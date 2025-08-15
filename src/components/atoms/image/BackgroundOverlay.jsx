import { TouchableOpacity, StyleSheet } from 'react-native';

// 가챠 박스 띄울 때, 배경 어둡게 + 바깥 영역 클릭 시 닫히도록
const BackgroundOverlay = (props) => {

  return (
    <TouchableOpacity 
      style={[styles.overlay, props.overlayStyle]} 
      onPress={props.onPress}
      activeOpacity={1}
    >
      <TouchableOpacity 
        style={[styles.content, props.containerStyle]} 
        activeOpacity={1}
        onPress={(e) => e.stopPropagation()}
      >
        {props.children}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
export default BackgroundOverlay;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height:'100%',
  }
});
