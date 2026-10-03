import React, { useEffect } from 'react';
import { config } from './config';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useColorScheme } from 'nativewind';
import {
  useGluestackColors as useGluestackColorsHook,
  useCalendarTheme as useCalendarThemeHook,
} from './useGluestackColors';

export type ModeType = 'light' | 'dark' | 'system';

/**
 * The theme a provider is built from: the same shape `config.ts` generates, so
 * the file an app regenerates from its own registries is accepted as it is.
 */
export type GluestackThemeConfig = Record<string, Record<string, string>>;

// Re-export color hooks
export const useGluestackColors = useGluestackColorsHook;
export const useCalendarTheme = useCalendarThemeHook;
export type { GluestackColors } from './useGluestackColors';

export interface GluestackUIProviderProps {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}

/**
 * Build a provider around a theme.
 *
 * This is what lets an app own its design system: it copies the registries with
 * `flipova-design adopt`, edits them, regenerates `theme/config.ts`, and mounts
 * the result here. The exported `GluestackUIProvider` is this factory applied to
 * the package's own theme, so nothing changes for an app that did not adopt.
 */
export function createGluestackUIProvider(theme: GluestackThemeConfig) {
  return function ThemedProvider({
    mode = 'light',
    ...props
  }: GluestackUIProviderProps) {
    const { colorScheme, setColorScheme } = useColorScheme();

    useEffect(() => {
      setColorScheme(mode);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    return (
      <View
        style={[
          theme[colorScheme!],
          { flex: 1, height: '100%', width: '100%' },
          props.style,
        ]}
      >
        <OverlayProvider>
          <ToastProvider>{props.children}</ToastProvider>
        </OverlayProvider>
      </View>
    );
  };
}

export const GluestackUIProvider = createGluestackUIProvider(config);
