// UnityBearController.jsx
import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Vibration, DeviceEventEmitter } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import UnityView from '@azesmway/react-native-unity'
import Orientation from 'react-native-orientation-locker'
import RNFS from 'react-native-fs'
import { NativeModules } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import SockJS from 'sockjs-client'
import useTokenStore from '@stores/tokenStore'

const { FaceMeshModule } = NativeModules

// ===== 서버 베이스 =====
const STUDY_BASE = 'https://i13c201.p.ssafy.io/study'

// ===== 랜드마크 인덱스 (Python과 동일) =====
const STANDARD_FACE_LANDMARKS = [
  33, 133, 159, 145, 158, 153,      // Right Eye (6)
  263, 362, 386, 374, 385, 380      // Left Eye  (6)
]
const MOUTH_LANDMARKS = [78, 308, 13, 14]          // 4
const HEAD_POSE_LANDMARKS = [1, 152, 10, 33, 263]  // 5

// ✅ 실제 전송에 사용할 새 매핑 (요청사항)
// Focused → "3"(공부), Waiting → "1"(인사), 나머지 전부 → "2"(자기)
const mapStatusToAction = (status) => {
  if (status === 'Focused') return '3'
  if (status === 'Waiting') return '1'
  return '2' // Break, Looking_away, Not_in_frame, 기타 모두
}

const COLLECTION_INTERVAL_MS = 1000   // 좌표 수집 throttle
const BATCH_FLUSH_MS = 10000          // 배치 전송 주기(로그 문구는 유지)

