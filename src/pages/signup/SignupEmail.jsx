import { StyleSheet, View } from 'react-native';
import SignupTemplate from '@templates/SignupTemplate'
import SignupEmailForm from '@organisms/signup/SignupEmailForm';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { emailCheck, codeCheck } from '@services/userAPI'

const SignupEmail = () => {
  const navigation = useNavigation();

  const [checkedEmail, setCheckedEmail] = useState(null);
  const [codeTime, setCodeTime] = useState(0);
  const intervalRef = useRef(null); // interval id 저장용

  const codeTimeOut = () => {
    // 기존 인터벌 있으면 제거
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCodeTime(prev => {
        const nextTime = prev - 1;

        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setCodeTime('인증 만료');
          return 0;
        }
        return nextTime;
      });
    }, 1000);
  };

  const [loading, setLoading] = useState(false);

  // 언마운트 시 interval 제거
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const emailCheckAPICall = async (email) => {
    setCheckedEmail(email);

    const result = await emailCheck(email);
    if (result.success) {
      setCodeTime(600);
      codeTimeOut();
    }
  };
  
  const codeCheckAPICall = async (code) => {
    const result = await codeCheck(checkedEmail, code);
    if (result.success) navigation.navigate('SignupInfo', { checkedEmail: checkedEmail });
  };

  return (
    <SignupTemplate
      height="80%"
      title="이메일 인증"
    >
      <SignupEmailForm emailCheck={emailCheckAPICall} codeCheck={codeCheckAPICall} checkedEmail={checkedEmail} codeTime={codeTime}/>
    </SignupTemplate>
  );
};

export default SignupEmail;

const styles = StyleSheet.create({
});
