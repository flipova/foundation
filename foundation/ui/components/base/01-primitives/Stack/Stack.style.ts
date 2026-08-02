export function useStackStyle(logic: any) {
  return {
    container: {
      // Structural choice: Defines the main axis for stacking items (either row or column)
      flexDirection: logic.direction,
      // Structural choice: Uses native flexbox gap for consistent spacing without needing child margins
      gap: logic.gap, // Requires RN 0.71+
    }
  };
}
