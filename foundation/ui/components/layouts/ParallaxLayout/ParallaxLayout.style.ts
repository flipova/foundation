
export function useParallaxLayoutStyle(logic: any) {
  return {
    /**
     * The main container expands to fill the available space (flex: 1).
     */
    container: {
      flex: 1,
    },
    /**
     * The header is positioned absolutely behind the scroll view content (done in TSX).
     * It uses overflow: hidden to ensure scaled/translated content does not bleed out.
     */
    header: {
      height: logic.headerHeight,
      width: '100%',
      overflow: 'hidden',
    },
    /**
     * The content wrapper fills the remaining space and provides a solid background 
     * to obscure the parallax header as the user scrolls up.
     */
    content: {
      flex: 1,
      backgroundColor: '#fff',
    }
  };
}
