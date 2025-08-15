import { useRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import Text from '@atoms/text/Text';
import Button from '@atoms/button/Button';
import GroupMemberSetting from '@organisms/group/GroupMemberSetting';
import { useState } from 'react';
import memberList from '@assets/data/groupMemberListDummy';

const GroupPage = () => {
  const route = useRoute();
  const { groupId = '' } = route.params ?? {};

  const [memberSetting, setMemberSetting] = useState(false);
  const deleteMember = (userId) => {
    console.log('deleteMember: ', userId);
  }
  const addMember = (userId) => {
    console.log('addMember: ', userId);
  }

  return (
    <View style={styles.page}>
      <Text>{groupId}번방 그룹 채팅</Text>
      <Button title="멤버 관리" onPress={() => setMemberSetting(true)}/>
      {memberSetting &&
        <GroupMemberSetting
          members={memberList.members}
          onPress={() => setMemberSetting(false)}
          titleBtnOnPress={() => setMemberSetting(false)}
          deleteMember={(index)=>deleteMember(index)}
        />}
    </View>
  );
};
export default GroupPage;

const styles = StyleSheet.create({
  page:{
    flex: 1,
    backgroundColor: '#FFFEEB',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
