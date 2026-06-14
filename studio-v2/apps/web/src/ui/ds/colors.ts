// ─────────────────────────────────────────────────────────────────────────────
// Studio Design System — Palette
// Monochrome (noir / blanc) + bleu #000091
// ─────────────────────────────────────────────────────────────────────────────

export const colors = {
  // Base surfaces — full dark everywhere
  base:       '#000000',   // canvas background
  bg:         '#000000',   // app background
  surface:    '#050505',   // panel surface
  s1:         '#050505',
  surface2:   '#0a0a0a',   // slightly elevated (inputs, sections)
  s2:         '#0a0a0a',
  surface3:   '#121212',   // hover / active
  s3:         '#121212',
  elevated:   '#181818',   // dropdowns, popovers, modals

  // Borders — very subtle
  border:     '#1a1a1a',
  borderSub:  '#2a2a2a',

  // Text
  text:       '#f4f4f5',   // primary text (zinc-50)
  textSub:    '#a1a1aa',   // secondary (zinc-400)
  muted:      '#71717a',   // muted / placeholder (zinc-500)

  // Brand — Flipova Blue
  primary:    '#208AEF',   // bg de boutons, bordures actives, fills
  accent:     '#60a5fa',   // texte/icônes actifs sur fond dark (blue-400)
  primaryHov: '#1d7cd6',
  primaryGlow:'#0c3b6b',

  // Semantic
  success:    '#10b981',   // vert
  warning:    '#f59e0b',   // ambre
  error:      '#ef4444',
  info:       '#60a5fa',

  // Component-kind colors
  layout:     '#f4f4f5',
  component:  '#3b82f6',
  block:      '#93c5fd',
  primitive:  '#bfdbfe',

  // UI Accent colors (used in property panels)
  blue:       '#3b82f6',
  cyan:       '#06b6d4',
  orange:     '#f97316',
  pink:       '#ec4899',
  purple:     '#a855f7',
  green:      '#22c55e',
  indigo:     '#6366f1',

  // Misc
  white:      '#ffffff',
  black:      '#000000',
  transparent:'transparent',
} as const;
