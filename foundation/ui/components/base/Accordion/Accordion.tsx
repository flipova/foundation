import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAccordionLogic, AccordionProps } from './Accordion.logic';
import { useAccordionStyle } from './Accordion.style';
import { ChevronDown } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition 
} from 'react-native-reanimated';

/**
 * `Accordion` is a vertically collapsing content panel that can show or hide its children.
 * 
 * **Role:**
 * Allows users to toggle the visibility of sections of content, useful for reducing visual
 * clutter in settings menus, FAQs, or detailed forms.
 * 
 * **Use cases:**
 * - FAQ lists where answers are hidden until expanded.
 * - Collapsible navigation menus.
 * - Grouping optional advanced settings.
 * 
 * **Structure:**
 * Uses `react-native-reanimated` for smooth layout transitions and icon rotation.
 * Consists of a pressable header and an optionally rendered body.
 * 
 * **Accessibility:**
 * The header acts as a button (`accessibilityRole="button"`) and explicitly communicates
 * its expanded state (`accessibilityState={{ expanded: logic.isOpen }}`). 
 */
const Accordion: React.FC<AccordionProps> = (rawProps) => {
  const logic = useAccordionLogic(rawProps);
  const styles = useAccordionStyle(logic);
  
  const rotation = useSharedValue(logic.isOpen ? 180 : 0);

  useEffect(() => {
    rotation.value = withTiming(logic.isOpen ? 180 : 0, {
      duration: 250,
      easing: Easing.inOut(Easing.quad),
    });
  }, [logic.isOpen, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View 
      style={[styles.container as any, rawProps.style]} 
      layout={LinearTransition.springify().damping(15).stiffness(150)}
    >
      <Pressable
        style={styles.headerNative as any}
        onPress={logic.handleToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: logic.isOpen }}
        accessibilityLabel={logic.title}
      >
        <Text style={styles.title as any}>{logic.title}</Text>
        <Animated.View style={animatedIconStyle}>
          <ChevronDown size={20} color={styles.icon.color as string} />
        </Animated.View>
      </Pressable>
      
      {logic.isOpen && (
        <Animated.View 
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(250)}
          style={styles.content as any}
        >
          {logic.children}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default React.memo(Accordion);
