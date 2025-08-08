// src/screens/AlignPreview.js
import React, { useEffect, useRef, useState } from 'react';
import {
    View, Image, Text, StyleSheet, useWindowDimensions, Platform,
    AppState, DeviceEventEmitter, Alert,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { NativeModules } from 'react-native';
import Orientation from 'react-native-orientation-locker'; // 화면 가로 잠금

const { FaceMeshModule } = NativeModules;

export default function AlignPreview() {
    const KEY_IDX = { nose: 1, leftEye: 133, rightEye: 362 };
    // ---------- 상태 ----------
    const [perm, setPerm] = useState('not-determined');
    const [status, setStatus] = useState('대기 중…');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [frameCount, setFrameCount] = useState(0);
    const [okFrames, setOkFrames] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    // ---------- 카메라 ----------
    const devices = useCameraDevices('wide-angle-camera');
    const device = devices.front || devices.back;
    const cameraRef = useRef(null);
    const intervalRef = useRef(null);

    // ---------- 화면 크기 ----------
    const { width: w, height: h } = useWindowDimensions();
    const isLandscape = w > h;

    // ---------- 윤곽선(비율 좌표) & 판정 파라미터 ----------
    // 오버레이 조금 더 큼
    const OUTLINE = { x: 0.32, y: 0.08, w: 0.36, h: 0.78 };
    // bbox 높이(0~1) 허용 범위
    const FACE_SIZE_MIN = 0.28;
    const FACE_SIZE_MAX = 0.50;
    // 점수 임계 & 유지 프레임(0.5초 간격)
    const OK_THRESH = 0.85;
    const LOCK_NEED_FRAMES = 8; // ≈ 4초

    // ---------- 가로 고정 ----------
    useEffect(() => {
        try {
            if (Orientation?.lockToLandscape) Orientation.lockToLandscape();
        } catch {}
        return () => {
            try {
                if (Orientation?.unlockAllOrientations) Orientation.unlockAllOrientations();
            } catch {}
        };
    }, []);

    // ---------- 권한 ----------
    useEffect(() => {
        (async () => {
            const st = await Camera.requestCameraPermission();
            setPerm(st);
        })();
    }, []);

    // ---------- 백그라운드 시 루프 중단 ----------
    useEffect(() => {
        const sub = AppState.addEventListener('change', (s) => {
            if (s !== 'active') stopLoop(true);
        });
        return () => sub.remove();
    }, []);

    // ---------- FaceMesh 이벤트: 로그 + 잠금 ----------
    useEffect(() => {
         const onLandmarks = DeviceEventEmitter.addListener('onFaceLandmarks', (data) => {
               setIsProcessing(false);
            // 🔊 무조건 1줄은 찍히도록
                   console.log('[FM] event faceCount=', data?.faceCount, 'landmarksType=', Array.isArray(data?.allLandmarks) ? 'array' : typeof data?.allLandmarks);
                   const pts = data?.allLandmarks;
               if (!Array.isArray(pts) || pts.length === 0) {
                   console.log('[FM] no landmarks in event. data keys=', Object.keys(data || {}));
                   setOkFrames(0);
                   return;
               }

            // 디버그: 점수/박스 계산 및 로그
            const { score, parts, bbox } = scoreAlignmentDebug(pts, OUTLINE, FACE_SIZE_MIN, FACE_SIZE_MAX);

            console.log(
                `[FACE] bbox(norm): cx=${bbox.cx.toFixed(3)}, cy=${bbox.cy.toFixed(3)}, h=${bbox.h.toFixed(3)}, yaw=${bbox.yaw.toFixed(3)}`
            );
            console.log(
                `[FACE] bbox(px):   cx=${Math.round(bbox.cx * w)}, cy=${Math.round(bbox.cy * h)}, ` +
                `w=${Math.round(bbox.bw * w)}, h=${Math.round(bbox.h * h)}`
            );
            console.log(
                `[OUTLINE] rect(norm): x=${OUTLINE.x.toFixed(3)}, y=${OUTLINE.y.toFixed(3)}, ` +
                `w=${OUTLINE.w.toFixed(3)}, h=${OUTLINE.h.toFixed(3)}`
            );
            console.log(
                `[OUTLINE] rect(px):   x=${Math.round(OUTLINE.x * w)}, y=${Math.round(OUTLINE.y * h)}, ` +
                `w=${Math.round(OUTLINE.w * w)}, h=${Math.round(OUTLINE.h * h)}`
            );
            console.log(
                `[SCORE] total=${score.toFixed(2)} | pos=${parts.pos.toFixed(2)}${parts.posOk?'✓':'✗'}, ` +
                `size=${parts.size.toFixed(2)}${parts.sizeOk?'✓':'✗'}, yaw=${parts.yaw.toFixed(2)}${parts.yawOk?'✓':'✗'}`
            );

            if (!isLocked) {
                if (score >= OK_THRESH) {
                    setOkFrames(p => {
                        const n = p + 1;
                        if (n >= LOCK_NEED_FRAMES) {
                            setIsLocked(true);
                            Alert.alert('정렬 완료', '얼굴이 가이드에 맞았습니다. 분석을 시작합니다.');
                        }
                        return n;
                    });
                } else {
                    setOkFrames(0);
                }
            } else {
                // 🔒 잠금 이후: 눈+코만 로그
                const nose = pts[KEY_IDX.nose];
                const le   = pts[KEY_IDX.leftEye];
                const re   = pts[KEY_IDX.rightEye];
                console.log('=== FaceMesh (locked) 눈/코 좌표 ===');
                if (nose) console.log(`nose(#${KEY_IDX.nose}): x=${nose.x.toFixed(4)}, y=${nose.y.toFixed(4)}, z=${(nose.z??0).toFixed(4)}`);
                if (le)   console.log(`leftEye(#${KEY_IDX.leftEye}): x=${le.x.toFixed(4)}, y=${le.y.toFixed(4)}, z=${(le.z??0).toFixed(4)}`);
                if (re)   console.log(`rightEye(#${KEY_IDX.rightEye}): x=${re.x.toFixed(4)}, y=${re.y.toFixed(4)}, z=${(re.z??0).toFixed(4)}`);
            }
        });

        const onError = DeviceEventEmitter.addListener('onFaceMeshError', (err) => {
            setIsProcessing(false);
            setStatus(`오류: ${err?.error || 'Unknown'}`);
            console.error('FaceMesh error', err);
        });

        return () => { onLandmarks.remove(); onError.remove(); };
    }, [isLocked, w, h]);

    // ---------- 준비되면 초기화 + 루프 시작 ----------
    useEffect(() => {
        if (perm !== 'authorized' || !device) return;
        (async () => {
            try {
                setStatus('MediaPipe 초기화 중…');
                await FaceMeshModule.initFaceMesh();
                setIsInitialized(true);
                setStatus('초기화 완료! 분석 시작');
                startLoop();
            } catch {
                setStatus('초기화 실패');
            }
        })();

        return () => {
            stopLoop(true);
            if (isInitialized) FaceMeshModule.cleanup().catch(() => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [perm, device]);

    // ---------- 0.5초 간격 루프 ----------
    const tick = async () => {
        if (!cameraRef.current || isProcessing) return;
        try {
            setIsProcessing(true);
            const photo = await cameraRef.current.takePhoto({ quality: 70, skipMetadata: true });
            const base64 = await RNFS.readFile(photo.path, 'base64');
            await FaceMeshModule.processCameraFrame(base64);
            setFrameCount(n => n + 1);
        } catch {
            setIsProcessing(false);
        }
    };

    const startLoop = () => {
        if (!isInitialized || !device || perm !== 'authorized') return;
        stopLoop(true);
        setFrameCount(0);
        setOkFrames(0);
        setIsLocked(false);
        setStatus('🔴 분석 중… 윤곽선에 맞춰주세요');
        intervalRef.current = setInterval(tick, 500);
    };

    const stopLoop = (silent = false) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsProcessing(false);
        if (!silent) setStatus(`⏹ 정지 (${frameCount}프레임)`);
    };

    if (!device || perm !== 'authorized') {
        return <View style={{ flex: 1, backgroundColor: '#000' }} />;
    }

    const remain = Math.max(0, Math.ceil((LOCK_NEED_FRAMES - okFrames) * 0.5));

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Camera ref={cameraRef} style={{ flex: 1 }} device={device} isActive photo />

            {/* ===== 오버레이 ===== */}
            <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 5, elevation: 5 }]}>
                {/* 상단 배너 */}
                <View style={styles.bannerTop}>
                    <Text style={styles.bannerText}>
                        {isLocked ? '정렬 완료 · 분석/로그 출력 중' : '윤곽선에 맞추면 카운트 후 시작'}
                    </Text>
                    {!isLocked && (
                        <Text style={styles.subText}>
                            OK 프레임: {okFrames}/{LOCK_NEED_FRAMES} · 남은 약 {remain}초
                        </Text>
                    )}
                    <Text style={styles.subText}>{status}</Text>
                </View>

                {/* 윤곽선 PNG (크게) */}
                <Image
                    source={require('../assets/overlay/front_head_outline_clean.png')}
                    style={{
                        position: 'absolute',
                        left: w * OUTLINE.x,
                        top:  h * OUTLINE.y,
                        width:  w * OUTLINE.w,
                        height: h * OUTLINE.h,
                        opacity: 0.7,
                        zIndex: 6,
                    }}
                    resizeMode="stretch"
                />

                {/* 하단 안내 */}
                {!isLandscape && (
                    <View style={styles.toast}>
                        <Text style={styles.toastText}>가로 화면으로 사용 중</Text>
                    </View>
                )}
                <View style={styles.bannerBottom}>
                    <Text style={styles.bannerText}>얼굴 크기/위치를 윤곽선에 맞춰주세요</Text>
                </View>
            </View>
        </View>
    );
}

