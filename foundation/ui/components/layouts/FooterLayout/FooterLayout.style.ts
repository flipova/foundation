/**
 * Styles for the FooterLayout component.
 * 
 * Structural choices:
 * - 'container' uses column flex direction to stack content vertically.
 * - 'content' gets flex: 1 to expand and take up all remaining vertical space above the footer.
 * - 'footer' retains its intrinsic height and uses z-index to overlay if ever needed.
 */
export function useFooterLayoutStyle(logic: any) {
  return {
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    content: {
      flex: 1,
    },
    footer: {
      zIndex: 5,
    }
  };
}
