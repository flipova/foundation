import { vars } from 'nativewind';
import type { ThemeRegistry } from '../contract';

/**
 * The registry spelled as the CSS variables NativeWind-based libraries read (`--primary: 24 24 27`): one table per
 * theme, built at runtime from the theme the app hands to <FlipovaProvider>, so an app that owns its themes needs no
 * file regenerated inside this package. Used by the gluestack and reusables providers; not part of the core entry.
 */
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

export function hexToTriplet(hex: string): string {
  let d = hex.replace('#', '');
  if (d.length === 3) d = [...d].map((c) => c + c).join('');
  const n = parseInt(d.slice(0, 6), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export interface CssVarTables {
  /** theme id -> { '--role': 'r g b' } */
  colors: Record<string, Record<string, string>>;
  /** the same, wrapped by NativeWind's vars() (what a View's style takes) */
  config: Record<string, ReturnType<typeof vars>>;
  /** variant -> mode -> theme id */
  variants: Record<string, Record<string, string>>;
}

const cache = new WeakMap<ThemeRegistry, CssVarTables>();

export function cssVarTables(theme: ThemeRegistry): CssVarTables {
  const hit = cache.get(theme);
  if (hit) return hit;
  const colors: CssVarTables['colors'] = {};
  const config: CssVarTables['config'] = {};
  for (const [id, t] of Object.entries(theme.themes as Record<string, { colors: Record<string, string> }>)) {
    colors[id] = Object.fromEntries(
      Object.entries(t.colors).map(([role, hex]) => [`--${kebab(role)}`, hexToTriplet(hex)]),
    );
    config[id] = vars(colors[id]);
  }
  const out = { colors, config, variants: theme.variants as CssVarTables['variants'] };
  cache.set(theme, out);
  return out;
}
