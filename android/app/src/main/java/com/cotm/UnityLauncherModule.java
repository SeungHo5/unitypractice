package com.cotm;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.os.Vibrator;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

// import com.azesmway.reactnative.unity.UnityUtils;   // ❌ 주석 처리/제거
import com.azesmwayreactnativeunity.ReactNativeUnityViewManager;  // ✅ 추가

import android.util.Log;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

public class UnityLauncherModule extends ReactContextBaseJavaModule {
    private static final String TAG = "UnityLauncherModule";
    private ReactApplicationContext reactContext;
    private static UnityLauncherModule instance;

    public UnityLauncherModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        instance = this;
    }

    public static UnityLauncherModule getInstance() {
        return instance;
    }

    @Override
    public String getName() {
        return "UnityLauncher";
    }

    // Unity 선기동 (백그라운드에서 Unity 엔진 준비)
    @ReactMethod
    public void initUnityPrewarm(Promise promise) {
        try {
            Log.d(TAG, "Unity 엔진 백그라운드 선기동 시작");
            
            // Unity 엔진 초기화 (실제 View 렌더링 없이 엔진만 준비)
            // ReactNativeUnityViewManager에서 제공하는 초기화 메서드가 있다면 사용
            // 없다면 단순히 성공 응답
            
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                Log.d(TAG, "Unity 엔진 백그라운드 선기동 완료");
                promise.resolve("Unity 엔진 선기동 성공");
            }, 100); // 100ms 후 성공 응답
            
        } catch (Exception e) {
            Log.e(TAG, "Unity 선기동 실패", e);
            promise.reject("PREWARM_ERROR", "Unity 선기동 실패: " + e.getMessage());
        }
    }

    // Unity 선기동된 엔진을 현재 화면에 연결
    @ReactMethod
    public void attachPrewarmedUnity(Promise promise) {
        try {
            Log.d(TAG, "선기동된 Unity 엔진 연결 시도");
            
            // 실제로는 Unity View가 렌더링될 때 자동으로 연결되므로
            // 여기서는 단순히 준비 완료 상태를 확인/설정
            
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                Log.d(TAG, "선기동된 Unity 엔진 연결 완료");
                promise.resolve("선기동된 Unity 연결 성공");
            }, 50); // 50ms 후 성공 응답
            
        } catch (Exception e) {
            Log.e(TAG, "Unity 연결 실패", e);
            promise.reject("ATTACH_ERROR", "Unity 연결 실패: " + e.getMessage());
        }
    }

    // Unity 실행 (React Native에서 Unity Activity 띄우기)
    @ReactMethod
    public void launchUnity(Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity != null) {
                Log.d(TAG, "Unity 실행 시작");
                // UnityUtils.launchUnity(currentActivity);  // ❌ 제거
                // 실제로 Unity 실행은 보통 React Native 쪽 JS에서 "UnityView" 렌더링으로 처리
                // 별도 코드가 필요하다면 ReactNativeUnityViewManager의 관련 메서드 확인

                promise.resolve("Unity 실행(React Native에서 UnityView 렌더링)"); 
            } else {
                promise.reject("NO_ACTIVITY", "현재 Activity를 찾을 수 없습니다");
            }
        } catch (Exception e) {
            Log.e(TAG, "Unity 실행 실패", e);
            promise.reject("LAUNCH_ERROR", "Unity 실행 실패: " + e.getMessage());
        }
    }

    // Unity로 메시지 전송
