/**
 * EmojiPicker Style - Web Variant
 *
 * @description
 * Generates CSS styles for emoji picker UI with categories, toggle, and grid.
 * Returns React.CSSProperties compatible with web rendering.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Returns plain React.CSSProperties instead of React Native StyleSheet.
 * Removes Platform.select() calls - sets CSS properties directly.
 * Covers container, toggle buttons, category strip, and emoji grid styling.
 * Supports both standard emojis and animated WebP variants.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure function with no side effects
 * - All styles use standard CSS properties
 * - Smooth transitions on interactions
 * - Responsive scrolling for categories on small screens
 *
 * @example
 * ```typescript
 * const styles = useEmojiPickerStyle(logic);
 * // styles.container: outer wrapper
 * // styles.grid: emoji selection grid
 * // styles.categoryBtn: category filter buttons
 * ```
 *
 * @see
 * - EmojiPicker.logic for state management
 * - EmojiPicker.web.tsx for component rendering
 */

import { useMemo } from 'react';

export function useEmojiPickerStyle(logic: any) {
  return useMemo(() => ({
    container: {
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderRadius: 24,
      width: '100%',
      maxWidth: 400,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.10)',
      boxSizing: 'border-box',
    } as React.CSSProperties,

    typeToggleContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 16,
      backgroundColor: '#F1F5F9',
      borderRadius: 12,
      padding: 4,
    } as React.CSSProperties,

    typeBtn: {
      flex: 1,
      paddingTop: 10,
      paddingBottom: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      cursor: 'pointer',
      border: 'none',
      background: 'none',
    } as React.CSSProperties,

    typeBtnActive: {
      backgroundColor: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    } as React.CSSProperties,

    typeText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#64748B',
    } as React.CSSProperties,

    typeTextActive: {
      color: '#0F172A',
    } as React.CSSProperties,

    categoriesScroll: {
      overflowX: 'auto',
      flexShrink: 0,
      marginBottom: 16,
    } as React.CSSProperties,

    categoriesContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12,
      paddingBottom: 4,
      overflowX: 'auto',
    } as React.CSSProperties,

    categoryBtn: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: 20,
      backgroundColor: '#F8FAFC',
      border: '1px solid #E2E8F0',
      gap: 6,
      marginRight: 8,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    } as React.CSSProperties,

    categoryBtnActive: {
      backgroundColor: '#EFF6FF',
      borderColor: '#BFDBFE',
    } as React.CSSProperties,

    categoryIcon: {
      fontSize: 14,
    } as React.CSSProperties,

    categoryText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#475569',
    } as React.CSSProperties,

    categoryTextActive: {
      color: '#2563EB',
    } as React.CSSProperties,

    grid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'flex-start',
    } as React.CSSProperties,

    emojiBtn: {
      width: 52,
      height: 52,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 26,
      backgroundColor: '#FFFFFF',
      margin: 4,
      cursor: 'pointer',
      border: 'none',
      transition: 'background-color 100ms ease',
    } as React.CSSProperties,

    selected: {
      backgroundColor: '#EFF6FF',
      outline: '2px solid #3B82F6',
    } as React.CSSProperties,

    emojiText: {
      fontSize: 32,
      lineHeight: 1,
    } as React.CSSProperties,

    animatedEmoji: {
      width: 40,
      height: 40,
    } as React.CSSProperties,
  }), [logic]);
}
