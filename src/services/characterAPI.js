import { characterAPI as api } from './api';
import { mergeCharacterData, mergeThemeData } from '../utils/dataMapper';

// ============ 로딩 상태 관리 ============
const loadingState = {
  // 캐릭터 관리
  getUserCharacters: false,
  selectCharacter: false,
  drawCharacter: false,
  
  // 테마 관리
  getUserThemes: false,
  selectTheme: false,
  drawTheme: false,
  
  // 경매 관리
  getAuctionList: false,
  getMySales: false,
  getPendingRevenue: false,
  purchaseItem: false,
  registerAuction: false,
  receiveRevenue: false,
  receiveAllRevenue: false,
  
  // 코인 관리
  getCurrency: false,
  earnCurrency: false,
  spendCurrency: false,
  
  // 레벨/경험치 관리
  getUserLevel: false,
  getCurrentLevelExp: false,
  getExpToNextLevel: false,
  getLevelProgress: false,
  addExperience: false,
  getOtherUserLevel: false,
  
  // 랭킹 관리
  getUserRanking: false,
  getMyRanking: false,
  getRankingList: false,
  getTopRankings: false,
  
  // 통합 함수들
  loadUserItems: false,
  handleItemSelect: false,
  handleItemDraw: false,
  loadAuctionItems: false,
  handleAuctionAction: false,
  getPlayerData: false,
  handleCurrencyTransaction: false,
  loadRankingData: false,

  // 챌린지 관리
  getActiveChallenges: false,
  getAllChallenges: false,
  claimChallengeReward: false,
};

// 로딩 상태 조회 함수
export const getLoadingState = (functionName) => loadingState[functionName];
export const getAllLoadingStates = () => ({ ...loadingState });

// ============ 캐릭터 관리 (Character Management) ============

// 보유 캐릭터 목록 조회
export const getUserCharacters = async () => {
  loadingState.getUserCharacters = true;
  try {
    console.log('캐릭터 API 호출 시작');
    console.log('API BaseURL:', api.defaults.baseURL);
    console.log('요청 URL:', '/character');
    
    const response = await api.get('/character');
    console.log('보유 캐릭터 목록 조회 API 성공:', response.data);
    // return { success: true, data: response.data };
    return { success: true, data: Array.isArray(response.data?.items) ? response.data.items : [] };
  } catch (error) {
    console.log('보유 캐릭터 목록 조회 API 호출 실패');
    console.log('에러 상태:', error.response?.status);
    console.log('에러 메시지:', error.message);
    
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserCharacters = false;
  }
};

