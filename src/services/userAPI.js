import { userAPI as api} from './api';

// ============ 로딩 상태 관리 ============
const loadingState = {
  // 인증
  signUp: false,
  login: false,
  socialLogin: false,
  getNaverState: false,
  resetPassword: false,
  reissueToken: false,
  logout: false,
  
  // 사용자 정보
  getMyInfo: false,
  updateMyInfo: false,
  deleteMyAccount: false,
  searchUsers: false,
  getUserDetail: false,
  
  // 친구 시스템
  requestFriend: false,
  cancelFriendRequest: false,
  acceptFriendRequest: false,
  rejectFriendRequest: false,
  unfriend: false,
  getFriends: false,
  getSentFriendRequests: false,
  getReceivedFriendRequests: false,
  getFriendRelation: false,
  
  // 차단 시스템
  blockUser: false,
  unblockUser: false,
  getBlockedUsers: false,
  
  // 채팅 시스템
  createOrGetChatRoom: false,
  getChatRooms: false,
  getChatMessages: false,
  
  // 알림 시스템
  getNotifications: false,
  deleteNotification: false,
  deleteChatNotifications: false,
  
  // 이메일 인증
  emailCheck: false,
  codeCheck: false
};

// 로딩 상태 조회 함수
export const getLoadingState = (functionName) => loadingState[functionName];
export const getAllLoadingStates = () => ({ ...loadingState });

// ============ 인증 (Authentication) ============

