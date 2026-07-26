/**
 * SearchInput.style — Web variant
 *
 * Returns plain React.CSSProperties. Replaces the RN-only outlineStyle hack
 * with standard CSS `outline: 'none'`.
 */

import { useMemo } from 'react';

export function useSearchInputStyle(logic: any) {
  return useMemo(() => ({
    wrapper: {
      width: '100%',
      marginBottom: 16,
    } as React.CSSProperties,

    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      border: '1.5px solid #e2e8f0',
      borderRadius: 24,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: '#f8fafc',
      boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
      transition: 'border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
    } as React.CSSProperties,

    containerFocused: {
      borderColor: '#3b82f6',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.10)',
    } as React.CSSProperties,

    input: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: '#334155',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      width: '100%',
    } as React.CSSProperties,

    iconLeft: {
      marginRight: 10,
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    } as React.CSSProperties,

    iconRight: {
      padding: 6,
      marginLeft: 8,
      borderRadius: 16,
      backgroundColor: '#f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: 'none',
      flexShrink: 0,
    } as React.CSSProperties,
  }), [logic]);
}
