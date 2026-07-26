/**
 * SwiperLayout Style - Web Variant
 *
 * @description
 * Generates CSS styles for horizontal swiper/carousel layout with viewport sizing.
 * Returns React.CSSProperties compatible with web rendering.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Uses CSS 100vw and 100% instead of React Native Dimensions.get('window').width.
 * Provides flex container and slide sizing for swipe/carousel interactions.
 * Flex: 1 ensures full viewport coverage without explicit calculations.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure function with no side effects
 * - 100vw accounts for viewport width dynamically
 * - Flexbox layout for responsive behavior
 * - Suitable for carousel and swipe navigation UIs
 *
 * @example
 * ```typescript
 * const styles = useSwiperLayoutStyle(logic);
 * // styles.container: outer flex wrapper
 * // styles.slide: full-width carousel slide
 * ```
 *
 * @see
 * - SwiperLayout.web.tsx for component rendering
 */

export function useSwiperLayoutStyle(_logic: any) {
  return {
    container: {
      flex: 1,
    } as React.CSSProperties,

    slide: {
      width: '100vw',
      flex: 1,
    } as React.CSSProperties,
  };
}
