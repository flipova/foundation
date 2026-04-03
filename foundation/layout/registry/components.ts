/**
 * Component Registry
 *
 * Base UI components: buttons, inputs, badges, avatars, etc.
 * Each component supports variants (e.g. primary/secondary/ghost for buttons)
 * and sizes. Theme-aware via themeDefault on color props.
 */

import type { ComponentMeta } from "../types";

export function getComponentMeta(id: string): ComponentMeta | undefined {
  return componentRegistry.find((m) => m.id === id);
}

export const componentRegistry: ComponentMeta[] = [

  {
    id: "Button",
    label: "Button",
    description: "Pressable button with variant and size support.",
    category: "action",
    tags: ["button", "cta", "action", "pressable"],
    themeMapping: { bg: "primary", text: "primaryForeground" },
    sizes: ["sm", "md", "lg"],
    variants: [
      {
        name: "primary",
        label: "Primary",
        overrides: { bg: undefined, color: undefined, borderWidth: 0 },
      },
      {
        name: "secondary",
        label: "Secondary",
        overrides: { bg: undefined, color: undefined, borderWidth: 0 },
      },
      {
        name: "outline",
        label: "Outline",
        overrides: { bg: "transparent", borderWidth: 1 },
      },
      {
        name: "ghost",
        label: "Ghost",
        overrides: { bg: "transparent", borderWidth: 0 },
      },
      {
        name: "destructive",
        label: "Destructive",
        overrides: { bg: undefined, color: undefined, borderWidth: 0 },
      },
    ],
    props: [
      { name: "variant",      label: "Variant",       type: "enum",    group: "style",    default: "primary", options: ["primary", "secondary", "outline", "ghost", "destructive"] },
      { name: "size",          label: "Size",          type: "enum",    group: "style",    default: "md", options: ["sm", "md", "lg"] },
      { name: "disabled",      label: "Disabled",      type: "boolean", group: "behavior", default: false },
      { name: "loading",       label: "Loading",       type: "boolean", group: "behavior", default: false },
      { name: "fullWidth",     label: "Full width",    type: "boolean", group: "layout",   default: false },
      { name: "borderRadius",  label: "Border radius", type: "radius",  group: "style",    default: "md" },
      { name: "iconPosition",  label: "Icon position", type: "enum",    group: "layout",   default: "left", options: ["left", "right"] },
    ],
  },

  {
    id: "TextInput",
    label: "Text Input",
    description: "Single-line text input with label, error state, and icon support.",
    category: "input",
    tags: ["input", "text", "field", "form"],
    themeMapping: { bg: "input", text: "foreground", border: "border", placeholder: "mutedForeground" },
    sizes: ["sm", "md", "lg"],
    variants: [
      { name: "outlined", label: "Outlined", overrides: { borderWidth: 1, bg: "transparent" } },
      { name: "filled",   label: "Filled",   overrides: { borderWidth: 0 } },
      { name: "underline", label: "Underline", overrides: { borderWidth: 0, borderBottomWidth: 1, borderRadius: "none" } },
    ],
    props: [
      { name: "variant",       label: "Variant",        type: "enum",    group: "style",    default: "outlined", options: ["outlined", "filled", "underline"] },
      { name: "size",           label: "Size",           type: "enum",    group: "style",    default: "md", options: ["sm", "md", "lg"] },
      { name: "placeholder",    label: "Placeholder",    type: "string",  group: "content" },
      { name: "label",          label: "Label",          type: "string",  group: "content" },
      { name: "error",          label: "Error message",  type: "string",  group: "content" },
      { name: "disabled",       label: "Disabled",       type: "boolean", group: "behavior", default: false },
      { name: "secureEntry",    label: "Password",       type: "boolean", group: "behavior", default: false },
      { name: "borderRadius",   label: "Border radius",  type: "radius",  group: "style",    default: "md" },
      { name: "background",     label: "Background",     type: "color",   group: "style",    themeDefault: "input" },
      { name: "borderColor",    label: "Border color",   type: "color",   group: "style",    themeDefault: "border" },
    ],
  },

  {
    id: "TextArea",
    label: "Text Area",
    description: "Multi-line text input.",
    category: "input",
    tags: ["textarea", "multiline", "input", "form"],
    themeMapping: { bg: "input", text: "foreground", border: "border" },
    sizes: ["sm", "md", "lg"],
    variants: [
      { name: "outlined", label: "Outlined", overrides: { borderWidth: 1, bg: "transparent" } },
      { name: "filled",   label: "Filled",   overrides: { borderWidth: 0 } },
    ],
    props: [
      { name: "variant",       label: "Variant",        type: "enum",    group: "style",    default: "outlined", options: ["outlined", "filled"] },
      { name: "size",           label: "Size",           type: "enum",    group: "style",    default: "md", options: ["sm", "md", "lg"] },
      { name: "placeholder",    label: "Placeholder",    type: "string",  group: "content" },
      { name: "label",          label: "Label",          type: "string",  group: "content" },
      { name: "error",          label: "Error message",  type: "string",  group: "content" },
      { name: "disabled",       label: "Disabled",       type: "boolean", group: "behavior", default: false },
      { name: "numberOfLines",  label: "Lines",          type: "number",  group: "layout",   default: 4 },
      { name: "borderRadius",   label: "Border radius",  type: "radius",  group: "style",    default: "md" },
      { name: "background",     label: "Background",     type: "color",   group: "style",    themeDefault: "input" },
    ],
  },

  {
    id: "Checkbox",
    label: "Checkbox",
    description: "Toggle checkbox with label.",
    category: "input",
    tags: ["checkbox", "toggle", "form", "boolean"],
    themeMapping: { active: "primary", border: "border" },
    sizes: ["sm", "md"],
    variants: [
      { name: "square",  label: "Square",  overrides: { borderRadius: "sm" } },
      { name: "rounded", label: "Rounded", overrides: { borderRadius: "full" } },
    ],
    props: [
      { name: "variant",     label: "Variant",       type: "enum",    group: "style",    default: "square", options: ["square", "rounded"] },
      { name: "size",         label: "Size",          type: "enum",    group: "style",    default: "md", options: ["sm", "md"] },
      { name: "disabled",     label: "Disabled",      type: "boolean", group: "behavior", default: false },
      { name: "label",        label: "Label",         type: "string",  group: "content" },
      { name: "activeColor",  label: "Active color",  type: "color",   group: "style",    themeDefault: "primary" },
    ],
  },

  {
    id: "Switch",
    label: "Switch",
    description: "Toggle switch.",
    category: "input",
    tags: ["switch", "toggle", "boolean"],
    themeMapping: { active: "primary", track: "muted" },
    sizes: ["sm", "md"],
    variants: [],
    props: [
      { name: "size",         label: "Size",          type: "enum",    group: "style",    default: "md", options: ["sm", "md"] },
      { name: "disabled",     label: "Disabled",      type: "boolean", group: "behavior", default: false },
      { name: "label",        label: "Label",         type: "string",  group: "content" },
      { name: "activeColor",  label: "Active color",  type: "color",   group: "style",    themeDefault: "primary" },
      { name: "trackColor",   label: "Track color",   type: "color",   group: "style",    themeDefault: "muted" },
    ],
  },

  {
    id: "Badge",
    label: "Badge",
    description: "Small status indicator or label.",
    category: "display",
    tags: ["badge", "tag", "label", "status"],
    themeMapping: { bg: "primary", text: "primaryForeground" },
    sizes: ["sm", "md"],
    variants: [
      { name: "solid",   label: "Solid",   overrides: {} },
      { name: "outline", label: "Outline", overrides: { bg: "transparent", borderWidth: 1 } },
      { name: "subtle",  label: "Subtle",  overrides: {} },
    ],
    props: [
      { name: "variant",      label: "Variant",       type: "enum",    group: "style",    default: "solid", options: ["solid", "outline", "subtle"] },
      { name: "size",          label: "Size",          type: "enum",    group: "style",    default: "md", options: ["sm", "md"] },
      { name: "color",         label: "Color scheme",  type: "enum",    group: "style",    default: "primary", options: ["primary", "secondary", "success", "warning", "error", "info"] },
      { name: "borderRadius",  label: "Border radius", type: "radius",  group: "style",    default: "full" },
    ],
  },

  {
    id: "Avatar",
    label: "Avatar",
    description: "User avatar with image, initials, or icon fallback.",
    category: "display",
    tags: ["avatar", "user", "profile", "image"],
    themeMapping: { bg: "muted", text: "mutedForeground" },
    sizes: ["xs", "sm", "md", "lg", "xl"],
    variants: [
      { name: "circle", label: "Circle", overrides: { borderRadius: "full" } },
      { name: "square", label: "Square", overrides: { borderRadius: "md" } },
    ],
    props: [
      { name: "variant",      label: "Shape",         type: "enum",    group: "style",    default: "circle", options: ["circle", "square"] },
      { name: "size",          label: "Size",          type: "enum",    group: "style",    default: "md", options: ["xs", "sm", "md", "lg", "xl"] },
      { name: "source",        label: "Image source",  type: "string",  group: "content" },
      { name: "initials",      label: "Initials",      type: "string",  group: "content" },
      { name: "background",    label: "Background",    type: "color",   group: "style",    themeDefault: "muted" },
    ],
  },

  {
    id: "IconButton",
    label: "Icon Button",
    description: "Pressable icon-only button.",
    category: "action",
    tags: ["icon", "button", "action"],
    themeMapping: { bg: "muted", icon: "foreground" },
    sizes: ["sm", "md", "lg"],
    variants: [
      { name: "filled", label: "Filled", overrides: {} },
      { name: "ghost",  label: "Ghost",  overrides: { bg: "transparent" } },
      { name: "outline", label: "Outline", overrides: { bg: "transparent", borderWidth: 1 } },
    ],
    props: [
      { name: "variant",      label: "Variant",       type: "enum",    group: "style",    default: "ghost", options: ["filled", "ghost", "outline"] },
      { name: "size",          label: "Size",          type: "enum",    group: "style",    default: "md", options: ["sm", "md", "lg"] },
      { name: "disabled",      label: "Disabled",      type: "boolean", group: "behavior", default: false },
      { name: "borderRadius",  label: "Border radius", type: "radius",  group: "style",    default: "full" },
      { name: "color",         label: "Icon color",    type: "color",   group: "style",    themeDefault: "foreground" },
    ],
  },

  {
    id: "Chip",
    label: "Chip",
    description: "Selectable chip / tag with optional close action.",
    category: "input",
    tags: ["chip", "tag", "filter", "selectable"],
    themeMapping: { bg: "muted", text: "foreground", active: "primary" },
    sizes: ["sm", "md"],
    variants: [
      { name: "filled",  label: "Filled",  overrides: {} },
      { name: "outline", label: "Outline", overrides: { bg: "transparent", borderWidth: 1 } },
    ],
    props: [
      { name: "variant",      label: "Variant",       type: "enum",    group: "style",    default: "filled", options: ["filled", "outline"] },
      { name: "size",          label: "Size",          type: "enum",    group: "style",    default: "md", options: ["sm", "md"] },
      { name: "selected",      label: "Selected",      type: "boolean", group: "behavior", default: false },
      { name: "closable",      label: "Closable",      type: "boolean", group: "behavior", default: false },
      { name: "disabled",      label: "Disabled",      type: "boolean", group: "behavior", default: false },
      { name: "borderRadius",  label: "Border radius", type: "radius",  group: "style",    default: "full" },
    ],
  },

  {
    id: "Spinner",
    label: "Spinner",
    description: "Loading indicator.",
    category: "feedback",
    tags: ["spinner", "loading", "indicator"],
    themeMapping: { color: "primary" },
    sizes: ["sm", "md", "lg"],
    variants: [],
    props: [
      { name: "size",   label: "Size",  type: "enum",  group: "style", default: "md", options: ["sm", "md", "lg"] },
      { name: "color",  label: "Color", type: "color", group: "style", themeDefault: "primary" },
    ],
  },
];
