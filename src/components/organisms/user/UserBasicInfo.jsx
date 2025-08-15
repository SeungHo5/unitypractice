import { StyleSheet, View } from 'react-native';
import Text from '@atoms/text/Text';
import Icon from '@atoms/image/Icon';
import Button from '@atoms/button/Button';
import { getCharacterImage } from '@utils/imageMapping';

const UserBasicInfo = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileImgContainer}>
        <View style={styles.profileImgBackground}>
          <Icon
            style={styles.profileImg}
            icon={getCharacterImage(props.user?.selectedCharacterId)}
          />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Button title="이름" type="caption" center disabled style={styles.infoTitle}/>
        <Text style={styles.name} type="caption">{props.user?.nickname}</Text>
        <View style={styles.rankContainer}>
          <Button title="순위" type="caption" center disabled style={styles.infoTitle}/>
          <Text type="caption">{props.user?.rank ? props.user.rank+'위': '없음'}</Text>
        </View>
        <View>
          <View style={styles.rankContainer}>
            <Button title="레벨" type="caption" center disabled style={styles.infoTitle}/>
            <Text type="caption">Lv {props.user?.currentLevel}</Text>
          </View>
          </View>
            <Text type="caption">그래프</Text>
            <Text type="caption" style={{textAlign: 'center'}}>{props.user?.levelProgress} / {props.user?.expToNextLevel}</Text>
          <View>
        </View>
      </View>
    </View>
  );
};
export default UserBasicInfo;

const styles = StyleSheet.create({
  container:{
    flex: 45,
    flexDirection: 'row',
  },
  profileImgContainer:{
    width: '45%',
    height: '100%',
    paddingLeft: 20,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImgBackground:{
    // 컴포넌트 크기 계산해서 width, height 설정하게 변경
    width: '100%',
    aspectRatio: 1, // 정사각형
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 500,
    borderColor: '#E6E6E6',
    borderWidth: 2
  },
  profileImg:{
    width: '100%',
    height: '100%'
  },
  infoContainer:{
    flex: 1,  // 나머지 크기
    justifyContent: 'center',
    marginBottom: 8,
    marginRight:8
  },
  infoTitle:{
    paddingVertical: 3,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  name:{
    width: '80%',
    backgroundColor: '#D9D9D9',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  rankContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginRight:15,
  }
});