const UnityBearController = () => {
  const navigation = useNavigation()
  const route = useRoute()

  // ====== 토큰 / 유저 / 스터디 룸 ======
  const { accessToken } = useTokenStore()
  const {
    studyRoomId: routeStudyRoomId,
    myUserId: routeMyUserId,
    userId: routeUserId
  } = route.params || {}

  const studyRoomId = routeStudyRoomId || 24
  const myUserId = routeMyUserId || routeUserId || 12
  const finalAccessToken = accessToken

  // ====== Unity / Camera / FaceMesh ======
  const unityRef = useRef(null)
  const cameraRef = useRef(null)
  const faceMeshIntervalRef = useRef(null)
  const [perm, setPerm] = useState('not-determined')
  const [faceMeshInitialized, setFaceMeshInitialized] = useState(false)
  const [faceCount, setFaceCount] = useState(0)
  const [frameCount, setFrameCount] = useState(0)
  const [validDataCount, setValidDataCount] = useState(0)
  const devices = useCameraDevices()
  const device = devices.front

  // ====== WS/STOMP ======
  const socketRef = useRef(null)
  const [wsStatus, setWsStatus] = useState('disconnected')  // disconnected | connecting | connected | subscribed
  const [isConnected, setIsConnected] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  // ====== 자동 전송 중복 방지 ======
  const lastActionSentRef = useRef(null)

  // ====== 깨우기 기능 중복 방지 ======
  const lastWakeUpSentRef = useRef({})

  // ====== 배치 큐 ======
  const queueRef = useRef([])
  const batchTimerRef = useRef(null)
  const lastEnqueueRef = useRef(0)

  // ====== 가로 잠금 & 정리 ======
  useEffect(() => {
    Orientation.lockToLandscape()
    return () => {
      Orientation.lockToPortrait()
      clearInterval(faceMeshIntervalRef.current)
      clearInterval(batchTimerRef.current)
      if (socketRef.current) {
        try { socketRef.current.close() } catch (e) {}
      }
    }
  }, [])

  // ====== 카메라 권한 + FaceMesh 초기화 ======
  useEffect(() => {
    ;(async () => {
      const st = await Camera.requestCameraPermission()
      setPerm(st)
      if (st === 'authorized') await initializeFaceMesh()
    })()
  }, [])

  const initializeFaceMesh = async () => {
    if (!FaceMeshModule) return
    try {
      await FaceMeshModule.initFaceMesh()
      setFaceMeshInitialized(true)
      setupFaceMeshListeners()
      startFaceMeshProcessing()
    } catch (err) {
      // FaceMesh 초기화 실패 처리
    }
  }

  // ====== FaceMesh 리스너: 좌표 추출 → 배치 큐에 적재 ======
  const setupFaceMeshListeners = () => {
    DeviceEventEmitter.addListener('onFaceLandmarks', data => {
      const { allLandmarks, faceCount: fc } = data || {}
      if (!allLandmarks || allLandmarks.length < 468) return

      const eye = STANDARD_FACE_LANDMARKS.map(i => {
        const p = allLandmarks[i]
        return (p && typeof p.x === 'number' && typeof p.y === 'number') ? [round4(p.x), round4(p.y)] : null
      }).filter(Boolean)

      const mouth = MOUTH_LANDMARKS.map(i => {
        const p = allLandmarks[i]
        return (p && typeof p.x === 'number' && typeof p.y === 'number') ? [round4(p.x), round4(p.y)] : null
      }).filter(Boolean)

      const head = HEAD_POSE_LANDMARKS.map(i => {
        const p = allLandmarks[i]
        return (p && typeof p.x === 'number' && typeof p.y === 'number') ? [round4(p.x), round4(p.y)] : null
      }).filter(Boolean)

      const valid = (eye.length === 12 && mouth.length === 4 && head.length === 5)
      const cur = frameCount + 1
      setFrameCount(cur)
      setFaceCount(fc)

      if (valid) {
        setValidDataCount(prev => prev + 1)
        const now = Date.now()
        if (now - lastEnqueueRef.current >= COLLECTION_INTERVAL_MS) {
          lastEnqueueRef.current = now
          const motionData = {
            studyRoomId,
            eyeLandmarks: eye,
            mouthLandmarks: mouth,
            headPoseLandmarks: head
          }
          console.log('FaceMesh 좌표 전송:', {
            눈_좌표: eye.length,
            입_좌표: mouth.length,
            머리_좌표: head.length,
            유효성: valid
          })
          queueRef.current.push(motionData)
        }
      }
    })
  }

  // ====== 카메라 프레임 → 네이티브 FaceMesh 처리 ======
  const startFaceMeshProcessing = () => {
    let tick = 0
    faceMeshIntervalRef.current = setInterval(async () => {
      tick++
      try {
        if (!cameraRef.current) return
        const photo = await cameraRef.current.takePhoto({ quality: 60, skipMetadata: true })
        const base64 = await RNFS.readFile(photo.path, 'base64')
        await FaceMeshModule.processCameraFrame(base64)
      } catch (err) {
        // FaceMesh 처리 에러 무시
      }
    }, 300)
  }

  // ====== 세션 시작 (서버에 세션 초기화 트리거) ======
  const startMotionSession = async () => {
    try {
      const url = `${STUDY_BASE}/test/activity/session/start/${studyRoomId}/${myUserId}`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(finalAccessToken ? { Authorization: `Bearer ${finalAccessToken}` } : {})
        }
      })

    } catch (e) {
      // session/start 실패 처리
    }
  }

  // ====== 세션 스냅샷 조회 (Redis) ======
  const fetchSessionSnapshot = async () => {
    try {
      const url = `${STUDY_BASE}/test/activity/redis/session/${studyRoomId}/${myUserId}`
      const res = await fetch(url, {
        headers: {
          ...(finalAccessToken ? { Authorization: `Bearer ${finalAccessToken}` } : {})
        }
      })
      const json = await res.json()

      return json
    } catch (e) {
      return null
    }
  }

  // ====== 그룹 상태 조회 (실시간 집계용) ======
  const fetchGroupStatus = async () => {
    try {
      const url = `${STUDY_BASE}/motion/study/${studyRoomId}/status`
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(finalAccessToken ? { Authorization: `Bearer ${finalAccessToken}` } : {})
        }
      })
      if (!res.ok) {
        return null
      }
      const json = await res.json()
      const list = json?.activeUsers || []
      const mine = list.find(u => Number(u.userId) === Number(myUserId)) || null

      return mine
    } catch (e) {
      return null
    }
  }

  // ====== 보강 로직: null 필드 API로 채우기 ======
  const enrichFromApisIfMissing = async (payload) => {
    const result = { ...payload }

    const needFocus = result.totalFocusTime == null
    const needStudy = result.totalStudyTime == null
    const needAvg   = result.avgFocusScore == null
    const needFocusCnt = result.focusSessionCount == null
    const needBreakCnt = result.breakSessionCount == null

    if (!needFocus && !needStudy && !needAvg && !needFocusCnt && !needBreakCnt) {
      return result
    }

    const session = await fetchSessionSnapshot()
    if (session) {
      if (needFocus && session.totalFocusTime != null) {
        result.totalFocusTime = session.totalFocusTime

      }
      if (needStudy) {
        const study = session.totalStudyTime ?? session.totalTime ?? session.studyTime
        if (study != null) {
          result.totalStudyTime = study

        }
      }
      if (needAvg && session.avgFocusScore != null) {
        result.avgFocusScore = session.avgFocusScore

      }
      if (needFocusCnt && session.focusSessionCount != null) {
        result.focusSessionCount = session.focusSessionCount

      }
      if (needBreakCnt && session.breakSessionCount != null) {
        result.breakSessionCount = session.breakSessionCount

      }
    }

    if (result.totalFocusTime == null || result.totalStudyTime == null || result.avgFocusScore == null) {
      const mine = await fetchGroupStatus()
      if (mine) {
        if (result.totalFocusTime == null && mine.totalFocusTime != null) {
          result.totalFocusTime = mine.totalFocusTime

        }
        if (result.totalStudyTime == null && mine.totalStudyTime != null) {
          result.totalStudyTime = mine.totalStudyTime

        }
        if (result.avgFocusScore == null && mine.avgFocusScore != null) {
          result.avgFocusScore = mine.avgFocusScore

        }
      }
    }

    return result
  }