/* ================= 유틸(디버그 포함) ================= */

// bbox + yaw 계산
const getBBox = (lm) => {
    let minX=1, minY=1, maxX=0, maxY=0, noseX=null, minZ=999;
    for (const p of lm) {
        if (p.x<minX) minX=p.x; if (p.x>maxX) maxX=p.x;
        if (p.y<minY) minY=p.y; if (p.y>maxY) maxY=p.y;
        if (typeof p.z==='number' && p.z<minZ) { minZ=p.z; noseX=p.x; }
    }
    const bw = Math.max(1e-6, maxX-minX);
    const bh = Math.max(1e-6, maxY-minY);
    const cx = (minX+maxX)/2;
    const cy = (minY+maxY)/2;
    const yaw = noseX==null ? 0 : (noseX - cx) / bw; // 정면일수록 0
    return { minX, minY, maxX, maxY, bw, bh, cx, cy, h: bh, yaw };
};

const inRect = (x,y,r)=> x>=r.x && x<=r.x+r.w && y>=r.y && y<=r.y+r.h;

/** 디버그 포함 점수 계산 */
const scoreAlignmentDebug = (lm, rect, hMin, hMax) => {
    const bbox = getBBox(lm);
    if (!bbox) return { score:0, parts:{}, bbox:null };

    const posOk  = inRect(bbox.cx, bbox.cy, rect) ? 1 : 0;
    const sizeOk = (bbox.h >= hMin && bbox.h <= hMax) ? 1 : 0;
    const yawOk  = (Math.abs(bbox.yaw) <= 0.10) ? 1 : 0;

    const parts = {
        pos: 0.45 * posOk,
        size: 0.35 * sizeOk,
        yaw: 0.20 * yawOk,
        posOk, sizeOk, yawOk,
    };
    const score = parts.pos + parts.size + parts.yaw;
    return { score, parts, bbox };
};

/* ================= 스타일 ================= */

const styles = StyleSheet.create({
    bannerTop: {
        width: '100%', paddingVertical: 10, paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    subText: { color: '#ddd', fontSize: 12, textAlign: 'center', marginTop: 2 },
    bannerBottom: {
        width: '100%', paddingVertical: 10, paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingBottom: Platform.select({ ios: 14, android: 10 }),
        position: 'absolute', bottom: 0, left: 0,
    },
    bannerText: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
    toast: {
        alignSelf: 'center', marginTop: 12, paddingHorizontal: 12, paddingVertical: 6,
        backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8,
    },
    toastText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});