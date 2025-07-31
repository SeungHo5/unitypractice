package com.cotm; // ← 본인 패키지에 맞게 조정

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class UnityLauncherModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public UnityLauncherModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "UnityLauncher";
    }

    @ReactMethod
    public void launchUnity() {
        try {
            Intent intent = new Intent(reactContext, 
                Class.forName("com.unity3d.player.UnityPlayerActivity"));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
