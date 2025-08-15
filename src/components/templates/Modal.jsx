import { StyleSheet, View } from 'react-native';
import Box from '@atoms/box/Box';
import ButtonIcon from '@atoms/button/ButtonIcon';
import BackgroundOverlay from '@atoms/image/BackgroundOverlay';

const Modal = (props) => {
  return (
    <BackgroundOverlay
      onPress={props.onPress}
      overlayStyle={[styles.overlay, props.overlayStyle]}
    >
      <Box
        style={!props.basicTitle && styles.boxContainer}
        titleContainerStyle={!props.basicTitle && styles.boxTitleContainer}
        titleStyle={!props.basicTitle && {fontSize:30}}
        contentStyle={!props.basicTitle && styles.box}
        titleBtnIcon={props.basicTitle && require('@assets/close.png')}
        {...props}
      >
        <ButtonIcon icon={require('@assets/close.png')} style={styles.closeBtn} onPress={props.onPress}/>
        <View style={{width:'100%', height: '100%'}}>
          {props.children}
        </View>
      </Box>
    </BackgroundOverlay>
  );
};
export default Modal;

const styles = StyleSheet.create({
  overlay:{
    paddingVertical: 100,
    paddingHorizontal: 20
  },
  boxContainer:{
    borderWidth: 8,
    borderColor: '#C0DACB',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  boxTitleContainer:{
    position: 'absolute',
    top: -35,              // 숫자!
    alignSelf: 'center',   // 가로 중앙
    height: 60,
    borderRadius: 15,
    backgroundColor: '#BC975F',
    borderColor: '#987341',
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    paddingVertical: 0,
    paddingHorizontal: 15,
  },
  box:{
    width:'100%',
    height:'100%',
    borderColor: '#C0DACB',
    borderWidth: 3,
    borderStyle: 'dashed',
    borderRadius: 10,
    overflow: 'visible'
  },
  closeBtn: {
    position: 'absolute',
    top: -50,
    right: -10,
  },
});