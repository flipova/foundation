import { Platform } from "react-native";
import { Breakpoint, breakpoints } from '../../tokens';

/**
 * On web: generates CSS classes with media queries to show/hide
 * elements per breakpoint without JavaScript overhead.
 * On native: returns empty styles (JS logic applies).
 */

const breakpointValues: Record<Breakpoint, number> = breakpoints;

const orderedBreakpoints: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

/**
 * Returns a style object that makes the element visible exclusively
 * for the provided breakpoints via CSS media queries on web.
 * On native, returns an empty style object.
 *
 * @example
 * // Visible exclusively on mobile
 * <Box style={showOnly(["xs", "sm"])} />
 *
 * // Visible exclusively on desktop
 * <Box style={showOnly(["md", "lg", "xl", "2xl"])} />
 * 
 * @param visibleAt - Array of breakpoints where the element should be displayed.
 * @returns Style object applicable to a component to control visibility.
 */
export const showOnly = (visibleAt: Breakpoint[]): any => {
  if (Platform.OS !== "web") return {};

  // Build media queries to hide element outside target breakpoints
  const minBp = visibleAt.reduce((min, bp) => {
    return breakpointValues[bp] < breakpointValues[min] ? bp : min;
  }, visibleAt[0]);

  const maxBp = visibleAt.reduce((max, bp) => {
    return breakpointValues[bp] > breakpointValues[max] ? bp : max;
  }, visibleAt[0]);

  const minIndex = orderedBreakpoints.indexOf(minBp);
  const maxIndex = orderedBreakpoints.indexOf(maxBp);
  const nextBp = orderedBreakpoints[maxIndex + 1];

  const minWidth = breakpointValues[minBp];
  const maxWidth = nextBp ? breakpointValues[nextBp] - 1 : undefined;

  // CSS injection in document head — once per breakpoint combination
  const key = visibleAt.sort().join("-");
  injectResponsiveStyle(key, minWidth, maxWidth);

  return { $$css: true, _: `responsive-show-${key}` } as any;
};

/**
 * Inverse of showOnly: hides the element at specified breakpoints.
 * 
 * @param hiddenAt - Array of breakpoints where the element should be hidden.
 * @returns Style object applicable to a component to manage visibility.
 */
export const hideAt = (hiddenAt: Breakpoint[]): any => {
  const allBp = orderedBreakpoints.filter((bp) => !hiddenAt.includes(bp));
  return showOnly(allBp);
};

// Cache to prevent duplicate CSS injection
const injected = new Set<string>();

const injectResponsiveStyle = (
  key: string,
  minWidth: number,
  maxWidth: number | undefined,
) => {
  if (injected.has(key) || typeof document === "undefined") return;
  injected.add(key);

  const className = `responsive-show-${key}`;
  const mediaQuery = maxWidth
    ? `@media (max-width: ${minWidth - 1}px), (min-width: ${maxWidth + 1}px)`
    : `@media (max-width: ${minWidth - 1}px)`;

  const css = `
    .${className} { display: flex; }
    ${mediaQuery} { .${className} { display: none !important; } }
  `;

  const style = document.createElement("style");
  style.setAttribute("data-responsive-key", key);
  style.textContent = css;
  document.head.appendChild(style);
};