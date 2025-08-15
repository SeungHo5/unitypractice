import { StyleSheet, View } from 'react-native';
import Box from '@atoms/box/Box';
import { useNavigation } from '@react-navigation/native';
import ChallengeBoard from '@molecules/challenge/ChallengeBoard';
import { getChallengeProgressByCategory } from '@services/characterAPI';
import { useEffect, useState } from 'react';
import { sanitizeStyleDimensions } from '@utils/dimensionUtils';

const ChallengeBox = () => {
  const navigation = useNavigation();
  const [challenge, setChallenge] = useState();
  const getChallengeProgressByCategoryAPICall = async() => {
    const res = await getChallengeProgressByCategory();
    if(res.success) console.log("챌린지 데이타",res.data);
    setChallenge(res.data);
  };
  useEffect(()=>{
    getChallengeProgressByCategoryAPICall();
  },[]);
  return (
    <Box
      title="Challenge"
      height={260}
      style={sanitizeStyleDimensions(styles.container)} 
      contentStyle={sanitizeStyleDimensions(styles.contentContainer)} 
      titleBtnIcon={require('@assets/navigate.png')}
      titleBtnOnPress={() => navigation.navigate('Challenge')}
      titleBtnStyle={sanitizeStyleDimensions({height: 36})}
    >
      <ChallengeBoard category="Study" progress={challenge?.[2].progress}/>
      <View style={sanitizeStyleDimensions(styles.borderRight)}></View>
      <ChallengeBoard category="Character" progress={challenge?.[3].progress}/>
      <View style={sanitizeStyleDimensions(styles.borderRight)}></View>
      <ChallengeBoard category="Coin" progress={challenge?.[4].progress}/>
    </Box>
  );
};
export default ChallengeBox;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  contentContainer:{
    flexDirection: 'row',
    paddingVertical: 10
  },
  boxBottom: {
    width: '100%',
    height: 20,
    backgroundColor: '#91B7AB',
  },
  borderRight:{
    borderRightWidth: 1,
    height: '80%',
    borderColor: '#91B7AB'
  }
});