import React, { useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration, BackHandler } from 'react-native';
import UnityView from '@azesmway/react-native-unity';
import Orientation from 'react-native-orientation-locker';
import { useNavigation } from '@react-navigation/native';

const UnityBearController = ({ onGoBack }) => {
    const navigation = useNavigation();
    const unityRef = useRef(null);

    // 뒤로 가기 동작(안전 버전)
    const goBack = useCallback(() => {
        if (typeof onGoBack === 'function') return onGoBack();
        if (navigation.canGoBack()) return navigation.goBack();
        // 스택이 없을 때 기본 화면으로
        return navigation.navigate('StudyListPage'); // 프로젝트 라우트명에 맞춰 수정 가능
    }, [navigation, onGoBack]);

    // 처음 진입: 가로 고정, 언마운트/뒤로가기: 세로 복귀
    useEffect(() => {
        Orientation.lockToLandscape();

        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            Orientation.lockToPortrait();
            setTimeout(goBack, 80);
            return true; // 기본 동작 막기
        });

        return () => {
            sub.remove();
            Orientation.lockToPortrait();
        };
    }, [goBack]);

    // Unity로 메시지
    const sendToUnity = (num) => {
        unityRef.current?.postMessage('BearSwitcher', 'OnReactNativeMessage', String(num));
    };

    return (
        <View style={styles.unityContainer}>
            <UnityView
                ref={unityRef}
                style={styles.unityView}
                onUnityMessage={(message) => {
                    try {
                        const data = typeof message === 'string' ? JSON.parse(message) : message;
                        if (data?.action === 'showBearStudy') Vibration.vibrate(200);
                        if (data?.action === 'wake_up_bear') Vibration.vibrate([0, 100, 50, 100]);
                    } catch (e) {
                        console.log('메시지 파싱 오류:', e);
                    }
                }}
            />

            {/* 1/2/3 버튼 */}
            <View style={styles.controlButtons}>
                {[1, 2, 3].map((num) => (
                    <TouchableOpacity key={num} onPress={() => sendToUnity(num)} style={styles.numberButton}>
                        <Text style={styles.numberButtonText}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 닫기 버튼 */}
            <TouchableOpacity
                onPress={() => {
                    console.log('Unity 닫기 버튼 클릭');
                    Orientation.lockToPortrait();

                    // Unity 정리 신호들 (있으면 동작, 없어도 무해)
                    unityRef.current?.postMessage('BearSwitcher', 'OnReactNativeMessage', 'RESET');
                    unityRef.current?.postMessage('GameManager', 'ResetGame', '');
                    unityRef.current?.postMessage('BearSwitcher', 'OnReactNativeMessage', '0');
                    unityRef.current?.postMessage('BearSwitcher', 'ResetBear', '');

                    setTimeout(() => {
                        console.log('홈으로 돌아가기 실행');
                        goBack(); // <-- 여기가 포인트!
                    }, 100);
                }}
                style={styles.closeButton}
            >
                <Text style={styles.closeButtonText}>← 닫기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    unityContainer: { flex: 1 },
    unityView: { flex: 1 },
    controlButtons: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 18,
        zIndex: 2,
    },
    numberButton: {
        backgroundColor: 'rgba(34,34,34,0.7)',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 28,
        marginHorizontal: 8,
    },
    numberButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    closeButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 3,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 12,
        borderRadius: 8,
    },
    closeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default UnityBearController;
