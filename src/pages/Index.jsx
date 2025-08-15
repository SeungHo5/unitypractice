import { StyleSheet } from 'react-native';
import Icon from '@atoms/image/Icon'
import Button from '@atoms/button/Button'
import BackgroundLayout from '@atoms/image/BackgroundLayout';
import FloatingIcon from '@atoms/image/FloatingIcon';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@stores/tokenStore';
import { useUserStore  } from '@stores/userStore';

const Index = ({ navigation }) => {

  const { loadTokens } = useTokenStore();
  const { fetchUser, clearUser, isLoggedIn } = useUserStore();

  useEffect(()=>{
    const initializeApp = async () => {
      try {
        // 1. 토큰 로드
        const hasTokens = await loadTokens();
        
        if (hasTokens) {
          // 2. 토큰이 있으면 유저 정보 가져오기
          await fetchUser();
        } else {
          // 3. 토큰이 없으면 유저 정보 초기화
          console.log('유저 정보 로드 실패:');
          clearUser();
        }
      } catch (error) {
        console.log('앱 초기화 실패:', error);
        // 토큰은 있지만 유저 정보 가져오기 실패 (토큰 만료 등)
        clearUser();
      }
    };

    initializeApp();
  },[]);

  const handleNavigation = () => {
    if (isLoggedIn()) {
      navigation.navigate('Home')
    } else {
      navigation.navigate('SignupMain')
    }
  }

  return (
    <BackgroundLayout>
      <Icon icon={require('@assets/index_title.png')} size={{width:250,height:150}} style={styles.titleIcon} />
      <FloatingIcon icon={require('@assets/logo.png')} style={styles.logo}/>
      <Button
        onPress={handleNavigation}
        title='press the start'
        style={[StyleSheet.absoluteFillObject, styles.textButton]}
        type='title'
        transparent
        textStyle={styles.text}
      />
    </BackgroundLayout>
  );
};

export default Index;

const styles = StyleSheet.create({
  titleIcon: {
    marginTop: 130
  },
  textButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 100
  },
  text: {
    color: '#DAFD95',
  }
});
