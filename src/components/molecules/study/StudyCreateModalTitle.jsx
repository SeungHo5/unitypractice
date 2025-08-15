import { StyleSheet, View } from 'react-native';
import Text from '@atoms/text/Text';
import Input from '@atoms/inputs/Input';

const StudyCreateModalTitle = (props) => {
  return (
    <View style={styles.titleContainer}>
      <Text type="mediumTitle" style={styles.text}>방 이름</Text>
      <View style={styles.innerContainer}>
        <Input name="name" inputStyle={{backgroundColor: 'transparent'}}></Input>
      </View>
    </View>
  );
};
export default StudyCreateModalTitle;

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#C0D6C8',
    borderRadius: 8,
    justifyContent: 'center'
  },
  text:{
    marginVertical: 15,
    color: 'white',
    backgroundColor: '#91B7AB',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  titleContainer:{
    width: '100%',
    flex:25,
  },
});