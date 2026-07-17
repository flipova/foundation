export function useCenterStyle(logic: any) {
  return {
    container: {
      // Structural choice: use flexbox to center items.
      // justifyContent centers items along the main axis (vertical by default in React Native)
      justifyContent: 'center',
      // alignItems centers items along the cross axis (horizontal by default)
      alignItems: 'center',
    }
  };
}
