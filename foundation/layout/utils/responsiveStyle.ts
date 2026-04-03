import { Platform } from "react-native";
import { Breakpoint, breakpoints } from "../../tokens/breakpoints";

/**
 * Sur web : génère des classes CSS avec media queries pour afficher/cacher
 * des éléments selon le breakpoint, sans JavaScript.
 * Sur native : retourne des styles vides (la logique JS reste reine).
 */

const breakpointValues: Record<Breakpoint, number> = breakpoints;

const orderedBreakpoints: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"];

/**
 * Retourne un style qui rend l'élément visible uniquement
 * pour les breakpoints fournis, via CSS media queries sur web.
 * Sur native, retourne un style vide (à combiner avec logique JS).
 *
 * @example
 * // Visible uniquement sur mobile
 * <Box style={showOnly(["xs", "sm"])} />
 *
 * // Visible uniquement sur desktop
 * <Box style={showOnly(["md", "lg", "xl", "2xl"])} />
 */
export const showOnly = (visibleAt: Breakpoint[]): any => {
  if (Platform.OS !== "web") return {};

  // Construit les media queries pour cacher l'élément en dehors des breakpoints cibles
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

  // Injection CSS dans le head — une seule fois par combinaison
  const key = visibleAt.sort().join("-");
  injectResponsiveStyle(key, minWidth, maxWidth);

  return { $$css: true, _: `responsive-show-${key}` } as any;
};

/**
 * Inverse de showOnly : cache l'élément aux breakpoints fournis.
 */
export const hideAt = (hiddenAt: Breakpoint[]): any => {
  const allBp = orderedBreakpoints.filter((bp) => !hiddenAt.includes(bp));
  return showOnly(allBp);
};

// Cache pour éviter les injections dupliquées
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