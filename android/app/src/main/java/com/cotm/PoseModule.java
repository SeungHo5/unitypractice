// 
// package com.cotm;
// 
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.bridge.ReactMethod;
// import com.facebook.react.bridge.Promise;
// import com.facebook.react.modules.core.DeviceEventManagerModule;
// import com.facebook.react.bridge.Arguments;
// import com.facebook.react.bridge.WritableMap;
// import com.facebook.react.bridge.WritableArray;
// 
// import android.util.Base64;
// import android.graphics.Bitmap;
// import android.graphics.BitmapFactory;
// import android.graphics.Canvas;
// import android.graphics.Color;
// import android.graphics.Paint;
// import android.util.Log;
// 
// import com.google.mediapipe.solutions
// import com.google.mediapipe.solutions.pose.PoseOptions;
// import com.google.mediapipe.solutions.pose.PoseResult;
// import com.google.mediapipe.formats.proto.LandmarkProto.NormalizedLandmarkList;
// import com.google.mediapipe.formats.proto.LandmarkProto.NormalizedLandmark;
// 
// import java.util.List;
// 
// public class PoseModule extends ReactContextBaseJavaModule {
//     private static final String TAG = "PoseModule";
//     private ReactApplicationContext reactContext;
//     private Pose pose;
//     private boolean isInitialized = false;
// 
//     public PoseModule(ReactApplicationContext reactContext) {
//         super(reactContext);
//         this.reactContext = reactContext;
//     }
// 
//     @Override
//     public String getName() { return "PoseModule"; }
// 
//     @ReactMethod
//     public void initPose(Promise promise) {
//         try {
//             PoseOptions options = PoseOptions.builder()
//                 .setStaticImageMode(false)
//                 .setModelComplexity(1)
//                 .setEnableSegmentation(false)
//                 .setSmoothLandmarks(true)
//                 .build();
//             pose = new Pose(reactContext, options);
//             pose.setResultListener(this::onPoseResults);
// 
//             isInitialized = true;
//             WritableMap result = Arguments.createMap();
//             result.putBoolean("success", true);
//             result.putString("message", "MediaPipe Pose 초기화 성공");
//             promise.resolve(result);
//         } catch (Exception e) {
//             isInitialized = false;
//             promise.reject("INIT_ERROR", "MediaPipe Pose 초기화 실패: " + e.getMessage(), e);
//         }
//     }
// 
//     @ReactMethod
//     public void processCameraFrame(String base64Image, Promise promise) {
//         if (!isInitialized || pose == null) {
//             promise.reject("NOT_INITIALIZED", "MediaPipe Pose가 초기화되지 않았습니다.");
//             return;
//         }
//         try {
//             byte[] imageBytes = Base64.decode(base64Image, Base64.DEFAULT);
//             Bitmap bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
//             if (bitmap == null) {
//                 promise.reject("DECODE_ERROR", "이미지 디코딩 실패");
//                 return;
//             }
//             long timestamp = System.currentTimeMillis() * 1000;
//             pose.send(bitmap, timestamp);
// 
//             WritableMap result = Arguments.createMap();
//             result.putBoolean("success", true);
//             promise.resolve(result);
//         } catch (Exception e) {
//             promise.reject("PROCESS_ERROR", "프레임 처리 실패: " + e.getMessage(), e);
//         }
//     }
// 
//     // 결과 콜백 함수
//     private void onPoseResults(PoseResult result) {
//         try {
//             List<NormalizedLandmarkList> multiPersonLandmarks = result.multiPersonLandmarks();
//             WritableMap resultMap = Arguments.createMap();
// 
//             if (multiPersonLandmarks != null && !multiPersonLandmarks.isEmpty()) {
//                 NormalizedLandmarkList person = multiPersonLandmarks.get(0);
//                 List<NormalizedLandmark> landmarks = person.getLandmarkList();
//                 resultMap.putInt("landmarkCount", landmarks.size());
// 
//                 WritableArray allLandmarks = Arguments.createArray();
//                 for (int i = 0; i < landmarks.size(); i++) {
//                     NormalizedLandmark lm = landmarks.get(i);
//                     WritableMap point = Arguments.createMap();
//                     point.putInt("idx", i);
//                     point.putDouble("x", lm.getX());
//                     point.putDouble("y", lm.getY());
//                     point.putDouble("z", lm.hasZ() ? lm.getZ() : 0);
//                     allLandmarks.pushMap(point);
//                 }
//                 resultMap.putArray("allLandmarks", allLandmarks);
//             } else {
//                 resultMap.putInt("landmarkCount", 0);
//                 resultMap.putArray("allLandmarks", Arguments.createArray());
//             }
//             sendEvent("onPoseLandmarks", resultMap);
//         } catch (Exception e) {
//             Log.e(TAG, "❌ 결과 처리 실패", e);
//         }
//     }
// 
//     private void sendEvent(String eventName, WritableMap params) {
//         if (reactContext.hasActiveCatalystInstance()) {
//             reactContext
//                 .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                 .emit(eventName, params);
//         }
//     }
// }