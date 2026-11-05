import { withAlpha, type ResolvedTheme } from '../theme';
import type { AlertProps, FeedbackVariant, ToastProps } from '../types';
import { px, weight, type Style } from './util';

/** The registry colour a feedback variant stands for. */
export function feedbackColor(variant: FeedbackVariant | 'default', t: ResolvedTheme): string {
  const c = t.colors;
  return { info: c.info, success: c.success, warning: c.warning, error: c.error, default: c.border }[variant];
}

export interface FeedbackRecipe {
  container: Style;
  title: Style;
  body: Style;
  /** the colour of the leading bar */
  accent: string;
}

export function alertRecipe({ variant = 'info' }: AlertProps, t: ResolvedTheme): FeedbackRecipe {
  const accent = feedbackColor(variant, t);
  return {
    accent,
    container: {
      width: '100%',
      gap: px(t, 'spacing', '1'),
      padding: px(t, 'spacing', '4'),
      borderRadius: px(t, 'radii', 'lg'),
      borderWidth: 1,
      borderColor: withAlpha(accent, 0.4),
      borderLeftWidth: 4,
      borderLeftColor: accent,
      backgroundColor: withAlpha(accent, 0.1),
    },
    title: { color: t.colors.foreground, fontSize: px(t, 'fontSizes', 'sm'), fontWeight: weight(t, 'semibold') },
    body: { color: t.colors.foreground, fontSize: px(t, 'fontSizes', 'sm') },
  };
}

export function toastRecipe({ variant = 'default' }: ToastProps, t: ResolvedTheme): FeedbackRecipe {
  const c = t.colors;
  const accent = feedbackColor(variant, t);
  const sh = t.scale.shadows.lg;
  return {
    accent,
    container: {
      minWidth: px(t, 'spacing', '40') + px(t, 'spacing', '24'),
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: px(t, 'spacing', '3'),
      padding: px(t, 'spacing', '4'),
      borderRadius: px(t, 'radii', 'lg'),
      borderWidth: 1,
      borderColor: c.border,
      borderLeftWidth: 4,
      borderLeftColor: accent,
      backgroundColor: c.popover,
      shadowColor: sh.color,
      shadowOffset: { width: sh.offsetX, height: sh.offsetY },
      shadowOpacity: sh.opacity,
      shadowRadius: sh.radius,
      elevation: sh.elevation,
    },
    title: { color: c.popoverForeground, fontSize: px(t, 'fontSizes', 'sm'), fontWeight: weight(t, 'semibold') },
    body: { color: c.mutedForeground, fontSize: px(t, 'fontSizes', 'sm') },
  };
}
