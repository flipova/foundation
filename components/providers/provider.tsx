import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  defaultRegistry,
  resolveTheme,
  themeIdFor,
  type Mode,
  type ResolvedTheme,
  type ThemeRegistry,
} from '../contract';
import type { ProviderAdapter } from './types';

interface Ctx {
  adapter: ProviderAdapter;
  theme: ResolvedTheme;
}

const FlipovaContext = createContext<Ctx | null>(null);

export interface FlipovaProviderProps {
  /**
   * The component library to render with (`flipova`, `gluestack`, `reusables`, `paper` or `tamagui` adapter, each from
   * its own sub-path). Components the library lacks are served by the flipova provider.
   */
  adapter: ProviderAdapter;
  mode?: Mode | 'system';
  /** Light/dark pair declared in the registry's themes (the `default` pair when omitted). */
  variant?: string;
  /**
   * The app's own themes: the `design-theme.ts` that `npx flipova-design gen` writes in the project. When omitted the
   * neutral light/dark starter bundled with the package is used.
   */
  theme?: ThemeRegistry;
  children?: React.ReactNode;
}

/**
 * Mounts one adapter with one theme. Colours, radii, spacings and type sizes come from the registry whatever the
 * adapter, which is what keeps the design identical across libraries.
 */
export function FlipovaProvider({
  adapter,
  mode = 'light',
  variant,
  theme: registry = defaultRegistry,
  children,
}: FlipovaProviderProps) {
  const system = useColorScheme();
  const resolvedMode: Mode = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
  const theme = useMemo(
    () => resolveTheme(themeIdFor(variant, resolvedMode, registry), registry),
    [variant, resolvedMode, registry],
  );
  const value = useMemo(() => ({ adapter, theme }), [adapter, theme]);
  return (
    <FlipovaContext.Provider value={value}>
      <adapter.Provider theme={theme} registry={registry}>
        {children}
      </adapter.Provider>
    </FlipovaContext.Provider>
  );
}

let fallbackTheme: ResolvedTheme | undefined;

/**
 * The resolved theme in use (hex colours, numeric scales). Outside a <FlipovaProvider> it is the light theme of the
 * bundled registry, so a component never renders without a design.
 */
export function useResolvedTheme(): ResolvedTheme {
  const ctx = useContext(FlipovaContext);
  if (ctx) return ctx.theme;
  return (fallbackTheme ??= resolveTheme(themeIdFor(undefined, 'light')));
}

/** The mounted adapter, or null when no <FlipovaProvider> is above. */
export const useAdapter = (): ProviderAdapter | null => useContext(FlipovaContext)?.adapter ?? null;

/** Which provider is mounted (`flipova` when none is). */
export const useProviderName = () => useAdapter()?.name ?? 'flipova';
