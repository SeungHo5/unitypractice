import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const BackgroundLayout = ({ children, backgroundImage, overlay = false, style, resizeMode = "cover", flexNone = false }) => {
  return (
    <ImageBackground
      source={backgroundImage ?? require('@assets/background.png')} // 기본 이미지 또는 전달된 이미지
      style={[styles.background, style, flexNone?{}:{flex: 1}]}
      resizeMode={resizeMode}
    >
      {overlay && <View style={styles.overlay} />}
      {children}  
    </ImageBackground>
  );
};

export default BackgroundLayout;

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // 검은 반투명 오버레이
  },
});

