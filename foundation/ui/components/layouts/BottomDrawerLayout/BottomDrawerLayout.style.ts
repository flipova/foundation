
export function useBottomDrawerLayoutStyle(logic: any) {
  return {
    // Fills the screen to contain both main content and absolute-positioned drawer overlays.
    container: {
      flex: 1,
    },
    // Covers the entire screen. Uses z-index: 10 to sit above children, but below the drawer.
    overlay: {
      position: 'absolute',
      top: 0, bottom: 0, left: 0, right: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 10,
    },
    // Anchors to the bottom of the screen. Uses a higher z-index (20) to sit above the overlay.
    drawer: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      minHeight: 200,
      backgroundColor: '#fff',
      zIndex: 20,
    }
  };
}
