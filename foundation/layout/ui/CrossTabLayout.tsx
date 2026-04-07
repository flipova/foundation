/**
 * CrossTabLayout
 *
 * Drag-and-drop reorderable grid with haptic feedback.
 * Children can be rearranged by long-pressing and dragging.
 */

import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
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
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("CrossTabLayout")!;

type SpacingKey = keyof typeof spacingTokens;

export interface CrossTabLayoutProps {
    items?: React.ReactElement[];
    children?: React.ReactNode | React.ReactElement[]; // backward compat
    columns?: number;
    spacing?: SpacingKey;
    itemBackground?: string;
    itemBorderRadius?: number;
    scrollEnabled?: boolean;
    onOrderChange?: (newOrderKeys: string[]) => void;
    springDamping?: number;
    springStiffness?: number;
    longPressDuration?: number;
    dragScale?: number;
    background?: string;
}

const CrossTabLayout: React.FC<CrossTabLayoutProps> = (rawProps) => {
    const { theme } = useTheme();
    const {
        items: itemsProp, children: childrenProp, columns, spacing, itemBackground,
        itemBorderRadius, scrollEnabled, onOrderChange,
        springDamping, springStiffness, longPressDuration, dragScale, background,
    } = applyDefaults(rawProps, META, theme) as Required<CrossTabLayoutProps>;
    const SPRING = { damping: springDamping, stiffness: springStiffness, mass: 0.5 };
    const isWeb = Platform.OS === "web";
    const [containerWidth, setContainerWidth] = useState(0);

    // Standard: items > children (backward compat)
    const rawItems = Array.isArray(itemsProp) && itemsProp.length > 0
        ? itemsProp
        : React.Children.toArray(childrenProp as React.ReactNode) as React.ReactElement[];

    const [items, setItems] = useState(() => rawItems);

    useEffect(() => {
        const newChildren = rawItems;
        
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
    }, [rawItems]);

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
    }, [items, onOrderChange, isWeb]);

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
                    spring={SPRING}
                    longPressDuration={longPressDuration}
                    dragScale={dragScale}
                >
                    {child}
                </DraggableCell>
            ))}
        </Box>
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
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
    cellWidth, itemBackground, itemBorderRadius, onSwap, totalItems,
    spring, longPressDuration, dragScale,
}: any) => {
    const isDragging = useSharedValue(false);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const triggerHaptic = () => {
        if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
    };

    const gesture = Gesture.Pan()
        .activateAfterLongPress(longPressDuration)
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
            translateX.value = withSpring(0, spring);
            translateY.value = withSpring(0, spring);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        zIndex: isDragging.value ? 1000 : 1,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: withSpring(isDragging.value ? dragScale : 1, spring) },
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

export default CrossTabLayout;
