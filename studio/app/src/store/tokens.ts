/**
 * Token resolver — imports real foundation tokens and provides
 * resolution of linked values ($spacing.4 → 16, $theme.primary → #3b82f6, etc.)
 */

import { spacing } from '../../../../foundation/tokens/spacing';
import { radii } from '../../../../foundation/tokens/radii';
import { shadows } from '../../../../foundation/tokens/shadows';
import { fontSizes, fontWeights, lineHeights } from '../../../../foundation/tokens/typography';
import { breakpoints } from '../../../../foundation/tokens/breakpoints';
import { opacity } from '../../../../foundation/tokens/opacity';
import { durations } from '../../../../foundation/tokens/motion';
import { zIndices } from '../../../../foundation/tokens/z-index';
import { colors } from '../../../../foundation/tokens/colors';
import { lightTheme } from '../../../../foundation/theme/config/definitions/light.theme';
import { darkTheme } from '../../../../foundation/theme/config/definitions/dark.theme';
import { neonTheme } from '../../../../foundation/theme/config/definitions/neon.theme';
import { springTheme } from '../../../../foundation/theme/config/definitions/spring.theme';
import { summerTheme } from '../../../../foundation/theme/config/definitions/summer.theme';
import { autumnTheme } from '../../../../foundation/theme/config/definitions/autumn.theme';
import { winterTheme } from '../../../../foundation/theme/config/definitions/winter.theme';
import { halloweenTheme } from '../../../../foundation/theme/config/definitions/halloween.theme';
import { christmasTheme } from '../../../../foundation/theme/config/definitions/christmas.theme';

export const THEME_REGISTRY: Record<string, Record<string, any>> = {
  light: lightTheme, dark: darkTheme, neon: neonTheme,
  spring: springTheme, summer: summerTheme, autumn: autumnTheme,
  winter: winterTheme, halloween: halloweenTheme, christmas: christmasTheme,
};

export const AVAILABLE_THEMES = Object.keys(THEME_REGISTRY);

export const FOUNDATION_TOKENS = {
  spacing,
  radii,
  shadows,
  fontSizes,
  fontWeights,
  lineHeights,
  breakpoints,
  opacity,
  durations,
  zIndices,
  colors,
};

export interface TokenEntry {
  path: string;
  label: string;
  value: unknown;
  category: string;
}

export function getAllTokens(): TokenEntry[] {
  const entries: TokenEntry[] = [];

  for (const [k, v] of Object.entries(spacing)) {
    entries.push({ path: `$spacing.${k}`, label: `spacing.${k} = ${v}px`, value: v, category: 'spacing' });
  }
  for (const [k, v] of Object.entries(radii)) {
    entries.push({ path: `$radii.${k}`, label: `radii.${k} = ${v}`, value: v, category: 'radii' });
  }
  for (const k of Object.keys(shadows)) {
    entries.push({ path: `$shadow.${k}`, label: `shadow.${k}`, value: k, category: 'shadows' });
  }
  for (const [k, v] of Object.entries(fontSizes)) {
    entries.push({ path: `$fontSize.${k}`, label: `fontSize.${k} = ${v}px`, value: v, category: 'typography' });
  }
  for (const [k, v] of Object.entries(fontWeights)) {
    entries.push({ path: `$fontWeight.${k}`, label: `fontWeight.${k} = ${v}`, value: v, category: 'typography' });
  }
  for (const [k, v] of Object.entries(lineHeights)) {
    entries.push({ path: `$lineHeight.${k}`, label: `lineHeight.${k} = ${v}`, value: v, category: 'typography' });
  }
  for (const [k, v] of Object.entries(breakpoints)) {
    entries.push({ path: `$breakpoint.${k}`, label: `breakpoint.${k} = ${v}px`, value: v, category: 'breakpoints' });
  }
  for (const [k, v] of Object.entries(opacity)) {
    entries.push({ path: `$opacity.${k}`, label: `opacity.${k} = ${v}`, value: v, category: 'opacity' });
  }
  for (const [k, v] of Object.entries(durations)) {
    entries.push({ path: `$duration.${k}`, label: `duration.${k} = ${v}ms`, value: v, category: 'motion' });
  }
  for (const [k, v] of Object.entries(zIndices)) {
    entries.push({ path: `$zIndex.${k}`, label: `zIndex.${k} = ${v}`, value: v, category: 'zIndex' });
  }

  const flatColors = Object.entries(colors).filter(([, v]) => typeof v === 'string');
  for (const [k, v] of flatColors) {
    entries.push({ path: `$color.${k}`, label: `color.${k} = ${v}`, value: v, category: 'colors' });
  }

  return entries;
}

export function getThemeTokens(themeColors: Record<string, string>): TokenEntry[] {
  return Object.entries(themeColors).filter(([, v]) => typeof v === 'string').map(([k, v]) => ({
    path: `$theme.${k}`, label: `theme.${k} = ${v}`, value: v, category: 'theme',
  }));
}

export function getThemeColors(themeName: string): Record<string, string> {
  const theme = THEME_REGISTRY[themeName];
  if (!theme) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(theme)) {
    if (typeof v === 'string') result[k] = v;
  }
  return result;
}

export function resolveTokenValue(linked: string, themeColors?: Record<string, string>): unknown {
  if (!linked || !linked.startsWith('$')) return linked;

  const path = linked.slice(1);
  const [group, key] = path.split('.');

  switch (group) {
    case 'spacing': return (spacing as any)[key];
    case 'radii': return (radii as any)[key];
    case 'shadow': return key;
    case 'fontSize': return (fontSizes as any)[key];
    case 'fontWeight': return (fontWeights as any)[key];
    case 'lineHeight': return (lineHeights as any)[key];
    case 'breakpoint': return (breakpoints as any)[key];
    case 'opacity': return (opacity as any)[key];
    case 'duration': return (durations as any)[key];
    case 'zIndex': return (zIndices as any)[key];
    case 'color': return (colors as any)[key];
    case 'theme': return themeColors?.[key];
    default: return linked;
  }
}

export function resolveProps(
  props: Record<string, any>,
  themeColors?: Record<string, string>,
  nodePropsContext?: Record<string, Record<string, any>>
): Record<string, any> {
  const resolved: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === 'string' && v.startsWith('$')) {
      // First try to resolve as a token
      const tokenValue = resolveTokenValue(v, themeColors);
      if (tokenValue !== v) {
        resolved[k] = tokenValue;
      } else if (v.startsWith('$node.') && nodePropsContext) {
        // Try to resolve $node. expressions
        const { resolveForPreview } = require('../../../engine/tree/expressions');
        resolved[k] = resolveForPreview(v, { nodePropsContext });
      } else {
        resolved[k] = v;
      }
    } else {
      resolved[k] = v;
    }
  }
  return resolved;
}
