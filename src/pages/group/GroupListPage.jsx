import LayoutWidthStatus from '@templates/LayoutWidthStatus';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import GroupList  from '@organisms/group/GroupList';
import GroupInfo from '@organisms/group/GroupInfo';
import SearchBarSection from '@organisms/group/SearchBarSection'
import GroupCreateModal from '@organisms/group/GroupCreateModal';
import { getStudyGroups, getLoadingState, createStudyGroup } from '@services/studyAPI';

const GroupListPage = () => {
  const navigation = useNavigation();

  const [groupList, setGroupList] = useState([]);
  
  useEffect(() => {
    search();
  }, []);

  const search = async (value) => {
    const result = await getStudyGroups(value);
    if (result.success) setGroupList(result.data.studyGroups);
  }
  
  const [filter, setFilter] = useState(false);
  const filtering = () => {
    console.log('필터 :', !filter ? 'on' : 'off');
    setFilter((prev) => !prev);
  }
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const createGroup = async (data) => {
    const result = await createStudyGroup(data);
    if (result.success) setCreateModalOpen(false);
  }

  const [group, setGroup] = useState();
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState();

  const open = (index) => {
    setCurrentIdx(index);
    setGroup(groupList[index]);
    setDetailOpen(true);
    console.log("group Open: ", groupList[index])
  }
  const close = () => {
    setDetailOpen(false);
  }

  const loading = getLoadingState('getStudyGroups');
  
  return (
    <>
      <LayoutWidthStatus
        title="Study Group"
        titleBtnIcon={require('@assets/close.png')}
        titleBtnOnPress={()=>navigation.goBack()}
        titleBtnStyle={{width:20, height:20}}
      >
        <SearchBarSection
          onSearch={(value) => search(value)}
          onFiltering={() => filtering()}
          onMakeRoom={() => setCreateModalOpen(true)}
          filter={filter}
        />
        <GroupList groupList={groupList} filter={filter} onPress={(index) => open(index)} loading={loading}/>
      </LayoutWidthStatus>
      {detailOpen && <GroupInfo group={group} onPress={() => close()}/>}
      {createModalOpen && <GroupCreateModal onClose={() => setCreateModalOpen(false)} onSubmit={createGroup}/>}
    </>
  );
};
export default GroupListPage;