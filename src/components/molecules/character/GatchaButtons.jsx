import React from "react";
import ButtonIcon from '@atoms/button/ButtonIcon';
import { View, StyleSheet } from 'react-native';

const GatchaButtons = ({ 
  onAuctionPress, 
  onGatchaPress 
}) => {

  return (
    <View style = {styles.container}>
      <View style={styles.iconWrapper}>
          <ButtonIcon
            icon={require('@assets/auction.png')}
            size={{ width: 55, height: 55 }}
            onPress={onAuctionPress}
          />
        </View>
      <View style={styles.iconWrapper}>
        <ButtonIcon
          icon={require('@assets/gatcha.png')}
          size={{ width: 50, height: 40 }}
          onPress={onGatchaPress}
        />
      </View>
    </View>
  );
};
export default GatchaButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  iconWrapper: {
    width: 55,
    height: 55,
    alignItems: 'center', // 수평 정렬
    justifyContent: 'center', // 수직 정렬
    marginRight: -10
  },
})