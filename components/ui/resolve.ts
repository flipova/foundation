import { UI_NAMES, type ProviderName, type UiComponents, type UiName } from '../contract';
import { flipovaComponents } from '../providers/flipova';
import { useAdapter } from '../providers/provider';
import type { ProviderAdapter } from '../providers/types';

const merged = new WeakMap<ProviderAdapter, UiComponents>();

/**
 * Every component of the contract for one adapter: its own where it has one, flipova's otherwise. This is the
 * fallback: a library that lacks a component (or a missing provider altogether) never leaves a hole.
 */
export function componentsOf(adapter: ProviderAdapter | null): UiComponents {
  if (!adapter || adapter.name === 'flipova') return flipovaComponents;
  let all = merged.get(adapter);
  if (!all) {
    all = { ...flipovaComponents };
    for (const name of UI_NAMES) {
      const own = adapter.components[name];
      if (own) (all as Record<UiName, unknown>)[name] = own;
    }
    merged.set(adapter, all);
  }
  return all;
}

export interface Coverage {
  provider: ProviderName;
  /** implemented by the library itself */
  native: UiName[];
  /** served by the flipova provider */
  fallback: UiName[];
}

export function coverageOf(adapter: ProviderAdapter): Coverage {
  const native = UI_NAMES.filter((n) => adapter.name === 'flipova' || !!adapter.components[n]);
  return { provider: adapter.name, native, fallback: UI_NAMES.filter((n) => !native.includes(n)) };
}

/** All the components of the mounted provider, with fallback: `const { Button } = useComponents()`. */
export const useComponents = (): UiComponents => componentsOf(useAdapter());
