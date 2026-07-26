/**
 * PasswordInput Style - Web Variant
 *
 * @description
 * Generates CSS styles for password input with strength meter indicator.
 * Returns React.CSSProperties compatible with web rendering.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Returns plain React.CSSProperties objects for all UI elements.
 * Handles outline suppression via CSS outline: 'none' instead of React Native outlineStyle.
 * Color-codes strength meter based on password score (red, orange, green, cyan).
 * Uses CSS flexbox for responsive layout.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure function with no side effects
 * - All styles use standard CSS properties
 * - Strength colors: weak=#ff4d4f, fair=#faad14, good=#52c41a, strong=#13c2c2
 * - Memoized for performance with dependency on strength changes
 *
 * @example
 * ```typescript
 * const styles = usePasswordInputStyle(logic);
 * // styles.container: flexbox container with border
 * // styles.input: text input with outline suppression
 * // styles.strengthBar: animated color bar indicating strength
 * // styles.strengthText: label (weak/fair/good/strong)
 * ```
 *
 * @see
 * - PasswordInput.logic.web.ts for logic and strength calculation
 * - PasswordInput.web.tsx for component rendering
 */

import { useMemo } from 'react';
import { PasswordStrength } from './PasswordInput.logic';

export function usePasswordInputStyle(logic: any) {
  return useMemo(() => {
    const strengthColors: Record<PasswordStrength, string> = {
      weak: '#ff4d4f',
      fair: '#faad14',
      good: '#52c41a',
      strong: '#13c2c2',
    };

    const strengthColor =
      logic.strength.score > 0
        ? strengthColors[logic.strength.label as PasswordStrength]
        : '#e8e8e8';

    return {
      wrapper: {
        width: '100%',
        marginBottom: 16,
      } as React.CSSProperties,

      container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: '1.5px solid #d9d9d9',
        borderRadius: 12,
        paddingLeft: 14,
        paddingRight: 14,
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        transition: 'border-color 150ms ease',
      } as React.CSSProperties,

      containerFocused: {
        borderColor: '#1890ff',
      } as React.CSSProperties,

      input: {
        flex: 1,
        height: 52,
        fontSize: 16,
        color: '#333',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        width: '100%',
      } as React.CSSProperties,

      icon: {
        padding: 8,
        marginLeft: 8,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
      } as React.CSSProperties,

      iconText: {
        fontSize: 14,
        color: '#1890ff',
        fontWeight: '600',
      } as React.CSSProperties,

      strengthContainer: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      } as React.CSSProperties,

      barsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        gap: 6,
        marginRight: 12,
      } as React.CSSProperties,

      strengthBar: {
        height: 4,
        flex: 1,
        borderRadius: 2,
        backgroundColor: '#e8e8e8',
        transition: `background-color 300ms ease`,
      } as React.CSSProperties,

      strengthBarActive: {
        backgroundColor: strengthColor,
      } as React.CSSProperties,

      strengthText: {
        fontSize: 12,
        color: '#8c8c8c',
        fontWeight: '500',
        textTransform: 'capitalize',
        width: 45,
        textAlign: 'right',
      } as React.CSSProperties,
    };
  }, [logic.strength]);
}
