import { useMemo } from 'react';

export function useTutoLayoutStyle(logic: any) {
  return useMemo(() => ({
    container: {
      flex: 1,
      position: 'relative',
    },
    tooltipContainer: {
      width: 250,
      maxWidth: '80%',
    },
    tooltipCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
    tooltipTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 6,
      color: '#1A1A1A',
    },
    tooltipDesc: {
      fontSize: 14,
      color: '#666',
      marginBottom: 12,
      lineHeight: 20,
    },
    tooltipActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 8,
    },
    tooltipBtn: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    tooltipBtnPrimary: {
      backgroundColor: '#4A90E2',
    },
    tooltipBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4A90E2',
    }
  }), [logic]);
}
