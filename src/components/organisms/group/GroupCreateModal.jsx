import { StyleSheet, View } from "react-native";
import Box from '@atoms/box/Box';
import BackgroundOverlay from '@atoms/image/BackgroundOverlay';
import Form from "@organisms/common/Form";
import SubmitButton from "@atoms/inputs/SubmitButton";
import GroupCreateModalTitle from "@molecules/group/GroupCreateModalTitle";
import GroupCreateModalSetting from "@molecules/group/GroupCreateModalSetting";

const GroupCreateModal = (props) => {

  return (
    <BackgroundOverlay onPress={props.onClose} overlayStyle={styles.overlay}>
      <Box
        title="그룹 만들기"
        titleBtnIcon={require('@assets/close.png')}
        titleBtnOnPress={props.onClose}
        titleBtnStyle={{width:20, height:20}}
        contentStyle={styles.container}
      >
        <Form style={{width: '100%', flex: 1}}>
          <GroupCreateModalTitle />
          <View style={styles.lineContainer}>
            <View style={styles.line}/>
          </View>
          <GroupCreateModalSetting />
          <View style={styles.btnContainer}>
            <SubmitButton
              title="그룹 생성"
              style={styles.createBtn}
              textStyle={styles.createBtnText}
              onSubmit={props.onSubmit}
              >
            </SubmitButton>
          </View>
        </Form>
      </Box>
    </BackgroundOverlay>
  );
};
export default GroupCreateModal;

const styles = StyleSheet.create({
  overlay:{
    paddingVertical: 150,
    paddingHorizontal: 25
  },
  container:{
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20
  },
  
  btnContainer:{
    width: '100%',
    flex:20,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  createBtn:{
    width: 150,
    borderRadius: 20,
    alignItems: 'center'
  },
  createBtnText:{
    color:'#E4CC71'
  },
  lineContainer:{
    flex: 10,
    justifyContent: 'center'
  },
  line:{
    width: '100%',
    borderColor: '#91B7AB',
    borderBottomWidth: 2,
    borderStyle: 'dashed'
  }
});