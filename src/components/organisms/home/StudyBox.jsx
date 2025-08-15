import { StyleSheet, View } from 'react-native';
import Box from '@atoms/box/Box';
import Text from '@atoms/text/Text';
import { useNavigation } from '@react-navigation/native';

const StudyBox = () => {
  const navigation = useNavigation();
  return (
    <Box
      title="Study Group"
      height={300}
      style={styles.container} 
      contentStyle={styles.contentContainer}
      titleBtnIcon={require('@assets/navigate.png')}
      titleBtnOnPress={() => navigation.navigate('GroupList')}
      titleBtnStyle={{height: 36}}
    >
      <Text>내용</Text>
    </Box>
  );
};
export default StudyBox;

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
  }
});