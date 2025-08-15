import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    DeviceEventEmitter,
    SafeAreaView,
    AppState,
    Platform,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { PoseModule } = NativeModules;

function PoseScreen() {
    const navigation = useNavigation();
    const [status, setStatus] = useState('대기 중...');
    const [isInitialized, setIsInitialized] = useState(false);
    const [landmarks, setLandmarks] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [frameCount, setFrameCount] = useState(0);
    const [isRealTimeActive, setIsRealTimeActive] = useState(false);

    const devices = useCameraDevices();
    const device = devices.front;
    const camera = useRef(null);
    const intervalRef = useRef(null);

    // 주요 포즈 라벨
    const POSE_LABELS = {
        0: '코',
        1: '목',
        7: '왼쪽 귀',
        8: '오른쪽 귀',
        11: '왼쪽 어깨',
        12: '오른쪽 어깨',
    };

    // 앱이 background로 가면 분석 중단
    useEffect(() => {
        const onChange = (state) => {
            if (state !== 'active') stopRealTimeProcessing();
        };
        const sub = AppState.addEventListener('change', onChange);
        return () => sub.remove();
    }, []);

    useEffect(() => {
        checkCameraPermission();

        const landmarkListener = DeviceEventEmitter.addListener(
            'onPoseLandmarks',
            (data) => {
                setLandmarks(data);
                setIsProcessing(false);

                if (data.allLandmarks && Array.isArray(data.allLandmarks)) {
                    let logLine = '✨ POSE 주요 좌표: ';
                    Object.keys(POSE_LABELS).forEach((idx) => {
                        const pt = data.allLandmarks[idx];
                        const label = POSE_LABELS[idx];
                        if (pt) {
                            logLine += `${label}: (${pt.x.toFixed(3)},${pt.y.toFixed(3)},${pt.z?.toFixed(3)}) | `;
                        } else {
                            logLine += `${label}: (X) | `;
                        }
                    });
                    console.log(logLine);
                }
            }
        );

        return () => {
            landmarkListener.remove();
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (isInitialized && PoseModule.cleanup) {
                PoseModule.cleanup()
                    .then(() => console.log('✅ Pose 정리 완료'))
                    .catch((error) => console.error('❌ Pose 정리 실패:', error));
            }
        };
    }, [isInitialized]);

    const checkCameraPermission = async () => {
        try {
            const permission = await Camera.getCameraPermissionStatus();
            if (permission === 'authorized') {
                setHasPermission(true);
            } else {
                const newPermission = await Camera.requestCameraPermission();
                setHasPermission(newPermission === 'authorized');
            }
        } catch (error) {
            console.error('카메라 권한 확인 실패:', error);
        }
    };

    const initializePose = async () => {
        try {
            setStatus('MediaPipe Pose 초기화 중...');
            const result = await PoseModule.initPose();
            setIsInitialized(true);
            setIsCameraActive(true);
            setStatus('초기화 완료! 실시간 분석 준비됨');
            Alert.alert('성공', 'MediaPipe Pose가 초기화되었습니다!');
        } catch (error) {
            setStatus('초기화 실패: ' + (error.message || 'Unknown error'));
            Alert.alert('오류', 'MediaPipe Pose 초기화 실패:\n' + (error.message || 'Unknown error'));
        }
    };

    const captureAndAnalyze = async () => {
        if (!camera.current || isProcessing) return;
        try {
            setIsProcessing(true);
            const photo = await camera.current.takePhoto({
                quality: 70,
                skipMetadata: true,
            });
            const base64 = await RNFS.readFile(photo.path, 'base64');
            await PoseModule.processCameraFrame(base64);
            setFrameCount((prev) => prev + 1);
        } catch (error) {
            setIsProcessing(false);
            if (frameCount % 10 === 0) {
                setStatus(`촬영 오류: ${error.message}`);
            }
        }
    };

    const startRealTimeProcessing = async () => {
        if (!isInitialized) {
            Alert.alert('오류', '먼저 MediaPipe를 초기화해주세요.');
            return;
        }
        if (!device || !hasPermission || !isCameraActive) {
            Alert.alert('오류', '카메라가 준비되지 않았습니다.');
            return;
        }
        setIsRealTimeActive(true);
        setFrameCount(0);
        setStatus('🔴 실시간 분석 중... (0.5초 간격)');
        intervalRef.current = setInterval(() => {
            captureAndAnalyze();
        }, 500);
        Alert.alert('시작', '실시간 포즈 분석이 시작되었습니다!\n0.5초마다 사진을 촬영하여 분석합니다.');
    };

    const stopRealTimeProcessing = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRealTimeActive(false);
        setStatus(`⏹️ 실시간 분석 정지됨 (총 ${frameCount}장 분석)`);
        setIsProcessing(false);
    };

    const takeSinglePhoto = async () => {
        if (!isInitialized) {
            Alert.alert('오류', '먼저 MediaPipe를 초기화해주세요.');
            return;
        }
        if (isProcessing) {
            Alert.alert('알림', '현재 처리 중입니다. 잠시 기다려주세요.');
            return;
        }
        await captureAndAnalyze();
    };

    const cleanup = async () => {
        try {
            setStatus('정리 중...');
            stopRealTimeProcessing();
            setIsCameraActive(false);
            if (PoseModule.cleanup) await PoseModule.cleanup();
            setIsInitialized(false);
            setLandmarks(null);
            setFrameCount(0);
            setStatus('정리 완료');
            Alert.alert('완료', 'MediaPipe Pose가 정리되었습니다.');
        } catch (error) {
            Alert.alert('오류', '정리 실패:\n' + (error.message || 'Unknown error'));
        }
    };

    const goBack = () => {
        stopRealTimeProcessing();
        navigation.goBack();
    };

    const renderMainPoseLandmarks = () => {
        if (!landmarks || !landmarks.allLandmarks) return null;
        return (
            <View>
                <Text style={styles.landmarks}>
                    🟢 전체 랜드마크: {landmarks.allLandmarks.length}개
                </Text>
                {Object.keys(POSE_LABELS).map((idx) => {
                    const pt = landmarks.allLandmarks[idx];
                    const label = POSE_LABELS[idx];
                    if (pt) {
                        return (
                            <Text key={idx} style={styles.landmarks}>
                                {label}: ({pt.x.toFixed(3)}, {pt.y.toFixed(3)}, {pt.z.toFixed(3)})
                            </Text>
                        );
                    }
                    return (
                        <Text key={idx} style={styles.landmarks}>
                            {label}: (X)
                        </Text>
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {device && hasPermission && (
                <Camera
                    ref={camera}
                    style={styles.camera}
                    device={device}
                    isActive={isCameraActive}
                    photo={true}
                />
            )}

            <SafeAreaView pointerEvents="box-none" style={styles.topOverlay}>
                <Text style={styles.title}>MediaPipe Pose</Text>
                <Text style={styles.subtitle}>🕺 실시간 자세 인식</Text>
                <Text style={styles.status}>
                    {status || '대기 중...'}
                    {isProcessing && ' 🔄'}
                </Text>
                {isRealTimeActive && (
                    <View>
                        <Text style={styles.frameText}>📸 분석된 사진: {frameCount}장</Text>
                        <Text style={styles.frameText}>
                            📊 상태: {isProcessing ? '분석 중 🔄' : '대기 중 ⏸️'}
                        </Text>
                    </View>
                )}
                {landmarks && (
                    <View style={styles.landmarkInfo}>
                        <Text style={styles.landmarks}>🎯 감지된 인체: 1명</Text>
                        {renderMainPoseLandmarks()}
                    </View>
                )}
            </SafeAreaView>

            <SafeAreaView pointerEvents="box-none" style={styles.bottomOverlay}>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, styles.initButton]} onPress={initializePose}>
                        <Text style={styles.buttonText}>🚀 초기화</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            (!isInitialized || !hasPermission || !isCameraActive) && styles.buttonDisabled,
                            isRealTimeActive && styles.stopButton,
                        ]}
                        onPress={isRealTimeActive ? stopRealTimeProcessing : startRealTimeProcessing}
                        disabled={!isInitialized || !hasPermission || !isCameraActive}
                    >
                        <Text style={styles.buttonText}>
                            {isRealTimeActive ? '⏹️ 분석 정지' : '🔴 실시간 분석'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            (!isInitialized || !isCameraActive || isProcessing) && styles.buttonDisabled,
                        ]}
                        onPress={takeSinglePhoto}
                        disabled={!isInitialized || !isCameraActive || isProcessing}
                    >
                        <Text style={styles.buttonText}>📸 한 장 분석</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.cleanupButton]} onPress={cleanup}>
                        <Text style={styles.buttonText}>🧹 정리</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Text style={styles.backButtonText}>← 뒤로 가기</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
    },
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: Platform.OS === 'android' ? 30 : 0,
        paddingHorizontal: 14,
        backgroundColor: 'rgba(0,0,0,0.33)',
        zIndex: 2,
        alignItems: 'center',
        paddingBottom: 10,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2,
        textShadowColor: '#0009',
        textShadowRadius: 2,
    },
    subtitle: { 
        color: '#eee', 
        fontSize: 13, 
        marginBottom: 4 
    },
    status: { 
        color: '#ffeb3b', 
        fontSize: 15, 
        marginBottom: 4, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },
    frameText: { 
        color: '#ffd', 
        fontSize: 13, 
        textAlign: 'center', 
        marginBottom: 1 
    },
    landmarkInfo: { 
        backgroundColor: 'rgba(48,96,48,0.15)', 
        padding: 8, 
        borderRadius: 7, 
        marginTop: 4, 
        marginBottom: 2 
    },
    landmarks: { 
        fontSize: 13, 
        marginBottom: 2, 
        color: '#d2ffd2' 
    },
    bottomOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 14,
        paddingBottom: Platform.OS === 'android' ? 18 : 24,
        paddingTop: 6,
        backgroundColor: 'rgba(0,0,0,0.23)',
        zIndex: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    button: {
        backgroundColor: 'rgba(0,122,255,0.82)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 7,
        marginHorizontal: 2,
        minWidth: 96,
        alignItems: 'center',
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '600' 
    },
    buttonDisabled: { 
        backgroundColor: 'rgba(180,180,180,0.6)' 
    },
    initButton: { 
        backgroundColor: 'rgba(52,199,89,0.85)' 
    },
    stopButton: { 
        backgroundColor: 'rgba(255,59,48,0.85)' 
    },
    cleanupButton: { 
        backgroundColor: 'rgba(142,142,147,0.7)' 
    },
    backButton: {
        alignSelf: 'center',
        backgroundColor: 'rgba(33,33,33,0.85)',
        borderRadius: 8,
        paddingHorizontal: 32,
        paddingVertical: 13,
        marginTop: 7,
    },
    backButtonText: { 
        color: '#fff', 
        fontSize: 15, 
        fontWeight: '600' 
    },
});

export default PoseScreen;