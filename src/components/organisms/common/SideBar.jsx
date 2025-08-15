import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import Box from '@atoms/box/Box';
import BackgroundOverlay from '@atoms/image/BackgroundOverlay';
import ButtonBox from '@atoms/box/ButtonBox';
import { useNavigation } from '@react-navigation/native';
import Icon from '@atoms/image/Icon';
import Text from '@atoms/text/Text';
import NotificationList from '@organisms/notification/NotificationList';
import ChatRoomList from '@organisms/chat/ChatRoomList';
import SettingsPanel from '@organisms/setting/SettingsPanel';
import UserInfo from '@organisms/user/UserInfo';
import { useUserStore } from '@stores/userStore';

const { width } = Dimensions.get('window');

const SideBar = ({ visible, onClose }) => {
    const { user } = useUserStore();
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const userName = "똑똑한참치김치찌개";
    const navigation = useNavigation();
    const paddingTop = Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

    const getIconSource = (icon) => {
        switch (icon) {
            case 'logo':
                return require('@assets/logo.png');
        }
    };

    const menus = [
        { icon: 'logo', title: '알림', key: 'notification' }, // 사이드바 안에서 내용 보여주기
        { icon: 'logo', title: '친구관리', link: 'Friends' }, // 이건 페이지 이동
        { icon: 'logo', title: '설정', key: 'settings' }, // 설정 패널 열기
        { icon: 'logo', title: '채팅', key: 'chat' }, //  사이드바 안에서 내용 보여주기
    ];

    if (!visible) return null;

    const handleMenuClick = (menu) => {
        if (menu.link) {
            navigation.navigate(menu.link); // 이동
            onClose();
        } else if (menu.key) {
            setSelectedMenu(menu.key); // 내부 콘텐츠 렌더링
            setIsMenuOpen(false);
        }
    };

    const handleBackToMenu = () => {
        setIsMenuOpen(true);
        setSelectedMenu(null);
    };

    const handleSettingsClose = () => {
        setSelectedMenu(null); // 선택된 메뉴 초기화
        setIsMenuOpen(true);   // 메뉴 화면으로 복귀
        onClose();             // 사이드바 닫기
    };

    
    return (
        <>
        <BackgroundOverlay
            onPress={onClose}
            containerStyle={styles.container}
            overlayStyle={[styles.overlay, selectedMenu === 'settings' && { alignItems: 'center' }]}
        >   
            {selectedMenu !== 'settings' && (
            <Box 
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                contentStyle={[styles.sidebarWrapper, { paddingTop: paddingTop }]}
                >
                {/* 사용자 정보 영역 */}
                {isMenuOpen && (
                <View style={styles.userSection}>
                    <ButtonBox contentStyle={styles.userButton} onPress={()=>setDetailOpen(true)}>
                        <View style={styles.userInfo}>
                            <Icon
                                icon={require('@assets/logo.png')}
                                size={{ width: 40, height: 40 }}
                                style={{ marginRight: 15, borderColor: '#91B7AB', borderWidth: 1, borderRadius: 50 }}
                            />
                            <Text type="midium">
                                {userName}
                            </Text>
                        </View>
                        <Icon
                            icon={require('@assets/arrow.png')}
                            size={5}
                            style={{ marginLeft: 0 }}
                        />
                    </ButtonBox>
                </View>
                )}

                {/* 메뉴 */}
                {isMenuOpen ? (
                <View style={styles.menuSection}>
                    {menus.map((item, index) => (
                        <ButtonBox
                            key={index}
                            style={{ height: 70, width: '100%', borderBottomColor: '#91B7AB', borderBottomWidth: 1 }}
                            contentStyle={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                            }}
                            onPress={() => handleMenuClick(item)}>
                            <View style={styles.menuInfo}>
                                <Icon
                                    icon={getIconSource(item.icon)}
                                    size={20}
                                    style={{ marginRight: 4 }}
                                />
                                <Text>
                                    {item.title}
                                </Text>
                            </View>
                            <Icon
                                icon={require('@assets/arrow.png')}
                                size={5}
                                style={{ marginLeft: 0 }}
                            />
                        </ButtonBox>
                    ))}
                </View>
            ) : (
                // {/* 메뉴 내부에서 띄울 콘텐츠 */}
                <View style={styles.menuContent}>
                    <ButtonBox onPress={handleBackToMenu} style={{ height: 30 }} contentStyle={styles.buttonbox}>
                        <Icon icon={require('@assets/arrow.png')} size={{ width: 13, height: 13 }} style={[{ marginBottom: 2 }, { transform: [{ scaleX: -1 }] }]} />
                        <Text style={{ color: '#91B7AB' }}>{"돌아가기"}</Text>
                    </ButtonBox>
                    {selectedMenu === 'notification' && <NotificationList />}
                    {selectedMenu === 'chat' && <ChatRoomList />}
                </View>
                )}
            </Box>
            )}

            {/* 설정만 따로 박스 밖에 전체화면으로 띄움 */}
            {selectedMenu === 'settings' && (
            <View style={styles.settingsPanel}>
                <SettingsPanel onClose={handleSettingsClose} />
            </View>
            )}
        </BackgroundOverlay>
        {detailOpen && <UserInfo onPress={()=>setDetailOpen(false)} userId={user.data.data.id}/>}
        </>
    );
};
export default SideBar;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: 'flex-end',
    },
    container: {
        width: width * 0.7,
        height: '100%',
    },
    sidebarWrapper: {
        justifyContent: 'flex-start',
        borderRadius: 0,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        borderLeftColor: '#91B7AB',
        borderLeftWidth: 25,
        flex: 1,
    },
    userSection: {
        borderBottomWidth: 1,
        borderBottomColor: '#91B7AB',
        width: '100%',
        height: '12%',
        justifyContent: 'center',
        paddingRight: 15,
    },
    userButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '80%',        // 오른쪽 아이콘 침범 방지
    },
    menuInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '80%',        // 오른쪽 아이콘 침범 방지
        margin: 10,
    },
    menuSection: {
        height: '85%',
        width: '100%',
        paddingTop: 30,
        paddingHorizontal: 15,
    },
    menuContent: {
        width: '100%',
        flex: 1,
    },
    buttonbox: {
        flexDirection: 'row',                          
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 20,                              
        margin: 8,
    },
    settingsPanel: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
});