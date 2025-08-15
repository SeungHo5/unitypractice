import React, { useState } from 'react';
import { View, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '@atoms/text/Text';
import ButtonBox from '@atoms/box/ButtonBox';
import Box from '@atoms/box/Box';
import Icon from '@atoms/image/Icon';
import { logout, getLoadingState } from '@services/userAPI';
import { useTokenStore } from '@stores/tokenStore';
import usePlayerStore from '@stores/playerStore';
import { useUserStore } from '@stores/userStore';

const SettingsPanel = ({ onClose }) => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  
  // 스토어들
  const { clearTokens } = useTokenStore();
  const { resetPlayerData } = usePlayerStore();
  const { clearUser } = useUserStore();
  
  // 로딩 상태
  const isLoggingOut = getLoadingState('logout');

  // 로그아웃 처리
  const handleLogout = async () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              // 서버에 로그아웃 요청
              const result = await logout();
              
              if (result.success) {
                // 로컬 데이터 초기화
                await clearTokens();
                resetPlayerData();
                clearUser();
                
                // 설정 패널 닫기
                onClose();
                
                // 로그인 화면으로 이동
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignupMain' }],
                });
                
                console.log('로그아웃 완료');
              } else {
                // 서버 로그아웃 실패해도 로컬 데이터는 초기화
                console.warn('서버 로그아웃 실패, 로컬 데이터만 초기화:', result.error);
                await clearTokens();
                resetPlayerData();
                clearUser();
                
                onClose();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignupMain' }],
                });
              }
            } catch (error) {
              console.error('로그아웃 처리 중 오류:', error);
              Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  return (
    <Box 
      style={styles.container} 
      title={"Setting"} 
      titleBtnIcon={require('@assets/close.png')} 
      titleBtnOnPress={onClose}
      titleBtnStyle={{ width: 20, height: 20 }}
      contentStyle={{
        overflow: 'visible'
      }}
      >
      {/* 상단 내용 */}
      <View style={styles.top}>
        <Text type="title" style={{ fontSize: 28, color: '#91B7AB' }}>
          {"Push 알림"}
        </Text>

        <Switch
          value={isEnabled}
          onValueChange={setIsEnabled}
          trackColor={{ false: '#ccc', true: '#91B7AB' }}
          thumbColor={isEnabled ? '#66b5a3' : '#f4f3f4'}
        />

      </View>

      {/* 중간 내용 */}
      <View style={styles.middle}>
          <Icon 
            icon={require('@assets/version.png')}
            size={{ width: 120, height: 120 }}
            />
          <Text type="title" style={{ color: '#91B7AB' }}>1.1.1</Text>
      </View>


      {/* 하단 내용 */}
      <View style={styles.bottom}>
        <ButtonBox 
          style={[
            styles.logoutButton,
            isLoggingOut && styles.logoutButtonDisabled
          ]}
          onPress={isLoggingOut ? null : handleLogout}
        >
          <Text type="title" style={{ color: '#fff' }}>
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </Text>
        </ButtonBox>
        
      </View>

      
    </Box>
  );
};

export default SettingsPanel;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    width: '100%',
    maxHeight: '50%',
    borderRadius: 16,
    paddingBottom: 18,
  },
  top: {
    // backgroundColor: 'black',
    flexDirection: 'row',
    width: '100%',
    height: '25%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#91B7AB', 
    borderStyle: 'dashed',
  },
  middle: {
    // backgroundColor: 'yellow',
    width: '100%',
    height: '25%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#91B7AB',
    borderStyle: 'dashed',
  },
  bottom: {
    // backgroundColor: 'green',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 65,
    paddingTop: 30,
  },
  logoutButton: {
    width: '70%',
    height: '60%',
    backgroundColor: '#91B7AB',
    borderWidth: 2,
    borderColor: '#66b5a3',
  },
  logoutButtonDisabled: {
    backgroundColor: '#ccc',
    borderColor: '#999',
  },
});
