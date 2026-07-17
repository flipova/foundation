
export function useTopDrawerLayoutStyle(logic: any) {
  return {
    /**
     * Main container takes up the entire space using flex: 1.
     */
    container: {
      flex: 1,
    },
    /**
     * The background overlay sits on top of the main content (zIndex: 10) 
     * and covers the full screen to intercept taps for closing the drawer.
     */
    overlay: {
      position: 'absolute',
      top: 0, bottom: 0, left: 0, right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 10,
    },
    /**
     * The drawer itself sits above the overlay (zIndex: 20) at the top of the screen.
     */
    drawer: {
      position: 'absolute',
      top: 0, left: 0, right: 0,
      minHeight: 200,
      backgroundColor: '#fff',
      zIndex: 20,
    }
  };
}
