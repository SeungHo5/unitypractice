import { StyleSheet, View } from "react-native";
import Text from "@atoms/text/Text";
import { useEffect, useRef, useState } from "react";
import Icon from "@atoms/image/Icon";

const Loading = ({textType="subtitle", ...props}) => {
  const getIconSource = (idx) => {
    switch (idx) {
      case 0:
        return require('@assets/img/loadingAnimation/loading0.png');
      case 1:
        return require('@assets/img/loadingAnimation/loading1.png');
      case 2:
        return require('@assets/img/loadingAnimation/loading2.png');
      case 3:
        return require('@assets/img/loadingAnimation/loading3.png');
      case 4:
        return require('@assets/img/loadingAnimation/loading4.png');
      case 5:
        return require('@assets/img/loadingAnimation/loading5.png');
    }
  };

  const [icon, setIcon] = useState(getIconSource(0));
  const [iconIdx, setIconIdx] = useState(0);
  const intervalRef = useRef(null); // interval id 저장용

  const loadingStart = () => {
    // 기존 인터벌 있으면 제거
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setIconIdx(prev => prev >= 5 ? 0 : prev + 1);
    }, 200);
  };

  useEffect(() => {
    setIcon(getIconSource(iconIdx));
  }, [iconIdx]);

  // 언마운트 시 interval 제거
  useEffect(() => {
    loadingStart();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);


  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container, props.style]}>
      <Icon icon={icon} style={[styles.icon, props.iconStyle]}/>
      <Text style={styles.text} type={textType}>  Loading...</Text>
    </View>
  );
};
export default Loading;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    zIndex: 10,
    backgroundColor: '#FFFEEB',
    marginTop: 100,
    marginBottom: 100,
    
  },
  icon:{
    width: '60%',
    height: 'auto',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  text:{
    alignSelf: 'center',
    color: '#91B7AB'
  }
});