import { StyleSheet, View } from "react-native";
import SearchInput from '@molecules/common/SearchInput';
import StudyListButtonSection from '@molecules/study/StudyListButtonSection';
import Form from "@organisms/common/Form";

const SearchFriendSection = (props) => {

  return (
    <Form style={styles.container}>
      <SearchInput onSearch={props.onSearch} />
    </Form>
  );
};
export default SearchFriendSection;

const styles = StyleSheet.create({
  container:{
    padding: 10,
    paddingTop: 0,
    alignItems: 'center',
  }
});