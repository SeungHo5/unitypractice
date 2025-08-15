import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';
import CenterBox from '@organisms/character/CenterBox';
import LayoutWidthStatus from '@templates/LayoutWidthStatus';
import { handleItemDraw, getLoadingState } from '@services/characterAPI';
import usePlayerStore from '../../stores/playerStore';

const CharacterDraw = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type = 'character', reset = false } = route.params || {};
  const wait = (ms = 1000) => new Promise(res => setTimeout(res, ms));

  // 전역 플레이어 상태/액션
  const { currency, spendCurrency, refreshCurrency } = usePlayerStore();

  // 로컬 UI 상태
  const [drawState, setDrawState] = useState('ready'); // 'ready' | 'revealing' | 'revealed'
  const [revealedItems, setRevealedItems] = useState([]);
  const [drawingCount, setDrawingCount] = useState(null);
  const [singleDrawCost] = useState(1000); // 1회 뽑기 비용
  const [multiDrawCost] = useState(10000); // 10회 뽑기 비용

  // API 로딩 상태
  const isDrawing = getLoadingState('handleItemDraw');

  
  // reset=true로 진입했을 때 상태 초기화
  useEffect(() => {
    if (reset) {
      setDrawState('ready');
      setRevealedItems([]);
      setDrawingCount(null);

      // param 초기화 (한 번만 실행되게)
      navigation.setParams({ reset: false });
    }
  }, [reset, navigation]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleDrawPress = async (count) => {
    // 중복 클릭 방지
    if (drawState !== 'ready' || isDrawing) {
      console.log('[뽑기] 무시됨 - 현재 상태:', drawState, '또는 API 요청 중:', isDrawing);
      return;
    }

    const cost = count === 1 ? singleDrawCost : multiDrawCost;
    console.log('[뽑기] 버튼 클릭', { 타입: type, 횟수: count, 비용: cost, 보유코인스냅샷: currency });

    setDrawingCount(count);
    setDrawState('revealing');
    console.log(`${count}회 뽑기 시작!`);

    // API 호출과 최소 연출시간(1000ms) 병렬 대기
    const [result] = await Promise.all([
      handleItemDraw(type, count, currency),
      wait(1000)
    ]);

    if (result.success) {
      console.log('[뽑기] API 성공 응답:', result.data);

      // 결과 정규화: 1회 => [obj], 10회 => data.results
      const results = Array.isArray(result.data?.results) ? result.data.results : [result.data];
      console.log('[뽑기] 정규화 결과', { 개수: results.length, 결과: results });

      // 코인 차감 (서버가 이미 차감한다면 spendCurrency 대신 refreshCurrency 사용)
      spendCurrency(cost); // <- 서버 차감이면 이 줄을 지우고 아래 줄로 대체
      console.log('[뽑기] 로컬 코인 차감 완료', { 차감: cost });
      // await refreshCurrency();

      // 결과 반영
      setRevealedItems(results);
      setDrawState('revealed');
      console.log('[뽑기] 연출 종료(revealed)');
    } else {
      console.error('뽑기 실패:', result.error);

      // 실패 케이스에서도 애니메이션 최소 1000ms 보장
      await wait(1000);

      refreshCurrency();
      setDrawState('ready');
      setDrawingCount(null);

      // 코인 부족 에러는 특별 처리
      if (result.error?.type === 'INSUFFICIENT_FUNDS') {
        Alert.alert('코인 부족', result.error.message);
      } else {
        const msg = result.error?.message || '뽑기에 실패했습니다!';
        Alert.alert('뽑기 실패', msg);
      }
    }
  };

  return (
    <LayoutWidthStatus>
      <CenterBox
        drawState={drawState}
        revealedItems={revealedItems}
        singleDrawCost={singleDrawCost}
        multiDrawCost={multiDrawCost}
        onDrawPress={handleDrawPress}
        onClose={handleClose}
        disabled={drawState !== 'ready'}
        drawingCount={drawingCount}
        type={type}
      />
    </LayoutWidthStatus>
  );
};

export default CharacterDraw;
    