import type { ResolvedTheme } from '../theme';
import type { AvatarProps } from '../types';
import { px, weight, type Style } from './util';

const BOX = { sm: '8', md: '10', lg: '14', xl: '20' } as const;
const TEXT = { sm: 'xs', md: 'sm', lg: 'xl', xl: '3xl' } as const;

export interface AvatarRecipe {
  container: Style;
  image: Style;
  initials: Style;
}

export function avatarRecipe({ size = 'md' }: AvatarProps, t: ResolvedTheme): AvatarRecipe {
  const box = px(t, 'spacing', BOX[size]);
  return {
    container: {
      width: box,
      height: box,
      borderRadius: px(t, 'radii', 'full'),
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: t.colors.muted,
    },
    image: { width: box, height: box },
    initials: {
      color: t.colors.mutedForeground,
      fontSize: px(t, 'fontSizes', TEXT[size]),
      fontWeight: weight(t, 'medium'),
    },
  };
}

/** "Ada Lovelace" -> "AL"; one word -> its first letter; nothing -> "?" */
export function initialsOf(name?: string): string {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  const letters = words.length === 1 ? [words[0]] : [words[0], words[words.length - 1]];
  return letters.map((w) => Array.from(w)[0].toUpperCase()).join('');
}
