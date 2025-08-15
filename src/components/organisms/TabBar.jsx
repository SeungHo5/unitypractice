import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ButtonIconText from '@atoms/button/ButtonIconText';
import { useNavigation, useRoute } from '@react-navigation/native';
import { toDP } from '@ui/layout'; // ⬅️ 오탈자 수정

const TAB_H = 50;

const TabBar = ({ onOpenMenu }) => {
  const route = useRoute();
  const navigation = useNavigation();

  const ICONS_ACTIVE = {
    Home: require('@assets/homeBtnActive.png'),
    CharacterMain: require('@assets/petBtnActive.png'),
    StudyList: require('@assets/studyBtnActive.png'),
    Menu: require('@assets/menuBtnActive.png'),
  };

  const ICONS_INACTIVE = {
    Home: require('@assets/homeBtn.png'),
    CharacterMain: require('@assets/petBtn.png'),
    StudyList: require('@assets/studyBtn.png'),
    Menu: require('@assets/menuBtn.png'),
  };

  const [currentIcons, setCurrentIcons] = useState(ICONS_INACTIVE);

  useEffect(() => {
    const newIcons = { ...ICONS_INACTIVE };
    switch (route.name) {
      case 'Home':
      case 'Challenge':
      case 'Friends':
        newIcons.Home = ICONS_ACTIVE.Home;
        break;
      case 'CharacterMain':
      case 'CharacterDraw':
      case 'CharacterAuction':
        newIcons.CharacterMain = ICONS_ACTIVE.CharacterMain;
        break;
      case 'StudyList':
      case 'GroupList':
        newIcons.StudyList = ICONS_ACTIVE.StudyList;
        break;
      default:
        break;
    }
    setCurrentIcons(newIcons);
  }, [route.name]);

  const navigateTo = (screenName) => navigation.navigate(screenName);

  // iOS는 살짝 띄워주고 싶다면: 화면 높이 기준 1.5%
  const extraPad = Platform.OS === 'ios' ? toDP('1.5%', 'height') : 0;

  return (
      <View style={[styles.container, { paddingBottom: extraPad, height: TAB_H + extraPad }]}>
        <ButtonIconText
            onPress={() => navigateTo('Home')}
            icon={currentIcons.Home}
            text="HOME"
            type="caption"
            style={styles.btn}
            iconStyle={{ flex: 2, margin: 5 }}
            textStyle={styles.titleStyle}
        />
        <ButtonIconText
            onPress={() => navigateTo('CharacterMain')}
            icon={currentIcons.CharacterMain}
            text="PET"
            type="caption"
            style={styles.btn}
            iconStyle={{ flex: 2, margin: 5 }}
            textStyle={styles.titleStyle}
        />
        <ButtonIconText
            onPress={() => navigateTo('StudyList')}
            icon={currentIcons.StudyList}
            text="STUDY"
            type="caption"
            style={styles.btn}
            iconStyle={{ flex: 2, margin: 5 }}
            textStyle={styles.titleStyle}
        />
        <ButtonIconText
            onPress={onOpenMenu}
            icon={currentIcons.Menu}
            text="MENU"
            type="caption"
            style={styles.btn}
            iconStyle={{ flex: 2, margin: 5 }}
            textStyle={styles.titleStyle}
        />
      </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',  // ⬅️ absoluteFillObject 제거
    left: 0,
    right: 0,
    bottom: 0,            // ⬅️ top 사용하지 않음
    backgroundColor: '#91B7AB',
    flexDirection: 'row',
    // width: '100%',      // left/right 있으면 불필요
    // height: 50,         // 런타임에서 height 계산해 넣기
    zIndex: 10,
    elevation: 8,         // Android 그림자
    // borderTopWidth: 1, borderColor: '#00000010', // 필요시
  },
  btn: {
    flex: 1,
    // height: '100%'     // 컨테이너가 명확한 height를 가지므로 OK
    padding: 2,
    flexDirection: 'column',
  },
  titleStyle: {
    fontSize: 10,
    color: '#C0D6C8',
  },
});
