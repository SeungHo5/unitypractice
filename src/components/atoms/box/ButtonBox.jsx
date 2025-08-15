import { TouchableOpacity, StyleSheet } from 'react-native';
import Box from '@atoms/box/Box.jsx'

const Button = ({children, style, contentStyle, onPress, disabled = false}, containerStyle,) => {
  return (
    <TouchableOpacity onPress={onPress ? onPress : (e) => e.stopPropagation()} disabled={disabled} style={[{ alignSelf: 'stretch' }, containerStyle]}>
      <Box style={style} contentStyle={contentStyle}>
        {children}
      </Box>
    </TouchableOpacity>
  );
};
export default Button;

const styles = StyleSheet.create({
  
});
