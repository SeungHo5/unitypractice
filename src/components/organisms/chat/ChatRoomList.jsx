import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Text from '@atoms/text/Text';
import Icon from '@atoms/image/Icon';
import SearchInput from '@molecules/common/SearchInput';
import { getChatRooms, searchUsers, createOrGetChatRoom } from '@services/userAPI';

const ChatRoomList = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  // const [searchHeight, setSearchHeight] = useState(0); // ✅ 추가: 검색 영역 높이
  const [dropdownTop, setDropdownTop] = useState(0);

  const avatarMap = {
    3: require('@assets/characters/3.png'),
    5: require('@assets/characters/5.png'),
    7: require('@assets/characters/1.png'),
    8: require('@assets/characters/2.png'),
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        console.log('채팅방 목록 로딩 시작');
        const data = await getChatRooms();
        console.log('채팅방 목록 API 응답:', data);

        const roomsArray = Array.isArray(data.data?.data) ? data.data.data : [];

        const normalizedRooms = roomsArray.map(room => ({
          id: room.roomId,
          name: room.targetUserNickname,
          lastMessage: room.lastMessage || '새 채팅방',
          updatedAt: room.lastSentAt || new Date().toISOString(),
          unreadCount: room.unreadCount || 0,
          avatar: 3,
          opponentId: room.targetUserId,
          roomId: room.roomId
        }));

        setChatRooms(normalizedRooms);
      } catch (error) {
        console.error('채팅방 목록 로딩 실패:', error);
        setChatRooms([]);
      }
    };

    fetchChatRooms();
  }, []);

  const searchForUsers = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      console.log('사용자 검색 시작:', searchQuery);
      const result = await searchUsers(searchQuery, 10, 0);

      if (result.success) {
        console.log('사용자 검색 성공:', result.data);
        setSearchResults(result.data || []);
      } else {
        console.error('사용자 검색 실패:', result.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('사용자 검색 에러:', error);
      setSearchResults([]);
    }
  };

  const filteredChatRooms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return chatRooms;
    return chatRooms.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.lastMessage.toLowerCase().includes(q)
    );
  }, [query, chatRooms]);

  const suggestions = useMemo(() => {
    const suggestions = [];

    const chatRoomSuggestions = filteredChatRooms.slice(0, 5).map(room => ({
      type: 'chatroom',
      ...room
    }));

    const userSuggestions = searchResults.slice(0, 5).map(user => ({
      type: 'user',
      id: user.id,
      name: user.nickname,
      avatar: user.profileImage || 3,
      userId: user.id
    }));

    suggestions.push(...chatRoomSuggestions, ...userSuggestions);
    return suggestions.slice(0, 10);
  }, [filteredChatRooms, searchResults]);

  const handleSearch = useCallback((text) => {
    setQuery(text ?? '');
    setShowDropdown(false);
  }, []);

  const createChatRoomAndNavigate = async (targetUserId) => {
    try {
      console.log('채팅방 생성 시작:', targetUserId);
      const result = await createOrGetChatRoom(targetUserId);

      if (result.success) {
        console.log('채팅방 생성/조회 성공:', result.data);
        const roomId = result.data.roomId || result.data.id;
        console.log('최종 룸 ID:', roomId);

        navigation.navigate('Chat', {
          roomId: roomId,
          myUserId: 'me',
          opponentId: targetUserId,
        });

        setQuery('');
        setShowDropdown(false);
      } else {
        console.error('채팅방 생성 실패:', result.error);
        Alert.alert('오류', '채팅방 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅방 생성 에러:', error);
      Alert.alert('오류', '채팅방 생성 중 오류가 발생했습니다.');
    }
  };

  const handlePressRoom = (room) => {
    navigation.navigate('Chat', {
      roomId: room.id,
      myUserId: 'me',
      opponentId: room.opponentId,
    });
  };

  const handleSuggestionPress = (item) => {
    if (item.type === 'chatroom') {
      handlePressRoom(item);
    } else if (item.type === 'user') {
      createChatRoomAndNavigate(item.userId);
    }
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => (
      <TouchableOpacity style={styles.roomItem} onPress={() => handlePressRoom(item)}>
        <Icon
            icon={avatarMap[item.avatar]}
            size={{ width: 35, height: 35 }}
            style={{ marginRight: 10, borderColor: '#91B7AB', borderWidth: 1, borderRadius: 50 }}
        />
        <View style={styles.roomInfo}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{formatTime(item.updatedAt)}</Text>
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.unreadCount}</Text>
                </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
  );

  return (
      <View style={{ flex: 1 }}>
        <View
            // style={styles.searchContainer}
            // ✅ 추가: 검색 영역 실제 높이 측정
        
             style={styles.searchContainer}
             onLayout={(e) => setDropdownTop(e.nativeEvent.layout.height)}
           >
        
          <SearchInput
              placeholder="친구 검색"
              onSearch={handleSearch}
              onChangeText={(t) => {
                console.log('[SearchInput onChangeText]', t);
                const text = t ?? '';
                setQuery(text);
                setShowDropdown(!!text.trim());

                if (text.trim()) {
                  searchForUsers(text.trim());
                } else {
                  setSearchResults([]);
                }
              }}
              style={styles.searchButton}
          />
          
          {/*{showDropdown && suggestions.length > 0 && (*/}
          {/*    // ✅ 수정: top을 문자열 퍼센트 대신 숫자 상태로 적용*/}
          {/*    <View style={[styles.dropdown, { top: searchHeight }]}>*/}
           {showDropdown && suggestions.length > 0 && (
              <View style={[styles.dropdown, { top: dropdownTop }]}>
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={suggestions}
                    keyExtractor={(it) => `${it.type}-${String(it.id)}`} // ✅ 안전한 키
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => handleSuggestionPress(item)}
                        >
                          <Icon icon={avatarMap[item.avatar]} size={{ width: 24, height: 24 }} style={{ marginRight: 8, borderRadius: 12 }} />
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                            <Text numberOfLines={1} style={{ color: '#666', fontSize: 12 }}>
                              {item.type === 'user' ? '사용자 검색 결과' : (item.lastMessage || '채팅방')}
                            </Text>
                          </View>
                          {item.type === 'user' && (
                              <Text style={{ fontSize: 10, color: '#999', backgroundColor: '#f0f0f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                                새 채팅
                              </Text>
                          )}
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f0f0f0' }} />}
                />
              </View>
          )}
        </View>

        <FlatList
            style={{ flex: 1 }}
            data={query.trim() ? filteredChatRooms : chatRooms}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
        />
      </View>
  );
};

export default ChatRoomList;

const DROPDOWN_MAX_H = 260;
const styles = StyleSheet.create({
  searchContainer: {
    position: 'relative',
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 10,
    elevation: 2,
  },
  dropdown: {
    position: 'absolute',
    
    left: 10,
    right: 10,
    maxHeight: DROPDOWN_MAX_H,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 1000,
    elevation: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  searchButton: {
    borderColor: '#91B7AB',
    borderWidth: 2,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#91B7AB',
  },
  roomInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#91B7AB',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#444',
    flexShrink: 1,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
});
