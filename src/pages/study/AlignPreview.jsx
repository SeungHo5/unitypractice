// AlignPreview.js (Python 코드 호환성 + 상세 로그 포함)

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Platform,
  DeviceEventEmitter, useWindowDimensions, Image
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { FaceMeshModule } = NativeModules;

// 🎯 Python 코드와 동일한 포인트 정의
const STANDARD_FACE_LANDMARKS = [
  // Right Eye (6개) - EAR 계산용
  33,   // 0: 우안 바깥 (right eye outer)
  133,  // 1: 우안 안쪽 (right eye inner) 
  159,  // 2: 우안 상단 중앙 (right eye top center)
  145,  // 3: 우안 하단 중앙 (right eye bottom center)
  158,  // 4: 우안 상단 (right eye top)
  153,  // 5: 우안 하단 (right eye bottom)
  
  // Left Eye (6개) - EAR 계산용
  263,  // 6: 좌안 바깥 (left eye outer)
  362,  // 7: 좌안 안쪽 (left eye inner)
  386,  // 8: 좌안 상단 중앙 (left eye top center)  
  374,  // 9: 좌안 하단 중앙 (left eye bottom center)
  385,  // 10: 좌안 상단 (left eye top)
  380,  // 11: 좌안 하단 (left eye bottom)
];

const MOUTH_LANDMARKS = [78, 308, 13, 14];        // MAR 계산용
const HEAD_POSE_LANDMARKS = [1, 152, 10, 33, 263]; // Head Pose 계산용

