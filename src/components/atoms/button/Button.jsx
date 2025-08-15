import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Text from '@atoms/text/Text';

const Button = (props) => {
  return (
    <TouchableOpacity
      style={[styles.button, props.transparent && {backgroundColor: 'transparent'}, props.center && {alignItems:'center'}, props.style]}
      onPress={props.onPress}
      disabled={props.disabled}
      activeOpacity={props.activeOpacity || 0.5}
    >
      <Text
        style={[{color: 'white'}, props.transparent && {color: 'black'}, props.textStyle]}
        type={props.type}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};
export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#91B7AB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    justifyContent: 'center',
  },
});
