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
  Platform
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { NativeModules, } from 'react-native';

const { FaceMeshModule } = NativeModules;

function FaceMeshScreen({ onGoBack }) {
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

  // 앱이 background로 가면 분석 중단 (안하면 버그생길 수 있음)
  useEffect(() => {
    const onChange = (state) => {
      if (state !== 'active') stopRealTimeProcessing();
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    checkCameraPermission();

    // 랜드마크 결과 리스너 등록
    const LANDMARK_LABELS = {
      1: '코끝',
      10: '이마 중앙 상단',
      33: '오른쪽 눈 바깥꼬리',
      61: '왼쪽 입꼬리',
      133: '오른쪽 눈 안쪽(안구)',
      152: '턱끝',
      234: '왼쪽 턱선 바깥',
      263: '왼쪽 눈 바깥꼬리',
      291: '오른쪽 입꼬리',
      362: '왼쪽 눈 안쪽(안구)',
      454: '오른쪽 턱선 바깥',
    };

    const landmarkListener = DeviceEventEmitter.addListener(
        'onFaceLandmarks',
        (data) => {
          setLandmarks(data);
          setIsProcessing(false);

          // 468 전체 좌표 로그 (원래 코드)
          if (data.allLandmarks && Array.isArray(data.allLandmarks)) {
            // 추출할 인덱스만 루프 (순서 보장)
            const idxArr = Object.keys(LANDMARK_LABELS).map(Number);

            let logLine = '✨ 주요 좌표: ';
            idxArr.forEach(idx => {
              const pt = data.allLandmarks[idx];
              const label = LANDMARK_LABELS[idx];
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

    const errorListener = DeviceEventEmitter.addListener(
        'onFaceMeshError',
        (error) => {
          console.error('❌ MediaPipe 오류:', error);
          setStatus(`오류: ${error.error || 'Unknown error'}`);
          setIsProcessing(false);
        }
    );

    return () => {
      landmarkListener.remove();
      errorListener.remove();

      if (intervalRef.current) clearInterval(intervalRef.current);

      if (isInitialized) {
        FaceMeshModule.cleanup()
            .then(() => console.log('✅ FaceMesh 정리 완료'))
            .catch(error => console.error('❌ FaceMesh 정리 실패:', error));
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

  const initializeFaceMesh = async () => {
    try {
      setStatus('MediaPipe 초기화 중...');
      const result = await FaceMeshModule.initFaceMesh();
      setIsInitialized(true);
      setIsCameraActive(true);
      setStatus('초기화 완료! 실시간 분석 준비됨');
      Alert.alert('성공', 'MediaPipe FaceMesh가 초기화되었습니다!');
    } catch (error) {
      setStatus('초기화 실패: ' + (error.message || 'Unknown error'));
      Alert.alert('오류', 'MediaPipe 초기화 실패:\n' + (error.message || 'Unknown error'));
    }
  };

  // 실제 사진 촬영+분석
  const captureAndAnalyze = async () => {
    if (!camera.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await camera.current.takePhoto({
        quality: 70, // (0~100) 실제 속도/품질 조절 가능
        skipMetadata: true,
      });
      const base64 = await RNFS.readFile(photo.path, 'base64');
      await FaceMeshModule.processCameraFrame(base64);
      setFrameCount(prev => prev + 1);
    } catch (error) {
      setIsProcessing(false);
      if (frameCount % 10 === 0) {
        setStatus(`촬영 오류: ${error.message}`);
      }
    }
  };

  // 실시간 처리 시작
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
    Alert.alert('시작', '실시간 얼굴 분석이 시작되었습니다!\n0.5초마다 사진을 촬영하여 분석합니다.');
  };

  // 실시간 처리 정지
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

  const processTestImage = async () => {
    if (!isInitialized) {
      Alert.alert('오류', '먼저 MediaPipe를 초기화해주세요.');
      return;
    }
    try {
      setStatus('테스트 이미지 처리 중...');
      const result = await FaceMeshModule.processTestImage();
      setStatus('테스트 완료!');
      Alert.alert('성공', '테스트 이미지 처리가 완료되었습니다!');
    } catch (error) {
      setStatus('테스트 처리 실패: ' + (error.message || 'Unknown error'));
      Alert.alert('오류', '테스트 이미지 처리 실패:\n' + (error.message || 'Unknown error'));
    }
  };

  const checkStatus = async () => {
    try {
      const statusInfo = await FaceMeshModule.getStatus();
      const statusMessage = `
상태: ${statusInfo.status || 'Unknown'}
분석된 사진: ${frameCount}장
초기화: ${isInitialized ? 'YES' : 'NO'}
카메라 활성: ${isCameraActive ? 'YES' : 'NO'}
실시간 분석: ${isRealTimeActive ? 'YES' : 'NO'}
처리 중: ${isProcessing ? 'YES' : 'NO'}
      `.trim();
      Alert.alert('📊 상태 정보', statusMessage);
    } catch (error) {
      // ignore
    }
  };

  const cleanup = async () => {
    try {
      setStatus('정리 중...');
      stopRealTimeProcessing();
      setIsCameraActive(false);
      await FaceMeshModule.cleanup();
      setIsInitialized(false);
      setLandmarks(null);
      setFrameCount(0);
      setStatus('정리 완료');
      Alert.alert('완료', 'MediaPipe가 정리되었습니다.');
    } catch (error) {
      Alert.alert('오류', '정리 실패:\n' + (error.message || 'Unknown error'));
    }
  };
  const renderFirstFiveLandmarks = () => {
    if (!landmarks || !landmarks.allLandmarks) return null;
    return (
        <View>
          <Text style={styles.landmarks}>🟢 전체 랜드마크: {landmarks.allLandmarks.length}개</Text>
          {landmarks.allLandmarks.slice(0, 5).map((pt, idx) => (
              <Text key={idx} style={styles.landmarks}>
                #{pt.idx} : ({pt.x.toFixed(3)}, {pt.y.toFixed(3)}, {pt.z.toFixed(3)})
              </Text>
          ))}
        </View>
    );
  };
  // UI 렌더링 함수
  const renderLandmarkCount = () => {
    if (!landmarks || typeof landmarks.landmarkCount !== 'number') return null;
    return (
        <Text style={styles.landmarks}>
          📍 랜드마크: {landmarks.landmarkCount}개
        </Text>
    );
  };
  const renderKeyPoints = () => {
    if (
        !landmarks ||
        !landmarks.keyPoints ||
        !Array.isArray(landmarks.keyPoints) ||
        landmarks.keyPoints.length < 3
    )
      return null;

    const [nose, leftEye, rightEye] = landmarks.keyPoints;
    // 각 포인트가 정상인지 체크
    if (
        !nose || !leftEye || !rightEye ||
        typeof nose.x !== 'number' ||
        typeof leftEye.x !== 'number' ||
        typeof rightEye.x !== 'number'
    ) return null;

    return (
        <View>
          <Text style={styles.landmarks}>
            👃 코끝: ({nose.x.toFixed(3)}, {nose.y.toFixed(3)})
          </Text>
          <Text style={styles.landmarks}>
            👁️ 왼눈: ({leftEye.x.toFixed(3)}, {leftEye.y.toFixed(3)})
          </Text>
          <Text style={styles.landmarks}>
            👁️ 오른눈: ({rightEye.x.toFixed(3)}, {rightEye.y.toFixed(3)})
          </Text>
        </View>
    );
  };

  const renderTimestamp = () => {
    if (!landmarks || !landmarks.timestamp) return <Text style={styles.timestamp}>⏰ N/A</Text>;
    try {
      const date = new Date(parseInt(landmarks.timestamp));
      return <Text style={styles.timestamp}>⏰ {date.toLocaleTimeString()}</Text>;
    } catch {
      return <Text style={styles.timestamp}>⏰ Invalid timestamp</Text>;
    }
  };

  return (
      <View style={styles.container}>
        {/* 카메라 전체 화면 */}
        {/** Camera가 화면 전체를 채우게 하고, 오버레이로 UI 띄움 */}
        {device && hasPermission && (
            <Camera
                ref={camera}
                style={styles.camera}
                device={device}
                isActive={isCameraActive}
                photo={true}
            />
        )}

        {/* 상단 오버레이 */}
        <SafeAreaView pointerEvents="box-none" style={styles.topOverlay}>
          <Text style={styles.title}>MediaPipe FaceMesh</Text>
          <Text style={styles.subtitle}>📸 실시간 사진 분석 (Vision Camera + RNFS)</Text>
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
                <Text style={styles.frameText}>⏱️ 간격: 0.5초마다 사진 촬영</Text>
              </View>
          )}
          {landmarks && (
              <View style={styles.landmarkInfo}>
                <Text style={styles.landmarks}>
                  🎯 감지된 얼굴: {landmarks.faceCount || 0}개
                </Text>
                {renderLandmarkCount()}
                {renderKeyPoints()}
                {renderTimestamp()}
                {renderFirstFiveLandmarks()}
              </View>
          )}
        </SafeAreaView>

        {/* 하단 오버레이 (버튼/뒤로가기) */}
        <SafeAreaView pointerEvents="box-none" style={styles.bottomOverlay}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.initButton]} onPress={initializeFaceMesh}>
              <Text style={styles.buttonText}>🚀 초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                  styles.button,
                  (!isInitialized || !hasPermission || !isCameraActive) && styles.buttonDisabled,
                  isRealTimeActive && styles.stopButton
                ]}
                onPress={isRealTimeActive ? stopRealTimeProcessing : startRealTimeProcessing}
                disabled={!isInitialized || !hasPermission || !isCameraActive}
            >
              <Text style={styles.buttonText}>
                {isRealTimeActive ? '⏹️ 실시간 분석 정지' : '🔴 실시간 분석 시작'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, (!isInitialized || !isCameraActive || isProcessing) && styles.buttonDisabled]}
                onPress={takeSinglePhoto}
                disabled={!isInitialized || !isCameraActive || isProcessing}
            >
              <Text style={styles.buttonText}>📸 한 장 분석</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, !isInitialized && styles.buttonDisabled]}
                onPress={processTestImage}
                disabled={!isInitialized}
            >
              <Text style={styles.buttonText}>🧪 테스트 (비교용)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.statusButton]} onPress={checkStatus}>
              <Text style={styles.buttonText}>📊 상태 확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cleanupButton]} onPress={cleanup}>
              <Text style={styles.buttonText}>🧹 정리</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
            <Text style={styles.backButtonText}>← 뒤로 가기</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // 카메라 아닌 부분
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
  // 상단 오버레이
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
  subtitle: { color: '#eee', fontSize: 13, marginBottom: 4 },
  status: { color: '#ffeb3b', fontSize: 15, marginBottom: 4, fontWeight: 'bold', textAlign: 'center' },
  frameText: { color: '#ffd', fontSize: 13, textAlign: 'center', marginBottom: 1 },
  landmarkInfo: { backgroundColor: 'rgba(48,96,48,0.15)', padding: 8, borderRadius: 7, marginTop: 4, marginBottom: 2 },
  landmarks: { fontSize: 13, marginBottom: 2, color: '#d2ffd2' },
  timestamp: { fontSize: 11, color: '#eee', marginTop: 1 },
  // 하단 오버레이
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
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  buttonDisabled: { backgroundColor: 'rgba(180,180,180,0.6)' },
  initButton: { backgroundColor: 'rgba(52,199,89,0.85)' },
  stopButton: { backgroundColor: 'rgba(255,59,48,0.85)' },
  statusButton: { backgroundColor: 'rgba(255,149,0,0.82)' },
  cleanupButton: { backgroundColor: 'rgba(142,142,147,0.7)' },
  backButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(33,33,33,0.85)',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 13,
    marginTop: 7,
  },
  backButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

export default FaceMeshScreen;