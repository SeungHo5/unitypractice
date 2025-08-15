import { StyleSheet } from 'react-native';
import SignupTemplate from '@templates/SignupTemplate';
import SignupInfoForm from '@organisms/signup/SignupInfoForm';
import { signUp } from '@services/userAPI';

const SignupInfo = ({navigation}) => {

  const handleSubmit = async (data) => {
    const result = await signUp(data.email, data.password, data.nickname);
    if (result.success) navigation.navigate('SignupSuccess');
  };

  return (
    <SignupTemplate height="75%" title="가입 정보 입력">
      <SignupInfoForm
        onSubmit={handleSubmit}
      />
    </SignupTemplate>
  );
};

export default SignupInfo;

const styles = StyleSheet.create({
});
