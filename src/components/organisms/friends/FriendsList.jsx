import { ScrollView, StyleSheet, View } from "react-native";
import FriendsListBox from "@molecules/friends/FriendsListBox";
import { getCharacterImage } from "@utils/imageMapping";

const FriendsList = (props) => {
  return (
    <View style={styles.listSection}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {props.friends.map((item, index) => (
            <FriendsListBox
              key={index}
              onPress={() => props.onPress(item.id)}
              onPress2={() => props.onPress2(item.id)}
              icon={getCharacterImage(item.characterId)}
              name={item.nickname}
              level={item.level}
              btnTitle={props.btnTitle}
              btnTitle2={props.btnTitle2}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
export default FriendsList;

const styles = StyleSheet.create({
  listSection:{
    width: '100%',
    flex: 90,
    padding: 10,
    paddingTop: 0
  },
  container:{
    height: '100%',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#91B7AB',
    overflow: 'hidden',
  },
  scrollContainer:{
    width: '100%',
  }
});