export default function AlignPreview({ onGoBack, onGoToUnity }) {
  console.log('AlignPreview 컴포넌트 시작 - Python 호환 모드');
  
  const navigation = useNavigation();
  
  const [perm, setPerm] = useState('not-determined');
  const [status, setStatus] = useState('카메라 준비 중…');
  const [faceMeshInitialized, setFaceMeshInitialized] = useState(false);
  const [faceMeshError, setFaceMeshError] = useState(null);
  const [faceCount, setFaceCount] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [lastDetectionTime, setLastDetectionTime] = useState(null);
  const [isUnityReady, setIsUnityReady] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // 🔢 검증 통계
  const [validDataCount, setValidDataCount] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);

  const faceMeshIntervalRef = useRef(null);
  const cameraReference = useRef(null);

  const devices = useCameraDevices();
  const device = devices.front;

  useEffect(() => {
    console.log('화면 가로모드로 설정');
    Orientation.lockToLandscape();
    return () => {
      console.log('화면 회전 제한 해제');
      Orientation.unlockAllOrientations();
    };
  }, []);

  useEffect(() => {
    console.log('카메라 권한 요청 시작');
    (async () => {
      const st = await Camera.requestCameraPermission();
      console.log('카메라 권한 결과:', st);
      setPerm(st);
      if (st === 'authorized') {
        setStatus('카메라 준비 완료! FaceMesh 초기화 중...');
        await initializeFaceMesh();
        startCountdown();
      }
    })();
  }, []);

  const initializeFaceMesh = async () => {
    console.log('FaceMesh 초기화 시작');
    console.log('FaceMeshModule 상태 확인:', !!FaceMeshModule);
    
    if (!FaceMeshModule) {
      console.log('FaceMeshModule이 없습니다');
      setFaceMeshError('네이티브 모듈 없음');
      return;
    }

    console.log('FaceMeshModule 사용 가능한 메소드:', Object.keys(FaceMeshModule));

    try {
      console.log('FaceMeshModule.initFaceMesh() 호출 중...');
      await FaceMeshModule.initFaceMesh();
      
      console.log('FaceMesh 초기화 성공');
      setFaceMeshInitialized(true);
      setFaceMeshError(null);
      setStatus('FaceMesh 초기화 완료! Python 호환 모드로 인식 시작...');
      
      console.log('Python 호환 리스너 설정 시작...');
      setupFaceMeshListeners();
      
      console.log('FaceMesh 처리 시작...');
      startFaceMeshProcessing();
      
      console.log('FaceMesh 초기화 완료');
    } catch (err) {
      console.log('FaceMesh 초기화 실패:', err.message);
      setFaceMeshError(err.message);
    }
  };

  const setupFaceMeshListeners = () => {
    console.log('📡 Python 호환 FaceMesh 이벤트 리스너 등록 중...');
    
    DeviceEventEmitter.addListener('onFaceLandmarks', async (data) => {
      const { allLandmarks, faceCount, timestamp } = data; // 🔄 keyPoints 대신 allLandmarks 사용
      setTotalFrames(prev => prev + 1);
      
      console.log(`🎯 얼굴 감지 결과: ${faceCount}개 얼굴, ${allLandmarks?.length || 0}개 랜드마크`);
      
      // 🚨 디버깅: 실제 데이터 형식 확인
      console.log('🔍 allLandmarks 데이터 샘플:', allLandmarks?.slice(0, 5));
      console.log('🔍 allLandmarks 타입:', typeof allLandmarks);
      console.log('🔍 allLandmarks 길이:', allLandmarks?.length);
      
      if (!allLandmarks || allLandmarks.length < 300) {
        console.log(`⚠️ 랜드마크 부족: ${allLandmarks?.length || 0}개 (최소 300개 필요)`);
        return;
      }

      // 🔍 Python 코드에서 요구하는 포인트들 검증
      console.log('🔍 ==================== Python 필수 포인트 검증 ====================');
      
      // 👁 눈 랜드마크 검증 (12개)
      const eyeLandmarks = STANDARD_FACE_LANDMARKS.map((idx, i) => {
        const point = allLandmarks[idx]; // 🔄 keyPoints 대신 allLandmarks 사용
        if (point && typeof point.x === 'number' && typeof point.y === 'number') {
          return {
            index: idx,
            x: point.x,
            y: point.y,
            z: point.z || 0
          };
        }
        console.log(`❌ 눈 포인트 ${idx} 누락 또는 잘못됨`);
        return null;
      }).filter(Boolean);
      
      console.log(`👁 눈 랜드마크: ${eyeLandmarks.length}/12개 추출 성공`);
      if (eyeLandmarks.length === 12) {
        console.log('✅ 우안 6개:', eyeLandmarks.slice(0, 6).map(p => `[${p.index}](${p.x.toFixed(1)},${p.y.toFixed(1)})`));
        console.log('✅ 좌안 6개:', eyeLandmarks.slice(6, 12).map(p => `[${p.index}](${p.x.toFixed(1)},${p.y.toFixed(1)})`));
      } else {
        console.log('❌ 눈 랜드마크 부족! 누락된 포인트들을 확인하세요.');
      }
      
      // 👄 입 랜드마크 검증 (4개)
      const mouthLandmarks = MOUTH_LANDMARKS.map(idx => {
        const point = allLandmarks[idx]; // 🔄 keyPoints 대신 allLandmarks 사용
        if (point && typeof point.x === 'number' && typeof point.y === 'number') {
          return {
            index: idx,
            x: point.x,
            y: point.y,
            z: point.z || 0
          };
        }
        console.log(`❌ 입 포인트 ${idx} 누락 또는 잘못됨`);
        return null;
      }).filter(Boolean);
      
      console.log(`👄 입 랜드마크: ${mouthLandmarks.length}/4개 추출 성공`);
      if (mouthLandmarks.length === 4) {
        console.log('✅ 입 좌표:', mouthLandmarks.map(p => `[${p.index}](${p.x.toFixed(1)},${p.y.toFixed(1)})`));
      } else {
        console.log('❌ 입 랜드마크 부족!');
      }
      
      // 🧠 머리 방향 랜드마크 검증 (5개)
      const headPoseLandmarks = HEAD_POSE_LANDMARKS.map(idx => {
        const point = allLandmarks[idx]; // 🔄 keyPoints 대신 allLandmarks 사용
        if (point && typeof point.x === 'number' && typeof point.y === 'number') {
          return {
            index: idx,
            x: point.x,
            y: point.y,
            z: point.z || 0
          };
        }
        console.log(`❌ 헤드포즈 포인트 ${idx} 누락 또는 잘못됨`);
        return null;
      }).filter(Boolean);
      
      console.log(`🧠 머리 방향 랜드마크: ${headPoseLandmarks.length}/5개 추출 성공`);
      if (headPoseLandmarks.length === 5) {
        console.log('✅ 머리 좌표:', headPoseLandmarks.map(p => `[${p.index}](${p.x.toFixed(1)},${p.y.toFixed(1)})`));
      } else {
        console.log('❌ 머리 랜드마크 부족!');
      }
      
      // 🏗 Python 코드 형식으로 데이터 구성
      const motionData = {
        studyRoomId: 'test-room-001', // 테스트용
        eyeLandmarks: eyeLandmarks,
        mouthLandmarks: mouthLandmarks,
        headPoseLandmarks: headPoseLandmarks
      };
      
      console.log('📦 Python 코드 형식 데이터:');
      console.log('  - studyRoomId:', motionData.studyRoomId);
      console.log('  - eyeLandmarks:', motionData.eyeLandmarks.length, '개');
      console.log('  - mouthLandmarks:', motionData.mouthLandmarks.length, '개');
      console.log('  - headPoseLandmarks:', motionData.headPoseLandmarks.length, '개');
      
      // 🎯 전체 데이터 유효성 확인
      const isValidData = eyeLandmarks.length === 12 && 
                         mouthLandmarks.length === 4 && 
                         headPoseLandmarks.length === 5;
      
      if (isValidData) {
        setValidDataCount(prev => prev + 1);
        console.log('Python 데이터 추출 성공');
        console.log(`성공률: ${validDataCount + 1}/${totalFrames} (${((validDataCount + 1)/totalFrames*100).toFixed(1)}%)`);
        
        // 3번마다 상세 JSON 출력
        if (frameCount % 3 === 0) {
          console.log('상세 JSON 데이터:', JSON.stringify(motionData, null, 2));
        }
      } else {
        console.log('데이터 부족');
        console.log(`성공률: ${validDataCount}/${totalFrames} (${totalFrames > 0 ? (validDataCount/totalFrames*100).toFixed(1) : '0.0'}%)`);
      }
      
      console.log('🔍 ==================== 검증 완료 ====================');

      // 백엔드 전송 시뮬레이션
      if (isValidData) {
        try {
          console.log('Python 백엔드로 데이터 전송 시뮬레이션');
          // 실제 전송 코드는 여기에
          // await fetch('http://your-python-backend.com/motion-data', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(motionData),
          // });
          console.log('전송 성공 (시뮬레이션)');
        } catch (err) {
          console.error('전송 실패:', err.message);
        }
      }

      setFaceCount(faceCount);
      setFrameCount(prev => {
        const newCount = prev + 1;
        if (newCount % 20 === 0) {
          console.log(`누적 처리: 총 ${newCount}프레임, 유효 ${validDataCount}프레임 (${(validDataCount/newCount*100).toFixed(1)}% 성공률)`);
        }
        return newCount;
      });
      setLastDetectionTime(new Date().toLocaleTimeString());
      setFaceMeshError(null);
    });

    DeviceEventEmitter.addListener('onFaceMeshError', (err) => {
      console.error('FaceMesh 에러 발생:', err);
      setFaceMeshError(err.error || 'Unknown');
    });
    
    console.log('Python 호환 FaceMesh 리스너 등록 완료');
  };

  const startFaceMeshProcessing = () => {
    console.log('FaceMesh 자동 처리 시작 (1초 간격)');
    let count = 0;
    
    faceMeshIntervalRef.current = setInterval(async () => {
      count++;
      
      try {
        if (!cameraReference.current) {
          if (count % 10 === 0) {
            console.log('카메라 참조가 준비되지 않음');
          }
          return;
        }

        const photo = await cameraReference.current.takePhoto({
          quality: 70,
          skipMetadata: true,
        });

        const base64 = await RNFS.readFile(photo.path, 'base64');
        
        if (count % 10 === 0) {
          console.log(`FaceMesh 처리 완료 #${count}`);
        }

        await FaceMeshModule.processCameraFrame(base64);

      } catch (err) {
        if (count % 5 === 0) {
          console.log(`처리 오류 #${count}:`, err.message);
        }
        setFaceMeshError(err.message);
      }
    }, 1000);
  };

  const startCountdown = () => {
    console.log('5초 카운트다운 시작');
    let c = 5;
    setCountdown(c);
    const timer = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(timer);
        setIsUnityReady(true);
        setStatus('스터디룸 입장 가능');
        console.log('Unity 버튼 활성화 완료');
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      console.log('AlignPreview 컴포넌트 정리 시작');
      if (faceMeshIntervalRef.current) {
        clearInterval(faceMeshIntervalRef.current);
        console.log('FaceMesh 인터벌 정리 완료');
      }
    };
  }, []);

  if (!device || perm !== 'authorized') {
    console.log('카메라 디바이스 또는 권한 문제:', { device: !!device, perm });
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>카메라 권한이 필요합니다</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← 홈으로</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Camera
        ref={cameraReference}
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo
      />

      {/* 🎯 얼굴 외곽선 오버레이 */}
      <View style={styles.faceOutlineContainer}>
        <Image
          source={require('../../assets/overlay/front_head_outline_only.png')}
          style={styles.faceOutlineImage}
          resizeMode="contain"
        />
      </View>

      {/* 상태 표시 오버레이 */}
      <View style={styles.overlay}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>FaceMesh Python 호환 모드</Text>
          <Text style={styles.statusText}>
            초기화: {faceMeshInitialized ? '완료' : '대기중'}
          </Text>
          <Text style={styles.statusText}>
            감지된 얼굴: {faceCount}개
          </Text>
          <Text style={styles.statusText}>
            처리된 프레임: {frameCount}개
          </Text>
          <Text style={styles.statusText}>
            유효 데이터: {validDataCount}개
          </Text>
          <Text style={styles.statusText}>
            성공률: {totalFrames > 0 ? ((validDataCount/totalFrames)*100).toFixed(1) : 0}%
          </Text>
          {lastDetectionTime && (
            <Text style={styles.statusText}>
              마지막 감지: {lastDetectionTime}
            </Text>
          )}
          {faceMeshError && (
            <Text style={styles.errorText}>에러: {faceMeshError}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>← 홈</Text>
        </TouchableOpacity>

        {/* 스터디룸 버튼 */}
        {isUnityReady && (
          <TouchableOpacity style={styles.unityButton} onPress={() => navigation.navigate('UnityBearController')}>
            <Text style={styles.buttonText}>스터디룸 입장</Text>
          </TouchableOpacity>
        )}

        {/* 카운트다운 */}
        {!isUnityReady && (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}초 후 입장 가능</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 10,
    color: '#ff6b6b',
    marginBottom: 2,
  },
  backButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  statusContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4ade80',
  },
  statusTitle: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    marginBottom: 3,
    fontFamily: 'monospace',
  },
  homeButton: {
    position: 'absolute',
    top: 220,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  unityButton: {
    position: 'absolute',
    top: 220,
    right: 20,
    backgroundColor: '#4ade80',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  countdownContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  countdownText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  // 🎯 얼굴 외곽선 관련 스타일
  faceOutlineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5, // 카메라 위, 상태표시 아래
  },
  faceOutlineImage: {
    width: 300,  // 원하는 크기로 조정
    height: 400, // 원하는 크기로 조정
    opacity: 0.7, // 투명도 조정 (0.0~1.0)
  },
});
