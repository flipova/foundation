/**
 * OTPInput Style - Web Variant
 *
 * @description
 * Generates CSS styles for OTP input cells with focus and validation states.
 * Returns React.CSSProperties compatible with web rendering.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Returns plain React.CSSProperties instead of React Native StyleSheet.
 * Handles outline suppression via CSS outline property (web-specific).
 * Provides focus and validation styling with smooth transitions.
 * Covers container and individual cell styling.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure function with no side effects
 * - All styles use standard CSS properties
 * - Smooth transitions for focus state changes
 * - Accessible focus indicators with shadow effect
 *
 * @example
 * ```typescript
 * const styles = useOTPInputStyle(logic);
 * // styles.container: flex wrapper for cells
 * // styles.cell: individual OTP input cell
 * // styles.cellFocused: focus state styling
 * ```
 *
 * @see
 * - OTPInput.logic.web.ts for logic layer
 * - OTPInput.web.tsx for component rendering
 */

import { useMemo } from 'react';

export function useOTPInputStyle(logic: any) {
  return useMemo(() => ({
    container: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 16,
    } as React.CSSProperties,

    cell: {
      width: 56,
      height: 64,
      border: '2px solid #E2E8F0',
      borderRadius: 12,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      color: '#1E293B',
      backgroundColor: '#F8FAFC',
      outline: 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
    } as React.CSSProperties,

    cellFocused: {
      borderColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
    } as React.CSSProperties,
  }), [logic]);
}
