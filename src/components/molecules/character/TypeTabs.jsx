import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@atoms/image/Icon'; // 너의 공용 아이콘

const TypeTabs = ({ activeType, onTypeChange, style }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type) => {
    onTypeChange(type);
  };

  return (
    <View style={[styles.container, style]}>
      {/* 토글 + 옵션 묶음 */}
      <View style={styles.row}>
        {/* 토글 버튼 */}
        {/* <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsOpen(prev => !prev)}
        >
          <Icon icon={require('@assets/coin.png')} size={24} />
        </TouchableOpacity> */}

        {/* 수평 옵션 */}
        {/* {isOpen && (
        )} */}
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={[styles.option, activeType === 'character' && styles.activeOption]}
              onPress={() => handleSelect('character')}
            >
              <Text style={[styles.optionText, activeType === 'character' && styles.activeText]}>
                캐릭터
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, activeType === 'room' && styles.activeOption]}
              onPress={() => handleSelect('room')}
            >
              <Text style={[styles.optionText, activeType === 'room' && styles.activeText]}>
                방
              </Text>
            </TouchableOpacity>
          </View>
      </View>
    </View>
  );
};

export default TypeTabs;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  iconButton: {
    padding: 6,
    backgroundColor: 'transparent',
    borderRadius: 6,
    marginRight: 3,
  },
  dropdown: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEA',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  option: {
    paddingVertical: 4,
    paddingHorizontal: 13,
  },
  activeOption: {
    backgroundColor: '#FFCD4A',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#111',
  },
});

