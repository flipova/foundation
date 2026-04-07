/**
 * SystemLayout
 *
 * Root-level wrapper that manages status bar, navigation bar, and safe area insets.
 * Handles platform-specific system UI configuration including Android navigation bar styling.
 */

import { StatusBar } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { applyDefaults, getLayoutMeta } from '../registry';
import Box from './primitives/Box';

const META = getLayoutMeta("SystemLayout")!;

interface SystemUIWrapperProps {
  children: React.ReactNode;
  rootBackgroundColor?: string | string[];
  statusBarContentStyle?: 'light' | 'dark' | 'auto';
  navigationBarContentStyle?: 'light' | 'dark';
  navigationBarReferenceColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
}

const getContrastStyle = (hexColor: string): 'light' | 'dark' => {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return 'dark';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'dark' : 'light';
};

export const SystemUIWrapper: React.FC<SystemUIWrapperProps> = (rawProps) => {
  const {
    children,
    rootBackgroundColor,
    statusBarContentStyle,
    navigationBarContentStyle,
    navigationBarReferenceColor,
    edges,
    style,
  } = applyDefaults(rawProps, META) as Required<SystemUIWrapperProps>;
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const referenceColor = useMemo(() => {
    return Array.isArray(rootBackgroundColor)
      ? rootBackgroundColor[0]
      : rootBackgroundColor;
  }, [rootBackgroundColor]);

  const navbarBackgroundColor = useMemo(() => {
    if (navigationBarReferenceColor) return navigationBarReferenceColor;
    return Array.isArray(rootBackgroundColor)
      ? rootBackgroundColor[rootBackgroundColor.length - 1]
      : rootBackgroundColor;
  }, [rootBackgroundColor, navigationBarReferenceColor]);

  const finalStatusStyle = useMemo(() => {
    if (statusBarContentStyle !== 'auto') return statusBarContentStyle;
    return getContrastStyle(referenceColor as string);
  }, [referenceColor, statusBarContentStyle]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const updateAndroidSystemUI = async () => {
      try {
        const NavigationBar = await import('expo-navigation-bar');

        const rawColor = (navbarBackgroundColor as string).replace('#', '');
        const safeColor = rawColor.length === 8
          ? `#${rawColor.substring(0, 6)}`
          : `#${rawColor}`;

        await NavigationBar.setBackgroundColorAsync(safeColor);

        const navIconStyle =
          navigationBarContentStyle ??
          getContrastStyle(safeColor);

        await NavigationBar.setButtonStyleAsync(navIconStyle);
      } catch (e) {
        console.warn('SystemUIWrapper: Failed to update Android NavigationBar', e);
      }
    };

    updateAndroidSystemUI();
  }, [navbarBackgroundColor, navigationBarContentStyle]);

  const edgeInsetsStyle = useMemo(() => ({
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  }), [edges, insets]);

  const isGradient = Array.isArray(rootBackgroundColor);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle={finalStatusStyle === 'light' ? 'light-content' : 'dark-content'}
        translucent
        animated
      />

      <Box
        flex={1}
        gradient={
          isGradient
            ? (rootBackgroundColor as string[]).slice(0, 2) as [string, string]
            : undefined
        }
        bg={isGradient ? undefined : (rootBackgroundColor as string)}
      >
        <View style={[styles.content, edgeInsetsStyle, { minHeight: height }, style]}>
          {children}
        </View>
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
