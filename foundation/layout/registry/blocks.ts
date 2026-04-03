/**
 * Block Registry
 *
 * Functional blocks that combine primitives and base components.
 * Each block is a higher-level UI pattern (auth form, header bar, avatar group, etc.)
 * with named slots and theme-aware styling.
 */

import type { BlockMeta } from "../types";

export function getBlockMeta(id: string): BlockMeta | undefined {
  return blockRegistry.find((m) => m.id === id);
}

export const blockRegistry: BlockMeta[] = [

  {
    id: "AuthFormBlock",
    label: "Auth Form",
    description: "Login/signup form with email, password, submit button, and optional social providers.",
    category: "auth",
    tags: ["auth", "login", "signup", "form", "email", "password"],
    themeMapping: { bg: "card", text: "foreground", accent: "primary" },
    components: ["TextInput", "Button"],
    slots: [
      { name: "header",   label: "Header (logo/title)", required: false },
      { name: "footer",   label: "Footer (links)",      required: false },
      { name: "social",   label: "Social providers",    required: false, array: true },
    ],
    props: [
      { name: "mode",           label: "Mode",            type: "enum",    group: "behavior", default: "login", options: ["login", "signup", "forgot"] },
      { name: "showRemember",   label: "Remember me",     type: "boolean", group: "behavior", default: true },
      { name: "showForgot",     label: "Forgot password",  type: "boolean", group: "behavior", default: true },
      { name: "spacing",        label: "Spacing",         type: "spacing", group: "layout",   default: 4 },
      { name: "background",     label: "Background",      type: "color",   group: "style",    themeDefault: "card" },
      { name: "borderRadius",   label: "Border radius",   type: "radius",  group: "style",    default: "xl" },
      { name: "padding",        label: "Padding",         type: "spacing", group: "layout",   default: 5 },
      { name: "buttonVariant",  label: "Button variant",  type: "enum",    group: "style",    default: "primary", options: ["primary", "secondary", "outline"] },
      { name: "inputVariant",   label: "Input variant",   type: "enum",    group: "style",    default: "outlined", options: ["outlined", "filled", "underline"] },
    ],
  },

  {
    id: "AvatarBlock",
    label: "Avatar Block",
    description: "Avatar with name, subtitle, and optional action.",
    category: "profile",
    tags: ["avatar", "user", "profile", "name"],
    themeMapping: { bg: "card", text: "foreground", subtitle: "mutedForeground" },
    components: ["Avatar"],
    slots: [
      { name: "action", label: "Action button", required: false },
    ],
    props: [
      { name: "size",          label: "Avatar size",    type: "enum",    group: "style",    default: "md", options: ["sm", "md", "lg", "xl"] },
      { name: "direction",     label: "Direction",      type: "enum",    group: "layout",   default: "row", options: ["row", "column"] },
      { name: "spacing",       label: "Spacing",        type: "spacing", group: "layout",   default: 3 },
      { name: "showSubtitle",  label: "Show subtitle",  type: "boolean", group: "behavior", default: true },
    ],
  },

  {
    id: "HeaderBlock",
    label: "Header Bar",
    description: "Top navigation bar with title, back button, and right actions.",
    category: "navigation",
    tags: ["header", "navbar", "topbar", "navigation", "back"],
    themeMapping: { bg: "card", text: "foreground", border: "border" },
    components: ["IconButton"],
    slots: [
      { name: "left",   label: "Left actions",  required: false },
      { name: "title",  label: "Title area",    required: true },
      { name: "right",  label: "Right actions", required: false, array: true },
    ],
    props: [
      { name: "height",        label: "Height",         type: "number",  group: "layout",   default: 56 },
      { name: "background",    label: "Background",     type: "color",   group: "style",    themeDefault: "card" },
      { name: "borderBottom",  label: "Bottom border",  type: "boolean", group: "style",    default: true },
      { name: "padding",       label: "Padding",        type: "spacing", group: "layout",   default: 4 },
      { name: "transparent",   label: "Transparent",    type: "boolean", group: "style",    default: false },
    ],
  },

  {
    id: "SearchBarBlock",
    label: "Search Bar",
    description: "Search input with icon and optional filter button.",
    category: "navigation",
    tags: ["search", "input", "filter", "bar"],
    themeMapping: { bg: "muted", text: "foreground", placeholder: "mutedForeground" },
    components: ["TextInput", "IconButton"],
    slots: [
      { name: "filters", label: "Filter actions", required: false, array: true },
    ],
    props: [
      { name: "placeholder",   label: "Placeholder",    type: "string",  group: "content",  default: "Search..." },
      { name: "background",    label: "Background",     type: "color",   group: "style",    themeDefault: "muted" },
      { name: "borderRadius",  label: "Border radius",  type: "radius",  group: "style",    default: "full" },
      { name: "showFilter",    label: "Show filter",    type: "boolean", group: "behavior", default: false },
      { name: "inputVariant",  label: "Input variant",  type: "enum",    group: "style",    default: "filled", options: ["outlined", "filled"] },
    ],
  },

  {
    id: "StatCardBlock",
    label: "Stat Card",
    description: "Metric card with value, label, trend indicator, and optional icon.",
    category: "data",
    tags: ["stat", "metric", "card", "kpi", "dashboard"],
    themeMapping: { bg: "card", text: "foreground", accent: "primary", muted: "mutedForeground" },
    components: ["Badge"],
    slots: [
      { name: "icon", label: "Icon", required: false },
    ],
    props: [
      { name: "background",    label: "Background",     type: "color",   group: "style",    themeDefault: "card" },
      { name: "borderRadius",  label: "Border radius",  type: "radius",  group: "style",    default: "xl" },
      { name: "padding",       label: "Padding",        type: "spacing", group: "layout",   default: 4 },
      { name: "showTrend",     label: "Show trend",     type: "boolean", group: "behavior", default: true },
      { name: "shadow",        label: "Shadow",         type: "shadow",  group: "style",    default: "sm" },
    ],
  },

  {
    id: "EmptyStateBlock",
    label: "Empty State",
    description: "Placeholder for empty lists or screens with icon, title, description, and action.",
    category: "feedback",
    tags: ["empty", "placeholder", "no-data", "illustration"],
    themeMapping: { text: "mutedForeground", accent: "primary" },
    components: ["Button"],
    slots: [
      { name: "illustration", label: "Illustration", required: false },
    ],
    props: [
      { name: "spacing",       label: "Spacing",        type: "spacing", group: "layout",   default: 4 },
      { name: "showAction",    label: "Show action",    type: "boolean", group: "behavior", default: true },
      { name: "actionVariant", label: "Action variant",  type: "enum",    group: "style",    default: "primary", options: ["primary", "outline", "ghost"] },
    ],
  },

  {
    id: "ListItemBlock",
    label: "List Item",
    description: "Standard list row with leading icon/avatar, title, subtitle, and trailing action.",
    category: "content",
    tags: ["list", "item", "row", "cell"],
    themeMapping: { bg: "card", text: "foreground", subtitle: "mutedForeground", border: "border" },
    components: ["Avatar", "IconButton"],
    slots: [
      { name: "leading",  label: "Leading element",  required: false },
      { name: "trailing", label: "Trailing element", required: false },
    ],
    props: [
      { name: "height",        label: "Height",         type: "number",  group: "layout",   default: 56 },
      { name: "spacing",       label: "Spacing",        type: "spacing", group: "layout",   default: 3 },
      { name: "showDivider",   label: "Show divider",   type: "boolean", group: "style",    default: true },
      { name: "pressable",     label: "Pressable",      type: "boolean", group: "behavior", default: true },
      { name: "background",    label: "Background",     type: "color",   group: "style",    themeDefault: "card" },
      { name: "padding",       label: "Padding",        type: "spacing", group: "layout",   default: 4 },
    ],
  },
];
