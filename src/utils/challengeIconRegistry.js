const iconMap = {
  'StudyBoard': require('@assets/challengeBoardIcon0.png'),
  'CharacterBoard': require('@assets/challengeBoardIcon1.png'),
  'CoinBoard': require('@assets/challengeBoardIcon2.png'),
};

export const getChallengeIconSource = (iconName) => {
  return iconMap[iconName];
};