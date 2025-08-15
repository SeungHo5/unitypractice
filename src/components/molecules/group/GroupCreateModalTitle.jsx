import { StyleSheet, View } from 'react-native';
import Text from '@atoms/text/Text';
import Input from '@atoms/inputs/Input';

const GroupCreateModalTitle = (props) => {
  return (
    <View style={styles.titleContainer}>
      <View style={[styles.innerContainer, styles.name]}>
        <Text type="body" style={styles.title}>그룹 이름</Text>
        <View style={styles.inputContainer}>
          <Input name="name" inputStyle={[styles.input,{height: '100%'}]}></Input>
        </View>
      </View>
      <View style={[styles.innerContainer, styles.description]}>
        <Text type="body" style={styles.title}>그룹 설명</Text>
        <View style={styles.inputContainer}>
          <Input name="description" inputStyle={styles.input}></Input>
        </View>
      </View>
    </View>
  );
};
export default GroupCreateModalTitle;

const styles = StyleSheet.create({
  titleContainer:{
    width: '100%',
    flex:25,
    marginRight: 10,
    marginBottom: 10,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 15,
    marginRight: 10,
  },
  title:{
    color: 'white',
    backgroundColor: '#91B7AB',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-start'
  },
  inputContainer:{
    backgroundColor: '#C0D6C8',
    borderRadius: 8,
    flex: 1,
  },
  input:{
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  name:{
    flex: 1,
  },
  description:{
    flex: 2,
  }
});