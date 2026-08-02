/**
 * Styles for the FlexLayout component.
 * 
 * Structural choices:
 * - flex: 1 enables the container to expand and fill available space.
 * - flexDirection determines the primary axis of arrangement based on logic.
 * - gap provides a consistent spacing between child elements using flex gap.
 */
export function useFlexLayoutStyle(logic: any) {
  return {
    container: {
      flex: 1,
      flexDirection: logic.direction,
      gap: logic.gap,
    }
  };
}
