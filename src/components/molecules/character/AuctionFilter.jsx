import React from 'react';
import { StyleSheet, View } from 'react-native';
import BackgroundLayout from '@atoms/image/BackgroundLayout';
import Button from '@atoms/button/Button';

const AuctionFilter = ({ activeFilter, onChange }) => {
  const filter = [
    { key: 'buy', text: '구매', active: activeFilter === 'buy' },
    { key: 'sell', text: '판매', active: activeFilter === 'sell' },
    { key: 'receivable', text: '판매완료', active: activeFilter === 'receivable' },
  ];

  return (
    <BackgroundLayout
      flexNone
      backgroundImage={require('@assets/sign.png')} 
      style={styles.background}
      resizeMode="stretch"
    >
      <Button onPress={() => onChange('buy')} style={styles.button} transparent />
      <Button onPress={() => onChange('sell')} style={styles.button} transparent />
      <Button onPress={() => onChange('receivable')} style={styles.button} transparent />
    </BackgroundLayout>
  );
};

export default AuctionFilter;

const styles = StyleSheet.create({
  background: {
    width: 110,
    height: 140,
    position: 'absolute',
    bottom: 40,
    right: 0,
    transform: [{ rotate: '-10deg' }], // 왼쪽으로 살짝 기울이기
  },
  button: {
    width: '50%',
    height: '24%',
  },
});