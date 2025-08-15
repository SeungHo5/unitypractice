import { StyleSheet, View } from "react-native";
import Box from "@atoms/box/Box";
import Text from '@atoms/text/Text'
import Icon from '@atoms/image/Icon'
import Button from '@atoms/button/Button';

const FriendsListBox = (props) => {
  return (
    <Box style={styles.box} contentStyle={styles.contentStyle}>
      <View style={{flexDirection: 'row', alignItems:'center', margin:10}}>
        <View style={styles.iconContainer}>
          <Icon icon={props.icon} size={{width:'80%',height:'80%'}}></Icon>
        </View>
        <View style={{height: '100%',justifyContent: 'space-around'}}>
          <Text style={{fontWeight: '600'}}>{props.name}</Text>
          <Button
            title={"Lv."+props.level}
            type="caption"
            style={styles.level}
          >
          </Button>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <Button
          onPress={()=>props.onPress()}
          title={props.btnTitle}
          type="caption"
          style={styles.iconText}
        />
        {props.btnTitle2 &&
          <Button
            onPress={()=>props.onPress2()}
            title={props.btnTitle2}
            type="caption"
            style={styles.iconText}
          />
        }
      </View>
    </Box>
  );
};
export default FriendsListBox;

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: 80,
    marginBottom: 15,
  },
  contentStyle: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  iconContainer:{
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 500,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  level:{
    borderRadius: 10,
    backgroundColor: '#C0D6C8',
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconText: {
    borderRadius: 25,
    backgroundColor: '#C0D6C8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnContainer:{
    margin: 5
  }
});