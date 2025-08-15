import { WebView } from 'react-native-webview';
import { KAKAO_REDIRECT_URI } from '@env';
import { getKakaoAuthUrl, loginWithKakaoCode } from '@services/oAuth';

const KakaoLogin = ({ navigation }) => {
  const handleWebViewNavigationStateChange = async (navState) => {
    const { url } = navState;
    if (url.startsWith(KAKAO_REDIRECT_URI)) {
      const codeMatch = url.match(/[?&]code=([^&]+)/);
      if (codeMatch) {
        const authCode = codeMatch[1];
        console.log('카카오 auth code:', authCode);
        
        try {
          const res = await loginWithKakaoCode(authCode);
          console.log('loginWithKakaoCode:', res);
          navigation.navigate('SignupSuccess'); // 로그인 성공 시 처리
        } catch (error) {
          console.log('loginWithKakaoCode Error:',error);
        }
      }
    }
  };

  return (
    <WebView
      source={{ uri: getKakaoAuthUrl() }}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      startInLoadingState={true}
    />
  );
};
export default KakaoLogin;
