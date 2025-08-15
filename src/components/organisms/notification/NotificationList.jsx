import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '@atoms/text/Text';
import Icon from '@atoms/image/Icon';
import Box from '@atoms/box/Box';
import ButtonBox from '@atoms/box/ButtonBox';
import { getNotifications, deleteNotification } from '@services/userAPI';

const getIconByType = (type) => {
  switch (type) {
    case 'chat':
      return require('@assets/logo.png');
    case 'friend':
      return require('@assets/logo.png');
    case 'system':
      return require('@assets/logo.png');
    default:
      return require('@assets/logo.png');
  }
};

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  // 알림 목록 로딩
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log('알림 목록 로딩 시작');
        const data = await getNotifications();
        console.log('알림 목록 API 응답:', data);
        
        // userAPI wrapper 형태 처리: 중첩된 구조 data.data.data
        console.log('data.data:', data.data);
        console.log('data.data.data:', data.data?.data);
        
        const notificationsArray = Array.isArray(data.data?.data) ? data.data.data : [];
        setNotifications(notificationsArray);
        console.log('알림 목록 로딩 성공:', notificationsArray.length, '개');
        console.log('📋 알림 데이터 샘플:', notificationsArray[0]);
      } catch (error) {
        console.error('알림 목록 로딩 실패:', error);
        // 실패 시 빈 배열로 설정
        setNotifications([]);
      }
    };
    
    fetchNotifications();
  }, []);

  // 알림 삭제 함수
  const handleDeleteNotification = async (notificationId) => {
    try {
      console.log('알림 삭제 시도:', notificationId);
      await deleteNotification(notificationId);
      
      // 로컬 상태에서도 제거
      setNotifications(prev => prev.filter(item => item.id !== notificationId));
      console.log('알림 삭제 성공:', notificationId);
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  // 알림 클릭 핸들러
  const handleNotificationPress = async (notification) => {
    console.log('🔔 알림 클릭:', notification);

    // 알림 타입에 따른 처리
    switch (notification.type) {
      case 'FRIEND_REQUEST':
        // 친구 요청 알림 → 친구 요청 목록 페이지로 이동
        console.log('친구 요청 페이지로 이동');
        navigation.navigate('FriendRequestList'); // 실제 스크린 이름으로 수정 필요
        break;

      case 'FRIEND_ACCEPT':
      case 'FRIEND_ACCEPTED':
        // 친구 요청 수락 알림 → 그냥 삭제만
        console.log('친구 요청 수락 알림 - 삭제만 진행');
        break;

      case 'CHAT':
      case 'CHAT_MESSAGE':
        // 채팅 알림 → 해당 채팅방으로 이동
        console.log('채팅방으로 이동:', notification.targetUserId);
        // navigation.navigate('ChatRoom', { userId: notification.targetUserId });
        break;

      default:
        console.log('기타 알림 타입:', notification.type);
        break;
    }

    // 모든 경우에서 알림 삭제
    await handleDeleteNotification(notification.id);
  };

  // 시간 포맷팅 함수
  const formatTime = (timeStr) => {
    if (!timeStr) return '시간 정보 없음';
    
    try {
      // ISO 문자열이나 다른 형식의 날짜를 Date 객체로 변환
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return '잘못된 시간 형식';
      
      // 한국 시간으로 포맷팅
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.log('시간 포맷팅 오류:', error);
      return timeStr; // 원본 문자열 반환
    }
  };

  const renderItem = ({ item }) => {
    // 가능한 시간 필드명들 체크
    const timeValue = item.time || item.createdAt || item.timestamp || item.createdTime;
    
    return (
      <ButtonBox 
        style={styles.card} 
        contentStyle={styles.cardContent}
        onPress={() => handleNotificationPress(item)}
      >
        <Icon 
          icon={getIconByType(item.type)} 
          size={{ width: 30, height: 30 }}
          style={{ marginRight: 10, borderColor: '#91B7AB', borderWidth: 1, borderRadius: 50 }}
          />
        <View style={{ flex: 1 }}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>{formatTime(timeValue)}</Text>
        </View>
      </ButtonBox>
    );
  };

  return (
    <FlatList
      style={{flex:1}}
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

export default NotificationList;

const styles = StyleSheet.create({
  list: {
  },
  card: {
    height: 70,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#91B7AB',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 14,
    color: '#91B7AB',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
