import { useRef } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import Button from '@atoms/button/Button';
import Text from '@atoms/text/Text';

const Input = ({
  name,                    // react-hook-form에서 사용하는 필드 이름
  rules,                   // 유효성 검사 규칙
  autoFocus,               // 컴포넌트가 마운트되자마자 자동 포커스
  placeholder,             // 입력 필드에 힌트로 표시될 텍스트
  secureTextEntry = false, // 비밀번호 입력처럼 텍스트를 가리는지 여부
  keyboardType = 'default',// 키보드 타입 ('default', 'numeric', 'email-address' 등)
  autoCapitalize = 'none', // 자동 대문자 설정 ('none', 'sentences', 'words', 'characters')
  style,                   // 외부에서 전달 받은 스타일
  inputStyle,              // 외부에서 전달 받은 input 스타일
  labelStyle,              // 외부에서 전달 받은 input 스타일
  label = null,            // label 태그
  isRow = false,           // label, input 정렬 방향
  editable = true,         // Input 비활
}) => {
  const { control } = useFormContext();
  const inputRef = useRef(null);

  const { formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <View style={[styles.container, isRow && { flexDirection: 'row' }, style]}>
      <View style={styles.labelContainer}>
        {label &&
          <Button
            onPress={() => inputRef.current?.focus()}
            title={label}
            transparent
            style={[styles.label, labelStyle]}
          />
        }
        {error && <Text type="caption" style={{ color: 'red', marginTop: 4 }}>{error.message}</Text>}
      </View>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={inputRef}
            style={[styles.input, inputStyle, !editable && { backgroundColor: '#d6d6d6ff', color: '#888' }]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoFocus={autoFocus}
            placeholderTextColor="#999"
            editable={editable}
          />
        )}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: 'transparent',
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#EFEFEF',
    fontFamily: 'Jua',
  },
  label: {
    paddingHorizontal: 0,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 12,
  }
});
