/**
 * FlipLayout
 *
 * Card carousel with flip (front/back) and horizontal swipe.
 * Supports touch gestures and web-based navigation controls.
 */

import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Text, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../tokens";
import { LayoutPadding } from "../types";
import { applyDefaults, getLayoutMeta, getConstants } from "../registry";
import Box from './primitives/Box';

const META = getLayoutMeta("FlipLayout")!;
const C = getConstants(META);

const SWIPE_THRESHOLD    = C.swipeThreshold!;
const FLIP_THRESHOLD     = C.flipThreshold!;
const SCALE_FACTOR       = C.scaleFactor!;
const FLIP_SCALE_FACTOR  = C.flipScaleFactor!;
const DEZOOM_DURATION    = C.dezoomDuration!;
const FLIP_DURATION      = C.flipDuration!;
const SLIDE_OUT_DURATION = C.slideOutDuration!;
const SPRING_NO_BOUNCE   = C.springNoBounce!;
const SPRING_SNAP        = C.springSnap!;
const EXIT_LEFT          = C.exitLeft!;
const EXIT_RIGHT         = C.exitRight!;

export interface FlipLayoutProps {
    children: React.ReactNode[];
    backContent?: React.ReactNode[];
    onFlip?: (index: number, isFlipped: boolean) => void;
    onSwipe?: (index: number, direction: 'left' | 'right') => void;
    springConfig?: { damping?: number; stiffness?: number };
    maxWidth?: number;
    background?: string;
    borderRadius?: RadiusToken;
    cardBackground?: string;
    cardBorderRadius?: RadiusToken;
    flipPerspective?: number;
    swipeThreshold?: number;
    padding?: LayoutPadding;
}

interface WebButtonProps {
    onPress: () => void;
    isPrimary?: boolean;
    foreground: string;
    card: string;
    border: string;
    primary: string;
    children: React.ReactNode;
}
const WebButton = React.memo(({
    onPress, isPrimary = false, foreground, card, border, primary, children,
}: WebButtonProps) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: isPrimary ? primary : `${card}88`,
            borderWidth: 1,
            borderColor: isPrimary ? primary : `${border}22`,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pressed ? 1 : 0.6,
            transform: [{ scale: pressed ? 0.9 : 1 }],
        } as any]}
    >
        {children}
    </Pressable>
));

