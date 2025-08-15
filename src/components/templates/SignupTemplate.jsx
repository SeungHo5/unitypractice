import { StyleSheet, View } from 'react-native';
import BackgroundLayout from '@atoms/image/BackgroundLayout';
import Text from '@atoms/text/Text';
import FloatingIcon from '@atoms/image/FloatingIcon';
import Button from '@atoms/button/Button'
import { useNavigation } from '@react-navigation/native';

const SignupTemplate = ({ children, height, title, style, overlay = true, logo = false }) => {
  
  const navigation = useNavigation();

  return (
    <BackgroundLayout style={styles.background} overlay={overlay}>
      {logo &&
        <View style={{flex: 1, justifyContent: 'center'}}>
          <FloatingIcon icon={require('@assets/logo.png')} />
          <Button
            onPress={() => {
              navigation.navigate('Home')
            }}
            title='press the start'
            style={[StyleSheet.absoluteFillObject, styles.textButton]}
            type='title'
            transparent
            textStyle={styles.text}
          />
        </View>
      }
      <View style={[styles.container, {height: height}]}>
        <View style={styles.titleContainer}>
          <Text type="subtitle" style={styles.title}>{title}</Text>
        </View>
        <View style={[styles.chidrenContainer, style]}>
          {children}
        </View>
      </View>
    </BackgroundLayout>
  );
};

export default SignupTemplate;

const styles = StyleSheet.create({
  background:{
    justifyContent: 'flex-end'
  },
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    overflow: 'hidden',
  },
  titleContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#8DB2A6',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  chidrenContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  title: {
    color: 'white'
  },
  textButton: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 100
  },
  text: {
    color: '#DAFD95',
  }
});
