import { StyleSheet, View } from 'react-native';
import Text from '@atoms/text/Text';

const UserAnalyzeInfo = (props) => {
  return (
    <View style={styles.container}>
      <View style={{flex:40}}>
        <View style={styles.summaryContainer}>
          <View style={styles.summary}>
            <Text type="title">{props.user?.totalStudyTime}h</Text>
            <Text type="caption">총 사용시간</Text>
          </View>
          <View style={styles.borderRight}></View>
          <View style={styles.summary}>
            <Text type="title">{props.user?.studyFocusRate}%</Text>
            <Text type="caption">공부 집중률</Text>
          </View>
          <View style={styles.borderRight}></View>
          <View style={styles.summary}>
            <Text type="title">{props.user?.avgFocusTime}h</Text>
            <Text type="caption">평균 집중 시간</Text>
          </View>
        </View>
      </View>
      <View style={styles.graphContainer}>
        <View style={styles.graph}>
          <View style={styles.canvas}></View>
          <Text>일일 집중도 변화량</Text>
        </View>
        <View style={styles.graph}>
          <View style={styles.canvas}></View>
          <Text>공부 집중률</Text>
        </View>
      </View>
    </View>
  );
};
export default UserAnalyzeInfo;

const styles = StyleSheet.create({
  container:{
    flex: 55,
    paddingHorizontal: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summary: {
    width:'33%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  graphContainer:{
    flex: 60,
    flexDirection: 'row',
  },
  graph:{
    width:'50%',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  canvas:{
    width: '70%',
    aspectRatio: 1,
    backgroundColor: '#91B7AB',

  },
  borderRight:{
    borderRightWidth: 1,
    height: '40%',
    borderColor: '#000000'
  }
});