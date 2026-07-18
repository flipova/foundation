import React from 'react';
import { View } from 'react-native';
import { useLottieAnimationLogic, LottieAnimationProps } from './LottieAnimation.logic';
import { useLottieAnimationStyle } from './LottieAnimation.style';
// Using lottie-react-native
import LottieView from 'lottie-react-native';

/**
 * LottieAnimation component renders high-quality vector animations using `lottie-react-native`.
 * 
 * Role & Use Cases:
 * Ideal for onboarding screens, success states, or complex loading indicators.
 * 
 * Structure:
 * Wraps `LottieView` inside a `View` container to control layout and sizing.
 * Ensures the animation source is correctly parsed whether it's a local require() or a remote URI string.
 * 
 * Accessibility:
 * As animations are primarily visual, consider providing a textual description nearby or adding `accessibilityLabel`
 * to the container for screen readers if the animation conveys critical information.
 */
const LottieAnimation: React.FC<LottieAnimationProps> = (rawProps) => {
  const logic = useLottieAnimationLogic(rawProps);
  const styles = useLottieAnimationStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      {logic.source && (
        <LottieView
          source={typeof logic.source === 'string' ? { uri: logic.source } : logic.source}
          autoPlay={logic.autoPlay}
          loop={logic.loop}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </View>
  );
};

export default LottieAnimation;
