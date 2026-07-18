
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export function useSwiperLayoutStyle(logic: any) {
  return {
    /**
     * Container uses flex: 1 to fill available vertical space, 
     * ensuring the horizontal ScrollView works correctly.
     */
    container: {
      flex: 1,
    },
    /**
     * Each slide takes the full width of the screen to ensure proper 
     * pagination snapping in the horizontal scroll view.
     */
    slide: {
      width,
      flex: 1,
    }
  };
}
