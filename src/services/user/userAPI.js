import api from './api';

// ============ 인증 (Authentication) ============

// 회원가입
export const signUp = async (email, password, nickname) => {
  const response = await api.post('/user/auth/signup', {
    email,
    password,
    nickname,
  });
  return response.data;
};

// 로그인
export const login = async (email, password) => {
  const response = await api.post('/user/auth/login', {
    email,
    password
  });
  return response;
};

// 소셜 로그인
export const socialLogin = async (provider, code, state = null) => {
  const requestBody = { code };
  if (state) requestBody.state = state;
  
  const response = await api.post(`/auth/${provider}`, requestBody);
  return response.data;
};

// 네이버 State 생성
export const getNaverState = async () => {
  const response = await api.get('/auth/naver/state');
  return response.data;
};

// 비밀번호 재설정
export const resetPassword = async (email, newPassword) => {
  const response = await api.post('/user/auth/reset-password', {
    email,
    newPassword
  });
  return response.data;
};

// 토큰 재발급
export const reissueToken = async () => {
  const response = await api.post('/user/auth/reissue');
  return response.data;
};

// 로그아웃
export const logout = async () => {
  const response = await api.post('/user/logout');
  return response.data;
};

// ============ 사용자 정보 (User Information) ============

// 내 정보 조회
export const getMyInfo = async () => {
  const response = await api.get('/user/me');
  return response.data;
};

// 내 정보 수정
export const updateMyInfo = async (nickname, birthYear, gender = null) => {
  const requestBody = { nickname, birthYear };
  if (gender) requestBody.gender = gender;
  
  const response = await api.put('/user/me', requestBody);
  return response.data;
};

// 회원 탈퇴
export const deleteMyAccount = async () => {
  const response = await api.delete('/user/me');
  return response.data;
};

// 사용자 검색
export const searchUsers = async (query, size = 10, page = 0) => {
  const response = await api.get('/user/search', {
    params: { query, size, page }
  });
  return response.data;
};

// 사용자 상세 조회
export const getUserDetail = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

// ============ 친구 시스템 (Friend System) ============

// 친구 요청
export const requestFriend = async (receiverId) => {
  const response = await api.post(`/friend/${receiverId}`);
  return response.data;
};

// 친구 요청 취소
export const cancelFriendRequest = async (receiverId) => {
  const response = await api.delete(`/friend/pending/${receiverId}`);
  return response.data;
};

// 친구 요청 수락
export const acceptFriendRequest = async (requesterId) => {
  const response = await api.put(`/friend/${requesterId}/accept`);
  return response.data;
};

// 친구 요청 거절
export const rejectFriendRequest = async (requesterId) => {
  const response = await api.delete(`/friend/${requesterId}/reject`);
  return response.data;
};

// 친구 해제
export const unfriend = async (friendId) => {
  const response = await api.delete(`/friend/${friendId}`);
  return response.data;
};

// 친구 목록 조회
export const getFriends = async () => {
  const response = await api.get('/friend');
  return response.data;
};

// 보낸 친구 요청 목록 조회
export const getSentFriendRequests = async () => {
  const response = await api.get('/friend/pending/sent');
  return response.data;
};

// 받은 친구 요청 목록 조회
export const getReceivedFriendRequests = async () => {
  const response = await api.get('/friend/pending/received');
  return response.data;
};

// 친구 관계 상태 조회
export const getFriendRelation = async (targetId) => {
  const response = await api.get(`/friend/relation/${targetId}`);
  return response.data;
};

// ============ 차단 시스템 (Block System) ============

// 사용자 차단
export const blockUser = async (blockedId) => {
  const response = await api.post(`/block/${blockedId}`);
  return response.data;
};

// 사용자 차단 해제
export const unblockUser = async (blockedId) => {
  const response = await api.delete(`/block/${blockedId}`);
  return response.data;
};

// 차단한 사용자 목록 조회
export const getBlockedUsers = async () => {
  const response = await api.get('/block');
  return response.data;
};

// ============ 채팅 시스템 (Chat System) ============

// 채팅방 생성/조회
export const createOrGetChatRoom = async (targetUserId) => {
  const response = await api.post(`/chat-room/${targetUserId}`);
  return response.data;
};

// 채팅방 목록 조회
export const getChatRooms = async () => {
  const response = await api.get('/chat-room');
  return response.data;
};

// 채팅 메시지 조회
export const getChatMessages = async (roomId) => {
  const response = await api.get(`/chat-message/${roomId}`);
  return response.data;
};

// ============ 알림 시스템 (Notification System) ============

// 알림 목록 조회
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

// 알림 삭제
export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

// 채팅방 알림 전체 삭제
export const deleteChatNotifications = async (chatRoomId) => {
  const response = await api.delete(`/notifications/chat/${chatRoomId}`);
  return response.data;
};

// ============ 이메일 인증 (Email Verification) ============

// 인증번호 발송
export const emailCheck = async (email) => {
  const response = await api.post(`/email/send?email=${ email }`, );
  return response.data;
};

// 인증번호 검증
export const codeCheck = async (email, code) => {
  const response = await api.post(`/email/verify?email=${ email }&code=${code}`);
  return response.data;
};