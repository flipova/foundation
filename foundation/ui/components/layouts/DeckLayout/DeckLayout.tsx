import React, { useMemo } from 'react';
import { Placeholder } from '../../Placeholder';
import { View, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useDeckLayoutLogic, DeckLayoutProps } from './DeckLayout.logic';
import { useDeckLayoutStyle } from './DeckLayout.style';

const { width } = Dimensions.get('window');

/**
 * @component DeckLayout
 * @description
 * DeckLayout implements a Tinder-like swipable card interface. Children are rendered as 
 * stacked cards that users can drag and swipe away to reveal the next item.
 *
 * @useCases
 * - Discovery interfaces (matching apps, product discovery).
 * - Flashcards or bite-sized educational content.
 *
 * @structure
 * - Cards are stacked absolutely on top of each other in the center of the screen.
 * - Uses Reanimated and Gesture Handler to track pans and animate standard deck interactions.
 * - Z-index is dynamically assigned to keep the active card on top and scaled correctly.
 *
 * @accessibility
 * - Swiping actions should have accessible alternative buttons for users with motor impairments.
 * - The active card must clearly announce its contents. Hidden cards should ideally have `importantForAccessibility="no"`.
 */
const DeckLayout: React.FC<DeckLayoutProps> = (rawProps) => {
  const logic = useDeckLayoutLogic(rawProps);
  const styles = useDeckLayoutStyle(logic);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const nextCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > width * 0.3) {
        translateX.value = withSpring(Math.sign(event.translationX) * width * 1.5);
        runOnJS(nextCard)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${translateX.value / 15}deg` }
      ],
    };
  });

  const childrenArray = React.Children.toArray(logic.children);
  
  // Memoize visible children slicing to prevent unnecessary calculations
  const visibleChildren = useMemo(() => {
    return childrenArray.slice(currentIndex, currentIndex + 3);
  }, [childrenArray, currentIndex]);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      {visibleChildren.map((child, index) => {
        const isFirst = index === 0;
        const scale = 1 - index * 0.05;
        const top = 15 + index * 5;
        
        if (isFirst) {
          return (
            <GestureDetector gesture={pan} key={currentIndex}>
              <Animated.View style={[styles.card as any, animatedStyle, { top: `${top}%`, zIndex: 100 }]}>
                {child}
              </Animated.View>
            </GestureDetector>
          );
        }
        
        return (
          <View 
            style={[styles.card as any, { top: `${top}%`, transform: [{ scale }], zIndex: 100 - index }]} 
            key={currentIndex + index}
            importantForAccessibility="no"
          >
            {child}
          </View>
        );
      }).reverse()}
    </View>
  );
};

export default DeckLayout;
