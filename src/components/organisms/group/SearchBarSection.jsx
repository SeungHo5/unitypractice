import { StyleSheet, View } from "react-native";
import SearchInput from '@molecules/common/SearchInput';
import GroupListButtonSection from "@molecules/group/GroupListButtonSection";

const SearchBarSection = (props) => {

  return (
    <View style={styles.container}>
      <SearchInput onSearch={props.onSearch} />
      <GroupListButtonSection onFiltering={props.onFiltering} filter={props.filter} onMakeRoom={props.onMakeRoom}/>
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