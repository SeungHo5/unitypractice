import { ScrollView, StyleSheet, View } from "react-native";
import Button from "@atoms/button/Button";

const FriendsFilterSection = (props) => {
  const menu = [
    { title: '친구목록' },
    { title: '친구검색' },
    { title: '추천친구' },
    { title: '친구요청' },
    { title: '차단친구' },
  ];

  return (
    <View style={{width: '100%', paddingHorizontal: 10}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerScroll}
        showsHorizontalScrollIndicator={false}
        horizontal
      >
        {menu.map((item, index) => (
          <Button
            key={index}
            style={[styles.btn, props.filterType == index && styles.active]}
            textStyle={props.filterType == index && styles.active}
            title={item.title}
            type="caption"
            onPress={()=>props.onPress(index)}
            onPress2={()=>props.onPress(index)}
            activeOpacity={1}
          />
        ))}
      </ScrollView>
    </View>
  );
};
export default FriendsFilterSection;

const styles = StyleSheet.create({
  container:{
    width: '100%',
    flexDirection: 'row',
  },
  containerScroll:{
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  margin: 5,
  },
  btn: {
    borderRadius: 50,
    backgroundColor: '#C0D6C8',
  },
  active:{
    color: '#E4CC71',
    backgroundColor: '#91B7AB',
  },
});