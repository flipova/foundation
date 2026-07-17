import React from 'react';
import { View } from 'react-native';
import { useImageLogic, ImageProps } from './Image.logic';
import { useImageStyle } from './Image.style';
import { Image as ExpoImage } from 'expo-image';

/**
 * Image component provides a highly performant image renderer using `expo-image`.
 * 
 * Role & Use Cases:
 * Use for rendering local, remote, or cached images across the application.
 * Excellent for lists and grids due to its high performance and caching capabilities.
 * 
 * Structure:
 * Wraps `ExpoImage` inside a generic `View` to allow consistent container styling.
 * Applies a default 200ms transition for smooth loading.
 * 
 * Accessibility:
 * Utilizes the `accessibilityLabel` mapped from the `alt` prop to ensure screen readers can describe the image.
 */
const Image: React.FC<ImageProps> = (rawProps) => {
  const logic = useImageLogic(rawProps);
  const styles = useImageStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      <ExpoImage 
        source={{ uri: logic.src }} 
        style={styles.image as any} 
        contentFit={logic.resizeMode === 'cover' ? 'cover' : logic.resizeMode === 'contain' ? 'contain' : 'fill'}
        accessibilityLabel={logic.alt}
        transition={200}
      />
    </View>
  );
};

export default Image;