const FlipLayout: React.FC<FlipLayoutProps> = (rawProps) => {
    const { theme } = useTheme();
    const {
        children, backContent, onFlip, onSwipe, background,
        borderRadius, cardBackground, flipPerspective, swipeThreshold, padding,
    } = applyDefaults(rawProps, META, theme) as Required<FlipLayoutProps>;
    const isWeb = Platform.OS === 'web';

    const finalBackground = background;
    const finalCardBg     = cardBackground;

    const [currentIndex,  setCurrentIndex]  = useState(0);
    const [displayIndex,  setDisplayIndex]  = useState(0);
    const [pendingIndex,  setPendingIndex]  = useState<number | null>(null);

    const currentIndexRef = useRef(0);
    useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

    const translateX   = useSharedValue(0);
    const translateY   = useSharedValue(0);
    const scale        = useSharedValue(1);
    const rotateY      = useSharedValue(0);
    const opacity      = useSharedValue(1);
    const isFlipping   = useSharedValue(false);
    const isFlippedSV  = useSharedValue(false);
    const slideInReady = useSharedValue(false);

    const context = useSharedValue({
        startX: 0,
        startY: 0,
        isHorizontal: null as boolean | null,
    });

    const cards = useMemo(() => children.map((front, i) => ({
        front,
        back: backContent[i] ?? null,
    })), [children, backContent]);

    const doSlideIn = useCallback(() => {
        'worklet';
        opacity.value = 1;
        translateX.value = withSpring(0, { ...SPRING_SNAP, velocity: 2 }, () => {
            scale.value = withSpring(1, SPRING_NO_BOUNCE);
        });
    }, [opacity, translateX, scale]);

    useAnimatedReaction(
        () => slideInReady.value,
        (ready, prev) => {
            if (ready && !prev) {
                slideInReady.value = false;
                doSlideIn();
            }
        },
        [doSlideIn],
    );

    useEffect(() => {
        if (pendingIndex === null) return;
        setPendingIndex(null);
        slideInReady.value = true;
    }, [pendingIndex]);

    const handleFlipState = useCallback((next: boolean) => {
        isFlippedSV.value = next;
        onFlip?.(currentIndex, next);
    }, [currentIndex, onFlip, isFlippedSV]);

    const handleSwipeStart = useCallback((
        direction: 'left' | 'right',
        length: number,
        entryX: number,
    ) => {
        const computeNewIndex = (prev: number) => direction === 'left'
            ? (prev + 1) % length
            : (prev - 1 + length) % length;

        const newIndex = computeNewIndex(currentIndexRef.current);

        setCurrentIndex(newIndex);
        setDisplayIndex(newIndex);
        setPendingIndex(newIndex);

        translateX.value = entryX;
        scale.value = SCALE_FACTOR;
        isFlippedSV.value = false;

        onSwipe?.(newIndex, direction);
    }, [onSwipe, translateX, scale, isFlippedSV]);

    const performFlip = useCallback(() => {
        'worklet';
        if (isFlipping.value) return;
        isFlipping.value = true;

        const targetRotation = isFlippedSV.value ? 0 : 180;

        scale.value = withTiming(FLIP_SCALE_FACTOR, { duration: DEZOOM_DURATION }, () => {
            rotateY.value = withTiming(targetRotation, { duration: FLIP_DURATION }, () => {
                scale.value = withSpring(1, SPRING_SNAP, () => {
                    runOnJS(handleFlipState)(!isFlippedSV.value);
                    isFlipping.value = false;
                });
            });
        });
    }, [isFlipping, isFlippedSV, scale, rotateY, handleFlipState]);

    const childrenLengthRef = useRef(children.length);
    useEffect(() => { childrenLengthRef.current = children.length; }, [children.length]);

    const performSwipe = useCallback((direction: 'left' | 'right') => {
        'worklet';
        if (isFlipping.value) return;

        const exitX  = direction === 'left' ? EXIT_LEFT  : EXIT_RIGHT;
        const entryX = direction === 'left' ? EXIT_RIGHT : EXIT_LEFT;
        const len    = childrenLengthRef.current;

        runOnJS(handleSwipeStart)(direction, len, entryX);

        translateX.value = withTiming(exitX, { duration: SLIDE_OUT_DURATION }, () => {
            opacity.value = 0;
        });
    }, [isFlipping, translateX, opacity, handleSwipeStart]);

    const panGesture = useMemo(() => Gesture.Pan()
        .activeOffsetX([-10, 10])
        .activeOffsetY([-10, 10])
        .onStart(() => {
            if (isFlipping.value) return;
            context.value = {
                startX: translateX.value,
                startY: translateY.value,
                isHorizontal: null,
            };
        })
        .onUpdate((e) => {
            if (isFlipping.value) return;

            if (context.value.isHorizontal === null) {
                if (Math.abs(e.translationX) > 10 || Math.abs(e.translationY) > 10) {
                    context.value.isHorizontal =
                        Math.abs(e.translationX) > Math.abs(e.translationY);
                }
            }

            if (context.value.isHorizontal) {
                translateX.value = context.value.startX + e.translationX;
                const p = Math.min(Math.abs(e.translationX) / 200, 1);
                scale.value = 1 - p * p * (1 - SCALE_FACTOR);

            } else if (context.value.isHorizontal === false && e.translationY < 0) {
                translateY.value = context.value.startY + e.translationY;
                const p = Math.min(Math.abs(e.translationY) / 60, 1);
                scale.value = 1 - p * (1 - FLIP_SCALE_FACTOR);
            }
        })
        .onEnd((e) => {
            if (context.value.isHorizontal) {
                if (Math.abs(e.translationX) > swipeThreshold) {
                    performSwipe(e.translationX < 0 ? 'left' : 'right');
                } else {
                    translateX.value = withSpring(0, SPRING_NO_BOUNCE);
                    scale.value      = withSpring(1, SPRING_NO_BOUNCE);
                }
            } else if (context.value.isHorizontal === false) {
                translateY.value = withSpring(0, SPRING_NO_BOUNCE);
                if (e.translationY < -FLIP_THRESHOLD) {
                    scale.value = FLIP_SCALE_FACTOR;
                    performFlip();
                } else {
                    scale.value = withSpring(1, SPRING_NO_BOUNCE);
                }
            }
        }),
        [performFlip, performSwipe, swipeThreshold],
    );

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: flipPerspective },
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }), [flipPerspective]);

    const frontAnimStyle = useAnimatedStyle(() => {
        const angle   = ((rotateY.value % 360) + 360) % 360;
        const visible = angle < 90 || angle > 270;
        const rot     = interpolate(
            angle, [0, 90, 270, 360], [0, 90, -90, 0], Extrapolation.CLAMP,
        );
        return {
            transform:  [{ rotateY: `${rot}deg` }],
            opacity:    visible ? 1 : 0,
            position:   'absolute',
            width:      '100%',
            height:     '100%',
        };
    });

    const backAnimStyle = useAnimatedStyle(() => {
        const angle   = ((rotateY.value % 360) + 360) % 360;
        const visible = angle >= 90 && angle <= 270;
        const rot     = interpolate(
            angle, [90, 180, 270], [-90, 0, 90], Extrapolation.CLAMP,
        );
        return {
            transform:  [{ rotateY: `${rot}deg` }],
            opacity:    visible ? 1 : 0,
            position:   'absolute',
            width:      '100%',
            height:     '100%',
        };
    });

    const cardWrapperStyle: ViewStyle = useMemo(() => isWeb ? {
        aspectRatio: 9 / 16,
        height: '80%' as any,
        maxHeight: 750,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    } : {
        width: '100%',
        flex:  1,
    }, [isWeb]);

    const card = cards[displayIndex];
    const backNode = card?.back ?? (
        <Box flex={1} bg={finalCardBg} justifyContent="center" alignItems="center">
            <Text style={{ color: theme.foreground, fontWeight: '600' }}>
                {`Verso ${displayIndex + 1}`}
            </Text>
        </Box>
    );

    const onPressLeft  = useCallback(() => performSwipe('right'), [performSwipe]);
    const onPressRight = useCallback(() => performSwipe('left'),  [performSwipe]);
    const onPressFlip  = useCallback(() => performFlip(),         [performFlip]);

    if (children.length === 0) {
        return (
            <Box
                flex={1}
                bg={finalBackground}
                borderRadius={borderRadius}
                style={{ width: '100%', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                pt={padding?.top    ?? padding?.vertical}
                pb={padding?.bottom ?? padding?.vertical}
                pl={padding?.left   ?? padding?.horizontal}
                pr={padding?.right  ?? padding?.horizontal}
            />
        );
    }

    return (
        <Box
            flex={1}
            bg={finalBackground}
            borderRadius={borderRadius}
            style={{ width: '100%', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
            pt={padding?.top    ?? padding?.vertical}
            pb={padding?.bottom ?? padding?.vertical}
            pl={padding?.left   ?? padding?.horizontal}
            pr={padding?.right  ?? padding?.horizontal}
        >
            {isWeb && (
                <>
                    <View style={{ position: 'absolute', left: '10%', zIndex: 100 }}>
                        <WebButton
                            onPress={onPressLeft}
                            foreground={theme.foreground}
                            card={theme.card}
                            border={theme.border}
                            primary={theme.primary}
                        >
                            <ChevronLeft color={theme.foreground} size={24} strokeWidth={2} />
                        </WebButton>
                    </View>
                    <View style={{ position: 'absolute', right: '10%', zIndex: 100 }}>
                        <WebButton
                            onPress={onPressRight}
                            foreground={theme.foreground}
                            card={theme.card}
                            border={theme.border}
                            primary={theme.primary}
                        >
                            <ChevronRight color={theme.foreground} size={24} strokeWidth={2} />
                        </WebButton>
                    </View>
                    <View style={{ position: 'absolute', bottom: 30, zIndex: 100 }}>
                        <WebButton
                            onPress={onPressFlip}
                            isPrimary
                            foreground={theme.foreground}
                            card={theme.card}
                            border={theme.border}
                            primary={theme.primary}
                        >
                            <RotateCcw color="#FFF" size={20} strokeWidth={2} />
                        </WebButton>
                    </View>
                </>
            )}

            <GestureDetector gesture={panGesture}>
                <Animated.View style={[cardWrapperStyle, containerStyle]}>
                    <Animated.View style={frontAnimStyle}>
                        <Box flex={1} bg={finalCardBg} style={{ overflow: 'hidden' }}>
                            {card?.front}
                        </Box>
                    </Animated.View>
                    <Animated.View style={backAnimStyle}>
                        <Box flex={1} bg={finalCardBg} style={{ overflow: 'hidden' }}>
                            {backNode}
                        </Box>
                    </Animated.View>
                </Animated.View>
            </GestureDetector>
        </Box>
    );
};

export default FlipLayout;
