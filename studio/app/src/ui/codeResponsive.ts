/**
 * codeResponsive — Responsive breakpoints and logic for the CodePanel.
 * Exported as a separate module to allow pure unit tests without React Native imports.
 */

/** Responsive breakpoints and logic for the CodePanel */
export const CODE_RESPONSIVE = {
  /** Below this total width, the file explorer is reduced to EXPLORER_WIDTH_COMPACT */
  BREAKPOINT_COMPACT_EXPLORER: 600,
  /** Normal explorer width */
  EXPLORER_WIDTH_NORMAL: 200,
  /** Compact explorer width (used below BREAKPOINT_COMPACT_EXPLORER) */
  EXPLORER_WIDTH_COMPACT: 140,
  /** Returns the explorer width based on the total panel width */
  getExplorerWidth: (totalWidth: number): number =>
    totalWidth < 600 ? 140 : 200,
} as const;
