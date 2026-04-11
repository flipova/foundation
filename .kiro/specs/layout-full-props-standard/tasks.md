
# Implementation Plan: layout-full-props-standard

## Overview

Complete the prop-exposure work for all layouts: rename multi-item slots to `items`, remove `swipeThreshold` from `constants` for FlipLayout and SwiperLayout, and add all missing `PropDescriptor` entries to the registry. Then wire each new prop into the corresponding TSX component. All changes are purely additive — every new default reproduces the previously hardcoded value.

## Tasks

- [x] 1. Update registry slot names for multi-item layouts (DeckLayout, FlipLayout, SwiperLayout)
  - In `foundation/layout/registry/layouts.ts`, rename the `cards` slot to `{ name: "items", label: "Cartes", required: true, array: true }` for DeckLayout
  - Rename the `cards` slot to `{ name: "items", label: "Faces recto", required: true, array: true }` for FlipLayout
  - Rename the `slides` slot to `{ name: "items", label: "Slides", required: true, array: true }` for SwiperLayout
  - Set `previewItemCount: 4` for DeckLayout, `previewItemCount: 3` for FlipLayout, `previewItemCount: 4` for SwiperLayout
  - Remove `swipeThreshold` from `constants` in FlipLayout and SwiperLayout registry entries (it is already declared in `props`)
  - _Requirements: 1.5, 1.6, 2.5, 2.6, 3.5, 3.6, 6.5, 7.5_

  - [x] 1.1 Write property test for multi-item slot name invariant
    - **Property 1: Multi-item layouts use slot name "items"**
    - **Validates: Requirements 1.5, 2.5, 3.5, 4.1–4.5, 30.4**

  - [x] 1.2 Write property test for previewItemCount invariant
    - **Property 2: Multi-item layouts declare previewItemCount ≥ 3**
    - **Validates: Requirements 1.6, 2.6, 3.6, 4.6, 12.2, 30.1**

- [x] 2. Update DeckLayout, FlipLayout, SwiperLayout TSX for items prop and backward compat aliases
  - In `DeckLayout.tsx`: add `items?: React.ReactNode[]` to the interface, keep `cards` as alias; resolve with priority `items > cards > children`; call `useStudioItems` when array is empty
  - In `FlipLayout.tsx`: add `items?: React.ReactNode[]`, keep `cards` as alias; same resolution priority and `useStudioItems` call
  - In `SwiperLayout.tsx`: add `items?: React.ReactNode[]`, keep `slides` as alias; same resolution priority and `useStudioItems` call
  - _Requirements: 1.1–1.4, 1.7, 2.1–2.4, 2.7, 3.1–3.4, 3.7_

  - [x] 2.1 Write property test for useStudioItems placeholder behavior
    - **Property 3: useStudioItems returns N placeholders for empty input**
    - **Validates: Requirements 1.7, 2.7, 3.7, 4.7**

- [x] 3. Add missing PropDescriptors for DeckLayout, FlipLayout, SwiperLayout in registry
  - DeckLayout: add `peekRotation` (number, layout, default: 0), `direction` (enum, behavior, default: "horizontal", options: ["horizontal","vertical"]), `background` (color, style, themeDefault: "background")
  - FlipLayout: verify `flipPerspective` (default: 1200) and `swipeThreshold` (default: 40) are in `props` (not `constants`)
  - SwiperLayout: verify `preloadRange` (default: 2) and `swipeThreshold` (default: 40) are in `props` (not `constants`)
  - _Requirements: 5.1–5.3, 6.1–6.2, 7.1–7.2_

- [x] 4. Wire new DeckLayout props into DeckLayout.tsx
  - Destructure `peekRotation`, `direction`, `background` from `applyDefaults`
  - Apply `bg={background}` to the root `Box`
  - Pass `peekRotation` to the `renderBackgroundCards` rotation transform
  - Use `direction` to determine swipe axis in the gesture handler
  - _Requirements: 5.4, 5.5_

