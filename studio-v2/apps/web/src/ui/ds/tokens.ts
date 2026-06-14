// ─────────────────────────────────────────────────────────────────────────────
// Studio Design System — Tokens
// ─────────────────────────────────────────────────────────────────────────────

export const space = {
  0:  0,
  1:  2,
  2:  4,
  3:  6,
  4:  8,
  5:  10,
  6:  12,
  7:  14,
  8:  16,
  10: 20,
  12: 24,
  16: 32,
} as const;

// Lexend — clean geometric sans, highly legible at small sizes
export const font = {
  family: 'Lexend' as any,
  size: {
    xxs:  8,
    xs:   10,
    sm:   11,
    md:   12,
    base: 13,
    lg:   14,
    xl:   16,
  },
  weight: {
    normal: '300' as const,  // Lexend Light
    medium: '400' as const,  // Lexend Regular
    semi:   '500' as const,  // Lexend Medium
    bold:   '600' as const,  // Lexend SemiBold
  },
} as const;

export const radius = {
  xs:   2,
  sm:   3,
  md:   4,
  lg:   6,
  xl:   8,
  full: 9999,
} as const;

export const height = {
  topbar:    40,
  statusbar: 20,
  tab:       30,
  row:       28,
  input:     30,
} as const;

export const zIndex = {
  base:    0,
  panel:   10,
  overlay: 100,
  modal:   200,
  tooltip: 300,
} as const;
