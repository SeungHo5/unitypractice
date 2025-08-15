import axios from 'axios';
import { API_USER_URL } from '@env';

const api = axios.create({
  baseURL: API_USER_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  // 토큰 가져오기
  const token = '';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
