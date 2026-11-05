import type { ResolvedTheme } from '../theme';
import type { SpinnerProps } from '../types';

export interface SpinnerRecipe {
  size: 'small' | 'large';
  color: string;
  scale: number;
}

export function spinnerRecipe({ size = 'md' }: SpinnerProps, t: ResolvedTheme): SpinnerRecipe {
  return { size: size === 'sm' ? 'small' : 'large', scale: { sm: 1, md: 1, lg: 1.5 }[size], color: t.colors.primary };
}
