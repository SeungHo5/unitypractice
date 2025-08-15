import api from './api';

// ============ 스터디 그룹 (Study Group) ============

// 스터디 그룹 생성
export const createStudyGroup = async (name, subject, description, maxMembers, isPublic) => {
  const response = await api.post('/study-groups', {
    name,
    subject,
    description,
    maxMembers,
    isPublic
  });
  return response.data;
};

// 스터디 그룹 목록 조회
export const getStudyGroups = async (keyword = null, subject = null, isPublic = null, isActive = null, page = 0, size = 20) => {
  const params = { page, size };
  if (keyword) params.keyword = keyword;
  if (subject) params.subject = subject;
  if (isPublic !== null) params.isPublic = isPublic;
  if (isActive !== null) params.isActive = isActive;

  const response = await api.get('/study-groups', { params });
  return response.data;
};

// 스터디 그룹 상세 조회
export const getStudyGroupDetail = async (groupId) => {
  const response = await api.get(`/study-groups/${groupId}`);
  return response.data;
};

// 스터디 그룹 수정
export const updateStudyGroup = async (groupId, name, subject, description, maxMembers, isPublic) => {
  const response = await api.put(`/study-groups/${groupId}`, {
    name,
    subject,
    description,
    maxMembers,
    isPublic
  });
  return response.data;
};

// 스터디 그룹 삭제
export const deleteStudyGroup = async (groupId) => {
  const response = await api.delete(`/study-groups/${groupId}`);
  return response.data;
};

// 스터디 그룹 가입
export const joinStudyGroup = async (groupId) => {
  const response = await api.post(`/study-groups/${groupId}/join`);
  return response.data;
};

// 스터디 그룹 탈퇴
export const leaveStudyGroup = async (groupId) => {
  const response = await api.post(`/study-groups/${groupId}/leave`);
  return response.data;
};

// 스터디 그룹 멤버 조회
export const getStudyGroupMembers = async (groupId) => {
  const response = await api.get(`/study-groups/${groupId}/members`);
  return response.data;
};

// 스터디 그룹 채팅 내역 조회
export const getStudyGroupMessages = async (studyGroupId) => {
  const response = await api.get(`/study-groups/${studyGroupId}/messages`);
  return response.data;
};

// ============ 스터디 룸 (Study Room) ============

// 스터디 방 생성
export const createStudyRoom = async (name, maxMembers, isPublic, leaderId) => {
  const response = await api.post('/study-rooms', {
    name,
    maxMembers,
    isPublic,
    leaderId
  });
  return response.data;
};

// 그룹에서 스터디 방 생성
export const createStudyRoomFromGroup = async (studyGroupId, name, maxMembers, isPublic, leaderId) => {
  const response = await api.post(`/study-rooms/from-group/${studyGroupId}`, {
    name,
    maxMembers,
    isPublic,
    leaderId
  });
  return response.data;
};

// 스터디 방 수정
export const updateStudyRoom = async (roomId, name, maxMembers, isPublic, leaderId) => {
  const response = await api.put(`/study-rooms/${roomId}`, {
    name,
    maxMembers,
    isPublic,
    leaderId
  });
  return response.data;
};

// 스터디 방 삭제
export const deleteStudyRoom = async (roomId) => {
  const response = await api.delete(`/study-rooms/${roomId}`);
  return response.data;
};

// 스터디 방 목록 조회
export const getStudyRooms = async (keyword = null, isPublic = null, studyGroupId = null) => {
  const params = {};
  if (keyword) params.keyword = keyword;
  if (isPublic !== null) params.isPublic = isPublic;
  if (studyGroupId) params.studyGroupId = studyGroupId;

  const response = await api.get('/study-rooms', { params });
  return response.data;
};

// 스터디 방 상세 조회
export const getStudyRoomDetail = async (roomId) => {
  const response = await api.get(`/study-rooms/${roomId}`);
  return response.data;
};

// 스터디 방 참여
export const joinStudyRoom = async (roomId, userId, sessionId) => {
  const response = await api.post(`/study-rooms/${roomId}/join`, null, {
    params: { userId, sessionId }
  });
  return response.data;
};

// 스터디 방 나가기
export const leaveStudyRoom = async (roomId, userId, sessionId) => {
  const response = await api.post(`/study-rooms/${roomId}/leave`, null, {
    params: { userId, sessionId }
  });
  return response.data;
};

// 스터디 방 멤버 조회
export const getStudyRoomMembers = async (roomId) => {
  const response = await api.get(`/study-rooms/${roomId}/members`);
  return response.data;
};

// ============ 학습 분석 (Analytics) ============

// 사용자별 전체 학습 요약 조회
export const getUserSummary = async (userId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get(`/analytics/users/${userId}/summary`, { params });
  return response.data;
};

// 스터디 그룹별 전체 학습 요약 조회
export const getGroupSummary = async (groupId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get(`/analytics/groups/${groupId}/summary`, { params });
  return response.data;
};

// 사용자별 날짜별 공부시간/집중시간 변화량 조회
export const getUserDailyTrend = async (userId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get(`/analytics/users/${userId}/daily-trend`, { params });
  return response.data;
};

// 스터디 그룹별 날짜별 공부시간/집중시간 변화량 조회
export const getGroupDailyTrend = async (groupId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get(`/analytics/groups/${groupId}/daily-trend`, { params });
  return response.data;
};

// 사용자별 요일별 학습 패턴 조회
export const getUserWeeklyPattern = async (userId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get(`/analytics/users/${userId}/weekly-pattern`, { params });
  return response.data;
};

// 스터디 그룹별 요일별 학습 패턴 조회
export const getGroupWeeklyPattern = async (groupId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get(`/analytics/groups/${groupId}/weekly-pattern`, { params });
  return response.data;
};

// 사용자별 시간대별 학습 패턴 조회
export const getUserHourlyPattern = async (userId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get(`/analytics/users/${userId}/hourly-pattern`, { params });
  return response.data;
};

// 스터디 그룹별 시간대별 학습 패턴 조회
export const getGroupHourlyPattern = async (groupId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get(`/analytics/groups/${groupId}/hourly-pattern`, { params });
  return response.data;
};

// ============ 모션 (Motion) ============

// 스터디 그룹 실시간 상태 조회
export const getStudyGroupActivityStatus = async (studyId) => {
  const response = await api.get(`/motion/study/${studyId}/status`);
  return response.data;
};

// 모션 데이터 분석 요청
export const analyzeMotionData = async (userId, studyId, status, poseKeypoints, faceKeypoints, imageWidth, imageHeight, timestamp) => {
  const response = await api.post('/motion/analyze', {
    userId,
    studyId,
    status,
    poseKeypoints,
    faceKeypoints,
    imageWidth,
    imageHeight,
    timestamp
  });
  return response.data;
};

// 배치 모션 데이터 종합 분석
export const analyzeBatchMotionData = async (userId, studyId, dataPoints) => {
  const response = await api.post('/motion/analyze-batch', {
    userId,
    studyId,
    dataPoints
  });
  return response.data;
};

// 사용자 Activity 세션 종료
export const forceEndUserSession = async (studyId, userId) => {
  const response = await api.delete(`/motion/study/${studyId}/user/${userId}`);
  return response.data;
};

// 스터디 Activity 세션 정리
export const clearStudyActivitySessions = async (studyId) => {
  const response = await api.delete(`/motion/study/${studyId}/session`);
  return response.data;
};

// 모션 서비스 상태 확인
export const checkMotionServiceHealth = async () => {
  const response = await api.get('/motion/health');
  return response.data;
};