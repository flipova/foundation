import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

/**
 * Custom hook to generate the styles for the AvatarPicker component.
 * @param logic The logic state from useAvatarPickerLogic.
 * @returns A StyleSheet object containing the component styles.
 */
export function useAvatarPickerStyle(logic: any) {
  return useMemo(() => StyleSheet.create({
    container: {
      padding: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1C1C1E',
      letterSpacing: 0.3,
    },
    uploadBtn: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: '#EBF4FF',
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    uploadBtnText: {
      color: '#007AFF',
      fontWeight: '600',
      fontSize: 14,
    },
    previewContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    mainAvatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    mainAvatarPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#F2F2F7',
      borderWidth: 4,
      borderColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    placeholderText: {
      color: '#8E8E93',
      fontSize: 16,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#3A3A3C',
      marginBottom: 12,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center',
    },
    avatarBtn: {
      width: 64,
      height: 64,
      borderRadius: 32,
      padding: 2,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    avatarBtnSelected: {
      borderColor: '#007AFF',
      backgroundColor: '#FFFFFF',
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    avatarImg: {
      width: '100%',
      height: '100%',
      borderRadius: 30,
    }
  }), [logic]);
}
