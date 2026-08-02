
export function useGradientStyle(logic: any) {
  return {
    container: {
      // flex: 1 ensures the gradient expands to fill the available space in its container,
      // allowing it to serve as a background layer.
      flex: 1,
    }
  };
}
