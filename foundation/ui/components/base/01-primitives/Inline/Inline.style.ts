export function useInlineStyle(logic: any) {
  return {
    container: {
      // Structural choice: Layout items in a row along the horizontal axis
      flexDirection: 'row',
      // Structural choice: Allow items to naturally wrap to the next line if there's not enough horizontal space
      flexWrap: 'wrap',
      // Structural choice: Use native flexbox gap for uniform spacing between all items (horizontally and vertically)
      gap: logic.gap, // React Native >= 0.71 supports gap!
    }
  };
}
