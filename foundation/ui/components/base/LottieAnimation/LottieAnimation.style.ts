
export function useLottieAnimationStyle(logic: any) {
  return {
    container: {
      // flex: 1 allows the container to expand, accommodating the animation.
      flex: 1,
      // Provides a fallback minimum height so the animation is visible even without explicit dimensions.
      minHeight: 100,
    }
  };
}
