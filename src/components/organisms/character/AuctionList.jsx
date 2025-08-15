import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AuctionItem from '@molecules/character/AuctionItem';
import Text from '@atoms/text/Text';

const AuctionList = ({ items = [], filterType, onItemAction }) => {
  const renderEmptyMessage = () => {
    switch (filterType) {
      case 'buy':
        return '구매 가능한 아이템이 없습니다.';
      case 'sell':
        return '판매 가능한 아이템이 없습니다.';
      case 'receivable':
        return '수령 가능한 아이템이 없습니다.';
      default:
        return '아이템이 없습니다.';
    }
  };

  if (!items || items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{renderEmptyMessage()}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      >
      {items && items.length > 0 && items.map((item) => (
        <AuctionItem
          key={`${item.id}-${item.auctionId || 'none'}`}
          item={item}
          filterType={filterType}
          onAction={() => onItemAction(item)}
        />
      ))}
    </ScrollView>
  );
};

export default AuctionList;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
