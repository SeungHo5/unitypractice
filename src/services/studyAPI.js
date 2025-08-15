import { studyAPI as api } from './api';

// ============ 로딩 상태 관리 ============
const loadingState = {
  // 스터디 그룹
  createStudyGroup: false,
  getStudyGroups: false,
  getStudyGroupDetail: false,
  updateStudyGroup: false,
  deleteStudyGroup: false,
  joinStudyGroup: false,
  leaveStudyGroup: false,
  getStudyGroupMembers: false,
  getStudyGroupMessages: false,
  
  // 스터디 룸
  createStudyRoom: false,
  createStudyRoomFromGroup: false,
  updateStudyRoom: false,
  deleteStudyRoom: false,
  getStudyRooms: false,
  getStudyRoomDetail: false,
  joinStudyRoom: false,
  leaveStudyRoom: false,
  getStudyRoomMembers: false,
  
  // 학습 분석
  getUserSummary: false,
  getGroupSummary: false,
  getUserDailyTrend: false,
  getGroupDailyTrend: false,
  getUserWeeklyPattern: false,
  getGroupWeeklyPattern: false,
  getUserHourlyPattern: false,
  getGroupHourlyPattern: false,
  
  // 모션
  getStudyGroupActivityStatus: false,
  analyzeMotionData: false,
  analyzeBatchMotionData: false,
  forceEndUserSession: false,
  clearStudyActivitySessions: false,
  checkMotionServiceHealth: false
};

// 로딩 상태 조회 함수
export const getLoadingState = (functionName) => loadingState[functionName];
export const getAllLoadingStates = () => ({ ...loadingState });

// ============ 스터디 그룹 (Study Group) ============

