import { StyleSheet, View } from 'react-native';
import Icon from "@atoms/image/Icon";
import ButtonIcon from "@atoms/button/ButtonIcon";
import Text from '@atoms/text/Text';
import { Controller, useFormContext } from 'react-hook-form';

const GroupCreateModalSetting = (props) => {
  const { control } = useFormContext();
  return (
    <View style={styles.settingContainer}>
      <View style={styles.settingInnerContainer}>
        <Controller
            control={control}
            name={"isPublic"}
            defaultValue={false}
            render={({ field: { value, onChange } }) => (
              <>
                <View style={styles.settingIconContainer}>
                  { value
                  ? <ButtonIcon
                    onPress={() => onChange(false)}
                    style={styles.settingIcon}
                    icon={require('@assets/img/study/locked.png')}
                    activeOpacity={0.8}
                    />
                  : <ButtonIcon
                    onPress={() => onChange(true)}
                    style={styles.settingIcon}
                    icon={require('@assets/img/study/unlocked.png')}
                    activeOpacity={0.8}
                  />}
                </View>
                <View style={styles.settingValue}>
                  <Text style={{color:'#91B7AB'}} type="title">{value ? "LOCKED" : "UNLOCKED"}</Text>
                </View>
              </>
            )}
          />
      </View>
      <View style={styles.settingInnerContainer}>
        <View style={styles.settingIconContainer}>
          <Icon style={styles.settingIcon} icon={require('@assets/img/study/maxMembers.png')}/>
        </View>
        <View style={styles.settingValue}>
          <Controller
            control={control}
            name={"maxMembers"}
            defaultValue={4}
            render={({ field: { value, onChange } }) => (
              <View style={styles.maxMembersBtnContainer}>
                <ButtonIcon 
                  style={styles.maxMembersBtn} 
                  icon={require('@assets/img/study/minus.png')}
                  onPress={() => onChange(Math.max(1, value - 1))}
                />
                <Text style={{color:'#91B7AB'}}>{typeof value === 'number' ? value : 4}</Text>
                <ButtonIcon 
                  style={styles.maxMembersBtn} 
                  icon={require('@assets/img/study/plus.png')}
                  onPress={() => onChange(Math.min(20, value + 1))}
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};
export default GroupCreateModalSetting;

const styles = StyleSheet.create({
  settingContainer:{
    width: '100%',
    flex:45,
    flexDirection: 'row'
  },
  settingInnerContainer:{
    width: '100%',
    flex: 1,
    paddingHorizontal: 10,
    marginRight: 10,
      marginBottom: 10,
  },
  settingIconContainer:{
    flex: 1,
    alignItems:'flex-end',
    flexDirection: 'row',
  },
  settingIcon:{
    width: '100%',
    aspectRatio: 1
  },
  settingValue:{
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxMembersBtnContainer:{
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#91B7AB',
    borderRadius: 50
  },
  maxMembersBtn:{
    height: '70%'
  },
});