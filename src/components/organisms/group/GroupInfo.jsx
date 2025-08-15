import { StyleSheet, View } from 'react-native';
import Modal from '@templates/Modal';
import { useEffect, useState } from 'react';
import Text from '@atoms/text/Text';
import Button from '@atoms/button/Button';
import Loading from '@organisms/common/Loading';
import { getStudyGroupDetail, getLoadingState, getStudyGroupMembers } from '@services/studyAPI';

const GroupInfo = (props) => {
  const [groupInfo, setGroupInfo] = useState();
  const [members, setMembers] = useState();

  const groupAPICall = async () => {
    const res = await getStudyGroupDetail(props.group.groupId);
    if (res.success) setGroupInfo(res.data);
    const res2 = await getStudyGroupMembers(props.group.groupId);
    if (res2.success) setMembers(res2.data.members);
  };

  useEffect(() => {
    groupAPICall();
  }, []);

  const applyGroup = () => {
    console.log("스터디 그룹 신청: ", groupInfo.groupId);
    props.onPress();
  }

  return (
    <Modal {...props} title="Group Info" overlayStyle={{paddingVertical: 130}}>
      {getLoadingState('getStudyGroupDetail')
      ?
        <Loading />
      : <View style={styles.container}>
          <View style={styles.basicInfoContainer}>
            <View style={styles.nameContainer}>
              <Text type="subtitle" style={styles.infoTitle}>Name</Text>
              <View style={styles.nameTextContainer}>
                <Text>{groupInfo?.name}</Text>
              </View>
            </View>
            <View style={styles.membersContainer}>
              <Text type="subtitle" style={styles.infoTitle}>Description</Text>
              <View style={styles.membersTextContainer}>
                <Text>{groupInfo?.description}</Text>
              </View>
            </View>
          </View>
          <View style={styles.lineContainer}>
            <View style={styles.line}/>
          </View>
          <View style={styles.detailInfoContainer}>
            <View style={styles.nameContainer}>
              <Text type="subtitle" style={styles.infoTitle}>Master</Text>
              <View style={styles.nameTextContainer}>
                <Text>{groupInfo?.leaderId}</Text>
              </View>
            </View>
            <View style={styles.membersContainer}>
              <Text type="subtitle" style={styles.infoTitle}>Members</Text>
              <View style={styles.membersTextContainer}>
                <Text>
                  {members
                    ?.filter(item => item.role !== "LEADER")
                    .map(item => item.userId)
                    .join(", ")}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <Button
              title="가입 신청"
              style={styles.bottomBtn}
              onPress={() => applyGroup()}/>
          </View>
        </View>
      }
    </Modal>
  );
};
export default GroupInfo;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 20,
  },
  basicInfoContainer:{
    flex: 40,
    justifyContent: 'flex-end',
    marginRight: 15,
    marginBottom: 10,
  },
  infoTitle:{
    color: '#91B7AB',
  },
  nameContainer:{
    height: "30%",
    marginBottom: 5,
    marginRight: 10,
  },
  nameTextContainer:{
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C0D6C8',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  membersContainer:{
    height: "50%",
    margin: 5
  },
  membersTextContainer:{
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C0D6C8',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  detailInfoContainer:{
    flex: 50,
    margin: 10
  },
  bottomContainer:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomBtn:{
    borderRadius: 50,
    paddingVertical: 8
  },
  lineContainer:{
    flex: 10,
    justifyContent: 'center'
  },
  line:{
    width: '100%',
    borderColor: '#91B7AB',
    borderBottomWidth: 1
  }
});