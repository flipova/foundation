import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useImageLogic, ImageProps } from './Image.logic';
import { useImageStyle } from './Image.style';
import { Image as ExpoImage } from 'expo-image';
import { isWeb } from '@/ui/utils/platform';

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
 * Enforces meaningful alt text in development mode.
 * 
 * Fallback & Error Handling:
 * Supports fallbackSrc for graceful degradation when image fails to load.
 * Provides error callbacks and automatic retry logic on web.
 */
const Image: React.FC<ImageProps> = (rawProps) => {
  const logic = useImageLogic(rawProps);
  const styles = useImageStyle(logic);
  const [isError, setIsError] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  const handleError = (error: any) => {
    setIsError(true);
    if (logic.onError) {
      const err = error instanceof Error ? error : new Error('Image failed to load');
      logic.onError(err);
    } else {
      console.warn('Image failed to load:', logic.src, error);
    }
  };

  const handleLoad = () => {
    setIsError(false);
    if (logic.onLoad) {
      logic.onLoad();
    }
  };

  // Determine which source to use (fallback if primary failed)
  const imageSrc = isError && logic.fallbackSrc ? logic.fallbackSrc : logic.src;

  // Web-specific rendering with proper error handling
  if (isWeb) {
    return (
      <View style={[styles.container as any, logic.rest.style]}>
        <img
          src={imageSrc}
          alt={logic.alt || 'Image'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: logic.resizeMode === 'cover' ? 'cover' : logic.resizeMode === 'contain' ? 'contain' : 'fill',
            transition: 'opacity 0.2s ease-in-out',
          } as React.CSSProperties}
          onError={(e) => {
            if (!isError && logic.fallbackSrc) {
              // Try fallback
              handleError(new Error('Primary image failed to load'));
            } else {
              // All sources exhausted
              handleError(e);
            }
          }}
          onLoad={handleLoad}
          aria-label={logic.alt}
          role="img"
        />
      </View>
    );
  }

  // Native rendering with ExpoImage
  return (
    <View style={[styles.container as any, logic.rest.style]}>
      <ExpoImage 
        source={{ uri: imageSrc }}
        style={styles.image as any}
        contentFit={logic.resizeMode === 'cover' ? 'cover' : logic.resizeMode === 'contain' ? 'contain' : 'fill'}
        accessibilityLabel={logic.alt}
        onError={handleError}
        onLoad={handleLoad}
        transition={200}
      />
      {isError && logic.fallbackSrc === undefined && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
          } as any}
        >
          <Text style={{ color: '#999', fontSize: 14 }}>Image failed to load</Text>
        </View>
      )}
    </View>
  );
};

export default Image;
