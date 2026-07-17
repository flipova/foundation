import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export function useSearchInputStyle(logic: any) {
  return useMemo(() => {
    return StyleSheet.create({
      wrapper: {
        width: '100%',
        marginBottom: 16,
      },
      container: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1.5, 
        borderColor: '#e2e8f0', 
        borderRadius: 24, 
        paddingHorizontal: 16,
        backgroundColor: '#f8fafc',
        shadowColor: 'rgba(0,0,0,0.03)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 1,
      },
      containerFocused: {
        borderColor: '#3b82f6',
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(59, 130, 246, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      input: { 
        flex: 1, 
        height: 48, 
        fontSize: 16, 
        color: '#334155',
        // @ts-ignore
    outlineStyle: "none" as any,
      },
      iconLeft: { 
        marginRight: 10,
        color: '#94a3b8',
      },
      iconRight: { 
        padding: 6,
        marginLeft: 8,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
      }
    });
  }, [logic]);
}
