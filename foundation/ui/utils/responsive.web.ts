/**
 * responsive — Web Variant
 *
 * @description
 * Utility module for responsive breakpoint calculations and value resolution.
 * Determines which breakpoint a given viewport width falls into, and resolves responsive values.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses `window.innerWidth` instead of React Native's Dimensions API.
 * getBreakpoint() maps pixel widths to breakpoint names (xs, sm, md, lg, xl, 2xl).
 * getResponsiveValue() handles responsive object destructuring with fallback logic.
 * Pure utility functions with no side effects or hooks.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure functions suitable for utility usage or within hooks
 * - Responsive value logic cascades to smaller breakpoints (mobile-first fallback)
 * - Breakpoint thresholds defined in tokens module
 *
 * @example
 * ```typescript
 * import { getBreakpoint, getResponsiveValue, Breakpoint } from './responsive.web';
 *
 * // Get current breakpoint
 * const bp: Breakpoint = getBreakpoint(1200); // returns 'lg'
 *
 * // Resolve responsive value with fallback
 * const padding = getResponsiveValue({
 *   xs: 8,
 *   md: 16,
 *   lg: 24,
 * }, 'md'); // returns 16
 * ```
 *
 * @see
 * - useBreakpoint hook for reactive breakpoint monitoring
 * - Breakpoint type definition in tokens
 */

import { Breakpoint, breakpoints } from '../../tokens';

/**
 * Retourne le point d'arrêt (breakpoint) correspondant à la largeur d'écran donnée ou courante.
 *
 * @param innerWidth - Largeur d'écran optionnelle à utiliser (par défaut window.innerWidth).
 * @returns Le point d'arrêt (ex: xs, sm, md, lg, xl, 2xl).
 */
export const getBreakpoint = (innerWidth?: number): Breakpoint => {
  const width =
    innerWidth ??
    (typeof window !== 'undefined' ? window.innerWidth : 0);

  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Type pour une valeur responsive (valeur brute ou objet associant breakpoint et valeur).
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Obtient la valeur correspondante pour un point d'arrêt donné à partir d'un objet ResponsiveValue.
 * Gère le repli (fallback) vers le point d'arrêt inférieur le plus proche.
 *
 * @param value - La valeur ou configuration responsive.
 * @param currentBreakpoint - Le point d'arrêt actuel de référence.
 * @returns La valeur résolue pour le point d'arrêt.
 */
export const getResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  currentBreakpoint: Breakpoint,
): T => {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }

  const responsiveValue = value as Partial<Record<Breakpoint, T>>;
  const orderedBreakpoints: Breakpoint[] = [
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
    '2xl',
  ];
  const currentIndex = orderedBreakpoints.indexOf(currentBreakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    const bp = orderedBreakpoints[i];
    if (responsiveValue[bp] !== undefined) {
      return responsiveValue[bp] as T;
    }
  }

  return responsiveValue[orderedBreakpoints[0]] as T;
};
