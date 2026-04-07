/**
 * designResponsive — Responsive breakpoints and logic for the DesignPanel.
 * Exported as a separate module to allow pure unit tests without React Native imports.
 */

/** Responsive breakpoints and logic for the DesignPanel */
export const DESIGN_RESPONSIVE = {
  /** Minimum panel width */
  MIN_WIDTH: 220,
  /** Maximum panel width */
  MAX_WIDTH: 360,
  /** Below this width, NRow fields switch from 4 columns to 2 columns */
  BREAKPOINT_TWO_COLUMNS: 260,
  /** Returns true if NRow should use 2 columns instead of 4 */
  shouldUseTwoColumns: (width: number): boolean => width < 260,
} as const;
