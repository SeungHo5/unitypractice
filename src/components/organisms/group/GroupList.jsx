import { ScrollView, StyleSheet, View } from "react-native";
import GroupListButton from '@molecules/group/GroupListButton';
import { getThemeImage } from "@utils/imageMapping";

const GroupList = (props) => {
  const getIconSource = (icon) => {
    switch (icon) {
      case 'studyRoom':
        return require('@assets/studyRoom.png');
      case 'studyRoom2':
        return require('@assets/studyRoom2.png');
    }
  };

  return (
    <ScrollView style={{width: '90%', marginBottom: 20}} contentContainerStyle={{ alignItems: 'center', marginRight : 10, marginBottom: 10}}>
      {props.groupList.map((item, index) => (
        (props.filter && 1==0 || !props.filter) &&
        <GroupListButton
          key={index}
          icon={getThemeImage(item.leaderRepresentativeRoomId)}
          index={index}
          name={item.name}
          description={item.description}
          currentMembers={item.currentMembers}
          maxMembers={item.maxMembers}
          onPress={()=>props.onPress(index)}
        />
      ))}
    </ScrollView>
  );
};
export default GroupList;

const styles = StyleSheet.create({
});