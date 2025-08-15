import { ScrollView, StyleSheet, View } from 'react-native';
import Modal from '@templates/Modal';
import GroupMemberBox from '@molecules/group/GroupMemberBox';
import { getCharacterImage } from '@utils/imageMapping';
import Button from '@atoms/button/Button';
import { useState } from 'react';

const GroupMemberSetting = (props) => {
  const [addMemberModalOn, setAddMemberModalOn] = useState(false);
  const addMemberOn = () => {
    console.log('addMemberOn', );
    setAddMemberModalOn(true);
  }

  return (
    <Modal basicTitle {...props} title="Members" overlayStyle={{paddingVertical: 200}} contentStyle={styles.container}>
      <View style={{height: '15%'}}>
        <Button type="caption" title="ADD MEMBERS" style={styles.addBtn} onPress={()=>addMemberOn()}/>
      </View>
      <View style={styles.memberContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {props.members.map((item, index) => (
            <GroupMemberBox
              key={index}
              onPress={() => props.onPress(index)}
              icon={getCharacterImage(item.icon)}
              nickname={item.nickname}
              role={item.role}
              level={item.level}
              studyTime={item.studyTime}
              deleteMember={()=>props.deleteMember(item.userId)}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};
export default GroupMemberSetting;

const styles = StyleSheet.create({
  container:{
    padding: 20
  },
  scrollContainer:{
    margin: 10
  },
  addBtn:{
    alignSelf: 'flex-end',
    borderRadius: 500,
    paddingVertical: 10
  },
  memberContainer:{
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#91B7AB',
  }
});