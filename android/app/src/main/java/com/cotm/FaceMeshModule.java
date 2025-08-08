package com.cotm;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.Base64;
import android.util.Log;

import com.google.mediapipe.solutioncore.CameraInput;
import com.google.mediapipe.solutioncore.SolutionGlSurfaceView;
import com.google.mediapipe.solutions.facemesh.FaceMesh;
import com.google.mediapipe.solutions.facemesh.FaceMeshOptions;
import com.google.mediapipe.solutions.facemesh.FaceMeshResult;
import com.google.mediapipe.formats.proto.LandmarkProto.NormalizedLandmark;
import com.google.mediapipe.formats.proto.LandmarkProto.NormalizedLandmarkList;

import java.util.List;

public class FaceMeshModule extends ReactContextBaseJavaModule {
    private static final String TAG = "FaceMeshModule"; // Logcat에서 태그로 쓸 문자열
    private ReactApplicationContext reactContext; // RN에서 Android 쪽 네이티브 함수 호출 컨텍스트
    private FaceMesh faceMesh; // mediapipe 얼굴 메쉬 얼굴 분석기
    private boolean isInitialized = false; // 초기화 설정 여부
    private long frameCounter = 0; // 분석 프레임 개수 카운트
    private boolean isStaticImageMode = false;

    public FaceMeshModule(ReactApplicationContext reactContext) {
        super(reactContext); 
        this.reactContext = reactContext; 
    }
    // RN에서 인스턴스 생성시 Context 주입
    //부모 클래스(super)에 컨텍스트 전달, 내 클래스에도 저장

    @Override
    public String getName() {
        return "FaceMeshModule";
    }
    // JS에서 NativeModules.FaceMeshModule 접근할 때 쓸 이름
    
