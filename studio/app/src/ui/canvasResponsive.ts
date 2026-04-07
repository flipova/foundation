/**
 * canvasResponsive — Responsive breakpoints and logic for the DeviceCanvas.
 * Exported as a separate module to allow pure unit tests without React Native imports.
 */

/** Responsive breakpoints and logic for the DeviceCanvas */
export const CANVAS_RESPONSIVE = {
  /** Below this central width, zoom is automatically reduced to fit the device */
  BREAKPOINT_REDUCE_ZOOM: 320,

  /** Padding around the device in the canvas viewport (px, each side) */
  CANVAS_PADDING: 48,

  /**
   * Calculates the initial zoom (0–100) so the device fits entirely in the available canvas width.
   * @param canvasWidth  Available central width in pixels
   * @param deviceWidth  Device frame width in pixels (at 100% zoom)
   * @returns Zoom value in percent (clamped between 10 and 100)
   */
  calculateInitialZoom: (canvasWidth: number, deviceWidth: number): number => {
    if (deviceWidth <= 0 || canvasWidth <= 0) return 100;
    const available = canvasWidth - CANVAS_RESPONSIVE.CANVAS_PADDING * 2;
    if (available <= 0) return 10;
    const ratio = available / deviceWidth;
    const zoom = Math.floor(ratio * 100);
    return Math.max(10, Math.min(100, zoom));
  },

  /**
   * Returns true when the canvas width is below the threshold that requires zoom reduction.
   * @param canvasWidth  Available central width in pixels
   */
  shouldReduceZoom: (canvasWidth: number): boolean =>
    canvasWidth < CANVAS_RESPONSIVE.BREAKPOINT_REDUCE_ZOOM,
} as const;
