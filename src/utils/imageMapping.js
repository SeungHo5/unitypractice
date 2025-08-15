 // utils/imageMapping.js (새로 생성)
// 캐릭터 이미지 매핑
export const getCharacterImage = (characterId) => {
  const characterImageMap = {
    0: require('@assets/characters/0.png'),
    1: require('@assets/characters/1.png'),
    2: require('@assets/characters/2.png'),
    3: require('@assets/characters/3.png'),
    4: require('@assets/characters/4.png'),
    5: require('@assets/characters/5.png'),
    6: require('@assets/characters/0.png'),
    7: require('@assets/characters/1.png'),
    8: require('@assets/characters/2.png'),
  };
  return characterImageMap[characterId];
};

// 테마 이미지 매핑
export const getThemeImage = (themeId) => {
  const themeImageMap = {
    1: require('@assets/rooms/room1.png'),
    2: require('@assets/rooms/room2.png'),
    3: require('@assets/rooms/room3.png'),
    4: require('@assets/rooms/room4.png'),
    5: require('@assets/rooms/room5.png'),
    6: require('@assets/rooms/room6.png'),
  };
  return themeImageMap[themeId];
};

// 홈화면에 표시되는 챌린지 보드 아이콘
export const getChallengeBoardImage = (iconName) => {
  const iconMap = {
    'StudyBoard': require('@assets/challengeBoardIcon0.png'),
    'CharacterBoard': require('@assets/challengeBoardIcon1.png'),
    'CoinBoard': require('@assets/challengeBoardIcon2.png'),
  };
  return iconMap[iconName];
};