// 회원가입
export const signUp = async (email, password, nickname) => {
  loadingState.signUp = true;
  try {
    const response = await api.post('/user/auth/signup', {
      email,
      password,
      nickname,
      birthYear: 0,
    });
    console.log('회원가입 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('회원가입 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.signUp = false;
  }
};

// 로그인
import { useTokenStore } from '@stores/tokenStore';
import { useUserStore  } from '@stores/userStore';
export const login = async (email, password) => {
  loadingState.login = true;
  
  try {
    const response = await api.post('/user/auth/login', {email, password});
    const accessToken = response.headers.authorization;
    const refreshToken = response.headers['refresh-token'];

    console.log('로그인 API 성공');
    console.log('JWT:', accessToken);
    console.log('Refresh:', refreshToken);

    await useTokenStore.getState().setTokens(accessToken, refreshToken);
    await useUserStore.getState().fetchUser();

    return { success: true, data: response };
  } catch (error) {
    console.log('로그인 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.login = false;
  }
};

// 소셜 로그인
export const socialLogin = async (provider, code, state = null) => {
  loadingState.socialLogin = true;
  try {
    const requestBody = { code };
    if (state) requestBody.state = state;
    
    const response = await api.post(`/auth/${provider}`, requestBody);
    console.log('소셜 로그인 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('소셜 로그인 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.socialLogin = false;
  }
};

// 네이버 State 생성
export const getNaverState = async () => {
  loadingState.getNaverState = true;
  try {
    const response = await api.get('/auth/naver/state');
    console.log('네이버 State 생성 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('네이버 State 생성 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getNaverState = false;
  }
};

// 비밀번호 재설정
export const resetPassword = async (email, newPassword) => {
  loadingState.resetPassword = true;
  try {
    const response = await api.post('/user/auth/reset-password', {
      email,
      newPassword
    });
    console.log('비밀번호 재설정 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('비밀번호 재설정 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.resetPassword = false;
  }
};

// 토큰 재발급
export const reissueToken = async () => {
  loadingState.reissueToken = true;
  try {
    const response = await api.post('/user/auth/reissue');
    console.log('토큰 재발급 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('토큰 재발급 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.reissueToken = false;
  }
};

// 로그아웃
export const logout = async () => {
  loadingState.logout = true;
  try {
    const response = await api.post('/user/logout');
    console.log('로그아웃 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('로그아웃 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.logout = false;
  }
};

// ============ 사용자 정보 (User Information) ============

// 내 정보 조회
export const getMyInfo = async () => {
  loadingState.getMyInfo = true;
  try {
    const response = await api.get('/user/me');
    console.log('내 정보 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('내 정보 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getMyInfo = false;
  }
};

// 내 정보 수정
export const updateMyInfo = async (nickname, birthYear, gender = null) => {
  loadingState.updateMyInfo = true;
  try {
    const requestBody = { nickname, birthYear };
    if (gender) requestBody.gender = gender;
    
    const response = await api.put('/user/me', requestBody);
    console.log('내 정보 수정 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('내 정보 수정 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.updateMyInfo = false;
  }
};

// 회원 탈퇴
export const deleteMyAccount = async () => {
  loadingState.deleteMyAccount = true;
  try {
    const response = await api.delete('/user/me');
    console.log('회원 탈퇴 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('회원 탈퇴 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.deleteMyAccount = false;
  }
};

// 사용자 검색
export const searchUsers = async (query, size = 10, page = 0) => {
  loadingState.searchUsers = true;
  try {
    const response = await api.get('/user/search', {
      params: { query, size, page }
    });
    console.log('사용자 검색 API 성공:', response.data.data.content);
    return { success: true, data: response.data.data.content };
  } catch (error) {
    console.log('사용자 검색 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.searchUsers = false;
  }
};

// 사용자 상세 조회
export const getUserDetail = async (id) => {
  loadingState.getUserDetail = true;
  try {
    const response = await api.get(`/user/${id}`);
    console.log('사용자 상세 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자 상세 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserDetail = false;
  }
};

// ============ 친구 시스템 (Friend System) ============

// 친구 요청
export const requestFriend = async (receiverId) => {
  loadingState.requestFriend = true;
  try {
    const response = await api.post(`/friend/${receiverId}`);
    console.log('친구 요청 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('친구 요청 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.requestFriend = false;
  }
};

// 친구 요청 취소
export const cancelFriendRequest = async (receiverId) => {
  loadingState.cancelFriendRequest = true;
  try {
    const response = await api.delete(`/friend/pending/${receiverId}`);
    console.log('친구 요청 취소 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('친구 요청 취소 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.cancelFriendRequest = false;
  }
};

// 친구 요청 수락
export const acceptFriendRequest = async (requesterId) => {
  loadingState.acceptFriendRequest = true;
  try {
    const response = await api.put(`/friend/${requesterId}/accept`);
    console.log('친구 요청 수락 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('친구 요청 수락 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.acceptFriendRequest = false;
  }
};

// 친구 요청 거절
export const rejectFriendRequest = async (requesterId) => {
  loadingState.rejectFriendRequest = true;
  try {
    const response = await api.delete(`/friend/${requesterId}/reject`);
    console.log('친구 요청 거절 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('친구 요청 거절 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.rejectFriendRequest = false;
  }
};

// 친구 해제
export const unfriend = async (friendId) => {
  loadingState.unfriend = true;
  try {
    const response = await api.delete(`/friend/${friendId}`);
    console.log('친구 해제 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('친구 해제 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.unfriend = false;
  }
};

// 친구 목록 조회
export const getFriends = async () => {
  loadingState.getFriends = true;
  try {
    const response = await api.get('/friend');
    console.log('친구 목록 조회 API 성공:', response.data.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.log('친구 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getFriends = false;
  }
};

// 보낸 친구 요청 목록 조회
export const getSentFriendRequests = async () => {
  loadingState.getSentFriendRequests = true;
  try {
    const response = await api.get('/friend/pending/sent');
    console.log('보낸 친구 요청 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('보낸 친구 요청 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getSentFriendRequests = false;
  }
};

// 받은 친구 요청 목록 조회
export const getReceivedFriendRequests = async () => {
  loadingState.getReceivedFriendRequests = true;
  try {
    const response = await api.get('/friend/pending/received');
    console.log('받은 친구 요청 목록 조회 API 성공:', response.data.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.log('받은 친구 요청 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getReceivedFriendRequests = false;
  }
};

// 친구 관계 상태 조회
export const getFriendRelation = async (targetId) => {
  loadingState.getFriendRelation = true;
  try {
    const response = await api.get(`/friend/relation/${targetId}`);
    console.log('친구 관계 상태 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('친구 관계 상태 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getFriendRelation = false;
  }
};

// ============ 차단 시스템 (Block System) ============

// 사용자 차단
export const blockUser = async (blockedId) => {
  loadingState.blockUser = true;
  try {
    const response = await api.post(`/block/${blockedId}`);
    console.log('사용자 차단 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자 차단 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.blockUser = false;
  }
};

// 사용자 차단 해제
export const unblockUser = async (blockedId) => {
  loadingState.unblockUser = true;
  try {
    const response = await api.delete(`/block/${blockedId}`);
    console.log('사용자 차단 해제 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자 차단 해제 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.unblockUser = false;
  }
};

// 차단한 사용자 목록 조회
export const getBlockedUsers = async () => {
  loadingState.getBlockedUsers = true;
  try {
    const response = await api.get('/block');
    console.log('차단한 사용자 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('차단한 사용자 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getBlockedUsers = false;
  }
};

// ============ 채팅 시스템 (Chat System) ============

// 채팅방 생성/조회
export const createOrGetChatRoom = async (targetUserId) => {
  loadingState.createOrGetChatRoom = true;
  try {
    const response = await api.post(`/chat-room/${targetUserId}`);
    console.log('채팅방 생성/조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('채팅방 생성/조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.createOrGetChatRoom = false;
  }
};

// 채팅방 목록 조회
export const getChatRooms = async () => {
  loadingState.getChatRooms = true;
  try {
    const response = await api.get('/chat-room');
    console.log('채팅방 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('채팅방 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getChatRooms = false;
  }
};

// 채팅 메시지 조회
export const getChatMessages = async (roomId) => {
  loadingState.getChatMessages = true;
  try {
    const response = await api.get(`/chat-message/${roomId}`);
    console.log('채팅 메시지 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('채팅 메시지 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getChatMessages = false;
  }
};

// ============ 알림 시스템 (Notification System) ============

// 알림 목록 조회
export const getNotifications = async () => {
  loadingState.getNotifications = true;
  try {
    const response = await api.get('/notifications');
    console.log('알림 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('알림 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getNotifications = false;
  }
};

// 알림 삭제
export const deleteNotification = async (id) => {
  loadingState.deleteNotification = true;
  try {
    const response = await api.delete(`/notifications/${id}`);
    console.log('알림 삭제 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('알림 삭제 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.deleteNotification = false;
  }
};

// 채팅방 알림 전체 삭제
export const deleteChatNotifications = async (chatRoomId) => {
  loadingState.deleteChatNotifications = true;
  try {
    const response = await api.delete(`/notifications/chat/${chatRoomId}`);
    console.log('채팅방 알림 전체 삭제 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('채팅방 알림 전체 삭제 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.deleteChatNotifications = false;
  }
};

// ============ 이메일 인증 (Email Verification) ============

// 인증번호 발송
export const emailCheck = async (email) => {
  loadingState.emailCheck = true;
  try {
    const response = await api.post(`/email/send?email=${ email }`, );
    console.log('인증번호 발송 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('인증번호 발송 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.emailCheck = false;
  }
};

// 인증번호 검증
export const codeCheck = async (email, code) => {
  loadingState.codeCheck = true;
  try {
    const response = await api.post(`/email/verify?email=${ email }&code=${code}`);
    console.log('인증번호 검증 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('인증번호 검증 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.codeCheck = false;
  }
};