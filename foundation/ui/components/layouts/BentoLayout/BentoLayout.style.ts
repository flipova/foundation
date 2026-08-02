
export function useBentoLayoutStyle(logic: any) {
  return {
    // Uses flex-wrap to allow bento items to flow to subsequent rows.
    // 'gap' establishes spacing between items consistently.
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: logic.gap,
    },
    // Large items consume the full row width to act as heroes or featured content.
    itemLarge: { flexBasis: '100%', height: 300, marginBottom: logic.gap },
    // Medium items take slightly less than half the space, accommodating the gap.
    itemMedium: { flexBasis: '48%', height: 200, marginBottom: logic.gap },
    // Small items divide into roughly thirds of the row width.
    itemSmall: { flexBasis: '31%', height: 150, marginBottom: logic.gap },
  };
}
