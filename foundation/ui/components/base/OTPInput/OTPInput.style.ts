import { useMemo } from 'react';
import { StyleSheet, Platform } from 'react-native';

export function useOTPInputStyle(logic: any) {
  return useMemo(() => {
    return StyleSheet.create({
      container: { 
        flexDirection: 'row', 
        gap: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
      },
      containerError: {
        opacity: 0.7,
      },
      cell: { 
        width: 56, 
        height: 64, 
        borderWidth: 2, 
        borderColor: '#E2E8F0', 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center',
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#1E293B',
        backgroundColor: '#F8FAFC',
        ...Platform.select({
          web: {
            // @ts-ignore
            outlineStyle: 'none',
          }
        })
      },
      cellFocused: {
        borderColor: '#3B82F6',
        backgroundColor: '#FFFFFF',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      },
      cellError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEE2E2',
      }
    });
  }, [logic]);
}
