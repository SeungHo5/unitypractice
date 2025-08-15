import LayoutWidthStatus from '@templates/LayoutWidthStatus';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import FriendsList from '@organisms/friends/FriendsList';
import { StyleSheet } from 'react-native';
import FriendsFilterSection from '@organisms/friends/FriendsFilterSection';
import SearchFriendSection from '@organisms/friends/SearchFriendSection';
import UserInfo from '@organisms/user/UserInfo';
import {
  getReceivedFriendRequests,
  getFriends,
  rejectFriendRequest,
  requestFriend,
  cancelFriendRequest,
  unblockUser,
  acceptFriendRequest,
  searchUsers,
  getLoadingState
} from '@services/userAPI';
import Loading from '../../components/organisms/common/Loading';

const Friends = () => {
  const navigation = useNavigation();

  const [friend, setFriend] = useState();
  const [friendsList, setFriendsList] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentId, setCurrentId] = useState();

  // 친구 목록 가져오기
  const getFriendsAPICall = async () => {
    const result = await getFriends();
    if (result.success) setFriendsList(result.data);
    console.log(result.data);
  }

  useEffect(()=>{
    getFriendsAPICall();
  },[]);

  // 친구 상세보기 open
  const open = (id) => {
    setCurrentId(id);
    setDetailOpen(true);
  }
  // 친구 상세보기 close
  const close = () => {
    setDetailOpen(false);
  }
  
  // 친구 요청
  const requestFriendAPICall = async (id) => {
    const result = await requestFriend(id);
    if (result.success) console.log("안내 메시지 출력 하기");
  }

  // 친구 요청 해제
  const requestCancle = async (id) => {
    const result = await cancelFriendRequest(id);
    if (result.success) console.log("안내 메시지 출력 하기");
  }

  // 친구 요청 수락
  const acceptFriendRequestAPICall = async (id) => {
    const result = await acceptFriendRequest(id);
    if (result.success) console.log("안내 메시지 출력 하기");
  }

  // 친구 요청 거절
  const rejectFriendRequestAPICall = async (id) => {
    const result = await rejectFriendRequest(id);
    if (result.success) console.log("안내 메시지 출력 하기");
  }
  
  // 친구 차단 해제
  const blockCancle = async (id) => {
    const result = await unblockUser(id);
    if (result.success) console.log("안내 메시지 출력 하기");
  }
  
  // 친구 검색
  const searchFriend = async (query) => {
    console.log(query);
    const result = await searchUsers(query);
    if (result.success) setFriendsList(result.data);
  }
  // 받은 친구 요청 목록 조회
  const getReceivedFriendRequestsAPICall = async () => {
    const result = await getReceivedFriendRequests();
    if (result.success) setFriendsList(result.data);
  }

  // typeId:    0=친구목록 | 1=추천친구 | 2=친구검색 | 3=친구요청 | 4=차단친구
  const [filterType, setFilterType] = useState(0);
  const filtered = (typeId) => {
    console.log("filtered: ", typeId)
    setFilterType(typeId);
  }

  // filterType에 따라 FrinedsListBox의 두번째 버튼에 함수 할당 + 목록 변경
  const [btn1Function, setBtn1Function] = useState('');
  const [btn2Function, setBtn2Function] = useState('');
  const [btnTitle1, setBtnTitle1] = useState('');
  const [btnTitle2, setBtnTitle2] = useState('');
  useEffect(()=>{
    switch (filterType) {
      case 0:
        getFriendsAPICall();
        setBtnTitle1('Info');
        setBtnTitle2('');
        setBtn1Function(() => (index) => open(index));
        break;
      case 1:
        setFriendsList([]);
        setBtnTitle1('Info');
        setBtnTitle2('Send');
        setBtn1Function(() => (index) => open(index));
        setBtn2Function(() => (id) => requestFriendAPICall(id));
        break;
      case 2:
        setFriendsList([]);
        setBtnTitle1('Info');
        setBtnTitle2('Send');
        setBtn1Function(() => (index) => open(index));
        setBtn2Function(() => (id) => requestFriendAPICall(id));
        break;
      case 3:
        getReceivedFriendRequestsAPICall();
        setBtnTitle1('Accept');
        setBtnTitle2('Cancle');
        setBtn1Function(() => (id) => acceptFriendRequestAPICall(id));
        setBtn2Function(() => (id) => rejectFriendRequestAPICall(id));
        break;
      case 4:
        setBtnTitle1('Info');
        setBtnTitle2('Cancle');
        setBtn1Function(() => (index) => open(index));
        setBtn2Function(() => (id) => blockCancle(id));
      break;
    }
  },[filterType]);
  
  return (
    <>
      <LayoutWidthStatus
        title="Friends"
        titleBtnIcon={require('@assets/close.png')}
        titleBtnOnPress={() => navigation.goBack()}
        titleBtnStyle={{height: '30%'}}
      >
        <FriendsFilterSection onPress={(type) => filtered(type)} filterType={filterType}/>
        { filterType == 1 &&
          <SearchFriendSection onSearch={(data) => searchFriend(data)}/>
        }
        { getLoadingState('getFriends') || getLoadingState('getReceivedFriendRequests') || getLoadingState('searchUsers')
        ? <Loading />
        : <FriendsList
          friends={friendsList}
          btnTitle={btnTitle1}
          btnTitle2={btnTitle2}
          onPress={(index) => btn1Function(index)}
          onPress2={(id) => btn2Function(id)}
        />
        }
      </LayoutWidthStatus>
      {detailOpen && <UserInfo onPress={close} userId={currentId}/>}
    </>
  );
};
export default Friends;

const styles = StyleSheet.create({
});