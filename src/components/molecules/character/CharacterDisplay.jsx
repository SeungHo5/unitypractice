import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CharacterDisplay = ({ 
  selectedCharacter, 
  selectedRoom, 
  characters = [], 
  rooms = [],
  characterWidth = 150, // 기본값
  characterHeight = 150,
  characterMarginBottom = '10%'
}) => {
  const currentCharacter = characters.find(c => c.id === selectedCharacter);
  const currentRoom = rooms.find(r => r.id === selectedRoom);

  return (
    <View style={styles.displayArea}>
      {/* 방 배경 */}
      {currentRoom && (
        <Image
          source={currentRoom.image}
          style={styles.roomBackground}
          resizeMode="cover"
        />
      )}
      
      {/* 캐릭터 */}
      {currentCharacter && (
        <Image
          source={currentCharacter.image}
          style={{
            ...styles.characterImage,
            width: characterWidth,
            height: characterHeight,
            marginBottom: characterMarginBottom,
          }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};
export default CharacterDisplay;

const styles = StyleSheet.create({
  displayArea: {
    width: '100%',
    height: '100%',
  },
  roomBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0, // 무조건 배경이 뒤
  },
  characterImage: {
    alignSelf: 'center',
    marginTop: 'auto',
    zIndex: 1,
  },
});