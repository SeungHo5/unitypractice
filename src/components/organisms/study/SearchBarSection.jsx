import { StyleSheet, View } from "react-native";
import SearchInput from '@molecules/common/SearchInput';
import StudyListButtonSection from '@molecules/study/StudyListButtonSection';

const SearchBarSection = (props) => {

  return (
    <View style={styles.container}>
      <SearchInput onSearch={props.onSearch} />
      <StudyListButtonSection onFiltering={props.onFiltering} filter={props.filter} onMakeRoom={props.onMakeRoom}/>
    </View>
  );
};
export default SearchBarSection;

const styles = StyleSheet.create({
  container:{
    width: '90%',
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center'
  }
});