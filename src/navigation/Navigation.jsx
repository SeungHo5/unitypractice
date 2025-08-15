import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '@pages/Home';
import Index from '@pages/Index';
import SignupMain from '@pages/signup/SignupMain';
import KakaoLogin from '@pages/signup/KakaoLogin'
import SignupEmail from '@pages/signup/SignupEmail';
import SignupInfo from '@pages/signup/SignupInfo';
import SignupSuccess from '@pages/signup/SignupSuccess';
import CharacterMain from '@pages/character/CharacterMain';
import CharacterDraw from '@pages/character/CharacterDraw';
import CharacterAuction from '@pages/character/CharacterAuction';
import Challenge from '@pages/challenge/Challenge';
import StudyListPage from '@pages/study/StudyListPage';
import Friends from '@pages/friends/Friends';
import Chat from '@pages/chat/Chat';
import GroupListPage from '@pages/group/GroupListPage';
import GroupPage from '@pages/group/GroupPage';
import AlignPreview from "@pages/study/AlignPreview";
import UnityBearController from "../pages/study/UnityBearController";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Index"
        screenOptions={{
          headerShown: false,
          animation: 'none'
        }}
      >
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SignupMain" component={SignupMain} />
        <Stack.Screen name="KakaoLogin" component={KakaoLogin} />
        <Stack.Screen name="SignupEmail" component={SignupEmail} />
        <Stack.Screen name="SignupInfo" component={SignupInfo} />
        <Stack.Screen name="SignupSuccess" component={SignupSuccess} />
        <Stack.Screen name="CharacterMain" component={CharacterMain} />
        <Stack.Screen name="CharacterDraw" component={CharacterDraw} />
        <Stack.Screen name="CharacterAuction" component={CharacterAuction} />
        <Stack.Screen name="Challenge" component={Challenge} />
        <Stack.Screen name="StudyList" component={StudyListPage} />
        <Stack.Screen name="Friends" component={Friends} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="GroupList" component={GroupListPage} />
        <Stack.Screen name="GroupPage" component={GroupPage} />
          <Stack.Screen name="AlignPreview" component={AlignPreview} />
          <Stack.Screen name="UnityBearController" component={UnityBearController} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
