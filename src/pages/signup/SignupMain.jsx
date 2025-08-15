import { StyleSheet, View } from 'react-native';
import Icon from '@atoms/image/Icon'
import Button from '@atoms/button/Button'
import ButtonIcon from '@atoms/button/ButtonIcon';
import BackgroundLayout from '@atoms/image/BackgroundLayout';
import Box from '@atoms/box/Box';
import { login } from '@services/userAPI';

// 박스로 변경해야 함
const SignupMain = ({ navigation }) => {

  const loginAPICall = async () => {
    const result = await login("yujinjeong053@gmail.com", "0703");
    // const result = await login("sojung017@naver.com", "1234");
    if (result.success) navigation.navigate('Home');
  };

  const handleNavigation = (name) => {
    navigation.navigate(name)
  }

  return (
    <BackgroundLayout style={styles.background}>
      <Box>
        <Icon icon={require('@assets/signup_title.png')} size={{width:200,height:100}} style={styles.title} />
        <Icon icon={require('@assets/logo.png')} size={{width:150,height:150}} style={styles.logo} />
        <ButtonIcon onPress={() => handleNavigation('KakaoLogin')} icon={require('@assets/signup_btn_kakao.png')} size={{width:'90%',height:40}} />
        <ButtonIcon icon={require('@assets/signup_btn_naver.png')} size={{width:'90%',height:40}} />
        <ButtonIcon icon={require('@assets/signup_btn_google.png')} size={{width:'90%',height:40}} />
        <Button
          onPress={() => handleNavigation('SignupEmail')}
          title="이메일 회원가입"
          type="caption"
          style={styles.emailBtn}
          textStyle={styles.emailBtnText}
        />
        <Button
          onPress={() => loginAPICall()}
          title="로그인"
          type="caption"
          style={styles.emailBtn}
          textStyle={styles.emailBtnText}
        />
      </Box>
    </BackgroundLayout>
  );
};

export default SignupMain;

const styles = StyleSheet.create({
  background:{
    paddingHorizontal: 20,
    paddingVertical: 80,
  },
  title: {
    marginTop: 70,
    marginBottom: 20
  },
  logo: {
    marginBottom: 40
  },
  emailBtn: {
    backgroundColor: 'transparent'
  },
  emailBtnText: {
    color: 'gray',
    textDecorationLine: 'underline'
  }
});
