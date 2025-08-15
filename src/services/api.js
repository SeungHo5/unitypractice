import axios from 'axios';
import { API_USER_URL, API_CHARACTER_URL, API_STUDY_URL } from '@env';
import { useTokenStore } from '@stores/tokenStore';

const createInstance = (baseURL) => {
  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터 - 토큰 자동 첨부
  api.interceptors.request.use(
    async (config) => {
      // Zustand store에서 토큰 가져오기
      const { accessToken } = useTokenStore.getState();
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 토큰 갱신 및 에러 처리
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // 401 에러이고, 재시도하지 않은 요청인 경우
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const { refreshToken, setTokens, clearTokens } = useTokenStore.getState();

        console.log('refreshToken: ', refreshToken);
        if (refreshToken) {
          try {
            // 리프레시 토큰으로 새 액세스 토큰 요청
            const refreshResponse = await axios.post(`${API_USER_URL}/user/auth/reissue`, {}, {
              headers: {
                'Refresh-Token': refreshToken,
                'Content-Type': 'application/json'
              }
            });
            console.log('refreshResponse: ', refreshResponse);
            
            const { authorization: newAccessToken } = refreshResponse.headers;
            
            // 새 토큰들을 스토어에 저장
            await setTokens(newAccessToken, refreshToken);
            console.log('토큰 저장 성공');
            
            // 원래 요청에 새 토큰 적용하여 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
            
            
          } catch (refreshError) {
            console.log('토큰 갱신 실패:', refreshError);
            
            // 리프레시 토큰도 만료된 경우 - 로그아웃 처리
            await clearTokens();
            
            return Promise.reject(refreshError);
          }
        } else {
          // 리프레시 토큰이 없는 경우
          await clearTokens();
          return Promise.reject(error);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return api;
};

export const userAPI = createInstance(API_USER_URL);
export const characterAPI = createInstance(API_CHARACTER_URL);
export const studyAPI = createInstance(API_STUDY_URL);