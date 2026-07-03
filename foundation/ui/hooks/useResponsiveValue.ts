import { ResponsiveValue, getResponsiveValue } from "../utils/responsive";
import { useBreakpoint } from "./useBreakpoint";

export const useResponsiveValue = <T>(value: ResponsiveValue<T>): T | null => {
  const { breakpoint } = useBreakpoint();
  if (!breakpoint) return null;
  return getResponsiveValue(value, breakpoint);
};