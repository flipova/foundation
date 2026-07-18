import { ResponsiveValue, getResponsiveValue } from "../utils/responsive";
import { useBreakpoint } from "./useBreakpoint";

/**
 * Hook permettant de récupérer la valeur responsive appropriée selon le point d'arrêt (breakpoint) courant.
 *
 * @param value - Une configuration de valeurs responsives ou une valeur brute.
 * @returns La valeur correspondant au point d'arrêt actuel, ou null s'il n'est pas encore connu.
 */
export const useResponsiveValue = <T>(value: ResponsiveValue<T>): T | null => {
  const { breakpoint } = useBreakpoint();
  if (!breakpoint) return null;
  return getResponsiveValue(value, breakpoint);
};