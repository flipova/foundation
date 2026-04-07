/**
 * UI exports — Primitives, Layouts, Components, and Blocks.
 */

export * from "./primitives";

// Layout components — explicit default re-exports so they resolve correctly
export { default as RootLayout } from "./RootLayout";
export { default as AuthLayout } from "./AuthLayout";
export { default as BentoLayout } from "./BentoLayout";
export { default as BottomDrawerLayout } from "./BottomDrawerLayout";
export { default as CenteredLayout } from "./CenteredLayout";
export { default as CrossTabLayout } from "./CrossTabLayout";
export { default as DashboardLayout } from "./DashboardLayout";
export { default as DeckLayout } from "./DeckLayout";
export { default as FlexLayout } from "./FlexLayout";
export { default as FlipLayout } from "./FlipLayout";
export { default as FooterLayout } from "./FooterLayout";
export { default as GridLayout } from "./GridLayout";
export { default as HeaderContentLayout } from "./HeaderContentLayout";
export { default as LeftDrawerLayout } from "./LeftDrawerLayout";
export { default as MasonryLayout } from "./MasonryLayout";
export { default as ParallaxLayout } from "./ParallaxLayout";
export { default as ResponsiveLayout } from "./ResponsiveLayout";
export { default as ScrollLayout } from "./ScrollLayout";
export { default as SidebarLayout } from "./SidebarLayout";
export { default as SketchLayout } from "./SketchLayout";
export { default as SplitLayout } from "./SplitLayout";
export { default as SwiperLayout } from "./SwiperLayout";
export { default as Swipe2ScreenLayout } from "./Swipe2ScreenLayout";
export * from "./SystemLayout";
export { default as TopDrawerLayout } from "./TopDrawerLayout";
export * from "./TutoLayout";
export { default as VoidLayout } from "./VoidLayout";

// Named type/interface exports from layout files
export type { AuthLayoutProps } from "./AuthLayout";
export type { BentoCellConfig, BentoLayoutProps } from "./BentoLayout";
export type { BottomDrawerLayoutProps } from "./BottomDrawerLayout";
export type { CenteredLayoutProps } from "./CenteredLayout";
export type { CrossTabLayoutProps } from "./CrossTabLayout";
export type { DashboardLayoutProps } from "./DashboardLayout";
export type { FlexLayoutProps } from "./FlexLayout";
export type { FlipLayoutProps } from "./FlipLayout";
export type { FooterLayoutProps } from "./FooterLayout";
export type { GridLayoutProps } from "./GridLayout";
export type { HeaderContentLayoutProps } from "./HeaderContentLayout";
export type { LeftDrawerLayoutProps } from "./LeftDrawerLayout";
export type { MasonryLayoutProps } from "./MasonryLayout";
export type { ParallaxLayoutProps } from "./ParallaxLayout";
export type { ResponsiveLayoutProps } from "./ResponsiveLayout";
export type { ScrollLayoutProps } from "./ScrollLayout";
export type { SidebarLayoutProps } from "./SidebarLayout";
export type { SplitLayoutProps } from "./SplitLayout";
export type { SwiperLayoutProps } from "./SwiperLayout";
export type { TopDrawerHandle, TopDrawerLayoutProps } from "./TopDrawerLayout";
export type { VoidLayoutProps } from "./VoidLayout";

export * from "./components";
export * from "./blocks";
