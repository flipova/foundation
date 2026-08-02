
export function useCenteredLayoutStyle(logic: any) {
  return {
    // Flex: 1 to ensure it fills the parent container completely.
    // Center items on both the main axis and cross axis.
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  };
}
