import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useAvatarPickerLogic, AvatarPickerProps } from './AvatarPicker.logic';
import { useAvatarPickerStyle } from './AvatarPicker.style';

/**
 * @component AvatarPicker
 * @description A robust and beautiful avatar picker component. 
 * Supports predefined avatars and an intuitive image selection and cropping interface using expo-image-picker.
 * 
 * @example
 * <AvatarPicker 
 *   value={selectedUri} 
 *   onChange={(uri) => setSelectedUri(uri)} 
 * />
 */
const AvatarPicker: React.FC<AvatarPickerProps> = (rawProps) => {
  const logic = useAvatarPickerLogic(rawProps);
  const styles = useAvatarPickerStyle(logic);

  return (
    <View style={[styles.container, logic.rest.style]} {...logic.rest}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile Picture</Text>
        <Pressable 
          onPress={logic.pickImage} 
          style={({ pressed }) => [
            styles.uploadBtn,
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Text style={styles.uploadBtnText}>Upload</Text>
        </Pressable>
      </View>
      
      <View style={styles.previewContainer}>
        {logic.value ? (
          <Image source={{ uri: logic.value }} style={styles.mainAvatar as any} />
        ) : (
          <View style={styles.mainAvatarPlaceholder}>
            <Text style={styles.placeholderText}>No Avatar</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.sectionTitle}>Or choose a default</Text>
      <View style={styles.grid}>
        {logic.defaultAvatars.map((uri: string) => (
          <Pressable 
            key={uri} 
            onPress={() => logic.selectAvatar(uri)} 
            style={({ pressed }) => [
              styles.avatarBtn, 
              logic.value === uri && styles.avatarBtnSelected,
              { transform: [{ scale: pressed ? 0.95 : 1 }] }
            ]}
          >
            <Image source={{ uri }} style={styles.avatarImg as any} />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default AvatarPicker;
