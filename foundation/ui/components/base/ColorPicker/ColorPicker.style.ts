import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

/**
 * Custom hook to generate the styles for the ColorPicker component.
 * @param logic The logic state from useColorPickerLogic.
 * @returns A StyleSheet object containing the component styles.
 */
export function useColorPickerStyle(logic: any) {
  return useMemo(() => StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    panelContainer: {
      height: 220,
      marginBottom: 20,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sliderContainer: {
      marginBottom: 20,
      borderRadius: 12,
      overflow: 'hidden',
      height: 24,
    },
    previewContainer: {
      marginBottom: 20,
      height: 48,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    swatchesContainer: {
      marginTop: 8,
    },
    titleContainer: {
      marginBottom: 16,
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333333',
      letterSpacing: 0.5,
    }
  }), [logic]);
}
