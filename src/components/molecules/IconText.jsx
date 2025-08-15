import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '@atoms/image/Icon';
import Text from '@atoms/text/Text';
import Box from '@atoms/box/Box';

 const IconText = ({ 
  icon, // 아이콘 이미지
  text, // 텍스트
  type,
  iconSize, // 아이콘 크기
  iconStyle, // 아이콘 스타일
  textStyle, // 텍스트 스타일
  boxStyle,
  width,
  height,
  resizeMode,
}) => {
  return (
    <Box width={width} height={height} contentStyle={[styles.box, boxStyle]}>
      <Icon icon={icon} size={iconSize} style={iconStyle} resizeMode={resizeMode}/>
      <Text type={type} style={[styles.text, textStyle]}>{text}</Text>
    </Box>
  );
};
export default IconText;

const styles = StyleSheet.create({
  box:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  text: {
    marginLeft: 4,
    fontWeight: '500'
  },
});