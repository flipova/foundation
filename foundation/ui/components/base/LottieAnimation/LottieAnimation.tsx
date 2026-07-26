import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { useLottieAnimationLogic, LottieAnimationProps } from './LottieAnimation.logic';
import { useLottieAnimationStyle } from './LottieAnimation.style';
import { isWeb } from '@/ui/utils/platform';

// Only import lottie-react-native on non-web platforms
let LottieView: any = null;

if (!isWeb) {
  try {
    LottieView = require('lottie-react-native').default;
  } catch (e) {
    // lottie-react-native not available
  }
}

/**
 * LottieAnimation component renders high-quality vector animations.
 * 
 * Role & Use Cases:
 * Ideal for onboarding screens, success states, or complex loading indicators.
 * 
 * Structure:
 * - Native: Wraps `lottie-react-native` for efficient native animation rendering.
 * - Web: Uses `lottie-web` library or Canvas API for animation playback.
 * 
 * @note
 * For web implementations, developers should:
 * 1. Install lottie-web: npm install lottie-web
 * 2. Initialize the animation in the container element
 * 
 * Accessibility:
 * As animations are primarily visual, consider providing a textual description nearby or adding `accessibilityLabel`
 * to the container for screen readers if the animation conveys critical information.
 */
const LottieAnimation: React.FC<LottieAnimationProps> = (rawProps) => {
  const logic = useLottieAnimationLogic(rawProps);
  const styles = useLottieAnimationStyle(logic);
  const webContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize lottie-web animation on web platform
  useEffect(() => {
    if (!isWeb || !webContainerRef.current || !logic.source) return;

    let lottie: any;
    
    // Attempt to load lottie-web
    try {
      // This will fail if lottie-web is not installed, which is expected
      // Developers should handle this in their build configuration
      lottie = require('lottie-web');
      
      const sourceUri = typeof logic.source === 'string' 
        ? logic.source 
        : logic.source?.uri || logic.source?.path;

      if (!sourceUri) return;

      // Load animation
      const animation = lottie.loadAnimation({
        container: webContainerRef.current,
        renderer: 'canvas', // or 'svg' for better quality but slower
        loop: logic.loop ?? true,
        autoplay: logic.autoPlay ?? true,
        path: sourceUri,
      });

      return () => {
        animation.destroy();
      };
    } catch (error) {
      console.warn(
        'LottieAnimation: lottie-web not installed. Install with: npm install lottie-web'
      );
    }
  }, [logic.source, logic.loop, logic.autoPlay]);

  // Native rendering
  if (!isWeb) {
    return (
      <View style={[styles.container as any, logic.rest.style]}>
        {logic.source && LottieView ? (
          <LottieView
            source={typeof logic.source === 'string' ? { uri: logic.source } : logic.source}
            autoPlay={logic.autoPlay}
            loop={logic.loop}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Animation not available</Text>
          </View>
        )}
      </View>
    );
  }

  // Web rendering - container for lottie-web
  return (
    <View
      style={[styles.container as any, logic.rest.style]}
      ref={webContainerRef as any}
    />
  );
};

export default LottieAnimation;
