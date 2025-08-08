import React, { useState,useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import UnityView from '@azesmway/react-native-unity';

const UnityBearController = ({ onGoBack }) => {
    const [showUnity, setShowUnity] = useState(false);
    const unityRef = useRef(null);

    // 1, 2, 3 버튼에서 Unity로 메시지 보내는 함수
    const sendToUnity = (num) => {
        // BearSwitcher = 유니티에서 이 스크립트가 붙어있는 GameObject 이름
        // OnReactNativeMessage = C#에서 만든 함수명
        // num.toString() = "1", "2", "3"
        unityRef.current?.postMessage(
            'BearSwitcher',
            'OnReactNativeMessage',
            num.toString()
        );
    };
    
    if (showUnity) {
        return (
            <View style={{ flex: 1 }}>
                {/* UnityView가 전체화면 */}
                <UnityView ref={unityRef} style={{ flex: 1 }} />

                {/* RN 오버레이 버튼: 아래쪽에 1/2/3, 위쪽에 닫기 */}
                <View style={{
                    position: 'absolute', bottom: 60, left: 0, right: 0, flexDirection: 'row',
                    justifyContent: 'space-around', paddingHorizontal: 18, zIndex: 2
                }}>
                    {[1,2,3].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => sendToUnity(num)}
                            style={{
                                backgroundColor: '#222b',
                                borderRadius: 30,
                                paddingVertical: 16,
                                paddingHorizontal: 28,
                                marginHorizontal: 8,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                {/* 닫기 버튼 */}
                <TouchableOpacity
                    onPress={() => setShowUnity(false)}
                    style={{
                        position: 'absolute', top: 30, left: 20, zIndex: 3,
                        backgroundColor: '#0008', padding: 10, borderRadius: 8
                    }}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>← 닫기</Text>
                </TouchableOpacity>
            </View>
        );
    }
    // if (showUnity) {
    //     return (
    //         <View style={{ flex: 1 }}>
    //             <UnityView style={{ flex: 1 }} />
    //             <TouchableOpacity onPress={() => setShowUnity(false)} style={{ position: 'absolute', top: 30, left: 20, zIndex: 2 }}>
    //                 <Text style={{ color: '#fff', backgroundColor: '#0008', padding: 8, borderRadius: 6 }}>← 닫기</Text>
    //             </TouchableOpacity>
    //         </View>
    //     );
    // }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setShowUnity(true)}>
                <Text style={{ fontSize: 22 }}>Unity 전체화면 실행</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onGoBack} style={{ marginTop: 40 }}>
                <Text>← 홈으로</Text>
            </TouchableOpacity>
        </View>
    );
};

export default UnityBearController;
