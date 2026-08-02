import React, { useEffect } from 'react';
import { Placeholder } from '../../Placeholder';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { useTutoLayoutLogic, TutoLayoutProps } from './TutoLayout.logic';
import { useTutoLayoutStyle } from './TutoLayout.style';
import { TutoContext } from './TutoContext';
import { TutoAnimations } from './TutoAnimations';

/**
 * @component TutoLayout
 * @description 
 * An advanced "Tour Guide" layout engine designed for onboarding flows.
 * It acts as an absolute wrapper and uses `TutoContext` to track the bounding boxes
 * of children components wrapped in `TutoElement`.
 * Supports highlighting, tooltips, and gesture animations (swipe/tap).
 */
const TutoLayout: React.FC<TutoLayoutProps> = (rawProps) => {
  const logic = useTutoLayoutLogic(rawProps);
  const styles = useTutoLayoutStyle(logic);

  // Animated properties for the highlight frame
  const animX = useSharedValue(0);
  const animY = useSharedValue(0);
  const animW = useSharedValue(0);
  const animH = useSharedValue(0);
  const animOpacity = useSharedValue(0);

  useEffect(() => {
    if (logic.isActive && logic.targetLayout) {
      animOpacity.value = withTiming(1, { duration: 300 });
      animX.value = withSpring(logic.targetLayout.x, { damping: 15 });
      animY.value = withSpring(logic.targetLayout.y, { damping: 15 });
      animW.value = withSpring(logic.targetLayout.width, { damping: 15 });
      animH.value = withSpring(logic.targetLayout.height, { damping: 15 });
    } else {
      animOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [logic.isActive, logic.targetLayout, animOpacity, animX, animY, animW, animH]);

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: animOpacity.value,
    left: animX.value,
    top: animY.value,
    width: animW.value,
    height: animH.value,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    backgroundColor: 'rgba(74, 144, 226, 0.2)', // Light highlight tint
    zIndex: 9999,
  }));

  const tooltipStyle = useAnimatedStyle(() => {
    // Position tooltip below or above the highlight
    // Simple heuristic: put below, unless it's too low
    const topPosition = animY.value + animH.value + 12;
    return {
      opacity: animOpacity.value,
      position: 'absolute',
      left: Math.max(12, animX.value), // Don't go off left edge
      top: topPosition,
      zIndex: 10000,
    };
  });

  return (
    <TutoContext.Provider value={logic.contextValue}>
      <View ref={logic.rootRef} style={[styles.container as any, logic.rest.style]} {...logic.rest}>
        {logic.children || <Placeholder label="children" />}

        {/* Tutorial Overlay */}
        <View style={[StyleSheet.absoluteFill, { zIndex: 9998 }]} pointerEvents="box-none">
            {/* Darkened backdrop except highlight area (simulated by border here, or just a solid highlight) */}
            <Animated.View style={highlightStyle} pointerEvents="none">
               {/* Gesture Animations */}
               {logic.currentStep?.animation && (
                 <TutoAnimations type={logic.currentStep.animation} />
               )}
            </Animated.View>
            
            {/* Tooltip & Controls */}
            {logic.targetLayout && (
              <Animated.View style={[styles.tooltipContainer as any, tooltipStyle]} pointerEvents="box-none">
                <View style={styles.tooltipCard as any}>
                  {!!logic.currentStep?.title && (
                    <Text style={styles.tooltipTitle as any}>{logic.currentStep.title}</Text>
                  )}
                  {!!logic.currentStep?.description && (
                    <Text style={styles.tooltipDesc as any}>{logic.currentStep.description}</Text>
                  )}
                  <View style={styles.tooltipActions as any}>
                    {logic.currentStepIndex > 0 && (
                      <Pressable onPress={logic.prevStep} style={styles.tooltipBtn as any}>
                        <Text style={styles.tooltipBtnText as any}>Back</Text>
                      </Pressable>
                    )}
                    <Pressable onPress={logic.nextStep} style={[styles.tooltipBtn as any, styles.tooltipBtnPrimary as any]}>
                      <Text style={[styles.tooltipBtnText as any, { color: 'white' }]}>
                        {logic.currentStepIndex === logic.steps.length - 1 ? 'Finish' : 'Next'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>
      </View>
    </TutoContext.Provider>
  );
};

export default TutoLayout;
