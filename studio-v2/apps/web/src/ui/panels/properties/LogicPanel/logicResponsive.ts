/**
 * logicResponsive — Responsive breakpoints and logic for the LogicPanel.
 * Exported as a separate module to allow pure unit tests without React Native imports.
 */

/** Responsive breakpoints and logic for the LogicPanel */
export const LOGIC_RESPONSIVE = {
  /** Minimum panel width */
  MIN_WIDTH: 220,
  /** Maximum panel width */
  MAX_WIDTH: 360,
  /** Below this width, binding fields switch to single column (full width) */
  BREAKPOINT_SINGLE_COLUMN: 260,
  /** Returns true if binding fields should use single column layout */
  shouldUseSingleColumn: (width: number): boolean => width < 260,
} as const;
