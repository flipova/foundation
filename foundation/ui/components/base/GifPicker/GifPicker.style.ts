import { useMemo } from 'react';

export function useGifPickerStyle(logic: any) {
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
      justifyContent: 'space-between',
    },
    gifBtn: {
      width: '48%', // Masonry-like 2 columns
      height: 140,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#F7FAFC',
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      position: 'relative',
    },
    gifBtnSelected: {
      borderColor: '#3182CE',
    },
    gifImg: {
      width: '100%',
      height: '100%',
    },
    selectedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(49, 130, 206, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: '#718096',
      fontWeight: '500',
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
