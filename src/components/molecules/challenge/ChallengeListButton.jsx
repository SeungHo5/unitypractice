import { StyleSheet, View } from "react-native";
import ButtonBox from "@atoms/box/ButtonBox";
import IconText from "@molecules/IconText";
import Text from '@atoms/text/Text'
import Icon from '@atoms/image/Icon'
import ButtonIconText from '@atoms/button/ButtonIconText';

const ChallengeListButton = (props) => {
  return (
    <ButtonBox disabled={props.disabled} style={[styles.box, props.complete && {backgroundColor:'#c8c8c8ff'}]} contentStyle={styles.contentStyle} onPress={props.onPress}>
      <View style={{flexDirection: 'row', alignItems:'center', marginBottom:10,marginRight:10}}>
        <View style={styles.iconContainer}>
          <Icon icon={props.icon} size={{width:'80%',height:'80%'}}></Icon>
        </View>
        <View>
          <Text style={{color:'#E4CC71', fontWeight: '600'}}>{props.title}</Text>
          <Text type="caption">{props.caption}</Text>
        </View>
      </View>
      <ButtonIconText
        flexNone
        onPress={props.onPressComplate}
        disabled={props.disabled || props.complete}
        icon={require('@assets/coin.png')}
        text={props.coin}
        type="caption"
        style={[styles.iconText, props.complete && {backgroundColor:'#c8c8c8ff'}]}
        iconStyle={{flex:35}}
        textStyle={{flex:65, color:'white', textAlign: 'right'}}
      >
      </ButtonIconText>
    </ButtonBox>
  );
};
export default ChallengeListButton;

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderColor: '#91B7AB',
    borderWidth: 3,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 15,
  },
  contentStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconContainer:{
    width: 50,
    height: 50,
    backgroundColor: '#C0D6C8',
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    width: 70,
    height: 30,
    borderColor: '#91B7AB',
    borderWidth: 2,
    borderRadius: 25,
    marginLeft: 5,
    backgroundColor: '#C0D6C8',
    paddingLeft: 5,
    paddingRight: 10,
  },
});