import ChatHeader from '@organisms/chat/ChatHeader';
import ChatMessages from '@organisms/chat/ChatMessages';
import ChatInputBar from '@organisms/chat/ChatInputBar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getChatMessages } from '@services/userAPI';
import useTokenStore from '@stores/tokenStore';

const Chat = () => {
  const navigation = useNavigation();
  const { accessToken } = useTokenStore();

  // 메시지 상태: 채팅 메시지 목록 관리
  const [messages, setMessages] = useState([]);
  
  // WebSocket 관련 상태
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const stompClientRef = useRef(null);

  // 라우터에서 파라미터 가져오기
  const route = useRoute();
  // const { roomId, myUserId, opponentId } = route.params; // 채팅방 ID, 내 ID, 상대방 ID
  const { roomId = 1, myUserId = 'me', opponentId = 'user123' } = route.params || {};

  const userMap = {
    [myUserId]: { name: '나', avatar: '@assets/character/5.png' },
    [opponentId]: { name: '상대방', avatar: '@assets/character/7.png' },
  };

  // 초기 메시지 로딩
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        console.log('채팅 메시지 로딩 시작:', roomId);
        const result = await getChatMessages(roomId);
        console.log('채팅 메시지 API 응답:', result);
        
        // API wrapper 구조 처리 - 중첩 구조: result.data.data
        const data = result.success ? (result.data?.data || []) : [];
        console.log('메시지 데이터 확인:', data, '타입:', typeof data, '배열여부:', Array.isArray(data));
        
        if (Array.isArray(data)) {
          // 시간순으로 정렬 (오래된 메시지가 먼저)
          const sorted = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setMessages(sorted);
          console.log('채팅 메시지 로딩 성공:', sorted.length, '개');
        } else {
          console.log('메시지 데이터가 배열이 아님 - 빈 배열로 설정');
          setMessages([]);
        }
      } catch (error) {
        console.error('채팅 메시지 로딩 실패:', error);
        // 실패 시 빈 배열로 설정
        setMessages([]);
      }
    };
    
    fetchInitialMessages();
  }, [roomId]);

  // WebSocket 연결
  useEffect(() => {
    if (!accessToken || !roomId) return;

    console.log('WebSocket 연결 시작:', roomId);
    
    // STOMP over WebSocket 연결
    const connectWebSocket = () => {
      try {
        // user-service WebSocket 엔드포인트 (토큰 없이 연결)
        // const wsUrl = `ws://i13c201.p.ssafy.io:30553/ws`;
        const wsUrl = `ws://i13c201.p.ssafy.io:30553/ws?token=${encodeURIComponent(accessToken)}`;
        console.log('WebSocket 연결 URL:', wsUrl);
        console.log('사용할 토큰:', accessToken ? accessToken.substring(0, 20) + '...' : 'null');
        console.log('방 ID:', roomId);
        
        // const socket = new WebSocket(wsUrl, [], { headers: { Authorization: `Bearer ${accessToken}` }});
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log('WebSocket 연결 성공');
          // setIsConnected(true);
          
          // STOMP 프레임 - CONNECT (Authorization 헤더 추가)
          // const connectFrame = `CONNECT\naccept-version:1.0,1.1,2.0\nheart-beat:10000,10000\nAuthorization:Bearer ${accessToken}\n\n\x00`;
          const connectFrame = `CONNECT\naccept-version:1.0,1.1,2.0\nheart-beat:10000,10000\nAuthorization:Bearer ${accessToken}\n\n\u0000`;
          console.log('STOMP CONNECT 프레임 전송 (토큰 포함)');
          socket.send(connectFrame);
        };

        // socket.onmessage = (event) => {
        //   console.log('WebSocket 메시지 수신:', event.data);
          
        //   if (event.data.startsWith('CONNECTED')) {
        //     console.log('STOMP 연결 완료');
            
        //     // 채팅방 구독
        //     const subscribeFrame = `SUBSCRIBE\nid:sub-0\ndestination:/sub/chat/room/${roomId}\n\n\x00`;
        //     socket.send(subscribeFrame);
        //     console.log('채팅방 구독 완료:', roomId);
        //   } else if (event.data.startsWith('MESSAGE')) {
        //     // 실시간 메시지 수신 처리
        //     try {
        //       const lines = event.data.split('\n');
        //       const bodyIndex = lines.findIndex(line => line === '') + 1;
        //       const messageBody = lines.slice(bodyIndex).join('\n').replace(/\x00$/, '');
              
        //       if (messageBody) {
        //         const receivedMessage = JSON.parse(messageBody);
        //         setMessages(prev => [...prev, receivedMessage]);
        //         console.log('새 메시지 수신:', receivedMessage);
        //       }
        //     } catch (error) {
        //       console.error('메시지 파싱 실패:', error);
        //     }
        //   }
        // };

        socket.onmessage = (event) => {
        const data = String(event.data || '');
        // STOMP CONNECTED 수신 시에 연결 완료 처리
        if (data.startsWith('CONNECTED')) {
          // CHANGED: CONNECTED를 받은 시점에 연결 완료로 간주
          setIsConnected(true); // CHANGED
          // CHANGED: 구독 경로를 /topic/chat/{roomId}로 수정
          const subscribeFrame =
            `SUBSCRIBE\nid:sub-0\ndestination:/topic/chat/${roomId}\n\n\u0000`; // CHANGED
          socket.send(subscribeFrame);
          return;
        }

        if (data.startsWith('MESSAGE')) {
          try {
            const lines = data.split('\n');
            const bodyIndex = lines.findIndex(line => line === '') + 1;
            const messageBody = lines.slice(bodyIndex).join('\n').replace(/\u0000$/, '');
            if (messageBody) {
              const received = JSON.parse(messageBody);
              setMessages(prev => [...prev, received]);
            }
          } catch (e) {
            console.error('메시지 파싱 실패:', e);
          }
          return;
        }

        // 필요시 ERROR, RECEIPT 등 추가 처리
      };

        socket.onerror = (error) => {
          console.error('WebSocket 오류:', error);
          setIsConnected(false);
        };

        socket.onclose = () => {
          console.log('WebSocket 연결 종료');
          setIsConnected(false);
        };

      } catch (error) {
        console.error('WebSocket 연결 실패:', error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        setIsConnected(false);
      }
    };
  }, [roomId, accessToken]);

  // 메시지 전송 (WebSocket)
  const handleSendMessage = (text) => {
    if (!text.trim() || !isConnected || !socketRef.current) {
      console.log('메시지 전송 불가:', { text: text.trim(), isConnected, hasSocket: !!socketRef.current });
      return;
    }

  //   try {
  //     // 메시지 객체 생성
  //     const messageToSend = {
  //       roomId,
  //       content: text,
  //       senderId: myUserId,
  //       createdAt: new Date().toISOString(),
  //     };

  //     // STOMP 프레임으로 메시지 전송
  //     const sendFrame = `SEND\ndestination:/pub/chat/send\ncontent-type:application/json\n\n${JSON.stringify(messageToSend)}\x00`;
  //     socketRef.current.send(sendFrame);
      
  //     console.log('메시지 전송:', messageToSend);
      
  //     // 로컬에도 즉시 추가 (UI 반응성을 위해)
  //     const localMessage = {
  //       ...messageToSend,
  //       id: Date.now(),
  //       text: text // 기존 구조와 호환성을 위해
  //     };
  //     setMessages(prev => [...prev, localMessage]);
      
  //   } catch (error) {
  //     console.error('메시지 전송 실패:', error);
  //   }
  // };

  // 서버 DTO가 message 필드를 기대 → 필드명 message로 전송
    const messageToSend = {
      message: text, // CHANGED (content → message)
      senderId: myUserId,
      createdAt: new Date().toISOString(),
    };

    // destination을 /app/chat/{roomId}로 수정 (@MessageMapping("/chat/{roomId}"))
    const sendFrame =
      `SEND\ndestination:/app/chat/${roomId}\ncontent-type:application/json\n\n${JSON.stringify(messageToSend)}\u0000`; // CHANGED
    try {
      socketRef.current.send(sendFrame);
      // 로컬 반영 (UI 반응성)
      setMessages(prev => [...prev, { ...messageToSend, id: Date.now(), senderId: myUserId }]);
    } catch (e) {
      console.error('메시지 전송 실패:', e);
    }
  };

  // 4) 표시용 가공
  const processedMessages = messages.map((m) => {
    const user = userMap[m.senderId] || { name: '알 수 없음', avatar: '' };
    // message | content | text 우선순위로 표시 텍스트 생성
    const displayText = m.message ?? m.content ?? m.text ?? ''; 
    // return { ...m, name: user.name, avatar: user.avatar, isMine: m.senderId === myUserId };
    return { ...m, text: displayText, name: user.name, avatar: user.avatar, isMine: m.senderId === myUserId };
  });
   
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // 헤더 높이에 따라 조정
    >
        {/* <ChatHeader username={userMap[opponentId].name} onBack={() => navigation.goBack()} /> */}
          <ChatHeader username={userMap[opponentId]?.name || '상대방'} onBack={() => navigation.goBack()} />
        <ChatMessages messages={processedMessages} myUserId={myUserId} contentContainerStyle={{ paddingBottom: 72 }}/>
        <ChatInputBar onSend={handleSendMessage} />
     </KeyboardAvoidingView>
  );
};
export default Chat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFEEB',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})