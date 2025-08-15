// src/stores/authStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set, get) => ({
  // 상태
  user: null,
  isLoggedIn: false,
  
  // 로그인 (토큰과 유저정보 저장)
  setLogin: async (userInfo, accessToken, refreshToken) => {
    try {
      // AsyncStorage에 저장
      await AsyncStorage.multiSet([
        ['@user', JSON.stringify(userInfo)],
        ['@accessToken', accessToken],
        ['@refreshToken', refreshToken],
        ['@isLoggedIn', 'true']
      ]);
      
      // 상태 업데이트
      set({ user: userInfo, isLoggedIn: true });
    } catch (error) {
      console.error('로그인 정보 저장 실패:', error);
    }
  },
  
  // 로그아웃
  logout: async () => {
    try {
      await AsyncStorage.multiRemove(['@user', '@accessToken', '@refreshToken', '@isLoggedIn']);
      set({ user: null, isLoggedIn: false });
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  },
  
  // 앱 시작시 자동 로그인 체크
  checkAutoLogin: async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('@isLoggedIn');
      if (isLoggedIn === 'true') {
        const userData = await AsyncStorage.getItem('@user');
        if (userData) {
          const user = JSON.parse(userData);
          set({ user, isLoggedIn: true });
        }
      }
    } catch (error) {
      console.error('자동 로그인 체크 실패:', error);
    }
  }
}));

export default useAuthStore;