import LayoutWidthStatus from '@templates/LayoutWidthStatus';
import { useNavigation } from '@react-navigation/native';
import ChallengeList from '@organisms/challenge/ChallengeList'
import challenges from '@assets/data/challengesDummy';
import ChallengeDetail from '@organisms/challenge/ChallengeDetail';
import { useState } from 'react';

const Challenge = () => {
  const navigation = useNavigation();

  const [challenge, setChallenge] = useState();
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState();

  const open = (index) => {
    console.log("open: ",index)
    setCurrentIdx(index);
    setChallenge(challenges[index]);
    setDetailOpen(true);
  }
  const close = () => {
    setDetailOpen(false);
  }
  const complate = (index) => {
    console.log("complate: ",index)
  }
  
  return (
    <>
      <LayoutWidthStatus
        title="Challenge"
        titleBtnIcon={require('@assets/close.png')}
        titleBtnOnPress={() => navigation.goBack()}
        titleBtnStyle={{height: '30%'}}
      >
        <ChallengeList challenges={challenges} onPress={(index) => open(index)} onPressComplate={(index) => complate(index)}/>
      </LayoutWidthStatus>
      {detailOpen && <ChallengeDetail onPress={close}  onPressComplate={(index) => complate(currentIdx)} item={challenge}/>}
    </>
  );
};
export default Challenge;