//   // ====== 다른 사용자 깨우기 요청 전송 ======
//   // Unity에서 졸고 있는 사용자 클릭 시 해당 사용자에게 깨우기 요청을 WebSocket으로 전송
//   const sendWakeUpRequest = (targetUserId) => {
//     if (!socketRef.current || wsStatus !== 'subscribed') {
//       console.log('깨우기 요청 실패: WebSocket 연결 없음')
//       return
//     }

//     // 중복 전송 방지 (같은 사용자에게 5초 내 재전송 금지)
//     const now = Date.now()
//     const lastSent = lastWakeUpSentRef.current[targetUserId] || 0
//     if (now - lastSent < 5000) {
//       console.log('깨우기 요청 스킵: 중복 전송 방지', { targetUserId })
//       return
//     }

//     // 테스트 페이지와 동일한 상호작용 메시지 구조 사용
//     const interactionMessage = {
//       receiverId: targetUserId,
//       interactionType: "VIBRATION",
//       message: "깨워드려요!",
//       studyRoomId: studyRoomId
//     }

//     // STOMP 프레임 구성하여 /pub/interaction/send 엔드포인트로 전송
//     const frame =
//       `SEND\n` +
//       `destination:/pub/interaction/send\n` +
//       `content-type:application/json\n` +
//       `\n` +
//       `${JSON.stringify(interactionMessage)}\u0000`

//     socketRef.current.send(frame)
//     lastWakeUpSentRef.current[targetUserId] = now
    
//     console.log('깨우기 요청 전송:', {
//       대상_사용자: targetUserId,
//       스터디룸: studyRoomId,
//       메시지: interactionMessage.message
//     })
//   }

//   // ====== 깨우기 진동 수신 처리 ======
//   // 다른 사용자가 보낸 깨우기 요청을 받았을 때 진동 + Unity 화면 떨림 실행
//   const handleWakeUpVibration = (interactionData) => {
//     // 1. 핸드폰 강한 진동 패턴 (3번 반복: 0.3초 진동 → 0.1초 대기 → 0.3초 진동 → 0.1초 대기 → 0.3초 진동)
//     // Vibration.vibrate([0, 300, 100, 300, 100, 300])  // 멀티 테스트시 주석 해제
    
//     // 2. Unity 화면 떨림 효과 (BearSwitcher 오브젝트의 OnReactNativeMessage 함수에 wake_up_bear 액션 전송)
//     unityRef.current?.postMessage('BearSwitcher', 'OnReactNativeMessage', 'wake_up_bear')
    
