import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  Image 
} from 'react-native';
import Button from '@atoms/button/Button';
import Icon from '@atoms/image/Icon';

const PriceInputModal = ({ 
  visible, 
  onConfirm, 
  onCancel, 
  item 
}) => {
  const [price, setPrice] = useState('');

  const handleConfirm = () => {
    const numericPrice = parseInt(price);
    if (numericPrice > 0) {
      onConfirm({ ...item, price: numericPrice });
      setPrice('');
    }
  };

  const handleCancel = () => {
    setPrice('');
    onCancel();
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>판매 가격 설정</Text>
          
          {/* 아이템 정보 */}
          <View style={styles.itemInfo}>
            <View style={styles.imageWrapper}>
              <Image source={item?.image} style={styles.image} />
            </View>
            <Text style={styles.itemName}>{item?.name}</Text>
          </View>

          {/* 가격 입력 */}
          <View style={styles.priceInputContainer}>
            <Text style={styles.label}>판매 가격</Text>
            <View style={styles.inputWrapper}>
              <Icon 
                icon={require('@assets/coin.png')} 
                size={{width: 20, height: 20}}
                style={styles.coinIcon}
              />
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="가격을 입력하세요"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* 버튼들 */}
          <View style={styles.buttonContainer}>
            <Button
              title="취소"
              onPress={handleCancel}
              style={[styles.button, styles.cancelButton]}
              textStyle={styles.cancelButtonText}
            />
            <Button
              title="판매 등록"
              onPress={handleConfirm}
              style={[styles.button, styles.confirmButton]}
              textStyle={styles.confirmButtonText}
              disabled={!price || parseInt(price) <= 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFEEB',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  itemInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderColor: '#b9d8d1ff',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  priceInputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#b9d8d1ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  coinIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: '#DDD',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#66b5a3',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PriceInputModal;