// 캐릭터 선택
export const selectCharacter = async (characterId) => {
  loadingState.selectCharacter = true;
  try {
    const response = await api.post(`/character/select/${characterId}`);
    console.log('캐릭터 선택 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('캐릭터 선택 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.selectCharacter = false;
  }
};

// 캐릭터 뽑기
export const drawCharacter = async (count = 1) => {
  loadingState.drawCharacter = true;
  try {
    const response = await api.post('/character/draw', { count });
    console.log('캐릭터 뽑기 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('캐릭터 뽑기 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.drawCharacter = false;
  }
};

// ============ 테마 관리 (Theme Management) ============

// 보유 테마 목록 조회
export const getUserThemes = async () => {
  loadingState.getUserThemes = true;
  try {
    console.log('테마 API 호출 시작');
    console.log('API BaseURL:', api.defaults.baseURL);
    console.log('요청 URL:', '/theme');
    
    const response = await api.get('/theme');
    console.log('보유 테마 목록 조회 API 성공:', response.data);
    return { success: true, data: Array.isArray(response.data?.items) ? response.data.items : [] };
  } catch (error) {
    console.log('보유 테마 목록 조회 API 호출 실패');
    console.log('에러 상태:', error.response?.status);
    console.log('에러 메시지:', error.message);
    
    
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserThemes = false;
  }
};

// 테마 선택
export const selectTheme = async (themeId) => {
  loadingState.selectTheme = true;
  try {
    const response = await api.post(`/theme/select/${themeId}`);
    console.log('테마 선택 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('테마 선택 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.selectTheme = false;
  }
};

// 테마 뽑기
export const drawTheme = async (count = 1) => {
  loadingState.drawTheme = true;
  try {
    const response = await api.post('/theme/draw', { count });
    console.log('테마 뽑기 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('테마 뽑기 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.drawTheme = false;
  }
};

// ============ 통합 함수들 (Integrated Functions) ============

// 통합 아이템 목록 로딩 함수 (캐릭터 또는 테마)
export const loadUserItems = async (itemType) => {
  loadingState.loadUserItems = true;
  try {
    let result;
    
    if (itemType === 'character') {
      result = await getUserCharacters();
    } else if (itemType === 'theme') {
      result = await getUserThemes();
    } else {
      return { success: false, error: '잘못된 아이템 타입입니다.' };
    }
    
    return result;
  } catch (error) {
    console.log('아이템 목록 로딩 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.loadUserItems = false;
  }
};

// 통합 아이템 선택 함수
export const handleItemSelect = async (itemType, itemId) => {
  loadingState.handleItemSelect = true;
  try {
    let result;
    
    if (itemType === 'character') {
      result = await selectCharacter(itemId);
    } else if (itemType === 'room') {
      result = await selectTheme(itemId);
    } else {
      return { success: false, error: '잘못된 아이템 타입입니다.' };
    }
    
    return result;
  } catch (error) {
    console.log('아이템 선택 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.handleItemSelect = false;
  }
};

// 통합 아이템 뽑기 함수 (코인 잔액 확인 포함)
export const handleItemDraw = async (itemType, count = 1, userCurrency = null) => {
  loadingState.handleItemDraw = true;
  try {
    // 코인 잔액 확인 (선택사항)
    const costPerDraw = 100; // 뽑기 당 비용 (실제 값은 백엔드에서 확인)
    const totalCost = costPerDraw * count;
    
    if (userCurrency !== null && userCurrency < totalCost) {
      return { 
        success: false, 
        error: { 
          type: 'INSUFFICIENT_FUNDS',
          message: `코인이 부족합니다! (필요: ${totalCost}, 보유: ${userCurrency})`
        }
      };
    }
    
    let result;
    
    if (itemType === 'character') {
      result = await drawCharacter(count);
    } else if (itemType === 'room') {
      result = await drawTheme(count);
    } else {
      return { success: false, error: '잘못된 아이템 타입입니다.' };
    }
    
    return result;
  } catch (error) {
    console.log('아이템 뽑기 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.handleItemDraw = false;
  }
};

// ============ 경매 관리 (Auction Management) ============

// 경매 목록 조회 (구매 탭)
export const getAuctionList = async (params = {}) => {
  loadingState.getAuctionList = true;
  try {
    const response = await api.get('/auction', {params});
    console.log('경매 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('경매 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getAuctionList = false;
  }
};

// 내 판매 목록 (판매 탭)
export const getMySales = async (params = {}) => {
  loadingState.getMySales = true;
  try {
    const response = await api.get('/auction/my-sales', {params});
    console.log('내 판매 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('내 판매 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getMySales = false;
  }
};

// 미수령 수익 조회 (수령가능 탭)
export const getPendingRevenue = async () => {
  loadingState.getPendingRevenue = true;
  try {
    const response = await api.get('/auction/pending-revenue');
    console.log('미수령 수익 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('미수령 수익 조회 API 호출 실패:');
    console.log('- 상태 코드:', error.response?.status);
    console.log('- 에러 메시지:', error.response?.data?.message);
    console.log('- 전체 에러 데이터:', error.response?.data);
    console.log('- 전체 에러 객체:', error);
    
    // 미수령 수익이 없는 경우 빈 배열 반환
    if ((error.response?.status === 500 || error.response?.status === 400) &&
        error.response?.data?.message?.includes('미수령 수익이 없습니다')) {
      console.log('미수령 수익이 없음 - 빈 배열 반환');
      return { success: true, data: [] };
    }
    
    // refresh token 에러도 빈 배열로 처리 (임시)
    if (error.response?.data?.message?.includes('Refresh Token이 유효하지 않습니다')) {
      console.log('토큰 에러이지만 미수령 수익으로 처리 - 빈 배열 반환');
      return { success: true, data: [] };
    }
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getPendingRevenue = false;
  }
};

// 상품 구매
export const purchaseItem = async (auctionId) => {
  loadingState.purchaseItem = true;
  try {
    const response = await api.post(`/auction/${auctionId}/purchase`);
    console.log('상품 구매 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('상품 구매 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.purchaseItem = false;
  }
};

// 상품 등록
export const registerAuction = async (request) => {
  loadingState.registerAuction = true;
  try {
    const response = await api.post('/auction', request);
    console.log('상품 등록 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('상품 등록 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.registerAuction = false;
  }
};

// 수익 수령
export const receiveRevenue = async (pendingRevenueId) => {
  loadingState.receiveRevenue = true;
  try {
    const response = await api.post('/auction/revenue/receive', null, {
      params: { pendingRevenueId }
    });
    console.log('수익 수령 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('수익 수령 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.receiveRevenue = false;
  }
};

// 모든 수익 일괄 수령
export const receiveAllRevenue = async () => {
  loadingState.receiveAllRevenue = true;
  try {
    const response = await api.post('/auction/pending-revenue/receive-all');
    console.log('모든 수익 일괄 수령 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('모든 수익 일괄 수령 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.receiveAllRevenue = false;
  }
};


// 아이템 데이터에 이미지와 이름 매핑 함수
const mapItemData = (items, itemType) => {
  if (!Array.isArray(items)) return [];
  
  console.log('mapItemData 호출:', { itemType, itemsCount: items.length });
  console.log('원본 데이터 샘플:', items[0]);
  
  return items.map(item => {
    let mappedItem = { ...item };
    
    if (itemType === 'character') {
      // 경매 데이터의 경우 item.itemId, 보유 데이터의 경우 item.id 사용
      const characterId = item.itemId || item.characterId || item.id;
      console.log('캐릭터 ID:', characterId, 'from item:', item);
      
      const characterData = mergeCharacterData([{ id: characterId, amount: 1 }]);
      const character = characterData.find(c => c.id === characterId);
      if (character) {
        mappedItem.name = character.name;
        mappedItem.image = character.image;
        mappedItem.rarity = character.rarity;
        console.log('캐릭터 매핑 성공:', character.name);
      } else {
        console.log('캐릭터 매핑 실패 - ID:', characterId);
      }
    } else if (itemType === 'theme') {
      // 경매 데이터의 경우 item.itemId, 보유 데이터의 경우 item.id 사용
      const themeId = item.itemId || item.themeId || item.id;
      console.log('테마 ID:', themeId, 'from item:', item);
      
      const themeData = mergeThemeData([{ id: themeId, amount: 1 }]);
      const theme = themeData.find(t => t.id === themeId);
      if (theme) {
        mappedItem.name = theme.name;
        mappedItem.image = theme.image;
        mappedItem.rarity = theme.rarity;
        console.log('테마 매핑 성공:', theme.name);
      } else {
        console.log('테마 매핑 실패 - ID:', themeId);
      }
    }
    
    return mappedItem;
  });
};

// 통합 목록 로딩 함수 (경매)
export const loadAuctionItems = async (filterType, itemType) => {
  loadingState.loadAuctionItems = true;
  try {
    let result;

    switch (filterType) {
      case 'buy':
        result = await getAuctionList({
          itemType: itemType === 'character' ? 'CHARACTER' : 'THEME',
          page: 0,
          size: 20
        });
        if (!result.success) return result;
        
        let buyData = mapItemData(result.data.content || [], itemType);
        
        // 백엔드에서 본인 상품 구매 차단을 처리하므로 프론트엔드에서는 별도 처리 불요
        
        return { success: true, data: buyData };

      case 'sell':
        // 판매 탭에서는 보유한 캐릭터/테마 목록을 조회 (판매하기 버튼을 위함)
        if (itemType === 'character') {
          result = await getUserCharacters();
          if (!result.success) return result;
          const characterData = mergeCharacterData(result.data || []);
          const ownedCharacters = characterData.filter(item => item.amount > 0);
          return { success: true, data: ownedCharacters };
        } else if (itemType === 'theme') {
          result = await getUserThemes();
          if (!result.success) return result;
          const themeData = mergeThemeData(result.data || []);
          const ownedThemes = themeData.filter(item => item.amount > 0);
          return { success: true, data: ownedThemes };
        } else {
          return { success: false, error: '잘못된 아이템 타입입니다.' };
        }

      case 'receivable':
        console.log('미수령 수익 조회 시작 - 디버깅');
        result = await getPendingRevenue();
        console.log('미수령 수익 조회 결과:', result);
        if (!result.success) return result;
        // 필터링: 현재 타입에 맞는 아이템만
        const filteredData = result.data.filter(item =>
          item.itemType === (itemType === 'character' ? 'CHARACTER' : 'THEME')
        );
        const receivableData = mapItemData(filteredData || [], itemType);
        return { success: true, data: receivableData };

      default:
        return { success: false, error: '잘못된 필터 타입입니다.' };
    }
  } catch (error) {
    console.log('목록 로딩 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.loadAuctionItems = false;
  }
};

// 통합 거래 액션 처리 함수
export const handleAuctionAction = async (filterType, item, activeType, currency = null) => {
  loadingState.handleAuctionAction = true;
  try {
    let result;

    switch (filterType) {
      case 'buy':
        // 잔액 확인
        if (currency !== null && currency < item.price) {
          return { 
            success: false, 
            error: { 
              type: 'INSUFFICIENT_FUNDS',
              message: `코인이 부족합니다! (보유: ${currency})`
            }
          };
        }
        // 경매 데이터에서는 auctionId 사용
        result = await purchaseItem(item.auctionId || item.id);
        break;

      case 'sell':
        result = await registerAuction({
          itemType: activeType === 'room' ? 'THEME' : 'CHARACTER',
          itemId: item.id,
          price: item.price
        });
        break;

      case 'receivable':
        result = await receiveRevenue(item.id);
        break;

      default:
        return { success: false, error: '잘못된 액션 타입입니다.' };
    }

    return result;
  } catch (error) {
    console.log('거래 액션 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.handleAuctionAction = false;
  }
};

// ============ 코인 관리 (Currency Management) ============

// 코인 조회
export const getCurrency = async () => {
  loadingState.getCurrency = true;
  try {
    const response = await api.get('/currency');
    console.log('코인 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('코인 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getCurrency = false;
  }
};

// 코인 획득
export const earnCurrency = async (amount) => {
  loadingState.earnCurrency = true;
  try {
    const response = await api.post('/currency/earn', { amount });
    console.log('코인 획득 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('코인 획득 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.earnCurrency = false;
  }
};

// 코인 소모
export const spendCurrency = async (amount) => {
  loadingState.spendCurrency = true;
  try {
    const response = await api.post('/currency/spend', { amount });
    console.log('코인 소모 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('코인 소모 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.spendCurrency = false;
  }
};

// ============ 레벨/경험치 관리 (Level/Experience Management) ============

// 전체 레벨 정보 조회
export const getUserLevel = async () => {
  loadingState.getUserLevel = true;
  try {
    const response = await api.get('/user-level');
    console.log('사용자 레벨 정보 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자 레벨 정보 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserLevel = false;
  }
};

// 현재 경험치 조회
export const getCurrentLevelExp = async () => {
  loadingState.getCurrentLevelExp = true;
  try {
    const response = await api.get('/user-level/exp');
    console.log('현재 경험치 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('현재 경험치 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getCurrentLevelExp = false;
  }
};

// 다음 레벨까지 필요 경험치 조회
export const getExpToNextLevel = async () => {
  loadingState.getExpToNextLevel = true;
  try {
    const response = await api.get('/user-level/exp-to-next');
    console.log('다음 레벨까지 필요 경험치 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('다음 레벨까지 필요 경험치 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getExpToNextLevel = false;
  }
};

// 레벨 진행률 조회
export const getLevelProgress = async () => {
  loadingState.getLevelProgress = true;
  try {
    const response = await api.get('/user-level/progress');
    console.log('레벨 진행률 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('레벨 진행률 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getLevelProgress = false;
  }
};

// 경험치 추가
export const addExperience = async (exp) => {
  loadingState.addExperience = true;
  try {
    const response = await api.post(`/user-level/add-exp?exp=${exp}`);
    console.log('경험치 추가 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('경험치 추가 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.addExperience = false;
  }
};

// 다른 유저 레벨 조회
export const getOtherUserLevel = async (userId) => {
  loadingState.getOtherUserLevel = true;
  try {
    const response = await api.get(`/user-level/${userId}/level`);
    console.log('다른 유저 레벨 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('다른 유저 레벨 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getOtherUserLevel = false;
  }
};

// ============ 랭킹 관리 (Ranking Management) ============

// 특정 유저 랭킹 조회
export const getUserRanking = async (userId) => {
  loadingState.getUserRanking = true;
  try {
    const response = await api.get(`/ranking/user/${userId}`);
    console.log('유저 랭킹 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('유저 랭킹 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserRanking = false;
  }
};

// 내 랭킹 조회
export const getMyRanking = async () => {
  loadingState.getMyRanking = true;
  try {
    const levelResult = await getUserLevel();
    if (!levelResult.success) {
      return levelResult;
    }
    console.log('내 랭킹 조회 성공:', levelResult.data.rank);
    return { success: true, data: levelResult.data.rank };
  } catch (error) {
    console.log('내 랭킹 조회 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.getMyRanking = false;
  }
};

// 랭킹 목록 조회
export const getRankingList = async (page = 0, size = 20) => {
  loadingState.getRankingList = true;
  try {
    const response = await api.get('/ranking', {
      params: { page, size }
    });
    console.log('랭킹 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('랭킹 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getRankingList = false;
  }
};

// 상위 랭킹 조회
export const getTopRankings = async (count = 10) => {
  loadingState.getTopRankings = true;
  try {
    const response = await api.get(`/ranking/top/${count}`);
    console.log('상위 랭킹 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('상위 랭킹 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getTopRankings = false;
  }
};

// ============ 통합 함수들 (Player Related Integrated Functions) ============

// 통합 플레이어 데이터 조회
export const getPlayerData = async () => {
  loadingState.getPlayerData = true;
  try {
    // 병렬로 코인과 레벨 정보 조회
    const [currencyResult, levelResult] = await Promise.all([
      getCurrency(),
      getUserLevel()
    ]);

    if (!currencyResult.success || !levelResult.success) {
      const error = currencyResult.error || levelResult.error;
      console.log('플레이어 데이터 조회 실패:', error);
      return { success: false, error };
    }

    const playerData = {
      currency: currencyResult.data.amount,
      level: levelResult.data
    };

    console.log('통합 플레이어 데이터 조회 성공:', playerData);
    return { success: true, data: playerData };
  } catch (error) {
    console.log('통합 플레이어 데이터 조회 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.getPlayerData = false;
  }
};

// 통합 코인 거래 함수 (획득/소모)
export const handleCurrencyTransaction = async (type, amount) => {
  loadingState.handleCurrencyTransaction = true;
  try {
    let result;
    
    if (type === 'earn') {
      result = await earnCurrency(amount);
    } else if (type === 'spend') {
      result = await spendCurrency(amount);
    } else {
      return { success: false, error: '잘못된 거래 타입입니다.' };
    }
    
    return result;
  } catch (error) {
    console.log('코인 거래 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.handleCurrencyTransaction = false;
  }
};

// 통합 랭킹 데이터 로딩 함수
export const loadRankingData = async (params = {}) => {
  loadingState.loadRankingData = true;
  try {
    const { type = 'list', userId = null, page = 0, size = 20, count = 10 } = params;
    let result;
    
    switch (type) {
      case 'user':
        if (!userId) {
          return { success: false, error: '사용자 ID가 필요합니다.' };
        }
        result = await getUserRanking(userId);
        break;
        
      case 'my':
        result = await getMyRanking();
        break;
        
      case 'list':
        result = await getRankingList(page, size);
        break;
        
      case 'top':
        result = await getTopRankings(count);
        break;
        
      default:
        return { success: false, error: '잘못된 랭킹 타입입니다.' };
    }
    
    return result;
  } catch (error) {
    console.log('랭킹 데이터 로딩 실패:', error);
    return { success: false, error };
  } finally {
    loadingState.loadRankingData = false;
  }
};

// ============ 챌린지 관리 (Challenge Management) ============

// 활성화된 챌린지 목록 조회
export const getActiveChallenges = async () => {
  loadingState.getActiveChallenges = true;
  try {
    const response = await api.get('/challenges/active');
    console.log('✅ 활성화된 챌린지 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ 활성화된 챌린지 목록 조회 API 호출 실패');
    console.log('📊 에러 상태:', error.response?.status);
    console.log('📝 에러 메시지:', error.message);
    console.log('🔗 요청 URL:', error.config?.url);
    console.log('📋 에러 응답:', error.response?.data);
    console.log('🔍 전체 에러 객체:', error);
    
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getActiveChallenges = false;
  }
};

// 모든 챌린지 목록 조회
export const getAllChallenges = async () => {
  loadingState.getAllChallenges = true;
  try {
    const response = await api.get('/challenges/all');
    console.log('✅ 모든 챌린지 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ 모든 챌린지 목록 조회 API 호출 실패');
    console.log('📊 에러 상태:', error.response?.status);
    console.log('📝 에러 메시지:', error.message);
    console.log('🔗 요청 URL:', error.config?.url);
    console.log('📋 에러 응답:', error.response?.data);
    console.log('🔍 전체 에러 객체:', error);
    
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getAllChallenges = false;
  }
};

/**
 * 모든 챌린지를 조회하고 카테고리별로 완료/미완료 개수를 반환합니다.
 * @returns {Object} API 응답과 카테고리별 진행률 정보
 */
export const getChallengeProgressByCategory = async () => {
  loadingState.getAllChallenges = true;
  try {
    const response = await api.get('/challenges/all');
    
    const challengesData = response.data;
    if (!Array.isArray(challengesData) || challengesData.length === 0) {
      console.log('⚠️ 챌린지 데이터가 비어있음');
      return { success: true, data: [] };
    }

    const categories = {};

    challengesData.forEach(challenge => {
      const { categoryId, categoryName, isCompleted } = challenge;
      
      if (!categories[categoryId]) {
        categories[categoryId] = {
          categoryId,
          categoryName,
          completed: 0,
          incomplete: 0
        };
      }

      if (isCompleted) {
        categories[categoryId].completed++;
      } else {
        categories[categoryId].incomplete++;
      }
    });

    const result = {};
    Object.values(categories).forEach(category => {
      result[category.categoryId] = {
        categoryName: category.categoryName,
        progress: `${category.completed} / ${category.completed + category.incomplete}`
      };
    });

    console.log('✅ 카테고리별 챌린지 분류 완료:', result);
    return { success: true, data: result };
    
  } catch (error) {
    console.log('❌ 모든 챌린지 목록 조회 및 분류 API 호출 실패');
    console.log('📊 에러 상태:', error.response?.status);
    console.log('📝 에러 메시지:', error.message);
    console.log('🔗 요청 URL:', error.config?.url);
    console.log('📋 에러 응답:', error.response?.data);
    console.log('🔍 전체 에러 객체:', error);
    
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getAllChallenges = false;
  }
};

// 챌린지 보상 수령
export const claimChallengeReward = async (userChallengeProgressId) => {
  loadingState.claimChallengeReward = true;
  try {
    console.log('🚀 챌린지 보상 수령 API 호출 시작');
    console.log('🔗 API BaseURL:', api.defaults.baseURL);
    console.log('🎯 요청 URL:', '/challenges/claim');
    console.log('📝 요청 파라미터:', { userChallengeProgressId });
    
    const response = await api.post('/challenges/claim', null, {
      params: { userChallengeProgressId }
    });
    console.log('✅ 챌린지 보상 수령 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ 챌린지 보상 수령 API 호출 실패');
    console.log('📊 에러 상태:', error.response?.status);
    console.log('📝 에러 메시지:', error.message);
    console.log('🔗 요청 URL:', error.config?.url);
    console.log('📋 에러 응답:', error.response?.data);
    console.log('🔍 전체 에러 객체:', error);
    
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.claimChallengeReward = false;
  }
};