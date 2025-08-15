import { ScrollView, StyleSheet, View } from "react-native";
import StudyListButton from '@molecules/study/StudyListButton';

const StudyList = (props) => {
  const getIconSource = (icon) => {
    switch (icon) {
      case 'studyRoom':
        return require('@assets/studyRoom.png');
      case 'studyRoom2':
        return require('@assets/studyRoom2.png');
    }
  };

  return (
    <ScrollView style={{width: '90%', marginBottom: 20}} contentContainerStyle={{ alignItems: 'center', marginBottom: 10,marginRight : 10}}>
      {props.studyList.map((item, index) => (
        (props.filter && !item.isActive || !props.filter) &&
        <StudyListButton
          key={index}
          icon={getIconSource('studyRoom')}
          index={index}
          title={item.name}
          personnel={item.currentMembers+"/"+item.maxMembers}
          isStudying={item.isActive}
          onPress={()=>props.onPress(item.roomId)}
        />
      ))}
    </ScrollView>
  );
};
export default StudyList;

const styles = StyleSheet.create({
});