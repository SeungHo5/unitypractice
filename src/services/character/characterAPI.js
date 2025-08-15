import api from './api';
console.log('baseURL:', api.defaults.baseURL);

export const getUserCharacters = async () => {
  const response = await api.get('/character');
  return response.data;
};

export const selectCharacter = async (characterId) => {
  const response = await api.post(`/character/select/${characterId}`);
  return response.data;
};

export const drawCharacter = async (count = 1) => {
  const response = await api.post('/character/draw', { count });
  return response.data;
}

export const getUserThemes = async () => {
  const response = await api.get('/theme');
  return response.data;
};

export const selectTheme = async (themeId) => {
  const response = await api.post(`/theme/select/${themeId}`);
  return response.data;
};

export const drawTheme = async (count = 1) => {
  const response = await api.post('/theme/draw', { count });
  return response.data;
};


