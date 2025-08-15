import { StyleSheet, View } from 'react-native';
import Modal from '@templates/Modal';
import Text from '@atoms/text/Text';
import Button from '@atoms/button/Button';
import { useNavigation } from '@react-navigation/native';
import Loading from '@organisms/common/Loading';
import { getLoadingState } from '@services/studyAPI';

const StudyInfo = ({ study, members = [], onPress, ...modalProps }) => {
  const navigation = useNavigation();

  const enterRoom = () => {
    const roomId = study?.roomId;
    console.log('스터디 방 입장:', roomId);
    if (!roomId) {
      console.warn('roomId가 없습니다');
      return;
    }
    // FaceMesh 준비 화면으로 이동
    navigation.navigate('AlignPreview', { roomId });
  };

  return (
      <Modal
          {...modalProps}              // (Modal에 넘길 기타 prop들만 전달)
          // onClose={onPress}          // Modal이 onClose를 기대한다면 주석 해제해서 이렇게 넘기세요
          title="Room Info"
          overlayStyle={{ paddingVertical: 130 }}
      >
        {getLoadingState('getStudyRoomMembers') ? (
            <Loading style={{ height: '80%', marginTop: 20 }} />
        ) : (
            <>
              <View style={styles.container}>
                <View style={styles.basicInfoContainer}>
                  <View style={styles.nameContainer}>
                    <Text type="subtitle" style={styles.infoTitle}>Name</Text>
                    <View style={styles.nameTextContainer}>
                      <Text>{study?.name ?? '-'}</Text>
                    </View>
                  </View>

                  <View style={styles.membersContainer}>
                    <Text type="subtitle" style={styles.infoTitle}>Members</Text>
                    <View style={styles.membersTextContainer}>
                      <Text>
                        {Array.isArray(members) && members.length > 0
                            ? members.join(', ')
                            : '멤버가 없습니다'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.lineContainer}>
                  <View style={styles.line} />
                </View>

                <View style={styles.detailInfoContainer} />

                <View style={styles.bottomContainer}>
                  <Button title="입장하기" style={styles.bottomBtn} onPress={enterRoom} />
                </View>
              </View>
            </>
        )}
      </Modal>
  );
};

export default StudyInfo;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 0 },
  basicInfoContainer: { flex: 45, justifyContent: 'flex-end', marginBottom: 10 },
  infoTitle: { color: '#91B7AB' },
  nameContainer: { height: '30%', marginBottom: 5 },
  nameTextContainer: {
    backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#C0D6C8',
    paddingVertical: 5, paddingHorizontal: 15,
  },
  membersContainer: { height: '50%', marginBottom: 5 },
  membersTextContainer: {
    flex: 1, backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#C0D6C8',
    paddingVertical: 5, paddingHorizontal: 15,
  },
  detailInfoContainer: { flex: 50 },
  bottomContainer: { alignItems: 'center', justifyContent: 'center' },
  bottomBtn: { borderRadius: 50, paddingVertical: 8 },
  lineContainer: { flex: 5, justifyContent: 'center' },
  line: { width: '100%', borderColor: '#91B7AB', borderBottomWidth: 1 },
});
