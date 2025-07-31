import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import UnityView from '@azesmway/react-native-unity';
import CameraScreen from './CameraScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [view, setView] = useState('home'); // 'home' | 'unity' | 'camera'

  const goHome = () => setView('home');

  return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#222' : '#f0f0f0' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        {view === 'home' && (
            <>
              <Text style={styles.title}>React Native + Unity 연동 테스트</Text>
              <TouchableOpacity style={styles.button} onPress={() => setView('unity')}>
                <Text style={styles.buttonText}>Unity 실행하기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { marginTop: 12 }]} onPress={() => setView('camera')}>
                <Text style={styles.buttonText}>카메라 실행하기</Text>
              </TouchableOpacity>
            </>
        )}

        {view === 'unity' && (
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
              <UnityView style={{ flex: 1 }} />
              <TouchableOpacity style={styles.floatingBackButton} onPress={goHome}>
                <Text style={styles.backButtonText}>← 홈으로</Text>
              </TouchableOpacity>
            </View>
        )}

        {view === 'camera' && (
            <CameraScreen onGoBack={goHome} />
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
  floatingBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;