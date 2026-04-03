/**
 * TutoLayout
 *
 * Step-by-step tutorial overlay with highlight zones, gesture detection, and animated transitions.
 * Supports manual and ref-based zone positioning, multiple gesture types, and auto-advance.
 */

import {
    ChevronRight
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, spacing } from "../../tokens";
import { applyDefaults, getLayoutMeta, getConstants } from "../registry";
import Box from "./primitives/Box";

const META = getLayoutMeta("TutoLayout")!;

const { width: SW, height: SH } = Dimensions.get('window');

export type TutoZoneShape     = 'circle' | 'rect' | 'pill';
export type TutoGesture       =
    | 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down'
    | 'tap' | 'double-tap' | 'long-press' | 'pinch' | 'rotate';
export type TutoLabelPosition =
    | 'top' | 'bottom' | 'left' | 'right'
    | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface TutoZoneManual {
    id: string;
    x: number; y: number; width: number; height: number;
    unit?: 'px' | '%';
    shape?: TutoZoneShape;
    color?: string;
    gesture?: TutoGesture;
    label?: string;
    labelPosition?: TutoLabelPosition;
    delay?: number;
}

export interface TutoZoneRef {
    id: string;
    ref: React.RefObject<View | null>;
    padding?: number;
    shape?: TutoZoneShape;
    color?: string;
    gesture?: TutoGesture;
    label?: string;
    labelPosition?: TutoLabelPosition;
    delay?: number;
}

export type TutoZone = TutoZoneManual | TutoZoneRef;

const isRefZone = (z: TutoZone): z is TutoZoneRef =>
    'ref' in z && z.ref !== undefined;

export interface TutoStep {
    zones: TutoZone[];
    title?: string;
    description?: string;
    textPosition?: 'top' | 'bottom' | 'center';
    autoDuration?: number;
}

export interface TutoLayoutProps {
    steps: TutoStep[];
    visible: boolean;
    onFinish: () => void;
    onStepChange?: (index: number) => void;
    overlayOpacity?: number;
    overlayColor?: string;
    showSkip?: boolean;
    nextLabel?: string;
    finishLabel?: string;
}

export const useTutoRef = () => useRef<View>(null);

interface ResolvedZone {
    id: string;
    x: number; y: number; width: number; height: number;
    shape?: TutoZoneShape;
    color?: string;
    gesture?: TutoGesture;
    label?: string;
    labelPosition?: TutoLabelPosition;
    delay?: number;
}

const resolveManual = (z: TutoZoneManual): ResolvedZone => {
    const u = z.unit ?? 'px';
    return {
        id: z.id,
        x: u === '%' ? z.x * SW : z.x,
        y: u === '%' ? z.y * SH : z.y,
        width:  u === '%' ? z.width  * SW : z.width,
        height: u === '%' ? z.height * SH : z.height,
        shape: z.shape, color: z.color,
        gesture: z.gesture, label: z.label,
        labelPosition: z.labelPosition, delay: z.delay,
    };
};

const measureRef = (
    ref: React.RefObject<View | null>,
    padding: number,
): Promise<ResolvedZone | null> =>
    new Promise((resolve) => {
        if (!ref.current) { resolve(null); return; }
        ref.current.measureInWindow((x, y, width, height) => {
            if (width === 0 && height === 0) { resolve(null); return; }
            resolve({
                id: '_ref_',
                x: x - padding, y: y - padding,
                width: width + padding * 2,
                height: height + padding * 2,
            });
        });
    });

const { swipeThreshold: SWIPE_THRESHOLD = 40 } = getConstants(META);

const gestureMatches = (
    gesture: TutoGesture,
    dx: number,
    dy: number,
    duration: number,
): boolean => {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    switch (gesture) {
        case 'swipe-left':  return dx < -SWIPE_THRESHOLD && absDx > absDy;
        case 'swipe-right': return dx >  SWIPE_THRESHOLD && absDx > absDy;
        case 'swipe-up':    return dy < -SWIPE_THRESHOLD && absDy > absDx;
        case 'swipe-down':  return dy >  SWIPE_THRESHOLD && absDy > absDx;
        case 'tap':         return absDx < 10 && absDy < 10 && duration < 300;
        case 'double-tap':  return absDx < 10 && absDy < 10 && duration < 300;
        case 'long-press':  return absDx < 10 && absDy < 10 && duration > 500;
        default:            return false;
    }
};

const GESTURE_ARROWS: Partial<Record<TutoGesture, { dx: number; dy: number }>> = {
    'swipe-left':  { dx: -1, dy:  0 },
    'swipe-right': { dx:  1, dy:  0 },
    'swipe-up':    { dx:  0, dy: -1 },
    'swipe-down':  { dx:  0, dy:  1 },
};

