import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@atoms/image/Icon';
import ItemAvatar from '@atoms/common/ItemAvatar';
import Text from '@atoms/text/Text';
import Box from '@atoms/box/Box';
import ButtonIcon from '@atoms/button/ButtonIcon';
import LottiView from 'lottie-react-native';

const DrawContent = ({ 
  drawState, 
  revealedItems = [], 
  contentHeight = 0,
  type,
}) => {

  const navigation = useNavigation();
  const chestSize = contentHeight ? contentHeight * 0.4 : 230;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (drawState === 'revealing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(shakeAnim, {
            toValue: -1,
            duration: 80,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ])
      ).start();
    } else {
      // drawState가 바뀌면 정지 및 초기화
      shakeAnim.stopAnimation();
      shakeAnim.setValue(0);
    }
  }, [drawState]);

  // 회전값
  const rotate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  if (drawState === 'ready' || drawState === 'revealing') {
    return (
      <View style={styles.container}>
        <View style={styles.chestContainer}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Icon
              icon={require('@assets/chest.png')}
              size={{ width: chestSize, height: chestSize }}
              style={[
                styles.chest,
              ]}
            />
          </Animated.View>
        </View>
      </View>
    );
  }

  if (drawState === 'revealed' && revealedItems.length > 0) {
    const isSingle = revealedItems.length === 1;
    const item = revealedItems[0];

    return (
    <View style={styles.container}>


      <Box style={{ width: '90%', height: '75%', backgroundColor: 'rgba(255, 254, 235, 0.9)', }}>
        {/*X 버튼 */}
        <ButtonIcon
          icon={require('@assets/close2.png')}
          onPress={() => navigation.navigate('CharacterDraw', { type, reset: true })}
          size={{ width: 30, height: 30 }}
          style={styles.closeButton}
        />
        {/* ✅ 폭죽 애니메이션 위치는 여기! Box 위에 덮어주는 용도 */}
        <LottiView
          source={require('@assets/animations/Confetti.json')}
          autoPlay
          loop={false}
          style={styles.fireworks}
        />
        {isSingle ? (
          <View style={styles.SingleBackdrop}>
            <ItemAvatar
              item={item}
              size={200}
              showSelection={false}
              showLock={false}
              disabled={true}
              type={type}
            />
            
            <Box style={styles.characterNameBox}>
              <Text style={styles.characterName}>
                {item.name || (type === 'room' ? `방 ${item.name}` : `캐릭터 ${item.name}`)}
              </Text>
            </Box>
          </View>
        ) : (
          <View style={styles.multiBackdrop}>
            {revealedItems.map((item, index) => (
              <View key={index} style={styles.itemBox}>
                <ItemAvatar
                  item={item}
                  size={80}
                  showSelection={false}
                  showLock={false}
                  disabled={true}
                  type={type}
                />
                <Box style={{width:'80%',  height:25, backgroundColor: '#F0CB5F',  paddingVertical: 0, }}>
                  <Text style={styles.itemName}>
                    {item.name || (type === 'room' ? `방 ${item.name}` : `캐릭터 ${item.name}`)}
                  </Text>
                </Box>
              </View>
              ))}
          </View>
        )}
      </Box>
    </View>
  );
}
  return null;
};
export default DrawContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 15,
    zIndex: 20,
    borderRadius: 12,
    padding: 4,
  },
  SingleBackdrop:{
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  characterNameBox: {
    marginTop: 60,
    marginBottom: -40,
    backgroundColor: '#F0CB5F',
    height: 50,
    width: '50%', // 이거 글씨에 맞게 조절되게 하고 시푼뎅...
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterName: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 600,
    textAlign: 'center',
  },
  multiBackdrop: {
    flex: 1, // 💡 그리드 채우도록 확장
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 55,
    marginBottom: 5,
    marginRight: 10,
  },
  itemBox: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemName: {
    marginTop: 3,
    marginBottom: 2,
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 16,
    includeFontPadding: false, // Android일 경우
  },
  fireworks: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    pointerEvents: 'none', // 터치 안 막게!
  },
});