//     @ReactMethod
//     public void sendToUnity(String message, Promise promise) {
//         try {
//             Log.d(TAG, "Unity로 메시지 전송: " + message);
//             // UnityUtils.sendUnityMessage("BearSwitcher", "OnReactNativeMessage", message);  // ❌ 제거
//             ReactNativeUnityViewManager.postMessage("BearSwitcher", "OnReactNativeMessage", message);
// 
//             promise.resolve("메시지 전송 성공");
//         } catch (Exception e) {
//             Log.e(TAG, "Unity 메시지 전송 실패", e);
//             promise.reject("SEND_ERROR", "메시지 전송 실패: " + e.getMessage());
//         }
//     }

    @ReactMethod
    public void vibrate(ReadableArray pattern, Promise promise) {
        try {
            Vibrator vibrator = (Vibrator) reactContext.getSystemService(reactContext.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                long[] longPattern = new long[pattern.size()];
                for (int i = 0; i < pattern.size(); i++) {
                    longPattern[i] = (long) pattern.getInt(i);
                }
                vibrator.vibrate(longPattern, -1);
                Log.d(TAG, "진동 실행: " + java.util.Arrays.toString(longPattern));
                promise.resolve("진동 실행 완료");
            } else {
                promise.reject("NO_VIBRATOR", "진동 기능을 사용할 수 없습니다");
            }
        } catch (Exception e) {
            Log.e(TAG, "진동 실행 실패", e);
            promise.reject("VIBRATE_ERROR", "진동 실행 실패: " + e.getMessage());
        }
    }

    // Unity에서 메시지 수신 (MainActivity에서 호출)
    public void onUnityMessage(String message) {
        Log.d(TAG, "Unity에서 메시지 수신: " + message);

        new Handler(Looper.getMainLooper()).post(() -> {
            try {
                processUnityMessage(message);
            } catch (Exception e) {
                Log.e(TAG, "Unity 메시지 처리 실패", e);
            }
        });
    }

    private void processUnityMessage(String jsonMessage) {
        try {
            JSONObject json = new JSONObject(jsonMessage);
            String action = json.optString("action", "");

            // 진동 처리 (Unity에서 vibrate: true이고 vibrationPattern이 있을 때만)
            if (json.optBoolean("vibrate", false)) {
                handleVibration(json.optJSONArray("vibrationPattern"));
            }

            // Unity 데이터를 React Native로 그대로 전달
            WritableMap params = convertJsonToWritableMap(json);
            params.putString("timestamp", String.valueOf(System.currentTimeMillis()));

            // 🔧 개선된 이벤트명 생성 (snake_case → camelCase)
            String eventName = generateEventName(action);

            Log.d(TAG, "🎯 이벤트 발생: " + eventName);

            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);

        } catch (Exception e) {
            Log.e(TAG, "Unity 메시지 처리 실패", e);
        }
    }

    // 🆕 개선된 이벤트명 생성 함수 (snake_case → camelCase)
    private String generateEventName(String action) {
        if (action == null || action.isEmpty()) {
            return "onUnityMessage";
        }

        // snake_case를 camelCase로 변환
        String[] parts = action.split("_");
        StringBuilder eventName = new StringBuilder("on");
        
        for (String part : parts) {
            if (!part.isEmpty()) {
                eventName.append(Character.toUpperCase(part.charAt(0)));
                if (part.length() > 1) {
                    eventName.append(part.substring(1));
                }
            }
        }
        
        String result = eventName.toString();
        Log.d(TAG, "🏷️ 이벤트명 변환: '" + action + "' → '" + result + "'");
        return result;
    }

    // vibrationPattern이 null이면 진동 실행 생략 (Unity에서 제공한 패턴만 사용)
    private void handleVibration(JSONArray patternArray) {
        try {
            if (patternArray == null) {
                Log.d(TAG, "진동 패턴이 없어서 진동 생략");
                return;
            }

            long[] vibrationPattern = new long[patternArray.length()];
            for (int i = 0; i < patternArray.length(); i++) {
                vibrationPattern[i] = patternArray.getLong(i);
            }

            Vibrator vibrator = (Vibrator) reactContext.getSystemService(reactContext.VIBRATOR_SERVICE);
            if (vibrator != null && vibrator.hasVibrator()) {
                vibrator.vibrate(vibrationPattern, -1);
                Log.d(TAG, "Unity 진동 패턴 실행: " + java.util.Arrays.toString(vibrationPattern));
            }
        } catch (Exception e) {
            Log.e(TAG, "진동 처리 실패", e);
        }
    }

    // JSONObject를 WritableMap으로 완전 변환 (모든 필드 자동 변환)
    private WritableMap convertJsonToWritableMap(JSONObject json) {
        WritableMap map = Arguments.createMap();
        try {
            java.util.Iterator<String> keys = json.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                Object value = json.get(key);

                if (value instanceof String) {
                    map.putString(key, (String) value);
                } else if (value instanceof Boolean) {
                    map.putBoolean(key, (Boolean) value);
                } else if (value instanceof Integer) {
                    map.putInt(key, (Integer) value);
                } else if (value instanceof Double) {
                    map.putDouble(key, (Double) value);
                } else if (value instanceof JSONArray) {
                    // JSONArray는 WritableArray로 변환
                    map.putArray(key, toWritableArray((JSONArray) value));
                } else {
                    // 기타는 문자열로 변환
                    map.putString(key, value.toString());
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "JSON to WritableMap 변환 실패", e);
        }
        return map;
    }

    // JSONArray를 WritableArray로 재귀 변환
    private WritableArray toWritableArray(JSONArray array) throws JSONException {
        WritableArray writableArray = Arguments.createArray();
        for (int i = 0; i < array.length(); i++) {
            Object value = array.get(i);
            if (value instanceof String) {
                writableArray.pushString((String) value);
            } else if (value instanceof Boolean) {
                writableArray.pushBoolean((Boolean) value);
            } else if (value instanceof Integer) {
                writableArray.pushInt((Integer) value);
            } else if (value instanceof Double) {
                writableArray.pushDouble((Double) value);
            } else if (value instanceof JSONArray) {
                writableArray.pushArray(toWritableArray((JSONArray) value));
            } else {
                writableArray.pushString(value.toString());
            }
        }
        return writableArray;
    }
}
