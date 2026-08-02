import { ResponsiveValue, getResponsiveValue } from "../utils/responsive";
import { useBreakpoint } from "./useBreakpoint";

/**
 * Hook to resolve a responsive value configuration based on the current breakpoint.
 *
 * @param value - Responsive value map object or primitive value.
 * @returns Resolved value for active breakpoint, or null if breakpoint is null (e.g. SSR).
 */
export const useResponsiveValue = <T>(value: ResponsiveValue<T>): T | null => {
  const { breakpoint } = useBreakpoint();
  if (!breakpoint) return null;
  return getResponsiveValue(value, breakpoint);
};