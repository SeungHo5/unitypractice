// src/components/atoms/IconImage/index.jsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icon = ({resizeMode = "contain", size, icon, style}) => {
  const width = size?.width || 24;
  const height = size?.height || 24;

  return (
    <Image
      source={icon}
      style={[{ width, height }, style]}
      resizeMode={resizeMode}
    />
  );
};

export default Icon;