- [x] 5. Add missing PropDescriptors for CrossTabLayout and wire into TSX
  - Registry: add `background` (color, style, themeDefault: "background")
  - `CrossTabLayout.tsx`: apply `style={{ flex: 1, backgroundColor: background }}` to `GestureHandlerRootView`
  - _Requirements: 11.2, 11.3_

- [x] 6. Add missing PropDescriptors for CenteredLayout and wire into TSX
  - Registry: add `mobilePadding` (spacing, layout, default: 4), `desktopPadding` (spacing, layout, default: 6)
  - `CenteredLayout.tsx`: replace `<Center p={isMobile ? 4 : 6}>` with `<Center p={isMobile ? mobilePadding : desktopPadding}>`
  - _Requirements: 15.2–15.5_

- [x] 7. Add missing PropDescriptors for AuthLayout and wire into TSX
  - Registry: add `formMaxWidth` (number, layout, default: 520), `formScrollPaddingY` (spacing, layout, default: 8), `formScrollPaddingX` (spacing, layout, default: 4)
  - `AuthLayout.tsx`: `<Scroll py={formScrollPaddingY} px={formScrollPaddingX}>` and `<Stack maxWidth={formMaxWidth}>`
  - _Requirements: 16.2–16.6_

- [x] 8. Add missing PropDescriptors for DashboardLayout and wire into TSX
  - Registry: add `headerPaddingX` (spacing, layout, default: 4), `mobileHeaderMinHeight` (number, layout, default: 60)
  - `DashboardLayout.tsx`: `<Box px={headerPaddingX}>` on header; `minHeight={isMobile ? mobileHeaderMinHeight : undefined}` on header Box
  - _Requirements: 17.2–17.5_

- [x] 9. Add missing PropDescriptors for ResponsiveLayout and wire into TSX
  - Registry: add `mobileHeaderHeight` (number, layout, default: 56), `tabletFooterHeight` (number, layout, default: 48), `sidebarMaxWidth` (number, layout, default: 320)
  - `ResponsiveLayout.tsx`: `hHeight: isMobile ? mobileHeaderHeight : headerHeight`; `fHeight: isTabletRange && collapseFooterOnTablet ? tabletFooterHeight : footerHeight`; `sWidth: Math.min(sidebarWidth, sidebarMaxWidth)`
  - _Requirements: 18.2–18.7_

- [x] 10. Add missing PropDescriptors for FlexLayout and wire into TSX
  - Registry: add `align` (enum, layout, default: "stretch", options: ["stretch","flex-start","center","flex-end","baseline"]), `justify` (enum, layout, default: "flex-start", options: ["flex-start","center","flex-end","space-between","space-around","space-evenly"])
  - `FlexLayout.tsx`: confirm `alignItems={align}` and `justifyContent={justify}` are wired (props already used in TSX)
  - _Requirements: 19.2–19.4_

- [x] 11. Add missing PropDescriptors for SplitLayout and wire into TSX
  - Registry: add `leftBorderRadius` (radius, style, default: "none"), `rightBorderRadius` (radius, style, default: "none")
  - `SplitLayout.tsx`: apply `borderRadius={leftBorderRadius}` to left panel Box, `borderRadius={rightBorderRadius}` to right panel Box
  - _Requirements: 20.2, 20.3_

- [x] 12. Add missing PropDescriptors for SidebarLayout and wire into TSX
  - Registry: add `sidebarMinWidth` (number, layout, default: 150), `sidebarMaxWidth` (number, layout, default: 600)
  - `SidebarLayout.tsx`: replace `minWidth: 150, maxWidth: 600` with `minWidth: sidebarMinWidth, maxWidth: sidebarMaxWidth` in the `canResize` style object
  - _Requirements: 22.2–22.4_

