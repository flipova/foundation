import type { ComponentType, ReactNode } from 'react';
import type { ProviderComponents, ProviderName, ResolvedTheme, ThemeRegistry } from '../contract';

/**
 * A provider adapter: the component library a theme is rendered with. The app picks one and the rest of its code
 * only ever talks to the contract (`import { Button } from '@flipova/foundation/ui'`), so switching library is a
 * one-line change.
 */
export interface ProviderAdapter {
  name: ProviderName;
  /** Mounts the library's own provider (Paper's PaperProvider, Tamagui's TamaguiProvider, ...) for this theme. */
  Provider: ComponentType<{ theme: ResolvedTheme; registry: ThemeRegistry; children?: ReactNode }>;
  /** The components the library really has. Any missing one is served by the flipova provider (see ui/). */
  components: ProviderComponents;
}

export const defineAdapter = (adapter: ProviderAdapter): ProviderAdapter => adapter;
