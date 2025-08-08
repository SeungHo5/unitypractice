import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera } from 'react-native-vision-camera';

function CameraScreen({ onGoBack }) {
    const [device, setDevice] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        const initializeCamera = async () => {
            try {
                setDebugInfo('권한 확인 중...');

                // 카메라 권한 확인 및 요청
                const cameraPermission = await Camera.getCameraPermissionStatus();
                console.log('Camera permission status:', cameraPermission);
                setDebugInfo(`권한 상태: ${cameraPermission}`);

                if (cameraPermission !== 'authorized') {
                    setDebugInfo('권한 요청 중...');
                    const newCameraPermission = await Camera.requestCameraPermission();
                    console.log('New camera permission:', newCameraPermission);
                    setDebugInfo(`새 권한 상태: ${newCameraPermission}`);

                    if (newCameraPermission !== 'authorized') {
                        setHasPermission(false);
                        setIsLoading(false);
                        setDebugInfo('권한이 거부되었습니다');
                        return;
                    }
                }

                setHasPermission(true);
                setDebugInfo('카메라 장치 검색 중...');

                // 사용 가능한 카메라 장치 가져오기
                const devices = await Camera.getAvailableCameraDevices();
                console.log('Available devices count:', devices ? devices.length : 0);

                if (devices && devices.length > 0) {
                    setDebugInfo(`${devices.length}개의 카메라 발견`);

                    // 전면 카메라들 필터링
                    const frontCameras = devices.filter(d => d.position === 'front');

                    if (frontCameras.length > 0) {
                        // 광각 카메라 우선 선택
                        let selectedCamera = null;

                        // 1. ultra-wide-angle 카메라 찾기
                        selectedCamera = frontCameras.find(camera =>
                            camera.deviceType === 'ultra-wide-angle'
                        );

                        // 2. wide-angle 카메라 찾기 (ultra-wide가 없으면)
                        if (!selectedCamera) {
                            selectedCamera = frontCameras.find(camera =>
                                camera.deviceType === 'wide-angle'
                            );
                        }

                        // 3. 그래도 없으면 첫 번째 전면 카메라 사용
                        if (!selectedCamera) {
                            selectedCamera = frontCameras[0];
                        }

                        console.log('Selected front camera:', selectedCamera.name, 'Type:', selectedCamera.deviceType, 'ID:', selectedCamera.id);
                        setDebugInfo(`전면 카메라 선택: ${selectedCamera.name} (${selectedCamera.deviceType})`);
                        setDevice(selectedCamera);
                    } else {
                        console.log('No front camera found, using first available camera');
                        setDebugInfo(`전면 카메라 없음, 첫 번째 카메라 사용: ${devices[0].name}`);
                        setDevice(devices[0]);
                    }
                } else {
                    console.log('No camera devices found');
                    setDebugInfo('카메라 장치를 찾을 수 없음');
                }
            } catch (error) {
                console.error('Camera initialization error:', error);
                setDebugInfo(`오류: ${error.message}`);
                Alert.alert('카메라 오류', '카메라를 초기화할 수 없습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        initializeCamera();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>전면 광각 카메라를 초기화하는 중...</Text>
                <Text style={styles.debugText}>{debugInfo}</Text>
                <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                    <Text style={styles.backButtonText}>돌아가기</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.permissionText}>카메라 권한이 필요합니다.</Text>
                <Text style={styles.debugText}>{debugInfo}</Text>
                <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                    <Text style={styles.backButtonText}>돌아가기</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (device == null) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>전면 카메라를 찾을 수 없습니다.</Text>
                <Text style={styles.debugText}>{debugInfo}</Text>
                <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                    <Text style={styles.backButtonText}>돌아가기</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 카메라 렌더링 전에 디버그 정보 확인
    console.log('Rendering camera with device:', device);

    return (
        <View style={styles.container}>
            <Text style={styles.successText}>광각 카메라 초기화 성공!</Text>
            <Text style={styles.cameraInfoText}>
                {device.name} ({device.deviceType}) - ID: {device.id}
            </Text>
            <Text style={styles.debugText}>{debugInfo}</Text>

            <Camera
                style={styles.cameraFullScreen}
                device={device}
                isActive={true}
                photo={true}
                resizeMode="cover"
            />

            <TouchableOpacity style={styles.backButtonBottom} onPress={onGoBack}>
                <Text style={styles.backButtonText}>돌아가기</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraFullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    permissionText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    successText: {
        color: '#00ff00',
        fontSize: 16,
        textAlign: 'center',
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 8,
        borderRadius: 8,
    },
    cameraInfoText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        position: 'absolute',
        top: 80,
        left: 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 8,
        borderRadius: 8,
    },
    debugText: {
        color: '#ffff00',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
        position: 'absolute',
        top: 110,
        left: 20,
        right: 20,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 8,
        borderRadius: 8,
    },
    backButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginTop: 20,
    },
    backButtonBottom: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        zIndex: 1,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CameraScreen;