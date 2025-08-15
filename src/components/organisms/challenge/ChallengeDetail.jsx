import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ButtonIconText from '@atoms/button/ButtonIconText';
import Text from '@atoms/text/Text';
import Modal from '@templates/Modal';

const ChallengeDetail = (props) => {
  return (
    <Modal {...props} title={props.item.category}>
      <View style={styles.view}>
        <Text type="title" style={[styles.content, styles.titleContent]}>{props.item.title}</Text>
      </View>
      <View style={styles.view}>
        <View style={styles.contentTitleContainer}>
          <Text style={styles.contentTitle}>Content</Text>
        </View>
        <Text type="mediumTitle" style={styles.content}>{props.item.caption}</Text>
      </View>
      <View style={styles.view}>
        <View style={styles.contentTitleContainer}>
          <Text style={styles.contentTitle}>Status</Text>
        </View>
        <Text type="mediumTitle" style={styles.content}>{props.item.current} / {props.item.goal}</Text>
      </View>
      <View style={[styles.view,{flex:0.6, justifyContent: 'flex-start'}]}>
        <ButtonIconText
          onPress={() => props.onPressComplate()}
          disabled={props.item.complete}
          icon={require('@assets/coin.png')}
          text={props.item.coin.toString()}
          style={[styles.iconTextStyle, props.item.complete && {backgroundColor:'#c8c8c8ff'}]}
          iconStyle={{height:'80%'}}
          textStyle={{color:'white'}}
          flexNone
        />
      </View>
    </Modal>
  );
};
export default ChallengeDetail;

const styles = StyleSheet.create({
  view:{
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTitleContainer:{
    backgroundColor: '#C0DACB',
    width: 70,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    position: 'absolute',
    top: 0,
    left: 20,
  },
  contentTitle:{
    color: 'white',
    fontWeight: '600'
  },
  content: {
    color: '#91B7AB',
  },
  titleContent: {
    fontSize: 28,
    textShadowColor: '#C0D6C8',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  iconTextStyle:{
    width: 110,
    height: 40,
    backgroundColor: '#C0D6C8',
    borderColor: '#91B7AB',
    borderWidth: 1,
    borderRadius: 15
  },
});