import { create } from 'zustand';
import {
  getPlayerData,
  getCurrency,
  getUserLevel,
  handleCurrencyTransaction,
  getLoadingState
} from '../services/characterAPI';

const usePlayerStore = create((set, get) => ({
  currency: 0,
  level: 1,

  // 상태 관리
  isDataLoaded: false,
  lastUpdated: null,

  // API 로딩 상태 (playerAPI에서 가져옴)
  get isLoading() {
    return getLoadingState('getPlayerData') ||
      getLoadingState('getCurrency') ||
      getLoadingState('getUserLevel') ||
      getLoadingState('handleCurrencyTransaction');
  },

  // 기본 액션
  setCurrency: (amount) => set({ currency: amount }),
  setLevel: (level) => set({ level }),

  // Currency 즉시 업데이트 (뽑기, 거래소에서)
  spendCurrency: (amount) => set((state) => ({
    currency: Math.max(0, state.currency - amount)
  })),

  earnCurrency: (amount) => set((state) => ({
    currency: state.currency + amount
  })),

  // ========== 데이터 로딩 (홈 진입시) ==========
  loadPlayerData: async () => {
    const result = await getPlayerData();

    if (result.success) {
      set({
        currency: result.data.currency,
        level: result.data.level.currentLevel, // 레벨만 저장
        isDataLoaded: true,
        lastUpdated: new Date()
      });

      console.log('플레이어 기본 데이터 로드 성공:', {
        currency: result.data.currency,
        level: result.data.level.currentLevel
      });
    } else {
      console.error('플레이어 데이터 로드 실패:', result.error);
      set({ isDataLoaded: false });
      throw new Error(result.error?.message || '플레이어 데이터 로드 실패');
    }
  },

  // ========== 개별 새로고침 ==========
  refreshCurrency: async () => {
    const result = await getCurrency();

    if (result.success) {
      set({ currency: result.data.amount });
    } else {
      console.error('Currency 새로고침 실패:', result.error);
    }
  },

  refreshLevel: async () => {
    const result = await getUserLevel();

    if (result.success) {
      set({ level: result.data.currentLevel }); // 레벨만 업데이트
    } else {
      console.error('Level 새로고침 실패:', result.error);
    }
  },

  // 전체 새로고침
  refreshPlayerData: async () => {
    set({ isDataLoaded: false });
    await get().loadPlayerData();
  },

  // 데이터 초기화 (로그아웃시)
  resetPlayerData: () => set({
    currency: 0,
    level: 1,
    isDataLoaded: false,
    lastUpdated: null
  }),

  // ========== 추가 편의 함수들 ==========
  // 서버 기반 코인 거래 (API 호출 포함)
  performCurrencyTransaction: async (type, amount) => {
    const result = await handleCurrencyTransaction(type, amount);

    if (result.success) {
      // 서버에서 거래 성공 시 로컬 상태 업데이트
      if (type === 'earn') {
        set((state) => ({ currency: state.currency + amount }));
      } else if (type === 'spend') {
        set((state) => ({ currency: Math.max(0, state.currency - amount) }));
      }
      return result;
    } else {
      console.error(`코인 ${type} 실패:`, result.error);
      return result;
    }
  }
}));

export default usePlayerStore;