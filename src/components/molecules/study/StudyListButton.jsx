import { StyleSheet, View } from "react-native";
import ButtonBox from "@atoms/box/ButtonBox";
import IconText from "@molecules/IconText";
import Text from '@atoms/text/Text'
import Icon from '@atoms/image/Icon'

const StudyListButton = (props) => {
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
          <View style={styles.roomNumber}>
            <Text style={{color:'#E4CC71'}}>{props.index +1}번방</Text>
          </View>
        </View>
        <View style={styles.roomInfoSection}>
          <Text type="midium">{props.title}</Text>
        </View>
        <View style={styles.roomInfoSection}>
          <Text
            type="midium"
            style={[styles.roomStatus,
              props.isStudying ? {color:"#B7F7D3"} : {color:"#E4CC71"}
            ]}>
              {props.isStudying ? "STUDYING" : "WAITING"}
            </Text>
        </View>
      </View>
      <View style={[styles.view, styles.personnelContainer]}>
        <IconText
          width={'90%'}
          height={20}
          iconSize={{width:'20%',height:'70%'}}
          icon={require('@assets/people.png')}
          resizeMode="stretch"
          text={props.personnel}
          type="caption"
          textStyle={{color:'#E4CC71'}}
          boxStyle={styles.personnelBox}
        />
      </View>
    </ButtonBox>
  );
};
export default StudyListButton;

const styles = StyleSheet.create({
  box:{
    width: '100%',
    height: 100,
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
    width: '35%',
    padding: 10,
  },
  roomIcon:{
    width: '100%',
    height: '100%',
    borderRadius: 15
  },
  roomInfoContainer:{
    width: '33%',
    paddingVertical: 5
  },
  roomInfoSection:{
    height:'33%',
    justifyContent: 'center'
  },
  roomNumber:{
    width: 70,
    height:'80%',
    justifyContent: 'center',
    backgroundColor: '#91B7AB',
    borderColor: '#83A59A',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomStatus:{
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5
  },
  personnelContainer:{
    width:'30%',
    justifyContent:'flex-end',
    alignItems:'center',
    padding: 10
  },
  personnelBox:{
    backgroundColor: '#91B7AB',
    borderColor: '#83A59A',
    paddingHorizontal: 5
  }
});