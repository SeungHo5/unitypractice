import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

// 번호 -> 정적 이미지 매핑
const avatarMap = {
  1: require('@assets/characters/1.png'),
  2: require('@assets/characters/2.png'),
  3: require('@assets/characters/3.png'),
  4: require('@assets/characters/4.png'),
  5: require('@assets/characters/5.png'),
  6: require('@assets/characters/1.png'),
  7: require('@assets/characters/2.png'),
  8: require('@assets/characters/3.png'),
};
const DEFAULT_AVATAR = avatarMap[1];

const AVATAR = 36;
const SLOT_HPAD = 6;
const NAME_LINE_H = 16; // 상대방 이름 lineHeight
const NAME_MB = 4; // 이름 marginBottom
const MY_ICON_LIFT = NAME_LINE_H + NAME_MB;

const ChatMessageItem = ({message, isMine, showHeader, showTime}) => {

  const avatarSource =
    typeof message.avatar === 'number'
      ? (avatarMap[message.avatar] || DEFAULT_AVATAR) // 번호 → 로컬 이미지
      : DEFAULT_AVATAR; 

  const myLift = (showHeader && isMine) ? -MY_ICON_LIFT : 0;

  return (
    <View style={[styles.container, isMine ? styles.myContainer : styles.otherContainer,]}>

      {/* 아바타: 그룹 첫 메시지에만 표시, 아니라면 같은 폭으로 빈공간 */}
      <View 
        style={{ 
          width: AVATAR + SLOT_HPAD * 2,
          paddingHorizontal: SLOT_HPAD,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: myLift,
        }}>
        {showHeader
          ? <Image source={avatarSource} style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2,}} />
          : <View style={{ width: AVATAR, height: AVATAR  }} />
        }
      </View>

      {/* 메시지 */}
      <View style={{ maxWidth: '75%', }}>

        {/* 이름: 상대방 + 그룹 첫 메시지에서만 표시 */}
        {showHeader && !isMine ? (
          <Text style={{ fontSize: 12, color: '#666', marginBottom: NAME_MB, lineHeight: NAME_LINE_H, }}>{message.name}</Text>
        ) : null}

        {/* 메시지 버블 */}
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble,]}>
          <Text>{message.text}</Text>
        </View>
        
        {/* 시간 - 그룹 마지막 메시지만 표시 */}
        {showTime && (
          <Text style={[styles.time, { textAlign: isMine ? 'right' : 'left' }]}>
            {formatTime(message.createdAt)}
          </Text>
        )}
      </View>
    </View>
  );
};

const formatTime = (date) => {
  const d = new Date(date);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export default ChatMessageItem;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-start',
  },
  myContainer: {
    flexDirection: 'row-reverse', // 내 메시지면 오른쪽
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  otherContainer: {
    flexDirection: 'row', // 상대 메시지면 왼쪽 
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 10,
    borderRadius: 12,
  },
  myBubble: {
    backgroundColor: '#fdda67ff',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#C0D6C8',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#eee',
  },
  time: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 4,
  },
});
