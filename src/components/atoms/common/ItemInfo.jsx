import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@atoms/text/Text';
import Icon from '@atoms/image/Icon';

const ItemInfo = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.priceContainer}>
        <Icon 
          icon={require('@assets/coin.png')} 
          size={{ width: 16, height: 16 }} 
        />
        <Text style={styles.price}>{item.price?.toLocaleString()}</Text>
      </View>
    </View>
  );
};

export default ItemInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});

