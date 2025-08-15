import React from 'react';
import Button from '@atoms/button/Button';
import { View, StyleSheet } from 'react-native';


const CharacterButtons = ({ buttons = [], onSelect }) => {
  return (
    <View style={styles.box}>
      {buttons.map((btn, idx) => (
        <Button
          key={btn.key}
          title={btn.text}
          onPress={() => onSelect(btn.key)}
          style={{
            backgroundColor : btn.active ? '#66b5a3' : '#b8ddd6',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20, 
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          textStyle={{
            color: btn.active ? '#fcd34d' : '#ffffff',
          }}
        />
      ))}
    </View>
  );
};
export default CharacterButtons;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row', // 버튼 가로배치
    padding: 0, // 패딩 제거해서 컨테이너에 딱 맞추기
  },
});