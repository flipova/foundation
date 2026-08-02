export function usePressableStyle(logic: any) {
  return {
    container: {
      // Provide visual feedback by lowering opacity when disabled.
      // This structural choice ensures standard disabled semantics without needing extra wrappers.
      opacity: logic.disabled ? 0.5 : 1,
    }
  };
}
