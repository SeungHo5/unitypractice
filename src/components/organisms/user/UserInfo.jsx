import { StyleSheet, View } from 'react-native';
import Modal from '@templates/Modal';
import UserBasicInfo from '@organisms/user/UserBasicInfo';
import UserAnalyzeInfo from '@organisms/user/UserAnalyzeInfo';
import { useEffect, useState } from 'react';
import Loading from '@organisms/common/Loading';
import { getLoadingState, getUserDetail } from '@services/userAPI';
import { getUserRanking } from '@services/characterAPI';

const UserInfo = (props) => {

  const [userBasicInfo, setUserBasicInfo] = useState();
  const [userAnalyzeInfo, setUserAnalyzeInfo] = useState();
  
  // 기본 정보 API
  const userBasicAPICall = async () => {
    const result = await getUserDetail(props.userId);
    if (result.success) return result.data.data;
  };

  // 분석 정보 API
  const userAnalyticsAPICall = async () => {
    return { totalStudyTime: 60, studyFocusRate: 75, avgFocusTime: 3 };
  };

  useEffect(() => {
    const fetchData = async () => {
      // 모든 API를 병렬로 호출
      const [basicInfo, currencyInfo, analyticsInfo] = await Promise.all([
        userBasicAPICall(),
        userAnalyticsAPICall(),
      ]);

      // 데이터 합체
      const combinedUserInfo = {
        ...basicInfo,
        ...currencyInfo,
      };
      console.log("combinedUserInfo: ",combinedUserInfo);

      setUserBasicInfo(combinedUserInfo);
      setUserAnalyzeInfo(analyticsInfo);
    };

    fetchData();
  }, []);

  return (
    <Modal {...props} title="Info" overlayStyle={{paddingVertical: 130}}>
    {getLoadingState('getUserDetail') || getLoadingState()
      ? <Loading />
      : <>
          <UserBasicInfo user={userBasicInfo}/>
          <View style={styles.line}/>
          <UserAnalyzeInfo user={userAnalyzeInfo}/>
        </>
    }
    </Modal>
  );
};
export default UserInfo;

const styles = StyleSheet.create({
  lineContainer:{
    justifyContent: 'center',
  },
  line:{
    width: '85%',
    alignSelf: 'center',
    borderColor: '#91B7AB',
    borderBottomWidth: 1
  }
});