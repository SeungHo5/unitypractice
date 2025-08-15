/**
 * NaN 높이/너비 문제 해결을 위한 유틸리티 함수들
 */

/**
 * 안전한 숫자 값 반환
 * @param {number|string} value - 검증할 값
 * @param {number} defaultValue - 기본값
 * @returns {number} 안전한 숫자 값
 */
export const safeNumber = (value, defaultValue = 0) => {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }
  return defaultValue;
};

/**
 * 안전한 높이 값 반환
 * @param {number|string} height - 높이 값
 * @param {number} fallback - 기본 높이 (기본: 100)
 * @returns {number|string} 안전한 높이 값
 */
export const safeHeight = (height, fallback = 100) => {
  // 문자열인 경우 (%, auto 등) 그대로 반환
  if (typeof height === 'string') return height;
  
  // 숫자이고 유효한 값인 경우
  return safeNumber(height, fallback);
};

/**
 * 안전한 너비 값 반환
 * @param {number|string} width - 너비 값
 * @param {string|number} fallback - 기본 너비 (기본: '100%')
 * @returns {number|string} 안전한 너비 값
 */
export const safeWidth = (width, fallback = '100%') => {
  // 문자열인 경우 그대로 반환
  if (typeof width === 'string') return width;
  
  // 숫자이고 유효한 값인 경우
  return safeNumber(width, fallback);
};

/**
 * 스타일 객체의 모든 치수 속성을 안전하게 처리
 * @param {object} style - 스타일 객체
 * @returns {object} 안전하게 처리된 스타일 객체
 */
export const sanitizeStyleDimensions = (style) => {
  if (!style || typeof style !== 'object') return style;
  
  const sanitized = { ...style };
  
  // 높이 관련 속성들
  const heightProps = ['height', 'minHeight', 'maxHeight'];
  // 너비 관련 속성들  
  const widthProps = ['width', 'minWidth', 'maxWidth'];
  // 기타 숫자 속성들
  const numericProps = [
    'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
    'marginHorizontal', 'marginVertical',
    'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
    'paddingHorizontal', 'paddingVertical',
    'borderRadius', 'borderWidth', 'fontSize', 'letterSpacing', 'opacity'
  ];
  
  // 위험한 position 속성들
  const dangerousProps = ['top', 'bottom', 'left', 'right'];
  
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    
    // NaN 값 처리
    if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
      if (heightProps.includes(key)) {
        sanitized[key] = 100; // 기본 높이
      } else if (widthProps.includes(key)) {
        sanitized[key] = '100%'; // 기본 너비
      } else if (numericProps.includes(key)) {
        sanitized[key] = 0; // 기타 속성은 0
      }
    }
    
    // overflow 속성 처리 (React Native에서는 'hidden'만 지원)
    if (key === 'overflow' && value !== 'hidden') {
      sanitized[key] = 'hidden';
    }
    
    // gap 속성 제거 (React Native 0.71에서 미지원)
    if (key === 'gap') {
      delete sanitized[key];
    }
    
    // 위험한 position 속성들 제거 (NaN 방지)
    if (dangerousProps.includes(key) && typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
      delete sanitized[key];
    }
  });
  
  return sanitized;
};

/**
 * React Native View 컴포넌트의 안전한 래퍼
 * @param {object} props - View 컴포넌트 props
 * @returns {object} 안전하게 처리된 props
 */
export const createSafeViewProps = (props) => {
  const { style, height, width, ...otherProps } = props;
  
  const safeStyle = {
    ...sanitizeStyleDimensions(style),
    ...(height && { height: safeHeight(height) }),
    ...(width && { width: safeWidth(width) })
  };
  
  return {
    ...otherProps,
    style: safeStyle
  };
};
