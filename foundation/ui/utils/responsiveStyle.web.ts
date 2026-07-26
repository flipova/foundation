/**
 * responsiveStyle — Web Variant
 *
 * @description
 * Utility for creating visibility styles tied to breakpoints using CSS media queries.
 * Provides showOnly() and hideAt() functions to conditionally display elements by viewport width.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Dynamically injects CSS media query rules into the document head.
 * showOnly() creates rules that hide elements outside specified breakpoint range.
 * hideAt() inverts the logic to hide at specific breakpoints.
 * Uses caching to avoid duplicate style injection.
 * Returns pseudo-style objects with class names for component styling.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Styles injected only once per breakpoint combination (cached)
 * - Safe for SSR: skips injection if document is undefined
 * - Complementary to Breakpoint useBreakpoint hook for conditional logic
 * - Works with any CSS-in-JS or inline style systems
 *
 * @example
 * ```typescript
 * import { showOnly, hideAt } from './responsiveStyle.web';
 *
 * // Show element only on mobile
 * <div style={showOnly(['xs', 'sm'])}>
 *   Mobile menu
 * </div>
 *
 * // Hide element on desktop
 * <div style={hideAt(['lg', 'xl', '2xl'])}>
 *   Mobile banner
 * </div>
 * ```
 *
 * @see
 * - useBreakpoint hook for reactive visibility logic
 * - CSS media query documentation (MDN)
 */

import { Breakpoint, breakpoints } from '../../tokens';

const breakpointValues: Record<Breakpoint, number> = breakpoints;
const orderedBreakpoints: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

// Cache to avoid duplicate style injection
const injected = new Set<string>();

const injectResponsiveStyle = (
  key: string,
  minWidth: number,
  maxWidth: number | undefined,
): void => {
  if (injected.has(key) || typeof document === 'undefined') return;
  injected.add(key);

  const className = `responsive-show-${key}`;
  const mediaQuery = maxWidth
    ? `@media (max-width: ${minWidth - 1}px), (min-width: ${maxWidth + 1}px)`
    : `@media (max-width: ${minWidth - 1}px)`;

  const css = `
    .${className} { display: flex; }
    ${mediaQuery} { .${className} { display: none !important; } }
  `;

  const style = document.createElement('style');
  style.setAttribute('data-responsive-key', key);
  style.textContent = css;
  document.head.appendChild(style);
};

/**
 * Retourne un style qui rend l'élément visible uniquement
 * pour les breakpoints fournis, via CSS media queries.
 *
 * @param visibleAt - Tableau des breakpoints où l'élément doit être affiché.
 * @returns Un objet style CSS applicable à un composant.
 */
export const showOnly = (visibleAt: Breakpoint[]): any => {
  const minBp = visibleAt.reduce((min, bp) =>
    breakpointValues[bp] < breakpointValues[min] ? bp : min, visibleAt[0]);

  const maxBp = visibleAt.reduce((max, bp) =>
    breakpointValues[bp] > breakpointValues[max] ? bp : max, visibleAt[0]);

  const maxIndex = orderedBreakpoints.indexOf(maxBp);
  const nextBp = orderedBreakpoints[maxIndex + 1];

  const minWidth = breakpointValues[minBp];
  const maxWidth = nextBp ? breakpointValues[nextBp] - 1 : undefined;

  const key = [...visibleAt].sort().join('-');
  injectResponsiveStyle(key, minWidth, maxWidth);

  return { $$css: true, _: `responsive-show-${key}` } as any;
};

/**
 * Inverse de showOnly : cache l'élément aux breakpoints fournis.
 *
 * @param hiddenAt - Tableau des breakpoints où l'élément doit être caché.
 * @returns Un objet style CSS applicable à un composant.
 */
export const hideAt = (hiddenAt: Breakpoint[]): any => {
  const allBp = orderedBreakpoints.filter((bp) => !hiddenAt.includes(bp));
  return showOnly(allBp);
};