// 스터디 그룹 생성
export const createStudyGroup = async (data) => {
  const {name, description, maxMembers, isPublic} = data;
  loadingState.createStudyGroup = true;
  try {
    const response = await api.post('/study-groups', {
      name,
      description,
      maxMembers,
      isPublic
    });
    console.log('스터디 그룹 생성 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 생성 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.createStudyGroup = false;
  }
};

// 스터디 그룹 목록 조회
export const getStudyGroups = async (keyword = null, subject = null, isPublic = null, isActive = null, page = 0, size = 20) => {
  loadingState.getStudyGroups = true;
  try {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (subject) params.subject = subject;
    if (isPublic !== null) params.isPublic = isPublic;
    if (isActive !== null) params.isActive = isActive;

    const response = await api.get('/study-groups', { params });
    console.log('스터디 그룹 목록 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getStudyGroups = false;
  }
};

// 스터디 그룹 상세 조회
export const getStudyGroupDetail = async (groupId) => {
  loadingState.getStudyGroupDetail = true;
  try {
    const response = await api.get(`/study-groups/${groupId}`);
    console.log('스터디 그룹 상세 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 상세 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getStudyGroupDetail = false;
  }
};

// 스터디 그룹 수정
export const updateStudyGroup = async (groupId, name, subject, description, maxMembers, isPublic) => {
  loadingState.updateStudyGroup = true;
  try {
    const response = await api.put(`/study-groups/${groupId}`, {
      name,
      subject,
      description,
      maxMembers,
      isPublic
    });
    console.log('스터디 그룹 수정 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 수정 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.updateStudyGroup = false;
  }
};

// 스터디 그룹 삭제
export const deleteStudyGroup = async (groupId) => {
  loadingState.deleteStudyGroup = true;
  try {
    const response = await api.delete(`/study-groups/${groupId}`);
    console.log('스터디 그룹 삭제 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 삭제 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.deleteStudyGroup = false;
  }
};

// 스터디 그룹 가입
export const joinStudyGroup = async (groupId) => {
  loadingState.joinStudyGroup = true;
  try {
    const response = await api.post(`/study-groups/${groupId}/join`);
    console.log('스터디 그룹 가입 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 가입 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.joinStudyGroup = false;
  }
};

// 스터디 그룹 탈퇴
export const leaveStudyGroup = async (groupId) => {
  loadingState.leaveStudyGroup = true;
  try {
    const response = await api.post(`/study-groups/${groupId}/leave`);
    console.log('스터디 그룹 탈퇴 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 탈퇴 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.leaveStudyGroup = false;
  }
};

// 스터디 그룹 멤버 조회
export const getStudyGroupMembers = async (groupId) => {
  loadingState.getStudyGroupMembers = true;
  try {
    const response = await api.get(`/study-groups/${groupId}/members`);
    console.log('스터디 그룹 멤버 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 멤버 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getStudyGroupMembers = false;
  }
};

// 스터디 그룹 채팅 내역 조회
export const getStudyGroupMessages = async (studyGroupId) => {
  loadingState.getStudyGroupMessages = true;
  try {
    const response = await api.get(`/study-groups/${studyGroupId}/messages`);
    console.log('스터디 그룹 채팅 내역 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 채팅 내역 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getStudyGroupMessages = false;
  }
};

// ============ 스터디 룸 (Study Room) ============

// 스터디 방 생성
export const createStudyRoom = async (name, maxMembers, isPublic, leaderId) => {
  loadingState.createStudyRoom = true;
  try {
    const response = await api.post('/study-rooms', {
      name,
      maxMembers,
      isPublic,
      leaderId
    });
    console.log('스터디 방 생성 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 방 생성 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.createStudyRoom = false;
  }
};

// 그룹에서 스터디 방 생성
export const createStudyRoomFromGroup = async (studyGroupId, name, maxMembers, isPublic, leaderId) => {
  loadingState.createStudyRoomFromGroup = true;
  try {
    const response = await api.post(`/study-rooms/from-group/${studyGroupId}`, {
      name,
      maxMembers,
      isPublic,
      leaderId
    });
    console.log('그룹에서 스터디 방 생성 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('그룹에서 스터디 방 생성 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.createStudyRoomFromGroup = false;
  }
};

// 스터디 방 수정
export const updateStudyRoom = async (roomId, name, maxMembers, isPublic, leaderId) => {
  loadingState.updateStudyRoom = true;
  try {
    const response = await api.put(`/study-rooms/${roomId}`, {
      name,
      maxMembers,
      isPublic,
      leaderId
    });
    console.log('스터디 방 수정 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 방 수정 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.updateStudyRoom = false;
  }
};

// 스터디 방 삭제
export const deleteStudyRoom = async (roomId) => {
  loadingState.deleteStudyRoom = true;
  try {
    const response = await api.delete(`/study-rooms/${roomId}`);
    console.log('스터디 방 삭제 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 방 삭제 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.deleteStudyRoom = false;
  }
};

// 스터디 방 목록 조회
export const getStudyRooms = async (keyword = null, isPublic = null, studyGroupId = null) => {
  loadingState.getStudyRooms = true;
  try {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (isPublic !== null) params.isPublic = isPublic;
    if (studyGroupId) params.studyGroupId = studyGroupId;

    const response = await api.get('/study-rooms', { params });
    console.log('스터디 방 목록 조회 API 성공:', response.data.studyRooms);
    return { success: true, data: response.data.studyRooms };
  } catch (error) {
    console.log('스터디 방 목록 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getStudyRooms = false;
  }
};

// 스터디 방 상세 조회
export const getStudyRoomDetail = async (roomId) => {
  loadingState.getStudyRoomDetail = true;
  try {
    const response = await api.get(`/study-rooms/${roomId}`);
    console.log('스터디 방 상세 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 방 상세 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getStudyRoomDetail = false;
  }
};

// 스터디 방 참여
export const joinStudyRoom = async (roomId, userId, sessionId) => {
  loadingState.joinStudyRoom = true;
  try {
    const response = await api.post(`/study-rooms/${roomId}/join`, null, {
      params: { userId, sessionId }
    });
    console.log('스터디 방 참여 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 방 참여 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.joinStudyRoom = false;
  }
};

// 스터디 방 나가기
export const leaveStudyRoom = async (roomId, userId, sessionId) => {
  loadingState.leaveStudyRoom = true;
  try {
    const response = await api.post(`/study-rooms/${roomId}/leave`, null, {
      params: { userId, sessionId }
    });
    console.log('스터디 방 나가기 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 방 나가기 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.leaveStudyRoom = false;
  }
};

// 스터디 방 멤버 조회
export const getStudyRoomMembers = async (roomId) => {
  loadingState.getStudyRoomMembers = true;
  try {
    const response = await api.get(`/study-rooms/${roomId}/members`);
    console.log('스터디 방 멤버 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 방 멤버 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getStudyRoomMembers = false;
  }
};

// ============ 학습 분석 (Analytics) ============

// 사용자별 전체 학습 요약 조회
export const getUserSummary = async (userId, startDate = null, endDate = null) => {
  loadingState.getUserSummary = true;
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/analytics/users/${userId}/summary`, { params });
    console.log('사용자별 전체 학습 요약 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자별 전체 학습 요약 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserSummary = false;
  }
};

// 스터디 그룹별 전체 학습 요약 조회
export const getGroupSummary = async (groupId, startDate = null, endDate = null) => {
  loadingState.getGroupSummary = true;
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/analytics/groups/${groupId}/summary`, { params });
    console.log('스터디 그룹별 전체 학습 요약 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹별 전체 학습 요약 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getGroupSummary = false;
  }
};

// 사용자별 날짜별 공부시간/집중시간 변화량 조회
export const getUserDailyTrend = async (userId, startDate = null, endDate = null) => {
  loadingState.getUserDailyTrend = true;
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/analytics/users/${userId}/daily-trend`, { params });
    console.log('사용자별 날짜별 공부시간/집중시간 변화량 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자별 날짜별 공부시간/집중시간 변화량 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserDailyTrend = false;
  }
};

// 스터디 그룹별 날짜별 공부시간/집중시간 변화량 조회
export const getGroupDailyTrend = async (groupId, startDate = null, endDate = null) => {
  loadingState.getGroupDailyTrend = true;
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/analytics/groups/${groupId}/daily-trend`, { params });
    console.log('스터디 그룹별 날짜별 공부시간/집중시간 변화량 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹별 날짜별 공부시간/집중시간 변화량 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getGroupDailyTrend = false;
  }
};

// 사용자별 요일별 학습 패턴 조회
export const getUserWeeklyPattern = async (userId, startDate = null, endDate = null) => {
  loadingState.getUserWeeklyPattern = true;
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/analytics/users/${userId}/weekly-pattern`, { params });
    console.log('사용자별 요일별 학습 패턴 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자별 요일별 학습 패턴 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserWeeklyPattern = false;
  }
};

// 스터디 그룹별 요일별 학습 패턴 조회
export const getGroupWeeklyPattern = async (groupId, startDate = null, endDate = null) => {
  loadingState.getGroupWeeklyPattern = true;
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/analytics/groups/${groupId}/weekly-pattern`, { params });
    console.log('스터디 그룹별 요일별 학습 패턴 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹별 요일별 학습 패턴 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getGroupWeeklyPattern = false;
  }
};

// 사용자별 시간대별 학습 패턴 조회
export const getUserHourlyPattern = async (userId, startDate = null, endDate = null) => {
  loadingState.getUserHourlyPattern = true;
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/analytics/users/${userId}/hourly-pattern`, { params });
    console.log('사용자별 시간대별 학습 패턴 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자별 시간대별 학습 패턴 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getUserHourlyPattern = false;
  }
};

// 스터디 그룹별 시간대별 학습 패턴 조회
export const getGroupHourlyPattern = async (groupId, startDate = null, endDate = null) => {
  loadingState.getGroupHourlyPattern = true;
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(`/analytics/groups/${groupId}/hourly-pattern`, { params });
    console.log('스터디 그룹별 시간대별 학습 패턴 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹별 시간대별 학습 패턴 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getGroupHourlyPattern = false;
  }
};

// ============ 모션 (Motion) ============

// 스터디 그룹 실시간 상태 조회
export const getStudyGroupActivityStatus = async (studyId) => {
  loadingState.getStudyGroupActivityStatus = true;
  try {
    const response = await api.get(`/motion/study/${studyId}/status`);
    console.log('스터디 그룹 실시간 상태 조회 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 그룹 실시간 상태 조회 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.getStudyGroupActivityStatus = false;
  }
};

// 모션 데이터 분석 요청
export const analyzeMotionData = async (userId, studyId, status, poseKeypoints, faceKeypoints, imageWidth, imageHeight, timestamp) => {
  loadingState.analyzeMotionData = true;
  try {
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
    console.log('모션 데이터 분석 요청 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('모션 데이터 분석 요청 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.analyzeMotionData = false;
  }
};

// 배치 모션 데이터 종합 분석
export const analyzeBatchMotionData = async (userId, studyId, dataPoints) => {
  loadingState.analyzeBatchMotionData = true;
  try {
    const response = await api.post('/motion/analyze-batch', {
      userId,
      studyId,
      dataPoints
    });
    console.log('배치 모션 데이터 종합 분석 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('배치 모션 데이터 종합 분석 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.analyzeBatchMotionData = false;
  }
};

// 사용자 Activity 세션 종료
export const forceEndUserSession = async (studyId, userId) => {
  loadingState.forceEndUserSession = true;
  try {
    const response = await api.delete(`/motion/study/${studyId}/user/${userId}`);
    console.log('사용자 Activity 세션 종료 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('사용자 Activity 세션 종료 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.forceEndUserSession = false;
  }
};

// 스터디 Activity 세션 정리
export const clearStudyActivitySessions = async (studyId) => {
  loadingState.clearStudyActivitySessions = true;
  try {
    const response = await api.delete(`/motion/study/${studyId}/session`);
    console.log('스터디 Activity 세션 정리 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('스터디 Activity 세션 정리 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.clearStudyActivitySessions = false;
  }
};

// 모션 서비스 상태 확인
export const checkMotionServiceHealth = async () => {
  loadingState.checkMotionServiceHealth = true;
  try {
    const response = await api.get('/motion/health');
    console.log('모션 서비스 상태 확인 API 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('모션 서비스 상태 확인 API 호출 실패:', error.response?.data || error);
    return { success: false, error: error.response?.data || error };
  } finally {
    loadingState.checkMotionServiceHealth = false;
  }
};