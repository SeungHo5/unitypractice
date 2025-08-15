import { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI } from '@env';
import { userAPI as api} from '@services/api';

export const getKakaoAuthUrl = () => {
  const baseUrl = 'https://kauth.kakao.com/oauth/authorize';
  const query = `client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    KAKAO_REDIRECT_URI
  )}&response_type=code&scope=profile_nickname,account_email`;
  return `${baseUrl}?${query}`;
};

export const loginWithKakaoCode = async (code) => {
  const response = await api.post('/auth/kakao', { code });
  return response.data;
};