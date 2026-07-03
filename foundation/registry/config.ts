/**
 * Configuration Maps and Enums for the UI Components
 * Centralized mappings for sizes, colors, and layout configurations.
 */

// -----------------------------------------------------------------------------
// Component Size Mappings
// -----------------------------------------------------------------------------

export const AvatarSizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
} as const;

export const ButtonSizeMap = {
  sm: { height: 32, px: 3, fontSize: 13 },
  md: { height: 40, px: 4, fontSize: 15 },
  lg: { height: 48, px: 5, fontSize: 17 },
} as const;

export const IconButtonSizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
} as const;

export const TextInputSizeMap = {
  sm: { height: 32, px: 3, fontSize: 13, labelSize: 11 },
  md: { height: 40, px: 4, fontSize: 15, labelSize: 13 },
  lg: { height: 48, px: 5, fontSize: 17, labelSize: 14 },
} as const;

export const DatePickerSizeMap = {
  sm: { height: 32, fontSize: 13 },
  md: { height: 40, fontSize: 15 },
  lg: { height: 48, fontSize: 17 },
} as const;

export const TextAreaSizeMap = {
  sm: { height: 80, px: 3, py: 2, fontSize: 13, labelSize: 11 },
  md: { height: 120, px: 4, py: 3, fontSize: 15, labelSize: 13 },
  lg: { height: 180, px: 5, py: 4, fontSize: 17, labelSize: 14 },
} as const;

export const SelectSizeMap = {
  sm: { height: 32, px: 3, fontSize: 13, labelSize: 11 },
  md: { height: 40, px: 4, fontSize: 15, labelSize: 13 },
  lg: { height: 48, px: 5, fontSize: 17, labelSize: 14 },
} as const;

export const SliderSizeMap = {
  sm: { trackHeight: 4, thumbSize: 16, labelSize: 11, valueSize: 12 },
  md: { trackHeight: 6, thumbSize: 20, labelSize: 13, valueSize: 14 },
} as const;

export const SwitchSizeMap = {
  sm: { scale: 0.8, labelSize: 13, width: 36, height: 20 },
  md: { scale: 1, labelSize: 15, width: 44, height: 24 },
} as const;

// -----------------------------------------------------------------------------
// Component Color Mappings
// -----------------------------------------------------------------------------

export const BadgeColorMap: Record<string, { solid: [string, string]; subtle: [string, string] }> = {
  primary:   { solid: ["primary", "primaryForeground"],   subtle: ["primary", "primaryForeground"] },
  secondary: { solid: ["secondary", "secondaryForeground"], subtle: ["secondary", "secondaryForeground"] },
  success:   { solid: ["success", "#fff"],   subtle: ["#dcfce7", "#166534"] },
  warning:   { solid: ["warning", "#fff"],   subtle: ["#fef3c7", "#92400e"] },
  error:     { solid: ["error", "#fff"],     subtle: ["#fee2e2", "#991b1b"] },
  info:      { solid: ["info", "#fff"],      subtle: ["#e0f2fe", "#0369a1"] },
};

// -----------------------------------------------------------------------------
// Layout & Union Enums
// -----------------------------------------------------------------------------

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type FlexAlignItems = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
export type FlexJustifyContent = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
export type GradientDirection = "toTop" | "toBottom" | "toLeft" | "toRight" | "toTopLeft" | "toTopRight" | "toBottomLeft" | "toBottomRight";
export type ScrollDirection = "vertical" | "horizontal" | "both";
export type DividerOrientation = "horizontal" | "vertical";
export type SidebarPosition = "left" | "right";
export type IconPosition = "left" | "right";
export type AccordionType = "single" | "multiple";