- [x] 13. Add missing PropDescriptors for BottomDrawerLayout and wire into TSX
  - Registry: add `handleBarColor` (color, style, themeDefault: "border"), `handleButtonSize` (number, layout, default: 56)
  - `BottomDrawerLayout.tsx`: `<Box bg={handleBarColor}>` on handle bar; `width: handleButtonSize` on handle button style
  - _Requirements: 23.2–23.4_

- [x] 14. Add missing PropDescriptors for TopDrawerLayout and wire into TSX
  - Registry: add `closeButtonSize` (number, layout, default: 36), `closeButtonBorderColor` (color, style, themeDefault: "border"), `closeButtonTextColor` (color, style, themeDefault: "mutedForeground")
  - `TopDrawerLayout.tsx`: `width: closeButtonSize, height: closeButtonSize, borderRadius: closeButtonSize / 2`; `borderColor: closeButtonBorderColor`; `color: closeButtonTextColor` on `×` Text
  - _Requirements: 24.2–24.5_

- [x] 15. Add missing PropDescriptors for LeftDrawerLayout and wire into TSX
  - Registry: add `handleBarColor` (color, style, themeDefault: "border"), `handleBarWidth` (number, layout, default: 40)
  - `LeftDrawerLayout.tsx`: `<Box bg={handleBarColor}>` on handle bar; `width={handleBarWidth}` on gesture zone Box
  - _Requirements: 25.2–25.4_

- [x] 16. Add missing PropDescriptors for ScrollLayout and wire into TSX
  - Registry: add `mobileHeaderHeight` (number, layout, default: 60), `mobileFooterHeight` (number, layout, default: 50)
  - `ScrollLayout.tsx`: `h: isMobile ? mobileHeaderHeight : headerHeight`; `f: isMobile ? mobileFooterHeight : footerHeight`
  - _Requirements: 26.2–26.4_

- [x] 17. Add missing PropDescriptors for HeaderContentLayout and wire into TSX
  - Registry: add `scrollEventThrottle` (number, behavior, default: 16)
  - `HeaderContentLayout.tsx`: `<Animated.ScrollView scrollEventThrottle={scrollEventThrottle} ...>`
  - _Requirements: 27.2, 27.3_

- [x] 18. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Write unit tests for registry changes
  - Add unit test cases to `foundation/layout/registry/__tests__/layouts.registry.test.ts` covering all new PropDescriptors and slot renames listed in the design's Testing Strategy section
  - Verify slot renames (DeckLayout, FlipLayout, SwiperLayout), `previewItemCount` values, new props with correct defaults/themeDefaults, and absence of `swipeThreshold` from `constants`
  - _Requirements: 30.1–30.4_

  - [x] 19.1 Write property test for zero-breaking-change defaults
    - **Property 4: applyDefaults({}, META, theme) returns exact declared defaults**
    - **Validates: Requirements 28.1, 28.2**

  - [x] 19.2 Write property test for ratio props having min and max
    - **Property 5: Ratio props have min and max defined**
    - **Validates: Requirements 29.4, 30.2**

  - [x] 19.3 Write property test for enum props having non-empty options
    - **Property 6: Enum props have non-empty options array**
    - **Validates: Requirements 29.5, 30.3**

  - [x] 19.4 Write property test for valid group values
    - **Property 7: Group values are one of style/layout/behavior/content**
    - **Validates: Requirement 29.6**

  - [x] 19.5 Write property test for color prop types
    - **Property 8: Color/background props use type "color" or "background"**
    - **Validates: Requirement 29.1**

- [x] 20. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Every new `default` or `themeDefault` reproduces the previously hardcoded value — zero visual change guaranteed
- Property tests use `fast-check` with `numRuns: 100`; tag each with `// Feature: layout-full-props-standard, Property N: <text>`
- GridLayout, MasonryLayout, BentoLayout, ParallaxLayout, RootLayout, VoidLayout, FooterLayout are already complete per the design audit — no registry or TSX changes needed for those
