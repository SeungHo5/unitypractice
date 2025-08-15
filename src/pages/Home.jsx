import { StyleSheet, View } from 'react-native';
import MainLayout from '../components/templates/MainLayout';
import FloatingIcon from '@atoms/image/FloatingIcon';
import StudyBox from '@organisms/home/StudyBox';
import ChallengeBox from '@organisms/home/ChallengeBox';
import RankBox from '@organisms/home/RankBox';
import { useUserStore  } from '@stores/userStore';
import { useEffect } from 'react';

const Home = () => {
  const { user } = useUserStore();

  return (
    <MainLayout style={styles.container}>
      <View style={styles.logo}>
        <FloatingIcon icon={require('@assets/logo.png')} />
      </View>
      <ChallengeBox />
      <StudyBox />
      <RankBox />
    </MainLayout>
  );
};
export default Home;

const styles = StyleSheet.create({
  container:{
    paddingHorizontal: 20,
    alignItems: 'center',
    marginRight: 20,
      marginBottom:20,
  },
  logo:{
    height: 300,
    justifyContent: 'center',
  },
});
