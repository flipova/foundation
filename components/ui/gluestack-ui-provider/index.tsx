import React, { useEffect } from 'react';
import { config, colors, variants } from './config';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useColorScheme } from 'nativewind';
import {
  useGluestackColors as useGluestackColorsHook,
  useCalendarTheme as useCalendarThemeHook,
} from './useGluestackColors';
import { ThemeContext, MountedThemeContext, resolveThemeId } from './theme-context';

export {
  ThemeContext,
  MountedThemeContext,
  useMountedColors,
  useMountedTheme,
  resolveThemeId,
} from './theme-context';

export type ModeType = 'light' | 'dark' | 'system';

/** A light/dark pair declared in `design/themes.xml` (e.g. `spring`). */
export type ThemeVariant = keyof typeof variants | (string & {});

/**
 * The theme a provider is built from: the same shape `config.ts` generates, so
 * the file an app regenerates from its own registries is accepted as it is.
 */
export type GluestackThemeConfig = Record<string, Record<string, string>>;

/**
 * What a provider is built from: the `colors` the generated theme exports, and
 * optionally the matching `vars()` config. Passing the whole module works:
 * `createGluestackUIProvider({ colors, config })`.
 */
export interface GluestackTheme {
  colors: GluestackThemeConfig;
  config?: Record<string, unknown>;
  /** variant -> mode -> theme id, generated from the `variant` attribute. */
  variants?: Record<string, Record<string, string>>;
}

// Re-export color hooks
export const useGluestackColors = useGluestackColorsHook;
export const useCalendarTheme = useCalendarThemeHook;
export type { GluestackColors } from './useGluestackColors';

export interface GluestackUIProviderProps {
  mode?: ModeType;
  /** Which light/dark pair to mount (e.g. `spring`). Defaults to `default`. */
  variant?: ThemeVariant;
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
export function createGluestackUIProvider(theme: GluestackTheme) {
  const vars = theme.config ?? theme.colors;
  const variantMap = theme.variants;
  const themeIds = Object.keys(vars);

  return function ThemedProvider({
    mode = 'light',
    variant,
    ...props
  }: GluestackUIProviderProps) {
    const { colorScheme, setColorScheme } = useColorScheme();

    useEffect(() => {
      setColorScheme(mode);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    // Nativewind only reports light/dark, so `system` resolves through it while a
    // named mode is taken as-is; either way the VARIANT picks the pair. Falling
    // back to the mode keeps a theme set without variants working untouched.
    const resolvedMode =
      mode === 'system' ? colorScheme ?? 'light' : mode;
    const themeId = resolveThemeId(variantMap, variant, resolvedMode);
    const mountedTheme = React.useMemo(
      () => ({ themeId, themeIds }),
      [themeId, themeIds]
    );

    return (
      <View
        style={[
          (vars as Record<string, unknown>)[themeId] as ViewProps['style'],
          { flex: 1, height: '100%', width: '100%' },
          props.style,
        ]}
      >
        <ThemeContext.Provider value={theme.colors}>
          <MountedThemeContext.Provider value={mountedTheme}>
            <OverlayProvider>
              <ToastProvider>{props.children}</ToastProvider>
            </OverlayProvider>
          </MountedThemeContext.Provider>
        </ThemeContext.Provider>
      </View>
    );
  };
}

export const GluestackUIProvider = createGluestackUIProvider({
  colors,
  config,
  variants,
});
