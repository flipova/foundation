/**
 * Styles for the GridLayout component.
 * 
 * Structural choices:
 * - flexWrap: 'wrap' allows children to flow onto the next row once a row is full.
 * - flexDirection: 'row' builds the grid from left to right.
 * - flexBasis dynamically calculates item width to fit `logic.columns` items per row.
 * - padding mimics the grid gap on individual items (native gap behavior may vary depending on React Native version and setup).
 */
export function useGridLayoutStyle(logic: any) {
  return {
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: logic.gap,
    },
    item: {
      // Approximating grid with flexBasis on Native
      flexBasis: `${100 / logic.columns}%`,
      // Subtracting gap compensation roughly
      padding: logic.gap / 2,
    }
  };
}
