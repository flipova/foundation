/**
 * Studio UI — root barrel.
 *
 * Structure:
 *   ui/
 *   ├── ds/          Design system (colors, tokens, atoms)
 *   ├── layout/      Chrome: Topbar, Statusbar, ResizeHandle
 *   ├── panels/      Main panels: Library, Canvas, Layers, Properties
 *   ├── modals/      Modal dialogs
 *   └── shared/      Reusable primitives: Tooltip, SmartInput, Toast…
 */

// Design system
export * from './ds';

// Layout chrome
export * from './layout';

// Panels
export * from './panels';

// Modals
export * from './modals';

// Shared utilities
export * from './shared';
