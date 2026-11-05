import { type ResolvedTheme } from '../theme';
import type { SwitchProps } from '../types';
import { px } from './util';

export interface SwitchRecipe {
  trackOn: string;
  trackOff: string;
  thumb: string;
  /** scale applied to the whole control (sm 0.75, md 1, lg 1.25) */
  scale: number;
  opacity: number;
  width: number;
  height: number;
}

export function switchRecipe({ size = 'md', disabled = false }: SwitchProps, t: ResolvedTheme): SwitchRecipe {
  return {
    trackOn: t.colors.primary,
    trackOff: t.colors.input,
    thumb: t.colors.background,
    scale: { sm: 0.75, md: 1, lg: 1.25 }[size],
    opacity: disabled ? 0.4 : 1,
    width: px(t, 'spacing', '11'),
    height: px(t, 'spacing', '6'),
  };
}
