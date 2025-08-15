import { StyleSheet, View } from "react-native";
import Text from '@atoms/text/Text'
import Icon from '@atoms/image/Icon'
import Box from "@atoms/box/Box";
import { getChallengeBoardImage } from "@utils/imageMapping";
import { sanitizeStyleDimensions } from "@utils/dimensionUtils";

const ChallengeBoard = (props) => {
  return (
    <View style={sanitizeStyleDimensions(styles.innerView)}>
      <Icon style={sanitizeStyleDimensions(styles.icon)} icon={getChallengeBoardImage(props.category+"Board")}/>
      <Box
        style={sanitizeStyleDimensions(styles.innerBox)}
        title={props.category}
        titleType="caption"
        titleContainerStyle={{alignItems: 'center', paddingHorizontal: 0}}
        titleHeight={24}
        contentStyle={sanitizeStyleDimensions(styles.innerBoxContent)}
      >
        <Text style={{color:'#91B7AB'}}>{props.progress}</Text>
      </Box>
    </View>
  );
};
export default ChallengeBoard;

const styles = StyleSheet.create({
  innerView:{
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  icon: {
    width: '100%',
    flex: 60,
    marginBottom: 5,
  },
  innerBox:{
    width: '60%',
    height: 80,
  },
  innerBoxContent:{
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#91B7AB',
    borderWidth: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});