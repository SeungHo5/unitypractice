import axios from 'axios';
import { API_CHARACTER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: API_CHARACTER_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzU0ODk2NTUxLCJleHAiOjE3NTQ4OTc0NTF9.8oevo9zMOr9WWQtnXsaR6CwoIj6a82Og43rgT1cSmjA';

// 요청 인터셉터 (임시로 사용)
api.interceptors.request.use(
  (config) => {
    if (TEST_TOKEN) {
      config.headers.Authorization = `Bearer ${TEST_TOKEN}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;