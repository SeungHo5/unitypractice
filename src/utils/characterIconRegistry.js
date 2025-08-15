const iconMap = {
  0: require('@assets/characters/0.png'),
  1: require('@assets/characters/1.png'),
  2: require('@assets/characters/2.png'),
  3: require('@assets/characters/3.png'),
  4: require('@assets/characters/4.png'),
  5: require('@assets/characters/5.png'),
};

export const getCharacterIconSource = (iconName) => {
  return iconMap[iconName];
};