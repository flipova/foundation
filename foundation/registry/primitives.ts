/**
 * Primitives Registry
 *
 * Low-level layout primitives available in the studio.
 * These are the building blocks for all layouts and components.
 */

export interface PrimitiveMeta {
  id: string;
  label: string;
  description: string;
  category: "primitive";
  tags: string[];
  props: { name: string; label: string; type: string; group: string; default?: any; options?: string[]; description?: string }[];
  slots?: { name: string; label: string; required: boolean }[];
}

export function getPrimitiveMeta(id: string): PrimitiveMeta | undefined {
  return primitiveRegistry.find(m => m.id === id);
}

export const primitiveRegistry: PrimitiveMeta[] = [
  {
    id: "Box",
    label: "Box",
    description: "Flexible container with spacing, background, and border support.",
    category: "primitive",
    tags: ["box", "container", "view", "div"],
    slots: [{ name: "children", label: "Content", required: false }],
    props: [
      { name: "flex",           label: "Flex",           type: "number",  group: "layout" },
      { name: "bg",             label: "Background",     type: "color",   group: "style" },
      { name: "p",              label: "Padding",        type: "spacing", group: "layout" },
      { name: "px",             label: "Padding X",      type: "spacing", group: "layout" },
      { name: "py",             label: "Padding Y",      type: "spacing", group: "layout" },
      { name: "m",              label: "Margin",         type: "spacing", group: "layout" },
      { name: "mx",             label: "Margin X",       type: "spacing", group: "layout" },
      { name: "my",             label: "Margin Y",       type: "spacing", group: "layout" },
      { name: "width",          label: "Width",          type: "number",  group: "layout" },
      { name: "height",         label: "Height",         type: "number",  group: "layout" },
      { name: "maxWidth",       label: "Max Width",      type: "number",  group: "layout" },
      { name: "minHeight",      label: "Min Height",     type: "number",  group: "layout" },
      { name: "borderRadius",   label: "Border Radius",  type: "radius",  group: "style" },
      { name: "overflow",       label: "Overflow",       type: "enum",    group: "style",   options: ["visible", "hidden", "scroll"] },
      { name: "justifyContent", label: "Justify",        type: "enum",    group: "layout",  options: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] },
      { name: "alignItems",     label: "Align Items",    type: "enum",    group: "layout",  options: ["stretch", "flex-start", "center", "flex-end", "baseline"] },
      { name: "alignSelf",      label: "Align Self",     type: "enum",    group: "layout",  options: ["auto", "flex-start", "center", "flex-end", "stretch"] },
    ],
  },
  {
    id: "Stack",
    label: "Stack",
    description: "Vertical stack with consistent spacing between children.",
    category: "primitive",
    tags: ["stack", "vertical", "column", "vstack"],
    slots: [{ name: "children", label: "Content", required: false }],
    props: [
      { name: "spacing",  label: "Spacing",  type: "spacing", group: "layout", default: 2 },
      { name: "align",    label: "Align",    type: "enum",    group: "layout", options: ["stretch", "flex-start", "center", "flex-end"] },
      { name: "bg",       label: "Background", type: "color", group: "style" },
      { name: "p",        label: "Padding",  type: "spacing", group: "layout" },
      { name: "flex",     label: "Flex",     type: "number",  group: "layout" },
    ],
  },
  {
    id: "Inline",
    label: "Inline",
    description: "Horizontal row with spacing and alignment.",
    category: "primitive",
    tags: ["inline", "horizontal", "row", "hstack"],
    slots: [{ name: "children", label: "Content", required: false }],
    props: [
      { name: "spacing",  label: "Spacing",  type: "spacing", group: "layout", default: 2 },
      { name: "align",    label: "Align",    type: "enum",    group: "layout", options: ["stretch", "flex-start", "center", "flex-end", "baseline"] },
      { name: "justify",  label: "Justify",  type: "enum",    group: "layout", options: ["flex-start", "center", "flex-end", "space-between", "space-around"] },
      { name: "wrap",     label: "Wrap",     type: "boolean", group: "layout", default: false },
      { name: "bg",       label: "Background", type: "color", group: "style" },
      { name: "p",        label: "Padding",  type: "spacing", group: "layout" },
      { name: "flex",     label: "Flex",     type: "number",  group: "layout" },
      { name: "fillWidth", label: "Fill Width", type: "boolean", group: "layout", default: false },
    ],
  },
  {
    id: "Center",
    label: "Center",
    description: "Centers content both horizontally and vertically.",
    category: "primitive",
    tags: ["center", "align", "middle"],
    slots: [{ name: "children", label: "Content", required: false }],
    props: [
      { name: "flex",   label: "Flex",       type: "number",  group: "layout" },
      { name: "bg",     label: "Background", type: "color",   group: "style" },
      { name: "p",      label: "Padding",    type: "spacing", group: "layout" },
      { name: "py",     label: "Padding Y",  type: "spacing", group: "layout" },
      { name: "width",  label: "Width",      type: "number",  group: "layout" },
      { name: "height", label: "Height",     type: "number",  group: "layout" },
    ],
  },
  {
    id: "Scroll",
    label: "Scroll",
    description: "Scrollable container.",
    category: "primitive",
    tags: ["scroll", "scrollview", "overflow"],
    slots: [{ name: "children", label: "Content", required: false }],
    props: [
      { name: "horizontal",          label: "Horizontal",          type: "boolean", group: "layout", default: false },
      { name: "showsScrollIndicator", label: "Show Indicator",     type: "boolean", group: "behavior", default: true },
      { name: "bg",                  label: "Background",          type: "color",   group: "style" },
      { name: "p",                   label: "Padding",             type: "spacing", group: "layout" },
      { name: "flex",                label: "Flex",                type: "number",  group: "layout" },
    ],
  },
  {
    id: "Divider",
    label: "Divider",
    description: "Horizontal or vertical divider line.",
    category: "primitive",
    tags: ["divider", "separator", "line", "hr"],
    props: [
      { name: "vertical",  label: "Vertical",  type: "boolean", group: "layout", default: false },
      { name: "color",     label: "Color",     type: "color",   group: "style" },
      { name: "thickness", label: "Thickness", type: "number",  group: "style",  default: 1 },
      { name: "spacing",   label: "Spacing",   type: "spacing", group: "layout" },
    ],
  },
];