const GestureIndicator = ({
    gesture, cx, cy, color,
}: { gesture: TutoGesture; cx: number; cy: number; color: string }) => {
    const progress = useSharedValue(0);
    const op       = useSharedValue(0);
    const arrow    = GESTURE_ARROWS[gesture];
    const TRAVEL   = 36;
    const DOT      = 10;

    useEffect(() => {
        op.value = withTiming(1, { duration: 300 });

        if (arrow) {
            progress.value = withRepeat(withSequence(
                withTiming(0, { duration: 0 }),
                withTiming(1, { duration: 600, easing: Easing.inOut(Easing.quad) }),
                withTiming(1, { duration: 200 }),
                withTiming(0, { duration: 0 }),
                withTiming(0, { duration: 300 }),
            ), -1, false);
        } else {
            progress.value = withRepeat(withSequence(
                withTiming(1, { duration: 400, easing: Easing.inOut(Easing.quad) }),
                withTiming(0, { duration: 600, easing: Easing.inOut(Easing.quad) }),
            ), -1, true);
        }

        return () => { cancelAnimation(progress); cancelAnimation(op); };
    }, [gesture]);

    const dotStyle = useAnimatedStyle(() => ({
        opacity: op.value,
        transform: arrow
            ? [
                { translateX: cx - DOT / 2 + arrow.dx * TRAVEL * progress.value },
                { translateY: cy - DOT / 2 + arrow.dy * TRAVEL * progress.value },
            ]
            : [
                { translateX: cx - DOT / 2 },
                { translateY: cy - DOT / 2 },
                { scale: 0.6 + progress.value * 0.8 },
            ],
    }));

    const ringStyle = useAnimatedStyle(() => ({
        opacity: op.value * (1 - progress.value) * 0.5,
        transform: arrow
            ? [
                { translateX: cx - DOT / 2 + arrow.dx * TRAVEL * progress.value },
                { translateY: cy - DOT / 2 + arrow.dy * TRAVEL * progress.value },
                { scale: 1 + progress.value * 0.6 },
            ]
            : [
                { translateX: cx - DOT / 2 },
                { translateY: cy - DOT / 2 },
                { scale: 1 + progress.value * 1.2 },
            ],
    }));

    return (
        <>
            <Animated.View style={[ringStyle, {
                position: 'absolute',
                width: DOT, height: DOT, borderRadius: DOT / 2,
                borderWidth: 1, borderColor: color,
            }]} />
            <Animated.View style={[dotStyle, {
                position: 'absolute',
                width: DOT, height: DOT, borderRadius: DOT / 2,
                backgroundColor: color,
            }]} />
        </>
    );
};

const LABEL_OFFSET = 10;

const getLabelStyle = (
    position: TutoLabelPosition,
    zx: number, zy: number, zw: number, zh: number,
): object => {
    switch (position) {
        case 'top':          return { bottom: SH - zy + LABEL_OFFSET, left: zx, right: SW - zx - zw, alignItems: 'center' };
        case 'bottom':       return { top: zy + zh + LABEL_OFFSET,    left: zx, right: SW - zx - zw, alignItems: 'center' };
        case 'left':         return { top: zy, right: SW - zx + LABEL_OFFSET, alignItems: 'flex-end' };
        case 'right':        return { top: zy, left: zx + zw + LABEL_OFFSET,  alignItems: 'flex-start' };
        case 'top-left':     return { bottom: SH - zy + LABEL_OFFSET, left: zx };
        case 'top-right':    return { bottom: SH - zy + LABEL_OFFSET, right: SW - zx - zw };
        case 'bottom-left':  return { top: zy + zh + LABEL_OFFSET,    left: zx };
        case 'bottom-right': return { top: zy + zh + LABEL_OFFSET,    right: SW - zx - zw };
        default:             return { top: zy + zh + LABEL_OFFSET,    left: zx };
    }
};

