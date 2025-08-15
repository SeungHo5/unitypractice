import React, { useState } from 'react';
import { ScrollView, StyleSheet, Dimensions} from 'react-native';
import BackgroundLayout from '@atoms/image/BackgroundLayout';
import TabBar from '@organisms/TabBar';
import SideBar from '@organisms/common/SideBar';


const { width } = Dimensions.get('window');

const MainLayout = ({ children, style }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  return (
    <>
      <BackgroundLayout>
        <ScrollView style={{width: '100%'}} contentContainerStyle={[{paddingBottom: 60}, style]}>
          {children}
        </ScrollView >
        <TabBar onOpenMenu={() => setSidebarVisible(true)} />
      </BackgroundLayout>

      <SideBar visible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
    </>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
 
});
