import { StyleSheet, View } from "react-native";
import Box from "@atoms/box/Box";
import Text from '@atoms/text/Text'
import Icon from '@atoms/image/Icon'
import ButtonIcon from "@atoms/button/ButtonIcon";

const GroupMemberBox = (props) => {
  return (
    <Box
      style={styles.box}
      contentStyle={styles.contentStyle}
    >
      <View style={styles.iconContainer}>
        <Icon style={styles.icon} icon={props.icon}/>
      </View>
      <Text >{props.nickname}</Text>
      <View style={styles.levelContainer}>
        <Text type="caption" style={{color: '#91B7AB'}}>Lv {props.level}</Text>
      </View>
      <View style={{height:'100%', flexDirection:'row', alignItems: 'center'}}>
        <Icon icon={require('@assets/img/study/studyIcon.png')} style={{height:'40%'}}/>
        <Text type="caption">{props.studyTime}</Text>
      </View>
      <ButtonIcon icon={require('@assets/img/study/memberDeleteBtn.png')} onPress={()=>props.deleteMember()}/>
    </Box>
  );
};
export default GroupMemberBox;

const styles = StyleSheet.create({
  box:{
    width: '100%',
    height: 50,
    backgroundColor: '#C0D6C8',
    borderRadius: 500
  },
  contentStyle:{
    flexDirection: 'row',
    justifyContent: "space-evenly"
  },
  iconContainer:{
    height: '80%',
    aspectRatio: 1,
    paddingVertical: 5,
    borderRadius: 500,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  icon:{
    height: '100%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  levelContainer:{
    backgroundColor: 'white',
    borderRadius: 500,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#91B7AB',
    borderWidth: 1
  },
  studyTimeBox:{},
});