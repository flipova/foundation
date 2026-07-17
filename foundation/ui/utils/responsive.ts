import { Dimensions, Platform } from "react-native";
import { Breakpoint, breakpoints } from '../../tokens';

/**
 * Retourne le point d'arrêt (breakpoint) correspondant à la largeur d'écran donnée ou courante.
 *
 * @param innerWidth - Largeur d'écran optionnelle à utiliser (par défaut la largeur de la fenêtre).
 * @returns Le point d'arrêt (ex: xs, sm, md, lg, xl, 2xl).
 */
export const getBreakpoint = (innerWidth?: number): Breakpoint => {
  const width =
    innerWidth ??
    (Platform.OS === "web" && typeof window !== "undefined"
      ? window.innerWidth
      : Dimensions.get("window").width);

  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
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
  if (typeof value !== "object" || value === null) {
    return value as T;
  }

  const responsiveValue = value as Partial<Record<Breakpoint, T>>;
  const orderedBreakpoints: Breakpoint[] = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
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