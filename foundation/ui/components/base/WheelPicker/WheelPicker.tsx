import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useAnimatedRef
} from 'react-native-reanimated';
import { useWheelPickerLogic, WheelPickerProps, WheelPickerItem } from './WheelPicker.logic';
import { useWheelPickerStyle } from './WheelPicker.style';

/**
 * Animated wheel item that calculates its 3D rotation based on the scroll position.
 */
const AnimatedWheelItem = ({ 
  item, 
  index, 
  scrollY, 
  itemHeight, 
  styles 
}: { 
  item: WheelPickerItem;
  index: number;
  scrollY: Animated.SharedValue<number>;
  itemHeight: number;
  styles: any;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = scrollY.value - index * itemHeight;
    
    const rotateX = interpolate(
      distance,
      [-itemHeight * 2, 0, itemHeight * 2],
      [-50, 0, 50],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      distance,
      [-itemHeight * 2, 0, itemHeight * 2],
      [0.85, 1, 0.85],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      distance,
      [-itemHeight * 2, 0, itemHeight * 2],
      [0.3, 1, 0.3],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      distance,
      [-itemHeight * 2, 0, itemHeight * 2],
      [itemHeight * 0.4, 0, -itemHeight * 0.4],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { perspective: 500 },
        { translateY },
        { rotateX: `${rotateX}deg` },
        { scale }
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Text style={styles.itemText} numberOfLines={1}>{item.label}</Text>
    </Animated.View>
  );
};

/**
 * @component WheelPicker
 * @description A fully robust 3D scrollable barrel wheel picker with submenu support.
 */
const WheelPicker: React.FC<WheelPickerProps> = (rawProps) => {
  const logic = useWheelPickerLogic(rawProps);
  const styles = useWheelPickerStyle(logic);
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(logic.selectedIndex * logic.itemHeight);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useEffect(() => {
    if (animatedRef.current && logic.selectedIndex >= 0) {
      setTimeout(() => {
        if (animatedRef.current && 'scrollTo' in animatedRef.current) {
          (animatedRef.current as any).scrollTo({ 
            y: logic.selectedIndex * logic.itemHeight, 
            animated: true 
          });
        }
      }, 50);
    }
  }, [logic.selectedIndex, logic.itemHeight]);

  return (
    <View style={[styles.container, logic.rest.style]} {...logic.rest}>
      <View style={styles.activeHighlight} />
      
      <Animated.ScrollView
        ref={animatedRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={logic.itemHeight}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={logic.handleScrollEnd}
        contentContainerStyle={{
          paddingVertical: logic.itemHeight * 2
        }}
      >
        {logic.wheelItems.map((item: WheelPickerItem, idx: number) => (
          <AnimatedWheelItem
            key={`${item.value}-${idx}`}
            item={item}
            index={idx}
            scrollY={scrollY}
            itemHeight={logic.itemHeight}
            styles={styles}
          />
        ))}
      </Animated.ScrollView>

      <Modal
        visible={logic.isSubmenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => logic.setIsSubmenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Option</Text>
            </View>
            <Animated.ScrollView bounces={false}>
              {logic.allItems.map((item: WheelPickerItem, idx: number) => (
                <Pressable
                  key={`${item.value}-${idx}`}
                  style={({ pressed }) => [
                    styles.submenuItem,
                    logic.value === item.value && styles.submenuItemActive,
                    pressed && styles.submenuItemPressed
                  ]}
                  onPress={() => logic.selectFromSubmenu(item.value)}
                >
                  <Text 
                    style={[
                      styles.submenuItemText,
                      logic.value === item.value && styles.submenuItemTextActive
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </Animated.ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WheelPicker;
