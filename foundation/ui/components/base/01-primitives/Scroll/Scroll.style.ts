export function useScrollStyle(logic: any) {
  return {
    container: {
      // Structural choice: flex: 1 allows the ScrollView to expand and fill
      // available space in its parent, ensuring it can become scrollable if content overflows.
      flex: 1,
    }
  };
}
