import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const localImages = [
  require('@assets/img/loadingAnimation/loading0.png'),
  require('@assets/img/loadingAnimation/loading1.png'),
  require('@assets/img/loadingAnimation/loading2.png'),
  require('@assets/img/loadingAnimation/loading3.png'),
  require('@assets/img/loadingAnimation/loading4.png'),
  require('@assets/img/loadingAnimation/loading5.png'),
];

const ImgPreloader = () => {
  return (
    <View style={styles.hidden}>
      {localImages.map((img, idx) => (
        <Image key={idx} source={img} />
      ))}
    </View>
  );
}
export default ImgPreloader;

const styles = StyleSheet.create({
  hidden: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
});