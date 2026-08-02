import { Dimensions, Platform } from "react-native";
import { Breakpoint, breakpoints } from '../../tokens';

/**
 * Returns the breakpoint token corresponding to a given or current viewport width.
 *
 * @param innerWidth - Optional viewport width (defaults to window/screen width).
 * @returns The active breakpoint token ('xs', 'sm', 'md', 'lg', 'xl', '2xl').
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
 * Type representing a responsive value (primitive value or a record map of breakpoint tokens to values).
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Resolves a value for a specific breakpoint from a ResponsiveValue configuration.
 * Handles fallback resolution by searching down to nearest lower breakpoint.
 *
 * @param value - Primitive value or responsive value map.
 * @param currentBreakpoint - Current reference breakpoint.
 * @returns Resolved value for active breakpoint.
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