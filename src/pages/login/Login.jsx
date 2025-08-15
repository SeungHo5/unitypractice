import { StyleSheet } from 'react-native';
import SignupTemplate from '@templates/SignupTemplate';
import LoginForm from '@organisms/login/LoginForm';
import { login } from '@services/userAPI';

const Login = ({navigation}) => {

  const handleLogin = async (data) => {
    const res = await login(data.email, data.password);
    if (res.success) {
      navigation.navigate('Home');
    } else {
      // 로그인 실패 처리
      console.log('로그인 실패:', res.error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <SignupTemplate height="60%" title="로그인">
      <LoginForm onSubmit={handleLogin} />
    </SignupTemplate>
  );
};

export default Login;

const styles = StyleSheet.create({
});
