import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Hook pour accéder aux dimensions des zones sécurisées
 * @returns Objet contenant les dimensions des zones sécurisées
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
