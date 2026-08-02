/**
 * Styles for the LeftDrawerLayout component.
 * 
 * Structural choices:
 * - 'container' acts as the main wrapper, filling available space with flex: 1.
 * - 'overlay' covers the entire screen absolutely using top/bottom/left/right: 0, with a semi-transparent black background. It sits above the main content (zIndex: 10).
 * - 'drawer' is absolutely positioned on the left side, with a fixed width, and sits above the overlay (zIndex: 20).
 */
export function useLeftDrawerLayoutStyle(logic: any) {
  return {
    container: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0, bottom: 0, left: 0, right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 10,
    },
    drawer: {
      position: 'absolute',
      top: 0, bottom: 0, left: 0,
      width: 280,
      backgroundColor: '#fff',
      zIndex: 20,
    }
  };
}