const HighlightZone = ({ zone, color }: { zone: ResolvedZone; color: string }) => {
    const { x: zx, y: zy, width: zw, height: zh } = zone;
    const zc = zone.color ?? color;

    const op = useSharedValue(0);

    const borderRadius =
        zone.shape === 'circle' ? Math.max(zw, zh) / 2 :
        zone.shape === 'pill'   ? Math.min(zw, zh) / 2 :
        radii.lg;

    useEffect(() => {
        const delay = zone.delay ?? 0;
        op.value = withDelay(delay, withTiming(1, { duration: 300 }));
        return () => { cancelAnimation(op); };
    }, [zone.id]);

    const wrapStyle  = useAnimatedStyle(() => ({ opacity: op.value }));
    const labelStyle = getLabelStyle(zone.labelPosition ?? 'bottom', zx, zy, zw, zh);

    const C = 10;
    const T = 1.5;

    return (
        <>
            <Animated.View style={[wrapStyle, {
                position: 'absolute',
                left: zx - 8, top: zy - 8,
                width: zw + 16, height: zh + 16,
                borderRadius: borderRadius + 8,
                backgroundColor: `${zc}08`,
            }]} />

            <Animated.View style={[wrapStyle, {
                position: 'absolute', left: zx, top: zy, width: zw, height: zh,
            }]}>
                <View style={{ position: 'absolute', top: 0, left: 0, width: C, height: C,
                    borderTopWidth: T, borderLeftWidth: T, borderColor: zc, borderTopLeftRadius: borderRadius }} />
                <View style={{ position: 'absolute', top: 0, right: 0, width: C, height: C,
                    borderTopWidth: T, borderRightWidth: T, borderColor: zc, borderTopRightRadius: borderRadius }} />
                <View style={{ position: 'absolute', bottom: 0, left: 0, width: C, height: C,
                    borderBottomWidth: T, borderLeftWidth: T, borderColor: zc, borderBottomLeftRadius: borderRadius }} />
                <View style={{ position: 'absolute', bottom: 0, right: 0, width: C, height: C,
                    borderBottomWidth: T, borderRightWidth: T, borderColor: zc, borderBottomRightRadius: borderRadius }} />
            </Animated.View>

            {zone.gesture && (
                <GestureIndicator
                    gesture={zone.gesture}
                    cx={zx + zw / 2}
                    cy={zy + zh / 2}
                    color={zc}
                />
            )}

            {zone.label && (
                <Animated.View style={[{ position: 'absolute' }, wrapStyle, labelStyle]}>
                    <Text style={[s.label, { color: zc }]}>{zone.label}</Text>
                </Animated.View>
            )}
        </>
    );
};

