/**
 * Swipe2ScreenLayout
 *
 * Swipe-to-project layout with camera-based QR pairing and lock mode.
 * Slides can be swiped up to project and pulled down to dismiss.
 */

import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../../theme/providers/ThemeProvider';
import { applyDefaults, getLayoutMeta } from '../registry';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
    content: React.ReactNode;
}

interface Swipe2ScreenLayoutProps {
    slides?: Slide[];
    containerBackground?: string;
    screenBackground?: string;
    swipeThreshold?: number;
    projectedScale?: number;
    animationDuration?: number;
}

const META = getLayoutMeta("Swipe2ScreenLayout")!;

const Swipe2ScreenLayout: React.FC<Swipe2ScreenLayoutProps> = (rawProps) => {
    const { theme } = useTheme();
    const {
        containerBackground, screenBackground, swipeThreshold,
        projectedScale, animationDuration, slides,
    } = applyDefaults(rawProps, META, theme) as Required<Swipe2ScreenLayoutProps>;

    const [permission, requestPermission] = useCameraPermissions();
    const [isConnected, setIsConnected] = useState(false);
    const [isProjected, setIsProjected] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [baseUrl, setBaseUrl] = useState<string | null>(null);

    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const triggerHaptic = (type: 'success' | 'impact') => {
        if (Platform.OS === 'web') return;
        if (type === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const syncWeb = async (active: boolean) => {
        if (!sessionId || !baseUrl) return;
        try {
            await fetch(`${baseUrl}/api/project`, {
                method: active ? 'POST' : 'DELETE',
                body: JSON.stringify({ sessionId, projected: active }),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) { 
            console.error("Sync error:", e); 
        }
    };

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            if (isLocked) return;
            if (!isProjected && event.translationY < 0) {
                translateY.value = event.translationY;
                scale.value = withTiming(0.9);
            }
            if (isProjected && event.translationY > 0) {
                translateY.value = event.translationY;
                scale.value = withTiming(0.8);
            }
        })
        .onEnd((event) => {
            if (isLocked) return;

            if (event.translationY < -swipeThreshold && !isProjected) {
                translateY.value = withTiming(-SCREEN_HEIGHT, { duration: animationDuration }, () => {
                    runOnJS(setIsProjected)(true);
                    runOnJS(syncWeb)(true);
                    translateY.value = 0;
                    scale.value = withSpring(projectedScale);
                });
            } else if (event.translationY > swipeThreshold && isProjected) {
                runOnJS(setIsProjected)(false);
                runOnJS(setIsLocked)(false);
                runOnJS(syncWeb)(false);
                scale.value = withSpring(1);
                translateY.value = withSpring(0);
            } else {
                translateY.value = withSpring(0);
                scale.value = withSpring(isProjected ? projectedScale : 1);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: scale.value }
        ],
        borderRadius: isProjected ? 20 : 0,
        overflow: 'hidden',
    }));

    if (!permission?.granted && !isConnected && Platform.OS !== 'web') {
        return (
            <View style={styles.center}>
                <TouchableOpacity style={styles.btn} onPress={requestPermission}>
                    <Text style={{ color: '#fff' }}>Authorize camera</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: containerBackground }]}>
            {!isConnected && Platform.OS !== 'web' ? (
                <CameraView 
                    onBarcodeScanned={({ data }: { data: string }) => {
                        const parts = data.split('|');
                        if (parts.length === 2) {
                            setBaseUrl(parts[0]);
                            setSessionId(parts[1]);
                            setIsConnected(true);
                            runOnJS(triggerHaptic)('success');
                        }
                    }} 
                    style={StyleSheet.absoluteFill} 
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                />
            ) : (
                <>
                    <GestureDetector gesture={gesture}>
                        <Animated.View style={[styles.screen, { backgroundColor: screenBackground }, animatedStyle]}>
                            <FlatList 
                                data={slides}
                                horizontal
                                pagingEnabled
                                scrollEnabled={!isProjected || isLocked}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
                                        {item.content}
                                    </View>
                                )}
                                keyExtractor={(_, index) => index.toString()}
                            />
                        </Animated.View>
                    </GestureDetector>

                    {isProjected && (
                        <TouchableOpacity 
                            style={[styles.lockBtn, isLocked && styles.locked]} 
                            onPress={() => {
                                setIsLocked(!isLocked);
                                triggerHaptic('impact');
                            }}
                        >
                            <Ionicons 
                                name={isLocked ? "lock-closed" : "lock-open"} 
                                size={28} 
                                color="white" 
                            />
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    screen: { flex: 1 },
    btn: { backgroundColor: '#007AFF', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
    lockBtn: {
        position: 'absolute', bottom: 50, right: 30, width: 64, height: 64, borderRadius: 32,
        backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: '#fff', zIndex: 100
    },
    locked: { backgroundColor: '#ff3b30', borderColor: '#ff3b30' }
});

export default Swipe2ScreenLayout;
