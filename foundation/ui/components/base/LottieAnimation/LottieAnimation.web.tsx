import React from 'react';
import { useLottieAnimationLogic, LottieAnimationProps } from './LottieAnimation.logic';
import { useLottieAnimationStyle } from './LottieAnimation.style';
// Using lottie-react for web
import Lottie from 'lottie-react';

/**
 * Role: Renders a JSON-based Lottie vector animation.
 * UseCases: Used for engaging, high-quality, lightweight animations like loading states, success markers, or onboarding visuals.
 * Structure: Wraps the `lottie-react` player in a container, automatically handling loop and autoplay configurations.
 * Accessibility: Animations can cause issues for some users. Ensure the animation does not flash heavily and can ideally be paused or described via ARIA labels if it conveys important meaning.
 */
const LottieAnimation: React.FC<LottieAnimationProps> = (rawProps) => {
  const logic = useLottieAnimationLogic(rawProps);
  const styles = useLottieAnimationStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.source && (
        <Lottie 
          animationData={logic.source} 
          loop={logic.loop} 
          autoplay={logic.autoPlay} 
          style={{ width: '100%', height: '100%' }} 
        />
      )}
    </div>
  );
};

export default LottieAnimation;
