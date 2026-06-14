/**
 * libraryResponsive — Responsive breakpoints and logic for the LibraryPanel.
 * Exported as a separate module to allow pure unit tests without React Native imports.
 */

/** Responsive breakpoints and logic for the LibraryPanel */
export const LIBRARY_RESPONSIVE = {
  /** Minimum panel width */
  MIN_WIDTH: 180,
  /** Maximum panel width */
  MAX_WIDTH: 280,
  /** Below this width, the component subtitle (itemSub) is hidden */
  BREAKPOINT_HIDE_SUBTITLE: 200,
  /** Returns true if the subtitle should be hidden */
  shouldHideSubtitle: (width: number): boolean => width < 200,
} as const;
