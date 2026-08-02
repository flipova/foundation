/**
 * Styles for the MasonryLayout component.
 * 
 * Structural choices:
 * - 'container' uses flex direction 'row' to arrange columns horizontally.
 * - 'column' uses flex direction 'column' to arrange its assigned items vertically.
 * - gap is applied to both container (for column spacing) and column (for item vertical spacing).
 */
export function useMasonryLayoutStyle(logic: any) {
  return {
    container: {
      flex: 1,
      flexDirection: 'row',
      gap: logic.gap,
    },
    column: {
      flex: 1,
      flexDirection: 'column',
      gap: logic.gap,
    }
  };
}
