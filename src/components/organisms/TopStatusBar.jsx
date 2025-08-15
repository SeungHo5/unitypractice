import React from 'react';
import { View, StyleSheet } from 'react-native';
import IconText from '@molecules/IconText';

const TopStatusBar = ({level, coin, style}) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container, style]}>
      <IconText
        width = {105}
        height = {40}
        icon={require('@assets/petBtn.png')}
        text={`Lv.${level}`}
      />
      <IconText 
        width = {105}
        height = {40}
        icon={require('@assets/coin.png')}
        text={`${coin}`}
      />
    </View>
  );
};
export default TopStatusBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 40,
    left: 20,
  },
});