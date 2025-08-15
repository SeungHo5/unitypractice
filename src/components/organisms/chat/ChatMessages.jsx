import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ChatMessageItem from '@molecules/chat/ChatMessageItem';

const ChatMessages = ({ messages, myUserId }) => {
  return (
    <ScrollView style={styles.container}>
      {messages.map((msg, index) => {
      const prev = messages[index - 1];
      const next = messages[index + 1];
      const isFirstInGroup = !prev || prev.senderId !== msg.senderId;
      const isLastInGroup  = !next || next.senderId !== msg.senderId;
      return (
        <ChatMessageItem
          key={msg.id}
          message={msg}
          isMine={msg.senderId === myUserId}
          showHeader={isFirstInGroup}  // 아바타/이름
          showTime={isLastInGroup}     // 시간
        />
      );
    })}
    </ScrollView>
  );
};

export default ChatMessages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    // backgroundColor: 'red',
  },
});
