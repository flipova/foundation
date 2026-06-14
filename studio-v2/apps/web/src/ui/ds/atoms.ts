import { colors } from './colors';
import { font, radius, space } from './tokens';

export const separatorH = {
  height: 1,
  backgroundColor: colors.border,
} as const;

export const separatorV = {
  width: 1,
  backgroundColor: colors.border,
} as const;

export function iconBadge(color: string, size = 20) {
  return {
    width: size,
    height: size,
    borderRadius: radius?.sm || 3,
    backgroundColor: color + '18',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}

export const codeBlock = {
  fontFamily: 'monospace' as any,
  fontSize: font?.size?.xs || 10,
  color: colors.text,
  backgroundColor: colors.bg,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius?.md || 4,
  padding: space?.[4] || 8,
} as const;

export function badge(color: string) {
  return {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius?.full || 9999,
    backgroundColor: color + '14',
  } as const;
}
