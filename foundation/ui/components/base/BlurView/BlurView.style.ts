
export function useBlurViewStyle(logic: any) {
  return {
    container: {
      // Use flex: 1 to ensure the BlurView fills its parent container by default.
      // This is typical for background blur overlays.
      flex: 1,
    }
  };
}
