/**
 * Layout Registry — Définitions complètes
 *
 * Chaque layout est décrit avec ses slots, props configurables,
 * valeurs par défaut, types, groupes et contraintes.
 */

import type { LayoutMeta } from "../types";

// ─── Helper pour lookup rapide ────────────────────────────────────────────────

export function getLayoutMeta(id: string): LayoutMeta | undefined {
  return layoutRegistry.find((m) => m.id === id);
}

// ─── Registre ─────────────────────────────────────────────────────────────────

export const layoutRegistry: LayoutMeta[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "VoidLayout",
    label: "Vide",
    description: "Conteneur minimal avec scroll, padding et maxWidth optionnels.",
    category: "page",
    slots: [{ name: "children", label: "Contenu", required: true }],
    responsive: false,
    animated: false,
    tags: ["blank", "empty", "minimal", "wrapper"],
    props: [
      { name: "maxWidth",      label: "Largeur max",     type: "number",  group: "layout",   description: "Largeur maximale du conteneur" },
      { name: "scrollable",    label: "Scrollable",      type: "boolean", group: "behavior", default: true },
      { name: "background",    label: "Fond",            type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",  label: "Rayon bordure",   type: "radius",  group: "style",    default: "none" },
      { name: "padding",       label: "Padding",         type: "padding", group: "layout" },
      { name: "spacing",       label: "Espacement",      type: "spacing", group: "layout",   default: 0 },
      { name: "centerContent", label: "Centrer contenu", type: "boolean", group: "layout",   default: false },
      { name: "showBorder",    label: "Bordure visible", type: "boolean", group: "style",    default: false },
    ],
  },

  {
    id: "CenteredLayout",
    label: "Centré",
    description: "Contenu centré avec carte optionnelle et maxWidth.",
    category: "page",
    slots: [{ name: "children", label: "Contenu", required: true }],
    responsive: true,
    animated: false,
    tags: ["centered", "form", "onboarding", "modal"],
    themeMapping: { root: "background", surface: "card" },
    props: [
      { name: "maxWidth",       label: "Largeur max carte", type: "number",  group: "layout",   default: 500 },
      { name: "padding",        label: "Padding carte",     type: "spacing", group: "layout",   default: 4 },
      { name: "background",     label: "Fond page",         type: "color",   group: "style",    themeDefault: "background" },
      { name: "cardBackground", label: "Fond carte",        type: "color",   group: "style",    themeDefault: "card" },
      { name: "borderRadius",   label: "Rayon bordure",     type: "radius",  group: "style",    default: "3xl" },
      { name: "shadowed",       label: "Ombre carte",       type: "boolean", group: "style",    default: false },
    ],
  },

  {
    id: "AuthLayout",
    label: "Authentification",
    description: "Panel branding (desktop) + formulaire centré. Mobile : plein écran.",
    category: "page",
    themeMapping: { root: "background", surface: "card" },
    slots: [
      { name: "children", label: "Formulaire", required: true },
      { name: "branding", label: "Panel branding", required: false },
    ],
    responsive: true,
    animated: false,
    tags: ["auth", "login", "signup", "onboarding"],
    props: [
      { name: "brandingBackground", label: "Fond branding",    type: "color",   group: "style",    themeDefault: "card" },
      { name: "background",         label: "Fond",             type: "background", group: "style" },
      { name: "borderRadius",       label: "Rayon bordure",    type: "radius",  group: "style",    default: "none" },
      { name: "spacing",            label: "Espacement",       type: "spacing", group: "layout",   default: 0 },
      { name: "brandingRatio",      label: "Ratio branding",   type: "ratio",   group: "layout",   default: 0.5, min: 0, max: 1 },
      { name: "padding",            label: "Padding formulaire", type: "spacing", group: "layout", default: 5 },
      { name: "shadowed",           label: "Ombre mobile",     type: "boolean", group: "style",    default: true },
    ],
  },

  {
    id: "DashboardLayout",
    label: "Dashboard",
    description: "Header fixe, sidebar collapsible, contenu scrollable, footer optionnel.",
    category: "page",
    themeMapping: { root: "background", surface: "card" },
    slots: [
      { name: "header",  label: "Header",  required: true },
      { name: "content", label: "Contenu", required: true },
      { name: "sidebar", label: "Sidebar", required: false },
      { name: "footer",  label: "Footer",  required: false },
    ],
    responsive: true,
    animated: true,
    dependencies: ["react-native-reanimated"],
    tags: ["dashboard", "admin", "sidebar", "header"],
    props: [
      { name: "sidebarWidth",          label: "Largeur sidebar",          type: "number",  group: "layout",   default: 260 },
      { name: "sidebarCollapsedWidth",  label: "Largeur sidebar réduite", type: "number",  group: "layout",   default: 70 },
      { name: "headerHeight",          label: "Hauteur header",           type: "number",  group: "layout",   default: 70 },
      { name: "footerHeight",          label: "Hauteur footer",           type: "number",  group: "layout",   default: 60 },
      { name: "spacing",               label: "Espacement",               type: "spacing", group: "layout",   default: 0 },
      { name: "borderRadius",          label: "Rayon bordure",            type: "radius",  group: "style",    default: "none" },
      { name: "background",            label: "Fond",                     type: "color",   group: "style",    themeDefault: "background" },
      { name: "disableContentScroll",  label: "Désactiver scroll contenu", type: "boolean", group: "behavior", default: false },
    ],
  },

  {
    id: "ResponsiveLayout",
    label: "Responsive",
    description: "Layout adaptatif header/sidebar/content/footer avec 3 modes.",
    category: "page",
    themeMapping: { root: "background" },
    slots: [
      { name: "content", label: "Contenu",  required: true },
      { name: "header",  label: "Header",   required: false },
      { name: "sidebar", label: "Sidebar",  required: false },
      { name: "footer",  label: "Footer",   required: false },
    ],
    responsive: true,
    animated: false,
    tags: ["responsive", "adaptive", "header", "sidebar", "footer"],
    props: [
      { name: "spacing",                label: "Espacement",              type: "spacing", group: "layout",   default: 0 },
      { name: "headerHeight",           label: "Hauteur header",          type: "number",  group: "layout",   default: 60 },
      { name: "sidebarWidth",           label: "Largeur sidebar",         type: "number",  group: "layout",   default: 260 },
      { name: "footerHeight",           label: "Hauteur footer",          type: "number",  group: "layout",   default: 60 },
      { name: "adaptiveMode",           label: "Mode adaptatif",          type: "enum",    group: "behavior", default: "basic", options: ["basic", "sidebar", "full"] },
      { name: "hideHeader",             label: "Cacher header",           type: "boolean", group: "behavior", default: false },
      { name: "hideFooter",             label: "Cacher footer",           type: "boolean", group: "behavior", default: false },
      { name: "collapseFooterOnTablet", label: "Footer compact tablette", type: "boolean", group: "behavior", default: false },
      { name: "background",             label: "Fond",                    type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",           label: "Rayon bordure",           type: "radius",  group: "style",    default: "none" },
      { name: "headerBackground",       label: "Fond header",             type: "color",   group: "style",    themeDefault: "background" },
      { name: "sidebarBackground",      label: "Fond sidebar",            type: "color",   group: "style",    themeDefault: "background" },
      { name: "footerBackground",       label: "Fond footer",             type: "color",   group: "style",    themeDefault: "background" },
      { name: "contentBackground",      label: "Fond contenu",            type: "color",   group: "style" },
      { name: "padding",                label: "Padding",                 type: "padding", group: "layout" },
      { name: "contentPadding",         label: "Padding contenu",         type: "padding", group: "layout" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "FlexLayout",
    label: "Flex",
    description: "Direction, wrap et espacement adaptatifs. Scroll optionnel.",
    category: "content",
    themeMapping: { root: "background" },
    slots: [{ name: "children", label: "Éléments", required: true }],
    responsive: true,
    animated: false,
    tags: ["flex", "row", "column", "wrap", "adaptive"],
    props: [
      { name: "direction",    label: "Direction",       type: "enum",    group: "layout",   default: "row", options: ["row", "column"] },
      { name: "wrap",         label: "Retour à la ligne", type: "boolean", group: "layout", default: false },
      { name: "spacing",      label: "Espacement",      type: "spacing", group: "layout",   default: 4 },
      { name: "maxWidth",     label: "Largeur max",     type: "number",  group: "layout" },
      { name: "scrollable",   label: "Scrollable",      type: "boolean", group: "behavior", default: false },
      { name: "padding",      label: "Padding",         type: "padding", group: "layout" },
      { name: "background",   label: "Fond",            type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius", label: "Rayon bordure",   type: "radius",  group: "style",    default: "none" },
    ],
  },

  {
    id: "GridLayout",
    label: "Grille",
    description: "Grille responsive avec colonnes adaptatives.",
    category: "content",
    themeMapping: { root: "background", surface: "card" },
    slots: [{ name: "children", label: "Cellules", required: true, array: true }],
    responsive: true,
    animated: false,
    tags: ["grid", "columns", "responsive"],
    props: [
      { name: "columns",          label: "Colonnes",          type: "number",  group: "layout",   description: "Nombre de colonnes (auto si omis)" },
      { name: "cellHeight",       label: "Hauteur cellule",   type: "number",  group: "layout",   default: 200 },
      { name: "spacing",          label: "Espacement",        type: "spacing", group: "layout",   default: 0 },
      { name: "maxWidth",         label: "Largeur max",       type: "number",  group: "layout" },
      { name: "scrollable",       label: "Scrollable",        type: "boolean", group: "behavior", default: false },
      { name: "padding",          label: "Padding",           type: "spacing", group: "layout",   default: 0 },
      { name: "itemBackground",   label: "Fond items",        type: "color",   group: "style",    themeDefault: "card" },
      { name: "itemBorderRadius", label: "Rayon items",       type: "radius",  group: "style",    default: "none" },
      { name: "background",       label: "Fond",              type: "color",   group: "style",    default: "transparent" },
      { name: "borderRadius",     label: "Rayon bordure",     type: "radius",  group: "style",    default: "none" },
      { name: "compact",          label: "Mode compact",      type: "boolean", group: "behavior", default: false },
    ],
  },

  {
    id: "BentoLayout",
    label: "Bento",
    description: "Grille bento box avec cellules de tailles variées.",
    category: "content",
    themeMapping: { root: "background" },
    slots: [{ name: "items", label: "Items", required: true, array: true }],
    responsive: true,
    animated: false,
    tags: ["bento", "grid", "mosaic", "dashboard"],
    props: [
      { name: "spacing",          label: "Espacement",      type: "spacing", group: "layout",   default: 2 },
      { name: "itemBackground",   label: "Fond items",      type: "color",   group: "style",    themeDefault: "card" },
      { name: "itemBorderRadius", label: "Rayon items",     type: "radius",  group: "style",    default: "none" },
      { name: "scrollable",       label: "Scrollable",      type: "boolean", group: "behavior", default: true },
      { name: "maxWidth",         label: "Largeur max",     type: "number",  group: "layout",   default: 1200 },
      { name: "baseHeight",       label: "Hauteur de base", type: "number",  group: "layout",   default: 200 },
      { name: "background",       label: "Fond",            type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",     label: "Rayon bordure",   type: "radius",  group: "style",    default: "none" },
    ],
  },

  {
    id: "MasonryLayout",
    label: "Masonry",
    description: "Grille masonry multi-colonnes.",
    category: "content",
    themeMapping: { root: "background", surface: "card" },
    slots: [{ name: "items", label: "Items", required: true, array: true }],
    responsive: false,
    animated: false,
    tags: ["masonry", "pinterest", "waterfall"],
    props: [
      { name: "columns",          label: "Colonnes",      type: "number",  group: "layout",   default: 2 },
      { name: "spacing",          label: "Espacement",    type: "spacing", group: "layout",   default: 1 },
      { name: "maxWidth",         label: "Largeur max",   type: "number",  group: "layout" },
      { name: "scrollable",       label: "Scrollable",    type: "boolean", group: "behavior", default: true },
      { name: "background",       label: "Fond",          type: "color",   group: "style",    default: "transparent" },
      { name: "borderRadius",     label: "Rayon bordure", type: "radius",  group: "style",    default: "none" },
      { name: "itemBackground",   label: "Fond items",    type: "color",   group: "style",    themeDefault: "card" },
      { name: "itemBorderRadius", label: "Rayon items",   type: "radius",  group: "style",    default: "none" },
      { name: "padding",          label: "Padding",       type: "padding", group: "layout" },
    ],
  },

  {
    id: "SplitLayout",
    label: "Split",
    description: "Deux panneaux (gauche/droite ou haut/bas) avec scroll indépendant.",
    category: "content",
    themeMapping: { root: "background", left: "card", right: "card" },
    slots: [
      { name: "left",  label: "Panneau gauche", required: true },
      { name: "right", label: "Panneau droit",  required: true },
    ],
    responsive: true,
    animated: false,
    tags: ["split", "two-pane", "master-detail"],
    props: [
      { name: "spacing",           label: "Espacement",          type: "spacing", group: "layout",   default: 0 },
      { name: "leftWidth",         label: "Largeur gauche fixe", type: "number",  group: "layout" },
      { name: "ratio",             label: "Ratio gauche",        type: "ratio",   group: "layout",   default: 0.5, min: 0, max: 1 },
      { name: "orientation",       label: "Orientation",         type: "enum",    group: "layout",   default: "horizontal", options: ["horizontal", "vertical"] },
      { name: "hideLeftOnMobile",  label: "Cacher gauche mobile", type: "boolean", group: "behavior", default: false },
      { name: "background",        label: "Fond",                type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",      label: "Rayon bordure",       type: "radius",  group: "style",    default: "none" },
      { name: "leftBackground",    label: "Fond gauche",         type: "color",   group: "style",    themeDefault: "card" },
      { name: "rightBackground",   label: "Fond droit",          type: "color",   group: "style",    themeDefault: "card" },
    ],
  },

  {
    id: "FooterLayout",
    label: "Footer",
    description: "Contenu principal avec footer fixe ou scrollable.",
    category: "content",
    themeMapping: { root: "background" },
    slots: [
      { name: "content", label: "Contenu", required: true },
      { name: "footer",  label: "Footer",  required: true },
    ],
    responsive: false,
    animated: false,
    tags: ["footer", "sticky", "bottom-bar"],
    props: [
      { name: "footerHeight",       label: "Hauteur footer",     type: "number",  group: "layout",   default: 60 },
      { name: "spacing",            label: "Espacement",         type: "spacing", group: "layout",   default: 0 },
      { name: "sticky",             label: "Footer sticky",      type: "boolean", group: "behavior", default: false },
      { name: "maxWidth",           label: "Largeur max",        type: "number",  group: "layout" },
      { name: "scrollable",         label: "Scrollable",         type: "boolean", group: "behavior", default: true },
      { name: "footerBackground",   label: "Fond footer",        type: "color",   group: "style",    themeDefault: "background" },
      { name: "footerBorderRadius", label: "Rayon footer",       type: "radius",  group: "style",    default: "none" },
      { name: "contentBorderRadius", label: "Rayon contenu",     type: "radius",  group: "style",    default: "none" },
      { name: "background",         label: "Fond",               type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",       label: "Rayon bordure",      type: "radius",  group: "style",    default: "none" },
      { name: "padding",            label: "Padding contenu",    type: "spacing", group: "layout",   default: 5 },
      { name: "footerPadding",      label: "Padding footer",     type: "spacing", group: "layout",   default: 5 },
      { name: "compact",            label: "Mode compact",       type: "boolean", group: "behavior", default: false },
    ],
  },

  {
    id: "CrossTabLayout",
    label: "Cross Tab",
    description: "Grille réordonnnable par drag & drop.",
    category: "content",
    themeMapping: { surface: "card" },
    constants: {
      springConfig: { damping: 18, stiffness: 120, mass: 0.5 },
    },
    slots: [{ name: "children", label: "Widgets", required: true, array: true }],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated", "react-native-gesture-handler", "expo-haptics"],
    tags: ["drag", "drop", "reorder", "widgets", "grid"],
    props: [
      { name: "columns",          label: "Colonnes",      type: "number",  group: "layout",   default: 2 },
      { name: "spacing",          label: "Espacement",    type: "spacing", group: "layout",   default: 4 },
      { name: "itemBackground",   label: "Fond items",    type: "color",   group: "style",    themeDefault: "card" },
      { name: "itemBorderRadius", label: "Rayon items",   type: "number",  group: "style",    default: 28 },
      { name: "scrollEnabled",    label: "Scroll activé", type: "boolean", group: "behavior", default: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "SidebarLayout",
    label: "Sidebar",
    description: "Contenu avec sidebar latérale, collapsible sur mobile.",
    category: "navigation",
    themeMapping: { root: "background", sidebar: "card", border: "border" },
    slots: [
      { name: "sidebar", label: "Sidebar", required: true },
      { name: "content", label: "Contenu", required: true },
    ],
    responsive: true,
    animated: false,
    tags: ["sidebar", "navigation", "menu", "resizable"],
    props: [
      { name: "sidebarWidth",        label: "Largeur sidebar",   type: "number",  group: "layout",   default: 280 },
      { name: "position",            label: "Position sidebar",  type: "enum",    group: "layout",   default: "left", options: ["left", "right"] },
      { name: "collapsible",         label: "Collapsible mobile", type: "boolean", group: "behavior", default: true },
      { name: "spacing",             label: "Espacement",        type: "spacing", group: "layout",   default: 4 },
      { name: "maxWidth",            label: "Largeur max",       type: "number",  group: "layout" },
      { name: "scrollable",          label: "Scrollable",        type: "boolean", group: "behavior", default: true },
      { name: "background",          label: "Fond",              type: "background", group: "style" },
      { name: "borderRadius",        label: "Rayon bordure",     type: "radius",  group: "style",    default: "none" },
      { name: "sidebarBackground",   label: "Fond sidebar",      type: "background", group: "style" },
      { name: "sidebarBorderRadius", label: "Rayon sidebar",     type: "radius",  group: "style",    default: "none" },
      { name: "padding",             label: "Padding",           type: "padding", group: "layout" },
      { name: "resizable",           label: "Redimensionnable",  type: "boolean", group: "behavior", default: false },
    ],
  },

  {
    id: "BottomDrawerLayout",
    label: "Tiroir bas",
    description: "Tiroir inférieur animé avec geste de swipe.",
    category: "navigation",
    themeMapping: { root: "background", drawer: "background", accent: "primary", border: "border" },
    constants: {
      springConfig: { damping: 25, stiffness: 200, mass: 0.5, overshootClamping: true },
    },
    slots: [
      { name: "content",       label: "Contenu principal",  required: true },
      { name: "drawerContent", label: "Contenu du tiroir",  required: true },
    ],
    responsive: true,
    animated: true,
    dependencies: ["react-native-reanimated", "react-native-gesture-handler", "expo-haptics"],
    tags: ["drawer", "bottom-sheet", "swipe", "modal"],
    props: [
      { name: "drawerHeight",       label: "Hauteur tiroir",  type: "number",  group: "layout",   default: 400 },
      { name: "maxWidth",           label: "Largeur max",     type: "number",  group: "layout" },
      { name: "scrollable",         label: "Scrollable",      type: "boolean", group: "behavior", default: true },
      { name: "drawerBackground",   label: "Fond tiroir",     type: "color",   group: "style",    themeDefault: "background" },
      { name: "drawerBorderRadius", label: "Rayon tiroir",    type: "radius",  group: "style",    default: "3xl" },
      { name: "background",         label: "Fond",            type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",       label: "Rayon bordure",   type: "radius",  group: "style",    default: "none" },
      { name: "defaultOpen",        label: "Ouvert par défaut", type: "boolean", group: "behavior", default: false },
    ],
  },

  {
    id: "TopDrawerLayout",
    label: "Tiroir haut",
    description: "Tiroir supérieur animé avec geste de swipe.",
    category: "navigation",
    themeMapping: { root: "background", drawer: "background", border: "border", muted: "muted" },
    constants: {
      springConfig: { damping: 25, stiffness: 200, mass: 0.5, overshootClamping: true },
    },
    slots: [
      { name: "content",       label: "Contenu principal",  required: true },
      { name: "drawerContent", label: "Contenu du tiroir",  required: true },
    ],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated", "react-native-gesture-handler", "expo-haptics"],
    tags: ["drawer", "top-sheet", "swipe", "notification"],
    props: [
      { name: "drawerHeight",       label: "Hauteur tiroir",    type: "number",  group: "layout",   default: 600 },
      { name: "maxWidth",           label: "Largeur max",       type: "number",  group: "layout" },
      { name: "scrollable",         label: "Scrollable",        type: "boolean", group: "behavior", default: true },
      { name: "drawerBackground",   label: "Fond tiroir",       type: "color",   group: "style",    themeDefault: "background" },
      { name: "drawerBorderRadius", label: "Rayon tiroir",      type: "radius",  group: "style",    default: "3xl" },
      { name: "background",         label: "Fond",              type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",       label: "Rayon bordure",     type: "radius",  group: "style",    default: "none" },
      { name: "defaultOpen",        label: "Ouvert par défaut", type: "boolean", group: "behavior", default: false },
    ],
  },

  {
    id: "LeftDrawerLayout",
    label: "Tiroir gauche",
    description: "Tiroir latéral gauche animé avec geste de swipe.",
    category: "navigation",
    themeMapping: { root: "background", drawer: "background", accent: "primary", border: "border" },
    constants: {
      springConfig: { damping: 25, stiffness: 200, mass: 0.5, overshootClamping: true },
    },
    slots: [
      { name: "content",       label: "Contenu principal",  required: true },
      { name: "drawerContent", label: "Contenu du tiroir",  required: true },
    ],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated", "react-native-gesture-handler", "expo-haptics"],
    tags: ["drawer", "side-menu", "swipe", "navigation"],
    props: [
      { name: "drawerWidth",        label: "Largeur tiroir",    type: "number",  group: "layout",   default: 280 },
      { name: "maxWidth",           label: "Largeur max",       type: "number",  group: "layout" },
      { name: "scrollable",         label: "Scrollable",        type: "boolean", group: "behavior", default: true },
      { name: "drawerBackground",   label: "Fond tiroir",       type: "color",   group: "style",    themeDefault: "background" },
      { name: "drawerBorderRadius", label: "Rayon tiroir",      type: "radius",  group: "style",    default: "none" },
      { name: "background",         label: "Fond",              type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",       label: "Rayon bordure",     type: "radius",  group: "style",    default: "none" },
      { name: "defaultOpen",        label: "Ouvert par défaut", type: "boolean", group: "behavior", default: false },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CARD
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "DeckLayout",
    label: "Deck",
    description: "Stack de cartes swipeable avec effet de profondeur.",
    category: "card",
    constants: {
      swipeThreshold: 60,
      exitDistance: 450,
      springConfig: { damping: 20, stiffness: 200, mass: 0.5 },
    },
    slots: [{ name: "children", label: "Cartes", required: true, array: true }],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated", "react-native-gesture-handler", "expo-haptics"],
    tags: ["deck", "cards", "swipe", "tinder", "stack"],
    props: [
      { name: "peekOffset",   label: "Décalage peek",  type: "number",  group: "layout",   default: 12 },
      { name: "peekScale",    label: "Échelle peek",   type: "ratio",   group: "layout",   default: 0.05, min: 0, max: 0.2 },
      { name: "cycle",        label: "Boucle",         type: "boolean", group: "behavior", default: false },
      { name: "cardShadow",   label: "Ombre cartes",   type: "boolean", group: "style",    default: true },
    ],
  },

  {
    id: "FlipLayout",
    label: "Flip",
    description: "Carousel avec flip recto/verso et swipe horizontal.",
    category: "card",
    themeMapping: { root: "background", surface: "card" },
    constants: {
      swipeThreshold: 40,
      flipThreshold: 22,
      scaleFactor: 0.92,
      flipScaleFactor: 0.90,
      dezoomDuration: 120,
      flipDuration: 320,
      slideOutDuration: 140,
      springNoBounce: { damping: 30, stiffness: 240, mass: 0.6 },
      springSnap: { damping: 35, stiffness: 300, mass: 0.5 },
      exitLeft: -700,
      exitRight: 700,
    },
    slots: [
      { name: "children",    label: "Faces recto", required: true, array: true },
      { name: "backContent", label: "Faces verso", required: false, array: true },
    ],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated", "react-native-gesture-handler"],
    tags: ["flip", "card", "recto-verso", "flashcard"],
    props: [
      { name: "maxWidth",         label: "Largeur max",       type: "number",     group: "layout" },
      { name: "background",       label: "Fond",              type: "color",      group: "style",    themeDefault: "background" },
      { name: "borderRadius",     label: "Rayon bordure",     type: "radius",     group: "style",    default: "none" },
      { name: "cardBackground",   label: "Fond carte",        type: "color",      group: "style",    themeDefault: "card" },
      { name: "flipPerspective",  label: "Perspective flip",  type: "number",     group: "layout",   default: 1200 },
      { name: "swipeThreshold",   label: "Seuil swipe",       type: "number",     group: "behavior", default: 40 },
      { name: "padding",          label: "Padding",           type: "padding",    group: "layout" },
    ],
  },

  {
    id: "SwiperLayout",
    label: "Swiper",
    description: "Carousel swipeable multi-directionnel avec préchargement.",
    category: "card",
    themeMapping: { root: "background", surface: "card" },
    constants: {
      swipeThreshold: 40,
      scaleFactor: 0.85,
    },
    slots: [{ name: "children", label: "Slides", required: true, array: true }],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated", "react-native-gesture-handler"],
    tags: ["swiper", "carousel", "slides", "stories"],
    props: [
      { name: "enableSwipeUp",   label: "Swipe haut",       type: "boolean", group: "behavior", default: false },
      { name: "enableSwipeDown",  label: "Swipe bas",        type: "boolean", group: "behavior", default: false },
      { name: "maxWidth",         label: "Largeur max",      type: "number",  group: "layout" },
      { name: "background",       label: "Fond",             type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",     label: "Rayon bordure",    type: "radius",  group: "style",    default: "none" },
      { name: "cardBackground",   label: "Fond carte",       type: "color",   group: "style",    themeDefault: "card" },
      { name: "cardBorderRadius", label: "Rayon carte",      type: "radius",  group: "style",    default: "none" },
      { name: "showCardCount",    label: "Compteur cartes",  type: "boolean", group: "behavior", default: false },
      { name: "preloadRange",     label: "Préchargement",    type: "number",  group: "behavior", default: 2 },
      { name: "swipeThreshold",   label: "Seuil swipe",      type: "number",  group: "behavior", default: 40 },
      { name: "padding",          label: "Padding",          type: "padding", group: "layout" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCROLL
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "ScrollLayout",
    label: "Scroll",
    description: "Structure scrollable avec header/footer sticky ou inline.",
    category: "scroll",
    themeMapping: { root: "background", surface: "card" },
    slots: [
      { name: "content", label: "Contenu", required: true },
      { name: "header",  label: "Header",  required: false },
      { name: "footer",  label: "Footer",  required: false },
    ],
    responsive: true,
    animated: false,
    tags: ["scroll", "sticky", "header", "footer", "safe-area"],
    props: [
      { name: "spacing",             label: "Espacement",         type: "spacing",  group: "layout",   default: 4 },
      { name: "useSafeAreaInsets",    label: "Safe area",          type: "boolean",  group: "behavior", default: true },
      { name: "headerHeight",        label: "Hauteur header",     type: "number",   group: "layout",   default: 80 },
      { name: "footerHeight",        label: "Hauteur footer",     type: "number",   group: "layout",   default: 60 },
      { name: "scrollDirection",     label: "Direction scroll",   type: "enum",     group: "behavior", default: "vertical", options: ["vertical", "horizontal", "both"] },
      { name: "showScrollIndicator", label: "Indicateur scroll",  type: "boolean",  group: "behavior", default: false },
      { name: "enableBounces",       label: "Rebond",             type: "boolean",  group: "behavior", default: true },
      { name: "stickyHeader",        label: "Header sticky",      type: "boolean",  group: "behavior", default: false },
      { name: "stickyFooter",        label: "Footer sticky",      type: "boolean",  group: "behavior", default: false },
      { name: "background",          label: "Fond",               type: "color",    group: "style",    themeDefault: "background" },
      { name: "borderRadius",        label: "Rayon bordure",      type: "radius",   group: "style",    default: "none" },
      { name: "headerBackground",    label: "Fond header",        type: "color",    group: "style",    themeDefault: "card" },
      { name: "footerBackground",    label: "Fond footer",        type: "color",    group: "style",    themeDefault: "card" },
      { name: "contentBackground",   label: "Fond contenu",       type: "color",    group: "style" },
    ],
  },

  {
    id: "HeaderContentLayout",
    label: "Header collapsible",
    description: "Header qui se réduit au scroll avec contenu principal.",
    category: "scroll",
    themeMapping: { root: "background", header: "card", content: "card" },
    slots: [
      { name: "header",  label: "Header",  required: true },
      { name: "content", label: "Contenu", required: true },
    ],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated"],
    tags: ["header", "collapsible", "scroll", "parallax"],
    props: [
      { name: "headerHeight",          label: "Hauteur header",          type: "number",  group: "layout",   default: 150 },
      { name: "headerCollapsedHeight", label: "Hauteur header réduit",   type: "number",  group: "layout",   default: 60 },
      { name: "spacing",               label: "Espacement",              type: "spacing", group: "layout",   default: 0 },
      { name: "maxWidth",              label: "Largeur max",             type: "number",  group: "layout" },
      { name: "headerBackground",      label: "Fond header",             type: "color",   group: "style",    themeDefault: "card" },
      { name: "headerBorderRadius",    label: "Rayon header",            type: "radius",  group: "style",    default: "none" },
      { name: "contentBackground",     label: "Fond contenu",            type: "color",   group: "style",    themeDefault: "card" },
      { name: "contentBorderRadius",   label: "Rayon contenu",           type: "radius",  group: "style",    default: "none" },
      { name: "background",            label: "Fond",                    type: "color",   group: "style",    themeDefault: "background" },
      { name: "borderRadius",          label: "Rayon bordure",           type: "radius",  group: "style",    default: "none" },
      { name: "padding",               label: "Padding contenu",         type: "spacing", group: "layout",   default: 5 },
      { name: "headerPadding",         label: "Padding header",          type: "spacing", group: "layout",   default: 5 },
    ],
  },

  {
    id: "ParallaxLayout",
    label: "Parallax",
    description: "Rangées horizontales scrollables avec synchronisation parallaxe.",
    category: "scroll",
    slots: [{ name: "rows", label: "Rangées", required: true, array: true }],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated"],
    tags: ["parallax", "horizontal", "sync", "showcase"],
    props: [
      { name: "spacing",            label: "Espacement",          type: "spacing", group: "layout",   default: 4 },
      { name: "alternateDirection", label: "Direction alternée",  type: "boolean", group: "behavior", default: true },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPECIAL
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "TutoLayout",
    label: "Tutoriel",
    description: "Overlay de tutoriel avec zones highlight et gestes.",
    category: "special",
    themeMapping: { root: "background", accent: "primary", text: "foreground" },
    constants: {
      swipeThreshold: 40,
    },
    slots: [{ name: "steps", label: "Étapes", required: true, array: true }],
    responsive: false,
    animated: true,
    dependencies: ["react-native-reanimated"],
    tags: ["tutorial", "onboarding", "highlight", "walkthrough"],
    props: [
      { name: "overlayOpacity", label: "Opacité overlay",  type: "ratio",   group: "style",    default: 0.78, min: 0, max: 1 },
      { name: "overlayColor",   label: "Couleur overlay",  type: "color",   group: "style" },
      { name: "showSkip",       label: "Bouton ignorer",   type: "boolean", group: "behavior", default: true },
      { name: "nextLabel",      label: "Label suivant",    type: "string",  group: "content",  default: "Suivant" },
      { name: "finishLabel",    label: "Label terminer",   type: "string",  group: "content",  default: "Terminer" },
    ],
  },

  {
    id: "SketchLayout",
    label: "Sketch (placeholder)",
    description: "Placeholder pour un canvas de dessin.",
    category: "special",
    slots: [],
    responsive: false,
    animated: false,
    tags: ["sketch", "draw", "canvas", "placeholder"],
    props: [],
  },
];