export const TutoLayout: React.FC<TutoLayoutProps> = (rawProps) => {
    const {
        steps, visible, onFinish, onStepChange,
        overlayOpacity, overlayColor, showSkip, nextLabel, finishLabel,
    } = applyDefaults(rawProps, META) as Required<TutoLayoutProps>;

    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const bgColor = overlayColor ?? '#000';

    const [stepIndex,     setStepIndex]     = useState(0);
    const [resolvedZones, setResolvedZones] = useState<ResolvedZone[]>([]);

    const step      = steps[stepIndex];
    const isLast    = stepIndex === steps.length - 1;
    const overlayOp = useSharedValue(0);
    const contentOp = useSharedValue(0);
    const contentY  = useSharedValue(12);
    const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pressStart = useRef<{ x: number; y: number; t: number } | null>(null);

    const resolveZones = async (zones: TutoZone[]) => {
        const results: ResolvedZone[] = [];
        for (const zone of zones) {
            if (isRefZone(zone)) {
                const padding  = zone.padding ?? spacing[2];
                const measured = await measureRef(zone.ref, padding);
                if (measured) results.push({
                    ...measured, id: zone.id,
                    shape: zone.shape, color: zone.color,
                    gesture: zone.gesture, label: zone.label,
                    labelPosition: zone.labelPosition, delay: zone.delay,
                });
            } else {
                results.push(resolveManual(zone));
            }
        }
        setResolvedZones(results);
    };

    useEffect(() => {
        if (visible) {
            setStepIndex(0);
            setTimeout(() => resolveZones(steps[0].zones), 80);
            overlayOp.value = withTiming(overlayOpacity, { duration: 340 });
            contentOp.value = withDelay(200, withTiming(1, { duration: 280 }));
            contentY.value  = withDelay(200, withSpring(0, { damping: 22, stiffness: 200 }));
        } else {
            overlayOp.value = withTiming(0, { duration: 220 });
            contentOp.value = withTiming(0, { duration: 160 });
        }
    }, [visible]);

    const applyStep = async (index: number) => {
        setStepIndex(index);
        onStepChange?.(index);
        await resolveZones(steps[index].zones);
        contentY.value  = 10;
        contentOp.value = withTiming(1, { duration: 240 });
        contentY.value  = withSpring(0, { damping: 22, stiffness: 200 });
    };

    const goToStep = (index: number) => {
        contentOp.value = withTiming(0, { duration: 120 }, () => {
            runOnJS(applyStep)(index);
        });
    };

    const handleNext = () => {
        if (!isLast) {
            goToStep(stepIndex + 1);
        } else {
            overlayOp.value = withTiming(0, { duration: 220 });
            contentOp.value = withTiming(0, { duration: 160 }, () => runOnJS(onFinish)());
        }
    };

    useEffect(() => {
        if (autoTimer.current) clearTimeout(autoTimer.current);
        if (visible && step?.autoDuration) {
            autoTimer.current = setTimeout(handleNext, step.autoDuration);
        }
        return () => { if (autoTimer.current) clearTimeout(autoTimer.current); };
    }, [stepIndex, visible]);

    const activeGesture = resolvedZones.find(z => z.gesture)?.gesture;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !!activeGesture,
            onMoveShouldSetPanResponder:  () => !!activeGesture,
            onPanResponderGrant: (e) => {
                pressStart.current = {
                    x: e.nativeEvent.pageX,
                    y: e.nativeEvent.pageY,
                    t: Date.now(),
                };
            },
            onPanResponderRelease: (e, gs) => {
                if (!activeGesture || !pressStart.current) return;
                const duration = Date.now() - pressStart.current.t;
                if (gestureMatches(activeGesture, gs.dx, gs.dy, duration)) {
                    handleNext();
                }
                pressStart.current = null;
            },
        })
    ).current;

    const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOp.value }));
    const contentStyle = useAnimatedStyle(() => ({
        opacity: contentOp.value,
        transform: [{ translateY: contentY.value }],
    }));

    const textPos = step?.textPosition ?? 'bottom';

    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible} statusBarTranslucent>
            <Animated.View
                style={[overlayStyle, StyleSheet.absoluteFill, { backgroundColor: bgColor }]}
                {...(activeGesture ? panResponder.panHandlers : {})}
            />

            {resolvedZones.map((zone) => (
                <HighlightZone
                    key={`${stepIndex}-${zone.id}`}
                    zone={zone}
                    color={theme.primary ?? '#fff'}
                />
            ))}

            <Animated.View style={[
                contentStyle,
                {
                    position: 'absolute',
                    left: spacing[3],
                    right: spacing[3],
                    ...(textPos === 'top'    ? { top: 52 }          :
                        textPos === 'center' ? { top: SH / 2 - 28 } :
                                               { bottom: 32 + insets.bottom }),
                },
            ]}>
                <Box style={[s.band, { backgroundColor: `${theme.background}F8` }]}>
                    <View style={s.dots}>
                        {steps.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    s.dot,
                                    {
                                        width: i === stepIndex ? spacing[3] : 4,
                                        backgroundColor: i === stepIndex
                                            ? theme.primary
                                            : `${theme.foreground}2E`,
                                    },
                                ]}
                            />
                        ))}
                    </View>

                    {(step?.title || step?.description) ? (
                        <View style={s.textWrap}>
                            {step.title && (
                                <Text style={[s.title, { color: theme.foreground }]}>
                                    {step.title}
                                </Text>
                            )}
                            {step.description && (
                                <Text style={[s.desc, { color: `${theme.foreground}99` }]}>
                                    {step.description}
                                </Text>
                            )}
                        </View>
                    ) : (
                        <View style={{ flex: 1 }} />
                    )}

                    <View style={s.actions}>
                        {showSkip && !isLast && (
                            <Pressable
                                onPress={onFinish}
                                hitSlop={12}
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                            >
                                <Text style={[s.skipText, { color: `${theme.foreground}55` }]}>
                                    Skip
                                </Text>
                            </Pressable>
                        )}

                        <Pressable
                            onPress={handleNext}
                            style={({ pressed }) => [
                                s.nextBtn,
                                {
                                    backgroundColor: theme.primary,
                                    opacity: pressed ? 0.85 : 1,
                                },
                            ]}
                        >
                            <Text style={[s.nextText, { color: theme.primaryForeground ?? '#fff' }]}>
                                {isLast ? finishLabel : nextLabel}
                            </Text>
                            {!isLast && (
                                <ChevronRight size={13} color={theme.primaryForeground ?? '#fff'} strokeWidth={2.5} />
                            )}
                        </Pressable>
                    </View>
                </Box>
            </Animated.View>
        </Modal>
    );
};

const s = StyleSheet.create({
    band: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        backgroundColor: 'transparent',
        borderRadius: 20,
        paddingHorizontal: spacing[3],
        paddingVertical: 10,
        overflow: 'hidden',
    },
    dots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flexShrink: 0,
    },
    dot: {
        height: 4,
        borderRadius: 2,
    },
    textWrap: {
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
    },
    title: {
        fontSize: 13,
        fontWeight: '500',
        lineHeight: 17,
    },
    desc: {
        fontSize: 11,
        lineHeight: 15,
        marginTop: 1,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        flexShrink: 0,
    },
    skipText: {
        fontSize: 12,
        fontWeight: '500',
    },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        borderRadius: radii.md,
        paddingHorizontal: spacing[3],
        paddingVertical: 6,
    },
    nextText: {
        fontSize: 12,
        fontWeight: '600',
    },
});
