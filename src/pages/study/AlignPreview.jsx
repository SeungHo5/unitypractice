// src/screens/AlignPreview.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View, Image, Text, StyleSheet, useWindowDimensions, Platform,
    AppState, DeviceEventEmitter, Alert, TouchableOpacity,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { NativeModules } from 'react-native';
import Orientation from 'react-native-orientation-locker'; // 화면 가로 잠금
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

const { FaceMeshModule } = NativeModules;

export default function AlignPreview(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const roomId = route?.params?.roomId;
    const onGoBack = props?.onGoBack ?? (() => navigation.goBack());
    const onGoToUnity = props?.onGoToUnity ?? (() => navigation.replace('UnityBearController', { roomId }));
    console.log('📹 AlignPreview 컴포넌트 시작!');

    // ---------- 상태 ----------
    const [perm, setPerm] = useState('not-determined');
    const [status, setStatus] = useState('카메라 준비 중…');

    // Unity 버튼 활성화 상태 (5초 자동 활성화)
    const [isUnityReady, setIsUnityReady] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // ---------- 카메라 ----------
    const devices = useCameraDevices('wide-angle-camera');
    const device = devices.front || devices.back;
    const cameraRef = useRef(null);

    // ---------- 화면 크기 ----------
    const { width: w, height: h } = useWindowDimensions();

    // ---------- 가로 고정 ----------
    useEffect(() => {
        console.log('📹 AlignPreview: 화면 가로모드 설정 시작');
        try {
            if (Orientation?.lockToLandscape) {
                Orientation.lockToLandscape();
                console.log('✅ 가로모드 설정 성공');
            }
        } catch (error) {
            console.log('❌ 가로모드 설정 실패:', error);
        }
        return () => {
            console.log('📹 AlignPreview: 화면 회전 제한 해제');
            try {
                if (Orientation?.unlockAllOrientations) {
                    Orientation.unlockAllOrientations();
                    console.log('✅ 화면 회전 해제 성공');
                }
            } catch (error) {
                console.log('❌ 화면 회전 해제 실패:', error);
            }
        };
    }, []);

    // ---------- 권한 ----------
    useEffect(() => {
        console.log('📹 AlignPreview: 카메라 권한 요청 시작');
        (async () => {
            try {
                const st = await Camera.requestCameraPermission();
                console.log('📹 카메라 권한 결과:', st);
                setPerm(st);
                if (st === 'authorized') {
                    setStatus('카메라 준비 완료! 5초 후 스터디룸 입장 가능');
                    // 카메라 준비되면 바로 5초 카운트다운 시작
                    startCountdown();
                }
            } catch (error) {
                console.log('❌ 카메라 권한 요청 실패:', error);
                setPerm('denied');
                setStatus('카메라 권한 필요');
            }
        })();
    }, []);

    // 5초 카운트다운 함수 (자동 시작)
    const startCountdown = () => {
        let count = 5;
        setCountdown(count);
        console.log('⏳ 5초 카운트다운 시작');

        const countdownInterval = setInterval(() => {
            count -= 1;
            setCountdown(count);
            console.log(`⏳ ${count}초 남음`);

            if (count <= 0) {
                clearInterval(countdownInterval);
                setIsUnityReady(true);
                console.log('✅ 스터디룸 버튼 활성화!');
                setStatus('스터디룸 입장 준비 완료!');
            }
        }, 1000);
    };

    if (!device || perm !== 'authorized') {
        console.log('❌ AlignPreview: 장치/권한 문제!', { device: !!device, perm });
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>카메라 권한이 필요합니다</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        console.log('🏠 홈으로 돌아가기');
                        try {
                            Orientation.lockToPortrait();
                        } catch (error) {
                            console.log('세로모드 복귀 오류:', error);
                        }
                        setTimeout(() => {
                            if (onGoBack) onGoBack();
                        }, 100);
                    }}
                >
                    <Text style={styles.backButtonText}>← 홈으로 돌아가기</Text>
                </TouchableOpacity>
            </View>
        );
    }

    console.log('✅ AlignPreview: 장치 및 권한 OK, 렌더링 시작');

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Camera ref={cameraRef} style={{ flex: 1 }} device={device} isActive photo />

            {/* ===== 오버레이 ===== */}
            <View style={[StyleSheet.absoluteFill, { zIndex: 5, elevation: 5 }]}>
                {/* 상단 배너 */}
                <View pointerEvents="none" style={styles.bannerTop}>
                    <Text style={styles.bannerText}>스터디룸 입장 준비</Text>
                    <Text style={styles.subText}>{status}</Text>

                    {/* Unity 준비 상태 표시 */}
                    {isUnityReady && (
                        <Text style={styles.unityReadyText}>⚡ 준비 완료! 우측상단 버튼으로 입장 가능</Text>
                    )}
                </View>

                {/* 좌측상단: 홈으로 버튼 */}
                <TouchableOpacity
                    style={styles.topLeftButton}
                    onPress={() => {
                        console.log('🏠 홈으로 돌아가기');
                        // 세로모드로 복귀
                        try {
                            Orientation.lockToPortrait();
                        } catch (error) {
                            console.log('세로모드 복귀 오류:', error);
                        }

                        setTimeout(() => {
                            if (onGoBack) onGoBack();
                        }, 100);
                    }}
                >
                    <Text style={styles.topButtonText}>← 홈으로</Text>
                </TouchableOpacity>

                {/* 우측상단: 스터디룸 가기 버튼 */}
                <TouchableOpacity
                    style={[
                        styles.topRightButton,
                        isUnityReady ? styles.enabledTopButton : styles.disabledTopButton
                    ]}
                    onPress={() => {
                        if (isUnityReady && onGoToUnity) {
                            console.log('🎮 스터디룸 가기!');
                            onGoToUnity();
                        } else {
                            console.log('❌ 아직 준비되지 않음');
                        }
                    }}
                    disabled={!isUnityReady}
                >
                    <Text style={[
                        styles.topButtonText,
                        isUnityReady ? styles.enabledTopText : styles.disabledTopText
                    ]}>
                        {isUnityReady ? '🎮 스터디룸 가기' : `⏳ ${countdown}초`}
                    </Text>
                </TouchableOpacity>

                {/* 하단 안내 */}
                <View style={styles.bannerBottom}>
                    <Text style={styles.bannerText}>
                        {isUnityReady ? '스터디룸 입장 준비가 완료되었습니다!' : `${countdown}초 후 스터디룸에 입장할 수 있습니다`}
                    </Text>
                </View>
            </View>
        </View>
    );
}

/* ================= 스타일 ================= */

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    bannerTop: {
        width: '100%', paddingVertical: 10, paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    subText: { color: '#ddd', fontSize: 12, textAlign: 'center', marginTop: 2 },
    unityReadyText: { color: '#4ade80', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 4 },

    // 상단 버튼들
    topLeftButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        zIndex: 10,
    },
    topRightButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        zIndex: 10,
        minWidth: 140,
        alignItems: 'center',
    },
    enabledTopButton: {
        backgroundColor: '#4ade80',
        shadowColor: '#4ade80',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 6,
    },
    disabledTopButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    topButtonText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#ffffff',
    },
    enabledTopText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    disabledTopText: {
        color: '#cccccc',
    },

    bannerBottom: {
        width: '100%', paddingVertical: 15, paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingBottom: Platform.select({ ios: 20, android: 15 }),
        position: 'absolute', bottom: 0, left: 0,
    },
    bannerText: { color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center' },
    backButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        shadowColor: '#6366f1',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});