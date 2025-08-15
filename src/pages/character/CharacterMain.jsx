import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import LayoutWidthStatus from '@templates/LayoutWidthStatus';
import MyRoom from '@organisms/character/MyRoom';
import { 
  loadUserItems, 
  handleItemSelect, 
  getLoadingState 
} from '../../services/characterAPI';
import { mergeCharacterData, mergeThemeData } from '../../utils/dataMapper';

const CharacterMain = () => {
  const navigation = useNavigation();
  
  // ===== LOCAL STATE =====
  const [activeTab, setActiveTab] = useState('character');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // API 데이터 상태
  const [characters, setCharacters] = useState([]);
  const [rooms, setRooms] = useState([]);

  // API 로딩 상태
  const loadingCharacters = getLoadingState('loadUserItems');
  const loadingRooms = getLoadingState('loadUserItems');
  const selectingItem = getLoadingState('handleItemSelect');
  
  // “초기 진입 때 기본 선택 확정했는지” 플래그
  const initializedRef = useRef(false);

  // ===== API FUNCTIONS =====
  const loadCharacters = async ({ setDefaultIfNeeded = false } = {}) => {
    const result = await loadUserItems('character');
    
    if (result.success) {
      const userCharacters = result.data?.items ?? result.data ?? [];
      console.log('보유 캐릭터:', userCharacters);
      const merged = mergeCharacterData(userCharacters);
      setCharacters(merged);

      if (setDefaultIfNeeded) {
        // 현재 선택된 캐릭터 -> 없으면 첫 보유 캐릭터
        const selected = userCharacters.find(c => c.isSelected);
        console.log('선택 캐릭터:', selected);
        if (selected) {
          setSelectedCharacter(selected.id);
        } else {
          const firstOwned = merged.find(c => !c.locked);
          if (firstOwned) setSelectedCharacter(firstOwned.id);
        }
      }
    } else {
      console.error('캐릭터 로드 실패:', result.error);
      setCharacters(mergeCharacterData([])); // fallback
    }
  };

  const loadRooms = async ({ setDefaultIfNeeded = false } = {}) => {
    const result = await loadUserItems('theme');
    
    if (result.success) {
      const userThemes = result.data?.items ?? result.data ?? [];
      console.log('보유 테마:', userThemes);
      const merged = mergeThemeData(userThemes);
      setRooms(merged);

      if (setDefaultIfNeeded) {
        // 현재 선택된 방 -> 없으면 첫 보유 방
        const selected = userThemes.find(t => t.isSelected);
        console.log('선택 테마:', selected);
        if (selected) {
          setSelectedRoom(selected.id);
        } else {
          const firstOwned = merged.find(t => !t.locked);
          if (firstOwned) setSelectedRoom(firstOwned.id);
        }
      }
    } else {
      console.error('방(테마) 로드 실패:', result.error);
      setRooms(mergeThemeData([])); // fallback
    }
  };
  
  // ===== EFFECTS =====
  // 1. 초기에 둘 다 불러서 Display에 즉시 띄우기
  useEffect(() => {
    (async () => {
      await Promise.all([
        loadCharacters({ setDefaultIfNeeded: true }),
        loadRooms({ setDefaultIfNeeded: true }),
      ]);
      initializedRef.current = true;
    })();
  }, []);

  // 2. 탭 변경 시, 해당 탭만 재조회 (기본 선택 덮었쓰지 않도록)
  useEffect(() => {
    if (!initializedRef.current) return; // 초기 세팅 전에는 무시
    if (activeTab === 'character') {
      loadCharacters({ setDefaultIfNeeded: false });
    } else {
      loadRooms({ setDefaultIfNeeded: false });
    }
  }, [activeTab]);
  
  // ===== EVENT HANDLERS =====
  const handleTabChange = (tab) =>  setActiveTab(tab);

  const handleItemSelectLocal = async (id) => {
    // 잠긴 아이템은 선택할 수 없음
    const currentItems = activeTab === 'character' ? characters : rooms;
    const selectedItem = currentItems.find(item => item.id === id);
    if (selectedItem?.locked) {
      console.log('잠긴 아이템은 선택할 수 없습니다.');
      return;
    }

    const result = await handleItemSelect(activeTab, id);
    
    if (result.success) {
      if (activeTab === 'character') {
        setSelectedCharacter(id);
        setCharacters(prev => prev.map(char => ({...char, isSelected: char.id === id})));
        console.log('캐릭터 선택 완료:', id);
      } else {
        setSelectedRoom(id);
        setRooms(prev => prev.map(room => ({...room, isSelected: room.id === id})));
        console.log('테마 선택 완료:', id);
      }
    } else {
      console.error('선택 실패:', result.error);
      // TODO: 사용자에게 에러 메시지 표시 (Toast, Alert 등)
    }
  };

  const handleAuctionPress = () => {
    navigation.navigate('CharacterAuction', { type: activeTab });
    console.log('경매 이동 - 타입:', activeTab);
  };

  const handleGatchaPress = () => {
    navigation.navigate('CharacterDraw', { type: activeTab });
    console.log('가챠 이동 - 타입:', activeTab);
  };

  const loading = loadingCharacters || loadingRooms || selectingItem;

  return (
    <LayoutWidthStatus>
      <MyRoom
        activeTab={activeTab}
        selectedCharacter={selectedCharacter}
        selectedRoom={selectedRoom}
        characters={characters}
        rooms={rooms}
        loading={loading}
        onTabChange={handleTabChange}
        onItemSelect={handleItemSelectLocal}
        onAuctionPress={handleAuctionPress}
        onGatchaPress={handleGatchaPress}
      />
    </LayoutWidthStatus>
  );
};

export default CharacterMain;