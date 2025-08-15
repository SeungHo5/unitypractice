import React from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import Icon from '@atoms/image/Icon';
import IconText from '@molecules/IconText';

// 희귀도에 따른 이모지 매핑
const rarityEmojis = {
  LEGENDARY: '👑',
  EPIC: '💎',
  RARE: '🔷',
  COMMON: '⚪',
};

const ItemAvatar = ({ 
  item,                    // 캐릭터 또는 방 데이터
  type = 'character',      // 'character' | 'room'
  size = 60, 
  isSelected = false, 
  isLocked = false, 
  showPrice = false,
  showRarity = false,
  showSelection = true,    // 선택 표시 여부 (기본값 true)
  showLock = true,         // 잠금 표시 여부 (기본값 true)
  selectionIcon,           // 커스텀 선택 아이콘 (기본: 체크)
  lockIcon,                // 커스텀 잠금 아이콘 (기본: 물음표)
  onPress,
  disabled = false         // 외부에서 비활성화 가능
}) => {
  if (!item || !item.image) {
    return null; // 렌더링 안 함
  }

  const isDisabled = disabled || isLocked;

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { width: size, height: size },
        isDisabled && styles.disabledContainer
      ]} 
      onPress={onPress}
      disabled={isDisabled}
    > 
    {/* 이미지 영역 */}
    <View style={styles.imageWrapper}>
      <Image
        source={item.image}
        style={[
          styles.image,
          type === 'room' && styles.roomImage, // 방은 전체 크기로
          isLocked && styles.lockedImage
        ]}
        resizeMode={type === 'room' ? 'cover' : 'contain'}
      />

      {/* 선택 표시 - showSelection이 true일 때만 */}
      {showSelection && isSelected && !isLocked && (
        <Icon
          icon={selectionIcon || require('@assets/check.png')}
          size={{ width: 40, height: 40 }}
          style={styles.overlayIcon}
        />
      )}

      {/* 잠금 표시 - showLock이 true이고 isLocked일 때만 */}
      {showLock && isLocked && (
        <Icon
          icon={lockIcon || require('@assets/question.png')}
          size={{ width: 24, height: 24 }}
          style={styles.overlayIcon}
        />
      )}

      {/* 희귀도 뱃지 */}
      {showRarity && item.rarity && rarityEmojis[item.rarity] && (
        <Text style={styles.rarityEmoji}>
          {rarityEmojis[item.rarity]}
        </Text>
      )}
      </View>

      {/* 가격 표시 */}
      {showPrice && item.price && (
      <View style={styles.priceWrapper}>
        <IconText
          icon={require('@assets/coin.png')}
          text={item.price}
          iconSize={{ width: 12, height: 12 }}
          textStyle={{ color: 'white', fontSize: 10 }}
          width={60}
          height={16}
        />
      </View>
    )}
    </TouchableOpacity>
  );
};
export default ItemAvatar;

const styles = StyleSheet.create({
  container: { // 아바타 박스
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // 내부 아이콘(선택/잠금/가격 뱃지) 위치 기준점
  },
  disabledContainer: {
    opacity: 0.8,
  },
  imageWrapper: { // 이미지와 오버레이 아이콘 감싸는 영역
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // overlayIcon 위치 기준
    width: '100%',
    height: '100%'
  },
  image: { // 아이템 이미지
    width: '100%',
    height: '100%',
    aspectRatio: 1,
  },
  roomImage: {
    borderRadius: 8, // 방일 경우 추가 둥근 테두리
  },
  lockedImage: {
    tintColor: 'rgba(0, 0, 0, 1)', 
  },
  overlayIcon: { // 선택 또는 잠금 상태 아이콘(중앙 위치)
    position: 'absolute',
    top: 35,
    zIndex: 3, // 이미지 위로 보이게
  },
  priceWrapper: { // 가격 뱃지 위치/스타일 (아래 중앙)
    position: 'absolute',
    bottom: 4,
    left: '50%',
    transform: [{ translateX: -30 }], // 가로 기준 중앙 정렬
    backgroundColor: 'rgba(0,0,0,0.5)', // 반투명 배경
    borderRadius: 8, // 모서리 둥글게
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 4, // 아이콘 위에 보이도록
  },
  rarityEmoji: {
    position: 'absolute',
    top: 4, // 부모 기준으로 얼마나 떨어뜨릴 것인지
    right: 4,
    fontSize: 14,
    zIndex: 4,
  }
});
