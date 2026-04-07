/**
 * topbarResponsive — Responsive breakpoints and logic for the Topbar.
 * Exported as a separate module to allow pure unit tests without React Native imports.
 */

/** Responsive breakpoints and logic for the Topbar */
export const TOPBAR_RESPONSIVE = {
  /** Below this width, secondary buttons (Import, Export, Reset) are grouped into a dropdown */
  BREAKPOINT_COMPACT: 1024,
  /** Below this width, the "Flipova Studio" text label is hidden (icon only) */
  BREAKPOINT_MINIMAL: 768,
  /** Returns true if secondary buttons should be grouped into a dropdown */
  isCompact: (width: number): boolean => width < 1024,
  /** Returns true if the logo text label should be hidden */
  isMinimal: (width: number): boolean => width < 768,
} as const;
