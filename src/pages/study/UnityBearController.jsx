import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration, DeviceEventEmitter } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import UnityView from '@azesmway/react-native-unity';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { FaceMeshModule, UnityLauncher } = NativeModules;

// Python 코드와 동일한 포인트 정의
const STANDARD_FACE_LANDMARKS = [
  33, 133, 159, 145, 158, 153,      // Right Eye (6개)
  263, 362, 386, 374, 385, 380,     // Left Eye (6개)
];

const MOUTH_LANDMARKS = [78, 308, 13, 14];        // MAR 계산용
const HEAD_POSE_LANDMARKS = [1, 152, 10, 33, 263]; // Head Pose 계산용

const UnityBearController = ({ onGoBack }) => {
    const navigation = useNavigation();
    const unityRef = useRef(null);
    const cameraReference = useRef(null);
    const faceMeshIntervalRef = useRef(null);

    // FaceMesh states 추가
    const [perm, setPerm] = useState('not-determined');
    const [faceMeshInitialized, setFaceMeshInitialized] = useState(false);
    const [faceCount, setFaceCount] = useState(0);
    const [frameCount, setFrameCount] = useState(0);
    const [validDataCount, setValidDataCount] = useState(0);

    const devices = useCameraDevices();
    const device = devices.front;

    // 처음부터 가로모드 설정 및 컴포넌트 언마운트 시 세로모드 복귀
    useEffect(() => {
        console.log('Unity 모드: 가로모드 강제');
        Orientation.lockToLandscape();
        
        console.log('UBC Unity 준비 완료');

        return () => {
            console.log('UBC Unity 종료: 세로모드 복귀');
            Orientation.lockToPortrait();
            
            // FaceMesh 정리
            if (faceMeshIntervalRef.current) {
                clearInterval(faceMeshIntervalRef.current);
                console.log('FaceMesh 인터벌 정리 완룼');
            }
        };
    }, []);

    // 카메라 및 FaceMesh 초기화
    useEffect(() => {
        (async () => {
            console.log('Unity + FaceMesh 초기화 시작');
            const st = await Camera.requestCameraPermission();
            console.log('카메라 권한 결과:', st);
            setPerm(st);
            
            if (st === 'authorized') {
                await initializeFaceMesh();
            }
        })();
    }, []);

    // FaceMesh 초기화
    const initializeFaceMesh = async () => {
        if (!FaceMeshModule) {
            console.log('FaceMeshModule이 없습니다');
            return;
        }

        try {
            console.log('Unity용 FaceMesh 초기화 중...');
            await FaceMeshModule.initFaceMesh();
            
            setFaceMeshInitialized(true);
            console.log('Unity용 FaceMesh 초기화 성공');
            
            setupFaceMeshListeners();
            startFaceMeshProcessing();
            
        } catch (err) {
            console.log('FaceMesh 초기화 실패:', err.message);
        }
    };

    // FaceMesh 리스너 설정
    const setupFaceMeshListeners = () => {
        DeviceEventEmitter.addListener('onFaceLandmarks', async (data) => {
            const { allLandmarks, faceCount } = data;
            
            if (!allLandmarks || allLandmarks.length < 300) {
                return;
            }

            // 데이터 추출
            const eyeLandmarks = STANDARD_FACE_LANDMARKS.map((idx) => {
                const point = allLandmarks[idx];
                if (point && typeof point.x === 'number' && typeof point.y === 'number') {
                    return { index: idx, x: point.x, y: point.y, z: point.z || 0 };
                }
                return null;
            }).filter(Boolean);
            
            const isValidData = eyeLandmarks.length === 12;
            
            // frameCount 먼저 업데이트
            const currentFrame = frameCount + 1;
            setFrameCount(currentFrame);
            
            if (isValidData) {
                setValidDataCount(prev => {
                    const newValidCount = prev + 1;
                    
                    // 10초마다 로그 출력
                    if (currentFrame % 5 === 0) {
                        const successRate = currentFrame > 0 ? ((newValidCount / currentFrame) * 100).toFixed(1) : '0.0';
                        console.log('Unity FaceMesh 데이터:', {
                            얼굴: faceCount,
                            눈포인트: eyeLandmarks.length,
                            프레임: currentFrame,
                            유효프레임: newValidCount,
                            성공률: `${successRate}%`
                        });
                    }
                    
                    return newValidCount;
                });
            } else {
                // 유효하지 않은 데이터일 때도 로그 출력 (10초마다)
                if (currentFrame % 10 === 0) {
                    const successRate = currentFrame > 0 ? ((validDataCount / currentFrame) * 100).toFixed(1) : '0.0';
                    console.log('Unity FaceMesh 데이터:', {
                        얼굴: faceCount,
                        눈포인트: eyeLandmarks.length,
                        프레임: currentFrame,
                        유효프레임: validDataCount,
                        성공률: `${successRate}%`
                    });
                }
            }

            setFaceCount(faceCount);
        });
    };

    // FaceMesh 처리
    const startFaceMeshProcessing = () => {
        console.log('Unity 백그라운드 FaceMesh 처리 시작');
        let count = 0;
        
        faceMeshIntervalRef.current = setInterval(async () => {
            count++;
            
            try {
                if (!cameraReference.current) return;

                const photo = await cameraReference.current.takePhoto({
                    quality: 60,
                    skipMetadata: true,
                });

                const base64 = await RNFS.readFile(photo.path, 'base64');
                await FaceMeshModule.processCameraFrame(base64);

            } catch (err) {
                if (count % 10 === 0) {
                    console.log(`Unity FaceMesh 처리 오류 #${count}:`, err.message);
                }
            }
        }, 1000);
    };

    // 1, 2, 3 버튼에서 Unity로 메시지 보내는 함수
    const sendToUnity = (num) => {
        unityRef.current?.postMessage(
            'BearSwitcher',
            'OnReactNativeMessage',
            num.toString()
        );
    };
    
    return (
        <View style={styles.overlayContainer}>
            {/* UnityView - 스터디룸에서만 렌더링 */}
            <UnityView 
                ref={unityRef} 
                style={styles.unityView}
                onUnityMessage={(message) => {
                    console.log('=== Unity 메시지 수신 (스터디룸) ===');
                    console.log('Raw message:', message);
                    console.log('Message type:', typeof message);
                    
                    try {
                        const data = typeof message === 'string' ? JSON.parse(message) : message;
                        console.log('Parsed data:', data);
                        console.log('Action:', data.action);
                        
                        if (data.action === 'showBearStudy') {
                            console.log('🐻 일어나! (공부 모드) - 진동 시작!');
                            Vibration.vibrate(200);
                        }
                        
                        if (data.action === 'wake_up_bear') {
                            console.log('🐻 일어나! (깨우기) - 진동 시작!');
                            Vibration.vibrate([0, 100, 50, 100]);
                        }
                        
                    } catch (error) {
                        console.log('❌ 메시지 파싱 오류:', error);
                        console.log('❌ 원본 메시지:', message);
                    }
                }}
            />

            {/* 미니샷 카메라 오버레이 */}
            {device && perm === 'authorized' && (
                <View style={styles.miniCameraContainer}>
                    <Camera
                        ref={cameraReference}
                        style={styles.miniCamera}
                        device={device}
                        isActive={true}
                        photo
                    />
                    
                    {/* 미니 카메라 상태 표시 */}
                    <View style={styles.miniStatus}>
                        <Text style={styles.miniStatusText}>
                            FaceMesh: {faceMeshInitialized ? '활성' : '비활성'}
                        </Text>
                        <Text style={styles.miniStatusText}>
                            얼굴: {faceCount} | 프레임: {frameCount}
                        </Text>
                    </View>
                </View>
            )}

            {/* RN 오버레이 버튼: 아래쪽에 1/2/3, 위쪽에 닫기 */}
            <View style={styles.controlButtons}>
                {[1,2,3].map((num) => (
                    <TouchableOpacity
                        key={num}
                        onPress={() => sendToUnity(num)}
                        style={styles.numberButton}
                    >
                        <Text style={styles.numberButtonText}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            {/* 닫기 버튼 */}
            <TouchableOpacity
                onPress={() => {
                    console.log('Unity 닫기 버튼 클릭');
                    
                    // 먼저 세로모드로 복귀
                    console.log('세로모드로 복귀 시도...');
                    Orientation.lockToPortrait();
                    
                    // Unity 리셋 메시지 전송 시도
                    console.log('Unity 리셋 메시지 전송 시도...');
                    
                    // 시도 1: BearSwitcher에 RESET 메시지
                    unityRef.current?.postMessage('BearSwitcher', 'OnReactNativeMessage', 'RESET');
                    
                    // 시도 2: GameManager에 리셋 메시지 (일반적인 Unity 패턴)
                    unityRef.current?.postMessage('GameManager', 'ResetGame', '');
                    
                    // 시도 3: 숫자 0으로 리셋 (기존 1,2,3 패턴 활용)
                    unityRef.current?.postMessage('BearSwitcher', 'OnReactNativeMessage', '0');
                    
                    // 시도 4: 다른 함수명으로 시도
                    unityRef.current?.postMessage('BearSwitcher', 'ResetBear', '');
                    
                    // 조금 지연 후 홈으로 돌아가기 (세로모드 설정 시간 확보)
                    setTimeout(() => {
                        console.log('홈으로 돌아가기 실행');
                        navigation.goBack();
                    }, 100);
                }}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>← 닫기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2, // Unity 위에 표시
    },
    unityView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    // 미니 카메라 스타일 추가
    miniCameraContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 1,   // 50 -> 1로 최소화
        height: 1,  // 30 -> 1로 최소화
        borderRadius: 8,
        overflow: 'hidden',
        zIndex: 5,
    },
    miniCamera: {
        flex: 1,
    },
    miniStatus: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 2,
    },
    miniStatusText: {
        color: '#fff',
        fontSize: 8,
        fontFamily: 'monospace',
    },
    controlButtons: {
        position: 'absolute', 
        bottom: 60, 
        left: 0, 
        right: 0, 
        flexDirection: 'row',
        justifyContent: 'space-around', 
        paddingHorizontal: 18, 
        zIndex: 2
    },
    numberButton: {
        backgroundColor: 'rgba(34, 34, 34, 0.7)',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 28,
        marginHorizontal: 8,
    },
    numberButtonText: {
        color: '#fff', 
        fontSize: 24, 
        fontWeight: 'bold'
    },
    closeButton: {
        position: 'absolute', 
        top: 50, 
        left: 20, 
        zIndex: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        padding: 12, 
        borderRadius: 8
    },
    closeButtonText: {
        color: '#fff', 
        fontSize: 16,
        fontWeight: '600'
    },
});

export default UnityBearController;