
export function useAuthLayoutStyle(logic: any) {
  return {
    // Defines a row-oriented flex container to place the image and form side by side.
    // Fills the entire available space (flex: 1).
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    // Consumes 50% of the space when present. Uses display: 'none' to completely collapse
    // when no image is provided, ensuring the form takes over.
    imageContainer: {
      flex: 1,
      display: logic.image ? 'flex' : 'none',
    },
    // Form container shares equal flex weight (flex: 1) with the image.
    // Centers content horizontally and vertically using justifyContent and alignItems.
    // Adds padding to ensure inputs do not hit the edge of the screen.
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    }
  };
}
