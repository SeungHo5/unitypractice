import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTokenStore = create((set, get) => ({
  accessToken: null,
  refreshToken: null,
  
  setTokens: async (BearerAcessToken, refreshToken) => {
    const accessToken = BearerAcessToken.replace(/^Bearer\s/, '');
    set({ accessToken, refreshToken });
    await AsyncStorage.setItem('auth_tokens', JSON.stringify({ 
      accessToken, 
      refreshToken 
    }));
  },
  
  loadTokens: async () => {
    try {
      const tokens = await AsyncStorage.getItem('auth_tokens');
      if (tokens) {
        const { accessToken, refreshToken } = JSON.parse(tokens);
        set({ accessToken, refreshToken });
        return true;
      }
    } catch (error) {
      console.log('토큰 로드 실패:', error);
    }
    return false;
  },
  
  clearTokens: async () => {
    set({ accessToken: null, refreshToken: null });
    await AsyncStorage.removeItem('auth_tokens');
  },
  
  updateAccessToken: async (newAccessToken) => {
    const { refreshToken } = get();
    await get().setTokens(newAccessToken, refreshToken);
  }
}));
export default useTokenStore;