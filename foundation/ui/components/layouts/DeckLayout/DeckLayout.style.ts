
export function useDeckLayoutStyle(logic: any) {
  return {
    // Centers the stack of cards in the middle of the screen.
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Absolute positioning allows cards to overlap each other (stacked on Z-axis).
    // Adds shadows for a physical card depth effect.
    card: {
      position: 'absolute',
      width: '80%',
      height: '70%',
      backgroundColor: '#fff',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }
  };
}
