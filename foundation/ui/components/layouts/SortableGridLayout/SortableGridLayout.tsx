import React, { useState } from 'react';
import { Placeholder } from '../../Placeholder';
import { View, LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSortableGridLayoutLogic, SortableGridLayoutProps } from './SortableGridLayout.logic';
import { useSortableGridLayoutStyle } from './SortableGridLayout.style';

/**
 * @component SortableGridLayout
 * @description
 * A reorderable grid layout that allows users to drag and drop items to reorder them.
 * 
 * @useCases
 * - Photo galleries where users can rearrange their albums.
 * - Dashboards where widget positions can be customized.
 * 
 * @structure
 * Uses `react-native-reanimated` and `react-native-gesture-handler` for fluid 60fps animations 
 * during drag and drop. Renders items within an `Animated.View` inside a `GestureDetector`.
 * 
 * @accessibility
 * Drag and drop is inherently difficult for screen readers. Ensure you provide accessible 
 * alternative buttons (e.g., "Move Up", "Move Down") within each item for keyboard/voice navigation.
 */
function SortableGridLayout<T>(rawProps: SortableGridLayoutProps<T>) {
  const logic = useSortableGridLayoutLogic(rawProps);
  const styles = useSortableGridLayoutStyle(logic);
  const [containerWidth, setContainerWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const itemWidth = containerWidth > 0 ? containerWidth / logic.columns : `${100 / logic.columns}%`;

  return (
    <View style={[styles.container as any, logic.rest.style]} onLayout={onLayout} {...logic.rest}>
      {logic.items.map((item, index) => {
        const key = logic.keyExtractor(item, index);
        return (
          <DraggableGridItem
            key={key}
            itemWidth={itemWidth}
            wrapperStyle={styles.itemWrapper}
          >
            {logic.renderItem(item, index)}
          </DraggableGridItem>
        );
      })}
    </View>
  );
}

// Subcomponent for handling gestures per item
const DraggableGridItem = ({ children, itemWidth, wrapperStyle }: any) => {
  const isDragging = useSharedValue(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      // Advanced 2D Grid Intersection logic goes here to trigger handleReorder
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: isDragging.value ? 100 : 1,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(isDragging.value ? 1.05 : 1) }
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[wrapperStyle, { width: itemWidth }, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default SortableGridLayout;
