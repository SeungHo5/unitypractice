import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@atoms/image/Icon';
import Text from '@atoms/text/Text';

const ButtonIconText = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.button, props.style, props.flexNone?{}:{flex: 1}]} disabled={props.disabled} activeOpacity={props.activeOpacity || 0.5}>
      <Icon icon={props.icon} size={props.iconSize} style={[styles.icon, props.iconStyle]}/>
      <Text type={props.type} style={[styles.text, props.textStyle]}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonIconText;

const styles = StyleSheet.create({
  button:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  icon:{
    flex: 1,
  },
  text: {
    fontWeight: '500',
    flex: 1
  },
});
