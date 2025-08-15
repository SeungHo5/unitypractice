import { create } from 'zustand';
import { getMyInfo } from '@services/userAPI';

export const useUserStore = create((set, get) => ({
  user: null,
  error: null,

  // 유저 정보 가져오기
  fetchUser: async () => {
    set({ error: null });
    
    try {
      const userData = await getMyInfo();
      
      set({ 
        user: userData, 
        error: null 
      });
      
      return userData;
    } catch (error) {
      console.log('유저 정보 가져오기 실패:', error);
      set({ 
        user: null, 
        error: error.response?.data?.message || '유저 정보를 가져올 수 없습니다.' 
      });
      throw error;
    }
  },

  // 유저 정보 업데이트
  updateUser: (userData) => {
    set({ user: userData });
  },

  // 특정 필드만 업데이트
  updateUserField: (field, value) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ 
        user: { 
          ...currentUser, 
          [field]: value 
        } 
      });
    }
  },

  // 유저 정보 초기화 (로그아웃 시)
  clearUser: () => {
    set({ 
      user: null, 
      error: null 
    });
  },

  // 로그인 상태 체크
  isLoggedIn: () => {
    return get().user !== null;
  }
}));