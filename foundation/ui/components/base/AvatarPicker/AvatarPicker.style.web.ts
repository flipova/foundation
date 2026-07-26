/**
 * AvatarPicker Style - Web Variant
 *
 * @description
 * Generates CSS styles for avatar picker UI including buttons, grid, and preview.
 * Returns React.CSSProperties compatible with web rendering.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Returns plain React.CSSProperties objects instead of React Native StyleSheet.
 * Property names map 1-to-1 with React.CSSProperties for direct spreading in JSX.
 * Covers container, header, preview, upload button, and avatar grid styling.
 * Uses flexbox for responsive layout and transitions for interactions.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure function with no side effects
 * - All styles use standard CSS properties
 * - Smooth transitions on avatar selection (border, shadow)
 * - Responsive design with max-width constraint
 *
 * @example
 * ```typescript
 * const styles = useAvatarPickerStyle(logic);
 * // styles.container: outer wrapper
 * // styles.mainAvatar: large preview (120x120)
 * // styles.avatarBtn: grid item button with selection state
 * // styles.grid: flex container for avatar options
 * ```
 *
 * @see
 * - AvatarPicker.logic.web.ts for logic layer
 * - AvatarPicker.web.tsx for component rendering
 */

import { useMemo } from 'react';

export function useAvatarPickerStyle(logic: any) {
  return useMemo(() => ({
    container: {
      padding: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.10)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      boxSizing: 'border-box',
    } as React.CSSProperties,

    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    } as React.CSSProperties,

    title: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1C1C1E',
      letterSpacing: 0.3,
    } as React.CSSProperties,

    uploadBtn: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: '#EBF4FF',
      borderRadius: 12,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      border: 'none',
    } as React.CSSProperties,

    uploadBtnText: {
      color: '#007AFF',
      fontWeight: '600',
      fontSize: 14,
    } as React.CSSProperties,

    previewContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 24,
    } as React.CSSProperties,

    mainAvatar: {
      width: 120,
      height: 120,
      borderRadius: '50%',
      border: '4px solid #FFFFFF',
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
      objectFit: 'cover',
    } as React.CSSProperties,

    mainAvatarPlaceholder: {
      width: 120,
      height: 120,
      borderRadius: '50%',
      backgroundColor: '#F2F2F7',
      border: '4px solid #FFFFFF',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)',
    } as React.CSSProperties,

    placeholderText: {
      color: '#8E8E93',
      fontSize: 16,
      fontWeight: '500',
    } as React.CSSProperties,

    sectionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: '#3A3A3C',
      marginBottom: 12,
    } as React.CSSProperties,

    grid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center',
    } as React.CSSProperties,

    avatarBtn: {
      width: 64,
      height: 64,
      borderRadius: '50%',
      padding: 2,
      border: '2px solid transparent',
      cursor: 'pointer',
      background: 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
    } as React.CSSProperties,

    avatarBtnSelected: {
      borderColor: '#007AFF',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)',
    } as React.CSSProperties,

    avatarImg: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
    } as React.CSSProperties,
  }), [logic]);
}
