// src/components/atoms/ButtonIcon/index.jsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const ButtonIcon = (props) => {
  const width = props.size?.width || 24;
  const height = props.size?.height || 24;

  if (props.icon){
    return (
      <TouchableOpacity onPress={props.onPress} style={[{ width, height }, props.style]} activeOpacity={props.activeOpacity || 0.5}>
        <Image
          source={props.icon}
          style={styles.img}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  } else {
    return null;
  }
};

export default ButtonIcon;

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
  },
});
