
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export function useSwipe2ScreenLayoutStyle(logic: any) {
  return {
    /**
     * Container uses flex: 1 to fill available vertical space, 
     * ensuring the horizontal ScrollView displays its content properly.
     */
    container: {
      flex: 1,
    },
    /**
     * Each screen forces its width to the device width to enable accurate paging 
     * and snaps. It flexes to fill vertical space.
     */
    screen: {
      width,
      flex: 1,
    }
  };
}
