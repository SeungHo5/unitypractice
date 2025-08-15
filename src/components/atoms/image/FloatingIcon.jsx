import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Icon from '@atoms/image/Icon'

const FloatingIcon = ({icon, style, width = 200, height = 200, toValue=-20, duration=1000}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: toValue,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    );
    
    loop.start();
    
    return () => {
      loop.stop();
    };
  }, [floatAnim]);

  return (
    <Animated.View style={[{ transform: [{ translateY: floatAnim }], alignItems:'center' }]}>
      <Icon icon={icon} size={{width, height}} style={[{marginTop: 50}, style]} />
    </Animated.View>
  );
};
export default FloatingIcon;