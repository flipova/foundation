import { useMemo } from 'react';

export function useIconPickerStyle(logic: any) {
  return useMemo(() => ({
    container: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
      borderWidth: 1,
      borderColor: '#F0F0F0',
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1A202C',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F7FAFC',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      paddingHorizontal: 12,
      marginBottom: 20,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: '#2D3748',
    },
    clearBtn: {
      padding: 4,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'flex-start',
    },
    iconBtn: {
      width: '21%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      backgroundColor: '#F7FAFC',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    iconBtnSelected: {
      backgroundColor: '#3182CE',
      borderColor: '#3182CE',
      shadowColor: '#3182CE',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    emptyContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      marginTop: 12,
      fontSize: 16,
      color: '#A0AEC0',
      fontWeight: '500',
    }
  }), [logic]);
}
