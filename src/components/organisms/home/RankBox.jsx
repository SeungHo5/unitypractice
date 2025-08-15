import { StyleSheet, View } from 'react-native';
import Box from '@atoms/box/Box';

const RankBox = () => {

  return (
    <>
      <Box title="Rank" height={500} contentStyle={styles.contentContainer}>
      </Box>
    </>
  );
};
export default RankBox;

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 100,
    justifyContent: 'flex-start',
  },
});