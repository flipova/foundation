/**
 * layoutResponsive — Non-overlap layout logic for the Studio main layout.
 * Exported as a separate module to allow pure unit tests without React Native imports.
 *
 * Validates: Requirements 15.1, 15.2, 15.6
 */

/** Minimum canvas width to guarantee the DeviceCanvas is never covered by side panels */
const MIN_CANVAS_WIDTH = 320;

/** Z-index hierarchy for the Studio layout */
export const Z_INDEX = {
  /** Base panels (LibraryPanel, DeviceCanvas, DesignPanel/LogicPanel) */
  PANEL: 0,
  /** Resize handles sit above panels */
  RESIZE_HANDLE: 100,
  /** Topbar sits above all panels */
  TOPBAR: 200,
  /** Statusbar sits above all panels */
  STATUSBAR: 200,
  /** Dropdowns and context menus sit above topbar */
  DROPDOWN: 300,
  /** Tooltips sit above dropdowns */
  TOOLTIP: 400,
  /** Modals sit above everything else */
  MODAL: 500,
} as const;

/** Responsive breakpoints and layout logic for the Studio main layout */
export const LAYOUT_RESPONSIVE = {
  /** Minimum width of the DeviceCanvas to prevent side panels from covering it */
  MIN_CANVAS_WIDTH,

  /**
   * Clamps a panel width so that the remaining canvas width is at least MIN_CANVAS_WIDTH.
   *
   * @param windowWidth   Total available window width in pixels
   * @param leftWidth     Current left panel width in pixels
   * @param rightWidth    Current right panel width in pixels
   * @param resizeHandles Total width consumed by resize handles (default: 12px for 2 handles)
   * @returns Object with clamped left and right widths
   */
  clampPanelWidths: (
    windowWidth: number,
    leftWidth: number,
    rightWidth: number,
    resizeHandles = 12,
  ): { left: number; right: number } => {
    const available = windowWidth - resizeHandles;
    const maxSidePanels = Math.max(0, available - MIN_CANVAS_WIDTH);

    // Distribute the budget proportionally if both panels exceed the budget
    const total = leftWidth + rightWidth;
    if (total <= maxSidePanels) {
      return { left: leftWidth, right: rightWidth };
    }

    if (maxSidePanels <= 0) {
      return { left: 0, right: 0 };
    }

    // Scale both panels proportionally
    const ratio = maxSidePanels / total;
    return {
      left: Math.floor(leftWidth * ratio),
      right: Math.floor(rightWidth * ratio),
    };
  },

  /**
   * Returns true when the panels overlap the canvas (i.e. canvas width < MIN_CANVAS_WIDTH).
   *
   * @param windowWidth   Total available window width in pixels
   * @param leftWidth     Left panel width in pixels
   * @param rightWidth    Right panel width in pixels
   * @param resizeHandles Total width consumed by resize handles (default: 12px)
   */
  panelsOverlapCanvas: (
    windowWidth: number,
    leftWidth: number,
    rightWidth: number,
    resizeHandles = 12,
  ): boolean => {
    const canvasWidth = windowWidth - leftWidth - rightWidth - resizeHandles;
    return canvasWidth < MIN_CANVAS_WIDTH;
  },

  /**
   * Calculates the effective canvas width given the window and panel widths.
   *
   * @param windowWidth   Total available window width in pixels
   * @param leftWidth     Left panel width in pixels
   * @param rightWidth    Right panel width in pixels
   * @param resizeHandles Total width consumed by resize handles (default: 12px)
   */
  canvasWidth: (
    windowWidth: number,
    leftWidth: number,
    rightWidth: number,
    resizeHandles = 12,
  ): number => {
    return Math.max(0, windowWidth - leftWidth - rightWidth - resizeHandles);
  },

  /**
   * Returns true when the window is wide enough to show all panels without overlap.
   * Breakpoints: 768px, 1024px, 1280px.
   */
  isBreakpoint768: (width: number): boolean => width >= 768,
  isBreakpoint1024: (width: number): boolean => width >= 1024,
  isBreakpoint1280: (width: number): boolean => width >= 1280,
} as const;
