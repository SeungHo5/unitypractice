import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import ButtonIcon from '@atoms/button/ButtonIcon';
import Text from '@atoms/text/Text';

const ChatHeader = ({ username = "상대 이름", onBack }) => {
    return (
        <View style={styles.container}>
            {/* 왼쪽 아이콘 */}
            <View style={styles.side}>
                <ButtonIcon 
                    icon={require('@assets/arrow.png')}
                    onPress={onBack}
                    size={{ width: 20, height: 20 }}
                    style={[{ marginLeft: 10 }, { transform: [{ scaleX: -1 }] }]}
                />
            </View>

            {/* 중앙 텍스트 */}
            <View style={styles.center}>
                <Text type="subtitle" style={{ color: '#fff' }}>{username}</Text>
            </View>

            {/* 오른쪽 빈 영역 (아이콘 크기 맞춤용) */}
            <View style={styles.side} />
        </View>
    );
};
export default ChatHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#91B7AB',
        flexDirection: 'row',
        height: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 2,
        alignItems: 'center',
    },
    side: {
        width: 40, // 왼쪽 버튼이랑 폭 동일하게
        alignItems: 'center',
        justifyContent: 'center',
    },
    center: {
        flex: 1, // 남은 거
        alignItems: 'center',
    },
})