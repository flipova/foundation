import { designTheme } from '../theme/design-theme';

export type Mode = 'light' | 'dark';

/**
 * The colour roles the components read. A theme is free to define more (they are available as `colors.<role>`), but
 * these must exist: `resolveTheme` refuses a theme that lacks one and names it, so a missing role is found at start-up,
 * not as an undefined colour on screen. `flipova-design` and its GUI check the same list.
 */
export const REQUIRED_ROLES = [
  'background',
  'foreground',
  'card',
  'cardForeground',
  'popover',
  'popoverForeground',
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'muted',
  'mutedForeground',
  'accent',
  'accentForeground',
  'destructive',
  'destructiveForeground',
  'border',
  'input',
  'ring',
  'success',
  'successForeground',
  'warning',
  'warningForeground',
  'error',
  'errorForeground',
  'info',
  'infoForeground',
] as const;
export type ColorRole = (typeof REQUIRED_ROLES)[number];

export interface ShadowToken {
  color: string;
  offsetX: number;
  offsetY: number;
  radius: number;
  opacity: number;
  elevation: number;
}

/** The numeric scales every theme registry provides (see design/tokens.xml). */
export interface Scale {
  spacing: Record<string, number>;
  radii: Record<string, number>;
  fontSizes: Record<string, number>;
  fontWeights: Record<string, number>;
  lineHeights: Record<string, number>;
  letterSpacings: Record<string, number>;
  opacity: Record<string, number>;
  duration: Record<string, number>;
  zIndex: Record<string, number>;
  breakpoints: Record<string, number>;
  fontFamilies: Record<string, { native: string; web?: string }>;
  shadows: Record<string, ShadowToken>;
}

/**
 * What `flipova-design gen` writes (design-theme.ts) and what <FlipovaProvider theme={...}> takes. The shape is fixed;
 * the contents (theme names, palettes, scales) are the app's: nothing in this package assumes a theme id.
 */
export interface ThemeRegistry {
  themes: Record<string, { mode: string; variant: string; colors: Record<string, string> }>;
  /** variant -> mode -> theme id */
  variants: Record<string, Record<string, string>>;
  scale: Scale;
}

/** The registry bundled with the package (a neutral light/dark starter), used when the app gives none. */
export const defaultRegistry: ThemeRegistry = designTheme as unknown as ThemeRegistry;

/** One theme of a registry, ready to read: colours as '#rrggbb', every scale as numbers. */
export interface ResolvedTheme {
  id: string;
  mode: string;
  variant: string;
  colors: Record<ColorRole, string> & Record<string, string>;
  scale: Scale;
}

/** variant + mode -> theme id, the way the registry declares its light/dark pairs (`default`, then any pair, when unknown). */
export function themeIdFor(variant: string | undefined, mode: Mode, theme: ThemeRegistry = defaultRegistry): string {
  const variants = theme.variants;
  const pair = (variant && variants[variant]) || variants.default || Object.values(variants)[0];
  const byMode = pair?.[mode];
  if (byMode && theme.themes[byMode]) return byMode;
  const any = Object.entries(theme.themes).find(([, t]) => t.mode === mode) ?? Object.entries(theme.themes)[0];
  if (!any) throw new Error('the theme registry declares no theme');
  return any[0];
}

export function resolveTheme(id: string, theme: ThemeRegistry = defaultRegistry): ResolvedTheme {
  const t = theme.themes[id];
  if (!t) throw new Error(`unknown theme "${id}" (known: ${Object.keys(theme.themes).join(', ')})`);
  const missing = REQUIRED_ROLES.filter((r) => !(r in t.colors));
  if (missing.length)
    throw new Error(`theme "${id}" lacks the colour role(s) the components read: ${missing.join(', ')}`);
  return { id, mode: t.mode, variant: t.variant, colors: t.colors as ResolvedTheme['colors'], scale: theme.scale };
}

/** '#rrggbb' + opacity -> 'rgba(r, g, b, a)' (what Tailwind's `/40` means, spelled for style objects). */
export function withAlpha(hex: string, alpha: number): string {
  let d = hex.replace('#', '');
  if (d.length === 3) d = [...d].map((c) => c + c).join('');
  const n = parseInt(d.slice(0, 6), 16);
  const a = Math.round(alpha * 1000) / 1000;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
