import { StyleSheet, View } from 'react-native';
import ButtonIconText from '@atoms/button/ButtonIconText';
import Button from '@atoms/button/Button';

const GroupListButtonSection = (props) => {
  return (
    <View style={styles.container}>
      <ButtonIconText
        flexNone
        style={styles.btn}
        textStyle={styles.filterBtnText}
        icon={props.filter ? require('@assets/checkBox_on.png') : require('@assets/checkBox_off.png')}
        iconSize={{width:12, height:12}}
        text="내 그룹만 보기"
        type="caption"
        onPress={props.onFiltering}
        activeOpacity={0.7}
      />
      <Button
        style={styles.makeBtn}
        textStyle={styles.makeBtnText}
        title="그룹 만들기"
        type="caption"
        onPress={props.onMakeRoom}
      />
    </View>
  );
};
export default GroupListButtonSection;

const styles = StyleSheet.create({
  container:{
    width: '100%',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btn: {
    width: 110,
    height: 25,
    backgroundColor: '#C0D6C8',
    borderRadius: 10,
    paddingHorizontal: 3
  },
  filterBtnText: {
    color: 'white',
    marginLeft: 0,
    flex: 2.5
  },
  makeBtn: {
    width: 80,
    height: 25,
    backgroundColor: '#91B7AB',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 10,
    alignItems: 'center'
  },
  makeBtnText: {
    color: '#E4CC71',
  }
});