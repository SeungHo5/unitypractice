// 채팅 입력창, 전송 버튼
import React from 'react';
import SearchInput from '@molecules/common/SearchInput';
import { StyleSheet, View } from 'react-native';  

const ChatInputBar = ({onSend}) => {
  return (
    <View style = {styles.container}>
      <SearchInput 
        name="message"
        placeholder="메시지 입력"
        onSearch={onSend}
        style={styles.input}
        icon = {require('@assets/coin.png')}
      />
    </View>
  );
};
export default ChatInputBar;

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#91B7AB', },
  input: { borderColor: '#E6E6E6', borderWidth: 3, borderRadius: 20, },
});