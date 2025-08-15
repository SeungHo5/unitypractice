import { StyleSheet, View } from 'react-native';
import Input from '@atoms/inputs/Input';
import Button from '@atoms/button/Button';
import { useFormContext } from 'react-hook-form';

const InputWithCheck = (props) => {
  const {getValues} = useFormContext();

  return (
    <View style={styles.container}>
      <Input
        name={props.name}
        keyboardType={props.keyboardType}
        label={props.label}
        placeholder={props.placeholder}
        style={{ flex: 3 }}
        autoFocus={props.autoFocus?true:false}
        rules={{
          required: props.required
        }}
      />
      <Button
        onPress={() => props.onPress(getValues(props.name))}
        title={props.title}
        center
        type="caption"
        style={[{ flex: 1, height: 48, paddingHorizontal: 10 }, props.buttonStyle]}
      />
    </View>
  );
};
export default InputWithCheck;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    margin: 10,
    alignItems: 'flex-end',
  }
});