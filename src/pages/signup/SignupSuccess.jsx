import { StyleSheet, View } from 'react-native';
import SignupTemplate from '@templates/SignupTemplate'
import Text from '@atoms/text/Text';
import { useEffect, useState } from 'react';
import { login } from '@services/userAPI';
import { useUserStore } from '@stores/userStore';

const SignupSuccess = () => {
 
  const [name, setName] = useState("XXX");

  const loginAPICall = async () => {
    const result = await login("yujinjeong053@gmail.com", '0703');
    // const result = await login("sojung017@naver.com", "1234");
    if (result.success) setName(useUserStore.getState().user.name);
  };
  
  useEffect(()=>{
    loginAPICall();
  },[]);

  return (
    <SignupTemplate
      height="20%"
      title="가입 성공!"
      overlay={false}
      logo
    >
      <View style={styles.welcomeContainer}>
        <Text>{name}님 가입을 축하합니다!</Text>
      </View>
    </SignupTemplate>
  );
};

export default SignupSuccess;

const styles = StyleSheet.create({
 welcomeContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
 }
});