import { StyleSheet } from 'react-native';
import Input from '@atoms/inputs/Input';
import Form from '@organisms/common/Form';
import SubmitButton from '@atoms/inputs/SubmitButton';
import { useRoute } from '@react-navigation/native';

const SignupInfoForm = ({onSubmit}) => {
  const route = useRoute();
  const { checkedEmail = '' } = route.params ?? {};

  return (
    <Form style={styles.container} defaultValues={{ email: checkedEmail, password: '', nickname: '' }}>
      <Input
        name="email"
        label="이메일"
        editable={false}
      />
      <Input
        name="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        secureTextEntry
        rules={{ required: '비밀번호는 필수입니다' }}
      />
      {/* <Input
        name="confirmPassword"
        placeholder="비밀번호를 다시 입력해주세요."
        secureTextEntry
      /> */}
      <Input
        name="nickname"
        keyboardType="default"
        label="닉네임"
        placeholder="아이디를 입력해주세요."
        rules={{ required: '닉네임은 필수입니다' }}
      />

      <SubmitButton
        onSubmit={onSubmit}
        title="가입하기"
        style={styles.submit}
      />
    </Form>
  );
};

export default SignupInfoForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 10,
      marginBottom: 10,
  },
  submit: {
    width: 100,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0
  }
});
