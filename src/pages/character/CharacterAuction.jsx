import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MainLayout from '@templates/MainLayout';
import TopStatusBar from '@organisms/TopStatusBar';
import TypeTabs from '@molecules/character/TypeTabs';
import AuctionList from '@organisms/character/AuctionList';
import Box from '@atoms/box/Box';
import Icon from '@atoms/image/Icon';
import AuctionFilter from '@molecules/character/AuctionFilter';
import ConfirmModal from '@molecules/character/ConfirmModal';
import PriceInputModal from '@molecules/character/PriceInputModal';
import usePlayerStore from '../../stores/playerStore';
import { useUserStore } from '../../stores/userStore';
import {
    loadAuctionItems,
    handleAuctionAction,
    getLoadingState
  } from '@services/characterAPI';

const CharacterAuction = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type = 'character' } = route.params || {};

   // PlayerStore에서 코인 정보 가져오기
  const { currency, level, refreshPlayerData } = usePlayerStore();
  
  // UserStore에서 사용자 정보 가져오기
  const { user, fetchUser } = useUserStore();

  // 상태 
  const [activeFilter, setActiveFilter] = useState('buy'); // 'buy' | 'sell' | 'receivable'
  const [activeType, setActiveType] = useState(type); // 'character' | 'room'
  const [selectedItem, setSelectedItem] = useState(null); // 클릭한 항목 저장
  const [modalVisible, setModalVisible] = useState(false); // 확인 모달
  const [priceModalVisible, setPriceModalVisible] = useState(false); // 가격 입력 모달
  const [items, setItems] = useState([]);

  // API 로딩 상태
  const loading = getLoadingState('loadAuctionItems') || getLoadingState('handleAuctionAction');

  // 데이터 로딩
  useEffect(() => {
    loadItems();
  }, [activeType, activeFilter]);


  const loadItems = async () => {
    const itemType = activeType === 'room' ? 'theme' : 'character';
    const result = await loadAuctionItems(activeFilter, itemType);
  
    
    if (result.success) {
      setItems(result.data);
    } else {
      setItems([]);
      Alert.alert('로드 실패', '목록을 불러오는데 실패했습니다.');
    }
  };
    
  const handleFilterChange = (filter) => { // 구매|판매|판매목록(수령가능)
    setActiveFilter(filter);
  };

  const handleTypeChange = (type) => { // 방|캐릭터
    setActiveType(type);
  };

  // 모달 내 '네' 클릭 시 API 호출
  const handleConfirm = async (item) => {
    if (!selectedItem) return;

    const result = await handleAuctionAction(activeFilter, item, activeType, currency);
    
    if (result.success) {
      // 플레이어 데이터 새로고침 (코인 변경 반영)
      if (activeFilter === 'buy' || activeFilter === 'receivable') {
        refreshPlayerData();
      }
      
      // 모달 닫기 및 목록 새로고침
      setModalVisible(false);
      setSelectedItem(null);
      loadItems();
    } else {
      // 에러 처리
      if (result.error?.type === 'INSUFFICIENT_FUNDS') {
        Alert.alert('코인 부족', result.error.message);
      } else {
        // 백엔드에서 오는 구체적인 에러 메시지 사용
        const errorMessage = result.error?.message || '작업에 실패했습니다.';
        Alert.alert('알림', errorMessage);
      }
    }
  };

  // 아이템 클릭 시 모달 띄움
  const handleItemPress = (item) => {
    setSelectedItem(item);
    
    // 판매 탭에서 가격이 없는 경우 가격 입력 모달 띄우기
    if (activeFilter === 'sell' && (!item.price || item.price === 0)) {
      setPriceModalVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  // 가격 설정 완료 후 상품 등록
  const handlePriceConfirm = async (itemWithPrice) => {
    const result = await handleAuctionAction(activeFilter, itemWithPrice, activeType, currency);
    
    if (result.success) {
      setPriceModalVisible(false);
      setSelectedItem(null);
      loadItems();
      Alert.alert('성공', '상품이 등록되었습니다.');
    } else {
      Alert.alert('오류', '상품 등록에 실패했습니다.');
    }
  };

  // 가격 입력 모달 취소
  const handlePriceCancel = () => {
    setPriceModalVisible(false);
    setSelectedItem(null);
  };

  // 모달 메시지
  const getConfirmMessage = () => {
    switch (activeFilter) {
      case 'buy': return '이 아이템을 구매하시겠습니까?';
      case 'sell': return '이 아이템을 판매하시겠습니까?';
      case 'receivable': return '판매 대금을 수령하시겠습니까?';
      default: return '';
    }
  };


  return (
    <MainLayout style={styles.container}>
      <TopStatusBar contentStyle={{justifyContent: 'center'}} level={level} coin={currency}/>
      <Box 
        title={'Trade Center'} 
        titleContainerStyle={{ justifyContent: 'center', alignItems: 'center'}}
        titleStyle={{ textAlign: 'center', width: '100%',}}
        contentStyle={{justifyContent: 'flex-start', paddingTop: 27, overflow: 'hidden'}}
        titleHeight={64}
      >
        <Icon
          icon={require('@assets/characterfamily.png')}
          size={{ height: '30%' }}
          style={styles.footerImage}
        />

        <Icon
          size={{ width: '100%', height: 30 }}
          icon={require('@assets/curtain.png')}
          style={{position:'absolute', top: -3}}
        />


        <View style={{width:'100%', paddingHorizontal:20}} >

          {/* 방|캐릭터 */}
          <TypeTabs
            activeType={activeType}
            onTypeChange={setActiveType}
            style={{ alignSelf: 'flex-start', marginTop: 5, marginBottom: 4, marginLeft: 0 }}
          />

          {/* 아이템 리스트 */}
            <Box style={{width:'100%'}} contentStyle={ styles.box } >
              <View style={styles.listContainer}>
                <AuctionList
                  items={items}
                  filterType={activeFilter}
                  onItemAction={handleItemPress}
                />

                {/* 일반 확인 모달 */}
                {modalVisible && selectedItem && (
                  <ConfirmModal
                    visible={modalVisible}
                    onConfirm={() => handleConfirm(selectedItem)}
                    onCancel={() => setModalVisible(false)}
                    message={getConfirmMessage()}
                  />
                )}

                {/* 가격 입력 모달 */}
                {priceModalVisible && selectedItem && (
                  <PriceInputModal
                    visible={priceModalVisible}
                    onConfirm={handlePriceConfirm}
                    onCancel={handlePriceCancel}
                    item={selectedItem}
                  />
                )}
              </View>
            </Box>
          </View>
      </Box>
      <AuctionFilter
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 90,
    margin: 15,
  },
  box: {
    backgroundColor: '#91B7AB',
    height: '60%',
    width: '100%',
  },
  listContainer:{
    width: '100%',
    height: '100%',
    padding: 10,
    overflow: 'hidden',
  },
  footerImage: {
    position: 'absolute',
    bottom: -15,
    left: 5,
    width: '70%',
    height: '30%',
    zIndex: 100,
  },
});

export default CharacterAuction;