import React, {useState} from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import ItemAvatar from '@atoms/common/ItemAvatar';

const COLUMNS = 4;
const GAP = 8;


const CharacterGrid = ({ 
  items = [], 
  selectedId, 
  onItemPress, 
  showPrice = false,
  showRarity = false 
}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const ITEM_SIZE = containerWidth
    ? (containerWidth  -  GAP * (COLUMNS - 1)) / COLUMNS
    : 0;

  return (
    <ScrollView 
      style={styles.scrollContainer}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
    <View 
      style={styles.grid}
    >
      {items
        .filter(Boolean)
        .sort((a, b) => Number(a.locked) - Number(b.locked)) // locked=false 먼저
        .map((item) => (
        <ItemAvatar
          key={item.id}
          item={item}
          size={ITEM_SIZE}
          isSelected={selectedId === item.id}
          isLocked={item.locked}
          showPrice={showPrice}
          showRarity={showRarity}
          onPress={() => !item.locked && onItemPress(item.id)}
        />
      ))}
    </View>
    </ScrollView>
  );
};
export default CharacterGrid;

const styles = StyleSheet.create({
  scrollContainer: {
    width: '100%',
    height: '100%',
  },
  grid: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap', // 줄바꿈 허용
    gap: GAP,         // 아이템 간 간격 (주의: RN 최신버전에서만 동작)
  },
});
