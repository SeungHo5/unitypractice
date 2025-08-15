// 임시 이미지 플레이스홀더
// 실제 이미지들이 로드될 때까지 사용할 기본 이미지들

export const PLACEHOLDER_IMAGES = {
  background: require('@assets/placeholder.png'), // 기본 배경
  logo: require('@assets/placeholder.png'), // 로고
  index_title: require('@assets/placeholder.png'), // 타이틀
  navigate: require('@assets/placeholder.png'), // 네비게이션 아이콘
};

// 기본 placeholder 이미지 반환 함수
export const getPlaceholderImage = () => ({
  uri: 'https://via.placeholder.com/150x150/91B7AB/ffffff?text=Image'
});
