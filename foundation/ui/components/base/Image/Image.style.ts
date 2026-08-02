
export function useImageStyle(logic: any) {
  return {
    container: {
      // Prevents the image from rendering outside the boundaries of this container,
      // particularly useful when applying border radii to the container.
      overflow: 'hidden',
    },
    image: {
      // Ensures the ExpoImage element fills the entire container by default.
      width: '100%',
      height: '100%',
    }
  };
}
