/**
 * CrossTabLayout
 *
 * Drag-and-drop reorderable grid with haptic feedback.
 * Children can be rearranged by long-pressing and dragging.
 */

import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    LinearTransition,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { spacing as spacingTokens } from "../../tokens/spacing";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta, getConstants } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("CrossTabLayout")!;
const { springConfig: SPRING_CONFIG } = getConstants(META);

type SpacingKey = keyof typeof spacingTokens;

export interface CrossTabLayoutProps {
    children: React.ReactElement[];
    columns?: number;
    spacing?: SpacingKey;
    itemBackground?: string;
    itemBorderRadius?: number;
    scrollEnabled?: boolean;
    onOrderChange?: (newOrderKeys: string[]) => void;
}

const CrossTabLayout: React.FC<CrossTabLayoutProps> = (rawProps) => {
    const { theme } = useTheme();
    const {
        children, columns, spacing, itemBackground,
        itemBorderRadius, scrollEnabled, onOrderChange,
    } = applyDefaults(rawProps, META, theme) as Required<CrossTabLayoutProps>;
    const isWeb = Platform.OS === "web";
    const [containerWidth, setContainerWidth] = useState(0);
    
    const [items, setItems] = useState(() => React.Children.toArray(children));

    useEffect(() => {
        const newChildren = React.Children.toArray(children);
        
        setItems(prevItems => {
            if (newChildren.length === prevItems.length) {
                return prevItems.map(prevItem => {
                    const updatedContent = newChildren.find(
                        child => (child as any).key === (prevItem as any).key
                    );
                    return updatedContent || prevItem;
                });
            }
            return newChildren;
        });
    }, [children]);

    const gap = useMemo(() => spacingTokens[spacing as SpacingKey] ?? 0, [spacing]);
    const cellWidth = useMemo(() => (containerWidth || 300) / columns, [containerWidth, columns]);

    const handleSwap = useCallback((fromIdx: number, toIdx: number) => {
        if (toIdx < 0 || toIdx >= items.length || fromIdx === toIdx) return;
        
        const newData = [...items];
        const [movedItem] = newData.splice(fromIdx, 1);
        newData.splice(toIdx, 0, movedItem);
        
        setItems(newData);

        if (onOrderChange) {
            const keys = newData.map(item => String((item as any).key));
            runOnJS(onOrderChange)(keys);
        }

        if (!isWeb) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
    }, [items, onOrderChange]);

    const Content = (
        <Box 
            flexDirection="row" 
            flexWrap="wrap" 
            width="100%" 
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            {items.map((child, index) => (
                <DraggableCell
                    key={(child as any).key ?? `cell-${index}`}
                    index={index}
                    columns={columns}
                    cellWidth={cellWidth}
                    spacing={gap}
                    itemBackground={itemBackground}
                    itemBorderRadius={itemBorderRadius}
                    onSwap={handleSwap}
                    totalItems={items.length}
                >
                    {child}
                </DraggableCell>
            ))}
        </Box>
    );

    return (
        <GestureHandlerRootView style={styles.flex}>
            {scrollEnabled ? (
                <Scroll showsVerticalScrollIndicator={false}>
                    {Content}
                </Scroll>
            ) : (
                Content
            )}
        </GestureHandlerRootView>
    );
};

const DraggableCell = ({ 
    children, index, columns, spacing, 
    cellWidth, itemBackground, itemBorderRadius, onSwap, totalItems 
}: any) => {
    const isDragging = useSharedValue(false);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const triggerHaptic = () => {
        if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    };

    const gesture = Gesture.Pan()
        .activateAfterLongPress(250)
        .onStart(() => {
            isDragging.value = true;
            runOnJS(triggerHaptic)();
        })
        .onUpdate((e) => {
            translateX.value = e.translationX;
            translateY.value = e.translationY;
        })
        .onEnd((e) => {
            const colOffset = Math.round(e.translationX / cellWidth);
            const rowOffset = Math.round(e.translationY / (cellWidth));
            
            const newIndex = index + colOffset + (rowOffset * columns);
            const clampedIndex = Math.max(0, Math.min(newIndex, totalItems - 1));
            
            runOnJS(onSwap)(index, clampedIndex);
            
            isDragging.value = false;
            translateX.value = withSpring(0, SPRING_CONFIG);
            translateY.value = withSpring(0, SPRING_CONFIG);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        zIndex: isDragging.value ? 1000 : 1,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: withSpring(isDragging.value ? 1.05 : 1, SPRING_CONFIG) },
        ],
        shadowOpacity: withTiming(isDragging.value ? 0.2 : 0),
        elevation: isDragging.value ? 10 : 0,
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                layout={LinearTransition.springify().damping(25).stiffness(180)}
                style={[{ width: `${100 / columns}%`, aspectRatio: 1, padding: spacing / 2 }, animatedStyle]}
            >
                <Box
                    flex={1}
                    width="100%"
                    bg={itemBackground}
                    borderRadius={itemBorderRadius}
                    overflow="hidden"
                >
                    {children}
                </Box>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1 }
});

export default CrossTabLayout;
