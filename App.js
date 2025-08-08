import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

import UnityBearController from './UnityBearController'; // 꼭 경로 맞게
import CameraScreen from './CameraScreen';
import FaceMeshScreen from './FaceMeshScreen';
import AlignPreview from './src/screens/AlignPreview'; // 경로 맞게

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [view, setView] = useState('home'); // 'home' | 'unity' | 'camera' | 'facemesh' | 'align'

  console.log('App 렌더:', view);

  const goHome = () => {
    console.log('홈으로 이동!');
    setView('home');
  };

  return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#222' : '#f0f0f0' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        {view === 'home' && (
            <>
              <Text style={styles.title}>React Native + Unity 연동 테스트</Text>

              <TouchableOpacity style={styles.button} onPress={() => {
                console.log('Unity 실행 버튼 클릭!');
                setView('unity');
              }}>
                <Text style={styles.buttonText}>Unity 실행하기</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={() => {
                console.log('카메라 실행 버튼 클릭!');
                setView('camera');
              }}>
                <Text style={styles.buttonText}>카메라 실행하기</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={() => {
                console.log('FaceMesh 실행 버튼 클릭!');
                setView('facemesh');
              }}>
                <Text style={styles.buttonText}>MediaPipe FaceMesh</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.button, { marginTop: 12 }]}
                  onPress={() => {
                    console.log('AlignPreview 실행 버튼 클릭!');
                    setView('align');
                  }}>
                <Text style={styles.buttonText}>카메라+오버레이 보기</Text>
              </TouchableOpacity>
            </>
        )}

        {view === 'unity' && (
            <UnityBearController onGoBack={goHome} />
        )}
        {view === 'camera' && (
            <CameraScreen onGoBack={goHome} />
        )}
        {view === 'facemesh' && (
            <FaceMeshScreen onGoBack={goHome} />
        )}
        {view === 'align' && (
            <AlignPreview onGoBack={goHome} />
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
