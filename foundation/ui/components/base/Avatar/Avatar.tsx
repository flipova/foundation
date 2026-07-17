import React from 'react';
import { View, Text, Image } from 'react-native';
import { useAvatarLogic, AvatarProps } from './Avatar.logic';
import { useAvatarStyle } from './Avatar.style';

/**
 * `Avatar` is a component used to visually represent a user or entity.
 * 
 * **Role:**
 * Displays a profile picture, or falls back to displaying initials if the 
 * image source is not provided or fails to load.
 * 
 * **Use cases:**
 * - User profiles and settings pages.
 * - Lists of users (e.g., chat contacts, list of authors).
 * - Identifying the current logged-in user in an app bar.
 * 
 * **Structure:**
 * A container `View` that clips its children to a perfect circle. It renders
 * an `Image` if a `src` is provided, otherwise it renders a `Text` component
 * containing derived or explicitly provided initials.
 * 
 * **Accessibility:**
 * If an image is provided, the `alt` text is passed as an `accessibilityLabel`
 * to ensure screen readers can announce the image content. If initials are used,
 * they are read by default, but consider wrapping the Avatar in an accessible
 * element if it conveys interactive meaning.
 */
const Avatar: React.FC<AvatarProps> = (rawProps) => {
  const logic = useAvatarLogic(rawProps);
  const styles = useAvatarStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      {logic.src ? (
        <Image source={{ uri: logic.src }} style={styles.image as any} accessibilityLabel={logic.alt} />
      ) : (
        <Text style={styles.initials as any}>{logic.initials}</Text>
      )}
    </View>
  );
};

export default React.memo(Avatar);
