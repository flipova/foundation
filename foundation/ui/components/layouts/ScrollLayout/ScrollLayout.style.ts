
export function useScrollLayoutStyle(logic: any) {
  return {
    /**
     * The scroll container fills the available space by default.
     * Content inside can expand beyond bounds to enable scrolling.
     */
    container: {
      flex: 1,
    }
  };
}
