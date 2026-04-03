/**
 * Document Tree Types
 *
 * The tree is the central data structure of the builder.
 * A page is a tree of nodes. Each node references a registry item
 * (layout, component, or block) and carries its configured props.
 *
 * The tree is:
 * - Serializable to JSON (saved to disk, sent over WebSocket)
 * - Renderable to React Native code (via codegen)
 * - Renderable to a live preview (via the web preview engine)
 */

export type NodeKind = "layout" | "component" | "block" | "slot" | "text";

export interface TreeNode {
  id: string;
  kind: NodeKind;
  registryId: string;
  props: Record<string, unknown>;
  variant?: string;
  children: TreeNode[];
  slotName?: string;
}

export interface PageDocument {
  id: string;
  name: string;
  route?: string;
  root: TreeNode;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDocument {
  name: string;
  version: string;
  theme: string;
  pages: PageDocument[];
  services: ServiceConfig[];
  navigation: NavigationConfig;
}

export interface ServiceConfig {
  id: string;
  type: "supabase" | "rest" | "graphql" | "firebase" | "custom";
  name: string;
  config: Record<string, unknown>;
}

export interface NavigationConfig {
  type: "stack" | "tabs" | "drawer";
  screens: NavigationScreen[];
}

export interface NavigationScreen {
  name: string;
  pageId: string;
  icon?: string;
  options?: Record<string, unknown>;
}
