import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { PasswordStrength } from './PasswordInput.logic';

export function usePasswordInputStyle(logic: any) {
  return useMemo(() => {
    const strengthColors: Record<PasswordStrength, string> = {
      weak: '#ff4d4f',
      fair: '#faad14',
      good: '#52c41a',
      strong: '#13c2c2',
    };

    const strengthColor = logic.strength.score > 0 ? strengthColors[logic.strength.label as PasswordStrength] : '#e8e8e8';

    return StyleSheet.create({
      wrapper: {
        width: '100%',
        marginBottom: 16,
      },
      container: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderWidth: 1.5, 
        borderColor: '#d9d9d9', 
        borderRadius: 12, 
        paddingHorizontal: 14,
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
      },
      containerFocused: {
        borderColor: '#1890ff',
      },
      input: { 
        flex: 1, 
        height: 52, 
        fontSize: 16, 
        color: '#333',
        // @ts-ignore
    outlineStyle: "none" as any,
      },
      icon: { 
        padding: 8,
        marginLeft: 8,
      },
      iconText: {
        fontSize: 14,
        color: '#1890ff',
        fontWeight: '600',
      },
      strengthContainer: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      barsContainer: {
        flexDirection: 'row',
        flex: 1,
        gap: 6,
        marginRight: 12,
      },
      strengthBar: {
        height: 4,
        flex: 1,
        borderRadius: 2,
        backgroundColor: '#e8e8e8',
      },
      strengthBarActive: {
        backgroundColor: strengthColor,
      },
      strengthText: {
        fontSize: 12,
        color: '#8c8c8c',
        fontWeight: '500',
        textTransform: 'capitalize',
        width: 45,
        textAlign: 'right',
      }
    });
  }, [logic.strength]);
}
