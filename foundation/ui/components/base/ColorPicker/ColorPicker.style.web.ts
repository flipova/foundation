/**
 * ColorPicker Style - Web Variant
 *
 * @description
 * Generates CSS styles for color picker UI components with panel, sliders, and swatches.
 * Returns React.CSSProperties compatible with web rendering.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Returns plain React.CSSProperties objects instead of React Native StyleSheet.
 * Covers container, panels, sliders, preview, and swatches styling.
 * Uses flexbox and modern CSS properties for layout.
 * Memoized for performance with dependency on logic changes.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure function with no side effects
 * - All styles use standard CSS properties
 * - Smooth shadows and borders for polished look
 * - Responsive max-width constraint for large screens
 *
 * @example
 * ```typescript
 * const styles = useColorPickerStyle(logic);
 * // styles.container: outer panel wrapper
 * // styles.panelContainer: color selection panel
 * // styles.sliderContainer: hue/value slider
 * // styles.previewContainer: current color preview
 * ```
 *
 * @see
 * - ColorPicker.logic.web.ts for logic layer
 * - ColorPicker.web.tsx for component rendering
 */

import { useMemo } from 'react';

export function useColorPickerStyle(logic: any) {
  return useMemo(() => ({
    container: {
      padding: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      boxSizing: 'border-box',
    } as React.CSSProperties,

    panelContainer: {
      height: 220,
      marginBottom: 20,
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.10)',
    } as React.CSSProperties,

    sliderContainer: {
      marginBottom: 20,
      borderRadius: 12,
      overflow: 'hidden',
      height: 24,
    } as React.CSSProperties,

    previewContainer: {
      marginBottom: 20,
      height: 48,
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(0, 0, 0, 0.10)',
    } as React.CSSProperties,

    swatchesContainer: {
      marginTop: 8,
    } as React.CSSProperties,

    titleContainer: {
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,

    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333333',
      letterSpacing: '0.5px',
    } as React.CSSProperties,
  }), [logic]);
}
