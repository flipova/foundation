import type { ResolvedTheme } from '../theme';
import type { SliderProps } from '../types';
import { px, type Style } from './util';

export interface SliderRecipe {
  root: Style;
  track: Style;
  filled: Style;
  thumb: Style;
  thumbSize: number;
}

export function sliderRecipe({ disabled = false }: SliderProps, t: ResolvedTheme): SliderRecipe {
  const c = t.colors;
  const thumb = px(t, 'spacing', '5');
  return {
    thumbSize: thumb,
    root: { width: '100%', height: thumb, justifyContent: 'center', opacity: disabled ? 0.4 : 1 },
    track: {
      height: px(t, 'spacing', '1.5'),
      borderRadius: px(t, 'radii', 'full'),
      backgroundColor: c.muted,
      overflow: 'hidden',
    },
    filled: { height: '100%', backgroundColor: c.primary },
    thumb: {
      position: 'absolute',
      width: thumb,
      height: thumb,
      borderRadius: px(t, 'radii', 'full'),
      backgroundColor: c.background,
      borderWidth: 2,
      borderColor: c.primary,
    },
  };
}

/** value -> 0..1 position, clamped */
export function sliderFraction(value: number, min: number, max: number): number {
  if (!(max > min)) return 0;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

/** 0..1 position -> value, snapped to `step` and clamped to [min, max] */
export function sliderValue(fraction: number, min: number, max: number, step: number): number {
  const raw = min + Math.min(1, Math.max(0, fraction)) * (max - min);
  const snapped = step > 0 ? Math.round((raw - min) / step) * step + min : raw;
  const decimals = (String(step).split('.')[1] ?? '').length;
  return Math.min(max, Math.max(min, Number(snapped.toFixed(decimals))));
}
