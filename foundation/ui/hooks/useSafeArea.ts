import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Hook to access device safe area inset dimensions.
 *
 * @returns Object containing safe area inset values (top, bottom, left, right, vertical, horizontal).
 */
export const useSafeArea = () => {
  const insets = useSafeAreaInsets();
  
  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    vertical: insets.top + insets.bottom,
    horizontal: insets.left + insets.right,
  };
};
