import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import ButtonIcon from '@atoms/button/ButtonIcon';
import BackgroundLayout from '@atoms/image/BackgroundLayout';
import DrawContent from '@molecules/character/DrawContent';
import ActionSection from '@molecules/character/ActionSection';


const CenterBox = ({
  drawState,
  revealedItems,
  isAnimating,
  singleDrawCost,
  multiDrawCost,
  onDrawPress,
  onClose,
  disabled = false,
  drawingCount,
  type,
}) => {
  
  const [contentHeight, setContentHeight] = useState(0);

  return (

    <BackgroundLayout resizeMode="stretch" backgroundImage={require('@assets/centerboxbackground.png')} style={{width:'100%',height:'100%'}}>
      <View style={styles.container}>

        {/* 오버레이 (revealed일 때만 표시) */}
        {drawState === 'revealed' && (
          <View style={styles.overlay} pointerEvents="none" />
        )}

        {/* X 버튼 */}
        {drawState !== 'revealed' && (
          <ButtonIcon
            icon={require('@assets/close.png')}
            size={{ width: 35, height: 35 }}
            onPress={onClose}
            style={styles.closeButton}
          />
        )}
        
        {/* 메인 콘텐츠 영역 */}
        <View 
          style={styles.contentArea}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
        >
          <DrawContent
            drawState={drawState}
            revealedItems={revealedItems}
            isAnimating={isAnimating}
            contentHeight={contentHeight}
            type={type}
          />
        </View>

        {/* 액션 버튼 (하단 고정) */}
        {drawState !== 'revealed' && (
          <View style={styles.actionArea}>
            <ActionSection
              drawState={drawState}
              singleDrawCost={singleDrawCost}
              multiDrawCost={multiDrawCost}
              onDrawPress={onDrawPress}
              disabled={disabled}
              drawingCount={drawingCount}
            />
          </View>
        )}
      </View>
    </BackgroundLayout>
  );
};
export default CenterBox;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 0,
    borderRadius: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 20,
    borderRadius: 12,
    padding: 4,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionArea: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
