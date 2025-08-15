import { ScrollView, StyleSheet, View } from "react-native";
import ChallengeListButton from "@molecules/challenge/ChallengeListButton";

const ChallengeList = (props) => {
  const getIconSource = (name) => {
    switch (name) {
      case 'pencil':
        return require('@assets/pencil.png');
      case 'logo':
        return require('@assets/logo.png');
      case 'coin':
        return require('@assets/coin.png');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={props.scrollEnabled}>
      {props.challenges.map((item, index) => (
        <ChallengeListButton
          onPressComplate={() => props.onPressComplate(index)}
          key={index}
          icon={getIconSource(item.icon)}
          title={item.title}
          caption={item.caption}
          coin={item.coin.toString()}
          complete={item.complete}
          onPress={() => props.onPress(index)}
          disabled={props.disabled}
        />
      ))}
    </ScrollView>
  );
};
export default ChallengeList;

const styles = StyleSheet.create({
  container:{
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  }
});