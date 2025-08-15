import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

const Text = ({ children, style, type = 'body', ...props }) => {
  return (
    <RNText style={[styles[type], style]} {...props}>
      {children} 
    </RNText>
  );
};
export default Text;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Jua',
  },
  mediumTitle: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Jua',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Jua',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Jua',
  },
  midium: {
    fontSize: 14,
    fontFamily: 'Jua',
  },
  caption: {
    fontSize: 12,
    fontFamily: 'Jua',
  },
});
