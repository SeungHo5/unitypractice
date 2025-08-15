import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '@atoms/button/Button';
import Icon from '@atoms/image/Icon';

const AuctionItem = ({ item, filterType, onAction }) => {
  const getButtonLabel = () => {
    if (filterType === 'buy') return '구매하기';
    if (filterType === 'sell') return item.isSelling ? '판매중' : '판매하기';
    if (filterType === 'receivable') return '수령하기';
    return '';
  };

  const isDisabled = 
    (filterType === 'sell' && item.isSelling);

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} />
      </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name || '이름 없음'}</Text>
          {/* 판매 탭에서 가격이 없으면 코인 아이콘 숨기기, 구매/수령 탭에서는 항상 표시 */}
          {(filterType !== 'sell' || (item.price && item.price > 0)) && (
            <View style={{alignItems: 'center', flexDirection: 'row', marginLeft: -5, marginBottom: 3,marginRight:3}}>
              <Icon icon={require('@assets/coin.png')} size={{width: 16, height: 16}}></Icon>
              <Text style={styles.price}>{item.price || 0}</Text>
            </View>
          )}
        </View>
      <Button
        onPress={onAction}
        disabled={isDisabled}
        title={getButtonLabel()}
        style={[styles.button, isDisabled && styles.disabledButton]}
        textStyle={[styles.buttonText, isDisabled && styles.disabledText]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFFEEB',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    marginBottom: 11,
    justifyContent: 'space-between'
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderColor: '#b9d8d1ff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    margin: 5
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  price: {
    color: '#666',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#66b5a3',
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginTop: 6,
    borderRadius: 15,
  },
  disabledButton: {
    backgroundColor: '#DDD',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledText: {
    color: '#999',
  },
});

export default AuctionItem;
