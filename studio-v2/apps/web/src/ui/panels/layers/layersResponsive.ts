/**
 * layersResponsive — Responsive breakpoints and logic for the LayersPanel.
 * Exported as a separate module to allow pure unit tests without React Native imports.
 */

/** Responsive breakpoints and logic for the LayersPanel */
export const LAYERS_RESPONSIVE = {
  /** Minimum panel height */
  MIN_HEIGHT: 160,
  /** Maximum panel height */
  MAX_HEIGHT: 320,
  /** Below this height, secondary badges (binding, repeat) are hidden */
  BREAKPOINT_HIDE_SECONDARY_BADGES: 200,
  /** Returns true if secondary badges (binding, repeat) should be hidden */
  shouldHideSecondaryBadges: (height: number): boolean => height < 200,
} as const;
