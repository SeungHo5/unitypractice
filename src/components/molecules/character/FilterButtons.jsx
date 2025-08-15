import React from 'react';
import Button from '@atoms/button/Button';
import { View, StyleSheet } from 'react-native';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'buy', text: '구매', active: activeFilter === 'buy' },
    { key: 'sell', text: '판매', active: activeFilter === 'sell' },
    { key: 'receivable', text: '수령가능', active: activeFilter === 'receivable' },
  ];

  return (
    <View style={styles.container}>
      {filters.map((filter, idx) => (
        <Button
          key={filter.key}
          title={filter.text}
          onPress={() => onFilterChange(filter.key)}
          style={[
            styles.button,
            {
              backgroundColor: filter.active ? '#66b5a3' : '#E0E0E0',
              borderTopLeftRadius: idx === 0 ? 12 : 0,
              borderTopRightRadius: idx === filters.length - 1 ? 12 : 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }
          ]}
          textStyle={{
            color: filter.active ? '#FFFFFF' : '#666666',
            fontSize: 14,
            fontWeight: '600',
          }}
        />
      ))}
    </View>
  );
};
export default FilterButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