//     // 3. 디버깅용 로그 출력
//     console.log('깨우기 진동 수신:', {
//       발신자: interactionData.senderId,
//       메시지: interactionData.message,
//       타입: interactionData.interactionType,
//       Unity_액션: 'wake_up_bear',
//       진동_상태: '주석처리됨'
//     })
//   }

  // ====== WS 연결 ======
  useEffect(() => {
    if (!finalAccessToken || !studyRoomId) {
      return
    }

    if (socketRef.current) {
      try { socketRef.current.close() } catch (e) {}
      socketRef.current = null
    }

    connectWebSocket()

    if (!batchTimerRef.current) {
      batchTimerRef.current = setInterval(flushBatch, BATCH_FLUSH_MS)
    }
  }, [finalAccessToken, studyRoomId])

  const connectWebSocket = () => {
    try {
      const sockUrl = `${STUDY_BASE}/ws-stomp?token=${encodeURIComponent(finalAccessToken)}`

      setWsStatus('connecting')
      const socket = new SockJS(sockUrl)
      socketRef.current = socket

      socket.onopen = () => {
        const connectFrame =
          `CONNECT\n` +
          `accept-version:1.0,1.1,2.0\n` +
          `heart-beat:10000,10000\n` +
          `\n\u0000`
        socket.send(connectFrame)
      }

      socket.onmessage = event => {
        const data = String(event?.data || '')
        if (!data.trim()) return

        if (data.startsWith('CONNECTED')) {
          setIsConnected(true)
          setWsStatus('connected')
          
          // 모션 채널 구독
          const motionSubFrame =
            `SUBSCRIBE\n` +
            `id:motion-sub-${studyRoomId}\n` +
            `destination:/sub/motion/study/${studyRoomId}\n` +
            `\n\u0000`
          socket.send(motionSubFrame)
          
          // 개인 상호작용 채널 구독 (깨우기 기능용)
          const interactionSubFrame =
            `SUBSCRIBE\n` +
            `id:interaction-sub-${myUserId}\n` +
            `destination:/sub/user/${myUserId}/interaction\n` +
            `\n\u0000`
          socket.send(interactionSubFrame)
          
          setIsSubscribed(true)
          setWsStatus('subscribed')

          // 세션 시작 트리거
          startMotionSession()
          return
        }

        if (data.startsWith('MESSAGE')) {
          const body = extractStompBody(data)
          if (!body) return

          try {
            const payload = JSON.parse(body)

            // ===== 모션 데이터 처리 (기존) =====
            if (data.includes(`/sub/motion/study/${studyRoomId}`)) {
              // ===== 부족값 보강 및 지표/유니티 전송 =====
              ;(async () => {
                const enriched = await enrichFromApisIfMissing(payload)

                const f = (enriched?.totalFocusTime ?? 0)
                const s = (enriched?.totalStudyTime ?? 0)
                const focusTime = Number.isFinite(f) ? f : 0
                const studyTime = Number.isFinite(s) ? s : 0
                const focusRate = studyTime > 0 ? (focusTime / studyTime * 100).toFixed(1) : (enriched?.totalStudyTime == null ? 'N/A' : 0)

                console.log('주요 필드:', {
                  현재_상태: enriched?.currentStatus,
                  총_집중시간: focusTime,
                  총_학습시간: studyTime,
                  집중_세션수: enriched?.focusSessionCount,
                  휴식_세션수: enriched?.breakSessionCount,
                  집중도: focusRate
                })

                // ===== 상태 → 유니티 자동 전송 =====
                const status = enriched?.currentStatus
                if (status) {
                  const action = mapStatusToAction(status)
                  if (action) {
                    if (lastActionSentRef.current !== action) {
                      const actionMeaning = action === '1' ? '인사' : action === '2' ? '자리비움' : '공부'
                      console.log('Unity 애니메이션:', {
                        상태: status,
                        액션: action,
                        의미: actionMeaning
                      })
                      sendToUnity(action)
                      lastActionSentRef.current = action
                    }
                  }
                }
              })()
            }

            // ===== 상호작용 메시지 처리 (새로 추가) =====
            // 개인 상호작용 채널(/sub/user/{userId}/interaction)에서 받은 메시지 처리
            if (data.includes(`/sub/user/${myUserId}/interaction`)) {
              // VIBRATION 타입의 상호작용(깨우기)일 때 진동 + Unity 화면 떨림 실행
              if (payload.interactionType === 'VIBRATION') {
                handleWakeUpVibration(payload)
              }
            }

          } catch (e) {
            // JSON 파싱 실패 처리
          }
          return
        }

        if (data.startsWith('ERROR')) {
          setIsConnected(false)
          setIsSubscribed(false)
          setWsStatus('disconnected')
          tryReconnect()
          return
        }

        if (data.startsWith('RECEIPT')) {
          return
        }
      }

      socket.onerror = (err) => {
        // SockJS 에러 처리
      }

      socket.onclose = (event) => {
        setIsConnected(false)
        setIsSubscribed(false)
        setWsStatus('disconnected')
        socketRef.current = null
        tryReconnect()
      }
    } catch (e) {
      socketRef.current = null
      tryReconnect()
    }
  }

  const tryReconnect = () => {
    setTimeout(() => {
      if (!isConnected) connectWebSocket()
    }, 2000)  // 2초 후 재연결 시도
  }

  // ====== 배치 전송 ======
  const flushBatch = () => {
    try {
      if (!socketRef.current) {
        return
      }
      if (queueRef.current.length === 0) {
        return
      }

      const batchMessage = {
        studyRoomId,
        batchTimestamp: new Date().toISOString(),
        dataPoints: queueRef.current.splice(0, queueRef.current.length)
      }

      const frame =
        `SEND\n` +
        `destination:/pub/motion/batch\n` +
        `content-type:application/json\n` +
        `\n` +
        `${JSON.stringify(batchMessage)}\u0000`

      socketRef.current.send(frame)
    } catch (e) {
      // 배치 전송 에러 처리
    }
  }

  // ====== Unity로 메시지 ======
  const sendToUnity = num => {
    unityRef.current?.postMessage('BearSwitcher', 'OnReactNativeMessage', String(num))
  }

  // ====== 렌더링 ======
  return (
    <View style={styles.overlayContainer}>
      {/* Unity 화면 */}
      <UnityView
        ref={unityRef}
        style={styles.unityView}
        onUnityMessage={message => {
          try {
            const data = typeof message === 'string' ? JSON.parse(message) : message
            // Unity에서 깨우기 요청이 올 때 처리 (졸고 있는 다른 사용자를 클릭했을 때)
            // 예상 메시지 형태: {action: "wake_up_user", targetUserId: 123}
            if (data?.action === 'wake_up_user' && data?.targetUserId) {
              sendWakeUpRequest(data.targetUserId)
            }
          } catch (e) {}
        }}
      />

      {/* 미니 카메라 & 상태 */}
      {device && perm === 'authorized' && (
        <View style={styles.miniCameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.miniCamera}
            device={device}
            isActive={true}
            photo
          />
          <View style={styles.miniStatus}>
            <Text style={styles.miniStatusText}>
              FaceMesh: {faceMeshInitialized ? '활성' : '비활성'} | 얼굴 {faceCount} | 프레임 {frameCount} | 유효 {validDataCount}
            </Text>
            <Text style={styles.miniStatusText}>
              WS: {wsStatus} | room #{String(studyRoomId)} | 큐 {queueRef.current.length}
            </Text>
          </View>
        </View>
      )}

      {/* 닫기 */}
      <TouchableOpacity
        onPress={() => {
          Orientation.lockToPortrait()
          setTimeout(() => navigation.goBack(), 100)
        }}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>← 닫기</Text>
      </TouchableOpacity>
    </View>
  )
}

// ====== 유틸 ======
const round4 = v => Math.round((v + Number.EPSILON) * 10000) / 10000
const extractStompBody = data => {
  const sep = '\n\n'
  const i = data.indexOf(sep)
  if (i === -1) return ''
  let body = data.slice(i + sep.length)
  if (body.endsWith('\u0000')) body = body.slice(0, -1)
  return body
}

// ====== 스타일 ======
const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2
  },
  unityView: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1
  },
  miniCameraContainer: {
    position: 'absolute', right: 16, top: 16, width: 160, height: 120, borderRadius: 8,
    overflow: 'hidden', backgroundColor: '#000', zIndex: 2
  },
  miniCamera: {
    width: '100%', height: '100%', opacity: 0.85
  },
  miniStatus: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', padding: 2
  },
  miniStatusText: {
    color: '#fff', fontSize: 8, fontFamily: 'monospace'
  },
  closeButton: {
    position: 'absolute', top: 50, left: 20, zIndex: 3,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 8
  },
  closeButtonText: {
    color: '#fff', fontSize: 16, fontWeight: '600'
  },
})

export default UnityBearController
