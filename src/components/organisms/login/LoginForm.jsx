import { StyleSheet } from 'react-native';
import Form from '@organisms/common/Form';
import Input from '@molecules/common/Input';
import Button from '@atoms/button/Button';

const LoginForm = ({ onSubmit }) => {
  return (
    <Form 
      style={styles.container} 
      defaultValues={{ email: '', password: '' }}
      onSubmit={onSubmit}
    >
      <Input
        name="email"
        keyboardType="email-address"
        label="이메일"
        placeholder="이메일을 입력해주세요"
        required="이메일은 필수입니다"
        autoFocus
      />
      <Input
        name="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        required="비밀번호는 필수입니다"
        secureTextEntry
      />
      <Button
        title="로그인"
        style={styles.submitButton}
        type="submit"
      />
    </Form>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 40,
  }
});
