import React from 'react';
import { View, StyleSheet, } from 'react-native';
import CharacterDisplay from '@molecules/character/CharacterDisplay';
import CharacterButtons from '@molecules/character/CharacterButtons';
import GatchaButtons from '@molecules/character/GatchaButtons';
import CharacterGrid from '@molecules/character/CharacterGrid';
import Box from '@atoms/box/Box'; 
import Loading from '@organisms/common/Loading';

const MyRoom = ({
  // UI 상태
  activeTab, // 'character' | 'room'
  selectedCharacter,
  selectedRoom,
  
  // 데이터
  characters,
  rooms,
  loading,
  
  // 이벤트 핸들러
  onTabChange,
  onItemSelect,
  onAuctionPress,
  onGatchaPress
}) => {
  const buttons = [
    { key: 'character', text: '캐릭터', active: activeTab === 'character' },
    { key: 'room', text: '방', active: activeTab === 'room' },
  ];

  // 현재 탭에 따라 데이터와 선택된 ID 변경
  const currentItems = activeTab === 'character' ? characters : rooms;
  const currentSelectedId = activeTab === 'character' ? selectedCharacter : selectedRoom;

  return (
    <View style={styles.container}>
      {loading && <Loading />}

      {/* 캐릭터/방 표시 영역 */}
      <View style={styles.displaySection}>
        <CharacterDisplay
          selectedCharacter={selectedCharacter}
          selectedRoom={selectedRoom}
          characters={characters}
          rooms={rooms}
          characterWidth={150} // 여기서 사이즈 컨트롤
          characterHeight={150}
          characterMarginBottom="0%"
        />
      </View>

      {/* 그리드 영역 */}
      <View style={styles.gridSection}>
        {/* 컨트롤 버튼들 */}
        <View style={styles.controlsSection}>
          <CharacterButtons 
            buttons={buttons} 
            onSelect={onTabChange} 
          />
          <GatchaButtons 
            onAuctionPress={onAuctionPress}
            onGatchaPress={onGatchaPress}
          />
        </View>
        <Box style={styles.gridBox} contentStyle={styles.gridContent}>
          <CharacterGrid
            items={currentItems}
            type={activeTab} // 'character' 또는 'room'
            selectedId={currentSelectedId}
            onItemPress={onItemSelect}
          />
        </Box>
      </View>
    </View>
  );
};
export default MyRoom;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 15,
    justifyContent: 'space-between',
  },
  displaySection: {
    height: '50%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  gridSection: {
    height: '40%',
  },
  gridBox: {
    width: '100%',
    alignSelf: 'center',
  },
  gridContent: {
    padding: 10,
    paddingTop: 20,
    backgroundColor: '#F5F5F5', // Box 자체 배경이 아닌 content 배경
    alignItems: 'stretch', // 자식이 전체 너비 사용
    justifyContent: 'flex-start',
  },
  controlsSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: -7,
    zIndex: 1,
    position: 'absolute',
    top: -35
  },
});