import React, { useEffect } from 'react';
import { NativeModules } from 'react-native';
import Navigation from './src/navigation/Navigation';

const App = () => {
  // Unity 선기동: 앱 시작과 동시에 백그라운드에서 Unity 준비
  useEffect(() => {
    console.log('App.js 앱 시작: Unity 엔진 백그라운드 선기동 시작');
    
    const { UnityLauncher } = NativeModules;
    if (UnityLauncher && UnityLauncher.initUnityPrewarm) {
      UnityLauncher.initUnityPrewarm()
        .then(result => {
          console.log('App.js Unity 엔진 백그라운드 선기동 완료:', result);
        })
        .catch(error => {
          console.log('App.js Unity 선기동 실패:', error.message);
        });
    } else {
      console.log('App.js UnityLauncher 모듈 또는 initUnityPrewarm 함수가 없습니다.');
    }
  }, []);

  return <Navigation />;
};

export default App;