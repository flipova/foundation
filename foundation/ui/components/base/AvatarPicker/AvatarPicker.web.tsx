import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useAvatarPickerLogic, AvatarPickerProps } from './AvatarPicker.logic';
import { useAvatarPickerStyle } from './AvatarPicker.style';

/**
 * @component AvatarPicker (Web)
 * @description Web version of the robust avatar picker.
 */
const AvatarPickerWeb: React.FC<AvatarPickerProps> = (rawProps) => {
  const logic = useAvatarPickerLogic(rawProps);
  const styles = useAvatarPickerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <View style={styles.header as any}>
        <Text style={styles.title as any}>Choose Avatar</Text>
        <Pressable onPress={logic.pickImage} style={styles.uploadBtn as any}>
          <Text style={styles.uploadBtnText as any}>Upload Photo</Text>
        </Pressable>
      </View>
      
      <View style={styles.grid as any}>
        {logic.defaultAvatars.map((uri: string) => (
          <Pressable 
            key={uri} 
            onPress={() => logic.selectAvatar(uri)} 
            style={[styles.avatarBtn as any, logic.value === uri && styles.avatarBtnSelected]}
          >
            <Image source={{ uri }} style={styles.avatarImg as any} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default AvatarPickerWeb;
