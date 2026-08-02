
export function useSystemLayoutStyle(logic: any) {
  return {
    /**
     * Container uses flex: 1 to ensure it occupies all available screen real estate 
     * within the safe area boundaries.
     */
    container: {
      flex: 1,
    }
  };
}
