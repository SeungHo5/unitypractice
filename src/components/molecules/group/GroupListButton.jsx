import { StyleSheet, View } from "react-native";
import ButtonBox from "@atoms/box/ButtonBox";
import IconText from "@molecules/IconText";
import Text from '@atoms/text/Text'
import Icon from '@atoms/image/Icon'

const GroupListButton = (props) => {
  return (
    <ButtonBox
      disabled={props.disabled}
      style={styles.box}
      contentStyle={styles.contentStyle}
      onPress={props.onPress}
    >
      <View style={[styles.view, styles.roomIconContainer]}>
        <Icon style={styles.roomIcon} icon={props.icon}/>
      </View>
      <View style={[styles.view, styles.roomInfoContainer]}>
        <View style={styles.roomInfoSection}>
          <Text type="subtitle" style={{fontSize:18}}>{props.name}</Text>
        </View>
        <View style={styles.roomInfoSection}>
          <Text type="caption" style={{color: 'white'}}>{props.description}</Text>
        </View>
      </View>
      <View style={[styles.view, styles.personnelContainer]}>
        <IconText
          width={'90%'}
          height={20}
          iconSize={{width:'20%',height:'70%'}}
          icon={require('@assets/people.png')}
          resizeMode="stretch"
          text={props.currentMembers+" / "+props.maxMembers}
          type="caption"
          textStyle={{color:'#E4CC71'}}
          boxStyle={styles.personnelBox}
        />
      </View>
    </ButtonBox>
  );
};
export default GroupListButton;

const styles = StyleSheet.create({
  box:{
    width: '100%',
    height: 80,
    backgroundColor: '#C0D6C8',
    borderColor: '#ADC1B4',
    borderWidth: 1,
  },
  contentStyle:{
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 10,
  },
  view:{
    height: '100%'
  },
  roomIconContainer:{
    width: '20%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  roomIcon:{
    height: '100%',
    aspectRatio: 1,
    borderRadius: 100,
  },
  roomInfoContainer:{
    width: '70%',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 5,
  },
  roomInfoSection:{
    justifyContent: 'center'
  },
  personnelContainer:{
    position: 'absolute',
    width:'26%',
    justifyContent:'flex-end',
    alignItems:'center',
    paddingVertical: 10,
    paddingRight: 5,
    bottom: 0,
    right: 0
  },
  personnelBox:{
    backgroundColor: '#91B7AB',
    borderColor: '#83A59A',
    paddingHorizontal: 5
  }
});