export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  "2xl": 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;
