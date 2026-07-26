/**
 * NumberInput.style — Web variant
 *
 * Returns plain React.CSSProperties instead of React Native StyleSheet.
 * useTheme is platform-agnostic so it can be imported as-is.
 */

import { useMemo } from 'react';
import { useTheme } from '../../../../theme/providers/ThemeProvider';

export function useNumberInputStyle(logic: any) {
  const { theme } = useTheme();

  return useMemo(() => {
    let borderColor = theme?.border ?? '#e5e7eb';
    if (logic.error) borderColor = theme?.destructive ?? '#ef4444';
    else if (logic.isFocused) borderColor = theme?.ring ?? theme?.primary ?? '#3b82f6';

    return {
      wrapper: {
        marginBottom: logic.error ? 4 : 0,
      } as React.CSSProperties,

      container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: theme?.background ?? '#ffffff',
        transition: 'border-color 150ms ease',
      } as React.CSSProperties,

      button: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: theme?.muted ?? '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        border: 'none',
        userSelect: 'none',
        transition: 'background-color 100ms ease',
      } as React.CSSProperties,

      buttonPressed: {
        backgroundColor: theme?.border ?? '#e5e7eb',
      } as React.CSSProperties,

      buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme?.foreground ?? '#111827',
        lineHeight: 1,
      } as React.CSSProperties,

      input: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        color: theme?.foreground ?? '#111827',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        width: '100%',
      } as React.CSSProperties,

      errorText: {
        color: theme?.destructive ?? '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
      } as React.CSSProperties,
    };
  }, [logic.error, logic.isFocused, theme]);
}
