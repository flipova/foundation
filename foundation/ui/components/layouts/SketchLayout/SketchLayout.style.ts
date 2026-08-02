
export function useSketchLayoutStyle(logic: any) {
  return {
    /**
     * The outermost container takes up the available space and provides 
     * a light background color to simulate a canvas or sketchpad area.
     */
    container: {
      flex: 1,
      // Infinite canvas feel
      backgroundColor: '#f8f9fa',
    }
  };
}
