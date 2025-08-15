import axios from 'axios';
import { API_STUDY_URL } from '@env';

const api = axios.create({
  baseURL: API_STUDY_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  // 토큰 가져오기
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzU0ODk0Njc0LCJleHAiOjE3NTQ4OTU1NzR9.k6tye9mwZvcDdPH3SJOC2jDI5wNPgeLHXVYBzKJBvEABearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzU0ODk2NTUxLCJleHAiOjE3NTQ4OTc0NTF9.8oevo9zMOr9WWQtnXsaR6CwoIj6a82Og43rgT1cSmjA';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
