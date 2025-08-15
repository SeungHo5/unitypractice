import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from '@atoms/image/Icon';
import Text from '@atoms/text/Text';
import ButtonBox from '@atoms/box/ButtonBox';

const ActionSection = ({ 
  drawState, 
  singleDrawCost,
  multiDrawCost, 
  onDrawPress, 
  disabled = false,
  drawingCount = null 
}) => {
  const getButtonLabel = (count) => {
    if (drawState === 'revealing') {
      return count === drawingCount ? '기달!' : `${count}개 뽑기`;
    }
    return `${count}개 뽑기`;
  };

  return (
    <View style={styles.container}>
      {/* 뽑기 버튼들 */}
      <View style={styles.buttonContainer}>

        {/* 1회 뽑기 */}
        <ButtonBox 
          style={[styles.button]} 
          contentStyle={{ justifyContent: 'space-around'}}
          onPress={() => onDrawPress(1)}
          disabled={disabled || drawState === 'revealing'}
        >
          <Text style={{color: '#7EB9AB', fontWeight: 'bold'}}>{getButtonLabel(1)}</Text>
          <View style={{ width:'100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Icon icon={require('@assets/coin.png')} />
            <Text style={{color:'#7EB9AB', fontWeight: 'bold'}}>{singleDrawCost}</Text>
          </View>
        </ButtonBox>

        {/* 10회 뽑기*/}
        <ButtonBox 
          style={styles.button} 
          contentStyle={{ justifyContent: 'space-around'}}
          onPress={() => onDrawPress(10)}
          disabled={disabled || drawState === 'revealing'}
        >
          <Text style={{color:'#7EB9AB', fontWeight: 'bold'}}>{getButtonLabel(10)}</Text>
          <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Icon icon={require('@assets/coin.png')}/>
            <Text style={{color:'#7EB9AB', fontWeight: 'bold'}}>{multiDrawCost}</Text>
          </View>
        </ButtonBox>
      </View>
    </View>
  );
};
export default ActionSection;

const styles = StyleSheet.create({
  button:{
    width: 120,
    height: 75,
    elevation: 8,
  },
  container: {
    alignItems: 'center',
    paddingTop: -10,
    paddingBottom: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 35,
    alignItems: 'flex-end',
  },
  buttonWrapper: {
    alignItems: 'center',
    margin: 10,
  },
  drawButton: {
    borderRadius: 18,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  singleButton: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 25,
    minWidth: 80,
  },
  multiButton: {
    backgroundColor: '#F2C744',
    paddingHorizontal: 25,
    minWidth: 110,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  multiButtonText: {
    fontSize: 14,
  },
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    margin: 3,
  },
  costText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
});