    @ReactMethod
    public void initFaceMesh(Promise promise) { // Rn에서 initFaceMesh() 호출 시 실행
        try {
            Log.d(TAG, "🚀 MediaPipe FaceMesh 초기화 시작");  // 시작 로그 출력


            // FaceMesh 옵션 설정 - 🔧 더 민감하게 조정
            // 🔧 다시 비디오 모드로 변경
            FaceMeshOptions options = FaceMeshOptions.builder()
                .setStaticImageMode(false)  // 🚀 비디오 모드
                .setRefineLandmarks(true)   // 고급 랜드마크(눈/입 가장자리 등) 더 정교하게
                .setMaxNumFaces(1)          // 인식 얼굴 개수
                .setMinDetectionConfidence(0.5f) // 얼굴 감지 최소 신뢰도(0~1) 0.5 이상일 때만 감지
                .setMinTrackingConfidence(0.5f) // 트래킹(연속 추적) 최소 신뢰도, 0.5 이상일 때만 계속 추적
                .build();

            faceMesh = new FaceMesh(reactContext, options); // 실제 얼굴 메쉬 객체 생성(초기화)

            faceMesh.setResultListener(this::onFaceMeshResults); // 결과 나올 때 마다 이 함수(콜백)로 결과 받음
            
            faceMesh.setErrorListener((message, e) -> {
                Log.e(TAG, "❌ MediaPipe 오류: " + message, e);
                sendErrorEvent("MediaPipe 오류: " + message);
            });
            // 오류 났을때 처리(로그 + JS 이벤트 전송)
            isInitialized = true; // 모듈 초기화 변수(이게 true)여야 다른 함수가 호출
            frameCounter = 0; // 몇번 프레임 실행됐는지
            Log.d(TAG, "✅ MediaPipe FaceMesh 초기화 완료"); //개발자 도구에서 볼수있음
            
            WritableMap result = Arguments.createMap(); // 딕셔너리 비슷한것을 만든다 RN에서 반환할때
            result.putBoolean("success", true); // 정상적으로 성공했다
            result.putString("message", "MediaPipe FaceMesh 초기화 성공"); // 상태 메시지
            result.putString("version", "0.8.9"); // 현재 라이브러리 버전
            result.putBoolean("staticImageMode", false); // 🔧 true/ 카메라처럼 딱딱 그때만, false / 게속 실시간 처리 따라다니면서
            
            // 성공, 결과값 준비
            promise.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "❌ 초기화 실패", e);
            isInitialized = false;
            WritableMap error = Arguments.createMap();
            error.putBoolean("success", false);
            error.putString("error", e.getMessage());
            promise.reject("INIT_ERROR", "MediaPipe 초기화 실패: " + e.getMessage(), e);
        } // 만약 오류가 나면, 에러 코드와 함께 RN에 에러 변환
    }

    @ReactMethod
    public void processCameraFrame(String base64Image, Promise promise) {
        if (!isInitialized || faceMesh == null) {
            promise.reject("NOT_INITIALIZED", "MediaPipe가 초기화되지 않았습니다.");
            return;
        }
// RN에서 카메라 이미지를 보냈을 때 호출, 초기화가 안됐으면 에러 반환
        try {
            Log.d(TAG, "📸 프레임 처리 시작 - Base64 길이: " + base64Image.length());
            //로그 받은 이미지 base64 길이 출력
            byte[] imageBytes = Base64.decode(base64Image, Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);

            if (bitmap == null) {
                promise.reject("DECODE_ERROR", "이미지 디코딩 실패");
                return;
            }
            //base64 문자열을 비트맵으로 변환, 실패 시 에러 반환

            Log.d(TAG, "🖼️ 비트맵 생성 완료: " + bitmap.getWidth() + "x" + bitmap.getHeight());

            long timestamp = System.currentTimeMillis() * 1000;
            Log.d(TAG, "⏰ Timestamp: " + timestamp);

            faceMesh.send(bitmap, timestamp);

            Log.d(TAG, "✅ 프레임 전송 완료");
            //변환 성공 시 크기, 타임스탬프 찍고
            //MediaPipe 얼굴 분석기(faceMesh)에 비트맵 + 타임스탬프 전달
            
            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            result.putString("message", "프레임 처리 요청 완료");
            result.putString("timestamp", String.valueOf(timestamp));
            result.putInt("width", bitmap.getWidth());
            result.putInt("height", bitmap.getHeight());
            promise.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "❌ 프레임 처리 실패", e);
            promise.reject("PROCESS_ERROR", "프레임 처리 실패: " + e.getMessage(), e);
        }
        //처리 완료 응답(이미지 정보 포함) 반환 에외시 에러
    }


    @ReactMethod
    public void getStatus(Promise promise) {
        try {
            WritableMap status = Arguments.createMap(); // JS로 넘길 딕셔너리 생성
            status.putBoolean("initialized", isInitialized); // 초기화 여부
            status.putBoolean("processing", faceMesh != null); // faceMesh 객체가 살아있는지
            status.putString("mode", isStaticImageMode ? "static_image" : "video"); // 🔧 모드 변경
            status.putString("version", "0.8.9");
            status.putString("frameCounter", String.valueOf(frameCounter));
            status.putString("currentTime", String.valueOf(System.currentTimeMillis()));

            promise.resolve(status);
        } catch (Exception e) {
            promise.reject("STATUS_ERROR", "상태 확인 실패: " + e.getMessage(), e);
        }
    }

    @ReactMethod
    public void cleanup(Promise promise) {
        try {
            Log.d(TAG, "🧹 MediaPipe 정리 시작");

            if (faceMesh != null) {
                faceMesh.close();
                faceMesh = null;
            }

            isInitialized = false;
            frameCounter = 0;

            Log.d(TAG, "✅ MediaPipe 정리 완료");

            WritableMap result = Arguments.createMap();
            result.putBoolean("success", true);
            result.putString("message", "정리 완료");

            promise.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "❌ 정리 실패", e);
            promise.reject("CLEANUP_ERROR", "정리 실패: " + e.getMessage(), e);
        }
    }

    // 🎯 결과 콜백 - 🔧 더 자세한 로깅 추가
    private void onFaceMeshResults(FaceMeshResult result) {
        try {
            frameCounter++; // 🆕 프레임 카운터 증가
            Log.d(TAG, "🎯 FaceMesh 결과 수신 #" + frameCounter);

            WritableMap resultMap = Arguments.createMap();
            resultMap.putString("timestamp", String.valueOf(System.currentTimeMillis()));

            List<NormalizedLandmarkList> multiFaceLandmarks = result.multiFaceLandmarks();
            // 🔧 더 자세한 디버깅
            Log.d(TAG, "📊 multiFaceLandmarks: " + (multiFaceLandmarks != null ? multiFaceLandmarks.size() : "null"));

            if (multiFaceLandmarks != null && !multiFaceLandmarks.isEmpty()) {
                resultMap.putInt("faceCount", multiFaceLandmarks.size());
                
                NormalizedLandmarkList firstFace = multiFaceLandmarks.get(0);
                List<NormalizedLandmark> landmarks = firstFace.getLandmarkList();
                resultMap.putInt("landmarkCount", landmarks.size());
                
                WritableArray allLandmarks = Arguments.createArray();
                for (int i = 0; i < landmarks.size(); i++) {
                    NormalizedLandmark lm = landmarks.get(i);
                    WritableMap point = Arguments.createMap();
                    point.putInt("idx", i);
                    point.putDouble("x", lm.getX());
                    point.putDouble("y", lm.getY());
                    point.putDouble("z", lm.hasZ() ? lm.getZ() : 0);
                    if (lm.hasVisibility()) point.putDouble("visibility", lm.getVisibility());
                    if (lm.hasPresence()) point.putDouble("presence", lm.getPresence());
                    allLandmarks.pushMap(point);
                }
                resultMap.putArray("allLandmarks", allLandmarks);
                
                WritableArray keyPoints = Arguments.createArray();
                // 🔧 더 많은 주요 포인트들 추출
                if (landmarks.size() > 1) {
                    // 코끝 (landmark #1)
                    NormalizedLandmark noseTip = landmarks.get(1);
                    WritableMap nosePoint = Arguments.createMap();
                    nosePoint.putString("name", "nose_tip");
                    nosePoint.putDouble("x", noseTip.getX());
                    nosePoint.putDouble("y", noseTip.getY());
                    keyPoints.pushMap(nosePoint);

                    Log.d(TAG, "👃 코끝 좌표: (" + noseTip.getX() + ", " + noseTip.getY() + ")");
                }
                if (landmarks.size() > 33) {
                    NormalizedLandmark leftEye = landmarks.get(33);
                    WritableMap leftEyePoint = Arguments.createMap();
                    leftEyePoint.putString("name", "left_eye");
                    leftEyePoint.putDouble("x", leftEye.getX());
                    leftEyePoint.putDouble("y", leftEye.getY());
                    keyPoints.pushMap(leftEyePoint);
                }
                if (landmarks.size() > 263) {
                    NormalizedLandmark rightEye = landmarks.get(263);
                    WritableMap rightEyePoint = Arguments.createMap();
                    rightEyePoint.putString("name", "right_eye");
                    rightEyePoint.putDouble("x", rightEye.getX());
                    rightEyePoint.putDouble("y", rightEye.getY());
                    keyPoints.pushMap(rightEyePoint);
                }
                // 🆕 더 많은 포인트 추가

                resultMap.putArray("keyPoints", keyPoints);

                Log.d(TAG, "✅ 얼굴 " + multiFaceLandmarks.size() + "개 감지, 랜드마크 " + landmarks.size() + "개");
            } else {
                  resultMap.putInt("faceCount", 0);
                  resultMap.putInt("landmarkCount", 0);
                  resultMap.putArray("allLandmarks", Arguments.createArray());
                  resultMap.putArray("keyPoints", Arguments.createArray());
                  Log.d(TAG, "👻 얼굴 감지되지 않음");
              }

            sendEvent("onFaceLandmarks", resultMap);

        } catch (Exception e) {
            Log.e(TAG, "❌ 결과 처리 실패", e);
            sendErrorEvent("결과 처리 오류: " + e.getMessage());
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        }
    }

    private void sendErrorEvent(String error) {
        WritableMap errorMap = Arguments.createMap();
        errorMap.putString("error", error);
        errorMap.putString("timestamp", String.valueOf(System.currentTimeMillis()));
        sendEvent("onFaceMeshError", errorMap);
    }
}