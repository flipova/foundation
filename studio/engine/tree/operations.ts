/**
 * Tree Operations
 *
 * Pure functions to manipulate the document tree.
 * All operations are immutable — they return new trees.
 */

import type { TreeNode, PageDocument, ProjectDocument } from "./types";

let counter = 0;
export function generateId(): string {
  return `node_${Date.now()}_${++counter}`;
}

export function createNode(
  kind: TreeNode["kind"],
  registryId: string,
  props: Record<string, unknown> = {},
  variant?: string,
): TreeNode {
  return {
    id: generateId(),
    kind,
    registryId,
    props,
    variant,
    children: [],
  };
}

export function findNode(root: TreeNode, nodeId: string): TreeNode | null {
  if (root.id === nodeId) return root;
  for (const child of root.children) {
    const found = findNode(child, nodeId);
    if (found) return found;
  }
  return null;
}

export function findParent(root: TreeNode, nodeId: string): TreeNode | null {
  for (const child of root.children) {
    if (child.id === nodeId) return root;
    const found = findParent(child, nodeId);
    if (found) return found;
  }
  return null;
}

export function insertChild(
  root: TreeNode,
  parentId: string,
  node: TreeNode,
  index?: number,
): TreeNode {
  if (root.id === parentId) {
    const children = [...root.children];
    if (index !== undefined) {
      children.splice(index, 0, node);
    } else {
      children.push(node);
    }
    return { ...root, children };
  }
  return {
    ...root,
    children: root.children.map((child) => insertChild(child, parentId, node, index)),
  };
}

export function removeNode(root: TreeNode, nodeId: string): TreeNode {
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== nodeId)
      .map((child) => removeNode(child, nodeId)),
  };
}

export function updateProps(
  root: TreeNode,
  nodeId: string,
  props: Record<string, unknown>,
): TreeNode {
  if (root.id === nodeId) {
    return { ...root, props: { ...root.props, ...props } };
  }
  return {
    ...root,
    children: root.children.map((child) => updateProps(child, nodeId, props)),
  };
}

export function moveNode(
  root: TreeNode,
  nodeId: string,
  newParentId: string,
  index?: number,
): TreeNode {
  const node = findNode(root, nodeId);
  if (!node) return root;
  const withoutNode = removeNode(root, nodeId);
  return insertChild(withoutNode, newParentId, node, index);
}

/** Derives the URL-safe route slug from a page name. Single source of truth. */
export function pageNameToRoute(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Derives the PascalCase component name from a page name. Single source of truth. */
export function pageNameToComponent(name: string): string {
  return name.replace(/[^a-zA-Z0-9 ]/g, " ").split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "Screen";
}

export function renamePage(
  project: ProjectDocument,
  pageId: string,
  newName: string,
): { project: ProjectDocument; oldRoute: string } {
  const page = project.pages.find((p) => p.id === pageId);
  if (!page) throw new Error(`Page not found: ${pageId}`);
  const oldRoute = page.route;
  const newRoute = pageNameToRoute(newName);
  const updatedPages = project.pages.map((p) =>
    p.id === pageId ? { ...p, name: newName, route: newRoute } : p,
  );
  const updatedScreens = project.navigation.screens.map((s) =>
    s.pageId === pageId ? { ...s, name: newName } : s,
  );
  return {
    project: {
      ...project,
      pages: updatedPages,
      navigation: { ...project.navigation, screens: updatedScreens },
    },
    oldRoute,
  };
}

export function createPage(name: string, layoutId: string = "RootLayout"): PageDocument {
  return {
    id: generateId(),
    name,
    route: pageNameToRoute(name),
    root: createNode("layout", layoutId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Tree traversal utilities
// ---------------------------------------------------------------------------

/**
 * Find the nearest ancestor node that has a repeatBinding.
 * Returns null if the node is not inside a repeat.
 */
export function findRepeatAncestor(
  root: TreeNode,
  nodeId: string,
  ancestors: TreeNode[] = []
): TreeNode | null {
  if (root.id === nodeId) {
    return ancestors.find(a => !!a.repeatBinding) || null;
  }
  for (const child of root.children) {
    const found = findRepeatAncestor(child, nodeId, [...ancestors, root]);
    if (found !== null) return found;
  }
  return null;
}

/**
 * Collect all $query.* variable names referenced in a tree.
 * Returns a Set of varNames like "jpUsersData".
 */
export function collectQueryRefs(node: TreeNode): Set<string> {
  const refs = new Set<string>();
  const addRef = (expr?: string) => {
    if (expr?.startsWith('$query.')) refs.add(expr.slice(7).split('.')[0]);
  };
  const walk = (n: TreeNode) => {
    if (n.bindings) Object.values(n.bindings).forEach(addRef);
    addRef(n.repeatBinding?.source);
    addRef(n.conditionalRender?.expression);
    if (n.events) {
      for (const actions of Object.values(n.events)) {
        for (const a of actions as any[]) {
          if (a.type === 'callApi' && a.payload?.queryName) {
            // callApi references are handled separately via collectApiCalls
          }
        }
      }
    }
    n.children.forEach(walk);
  };
  walk(node);
  return refs;
}

/**
 * Collect all $state.* variable names referenced in a tree.
 */
export function collectStateRefs(node: TreeNode): Set<string> {
  const refs = new Set<string>();
  const addRef = (expr?: string) => {
    if (expr?.startsWith('$state.')) refs.add(expr.slice(7).split('.')[0]);
  };
  const walk = (n: TreeNode) => {
    if (n.bindings) Object.values(n.bindings).forEach(addRef);
    addRef(n.conditionalRender?.expression);
    n.children.forEach(walk);
  };
  walk(node);
  return refs;
}

export interface ItemField {
  key: string;
  preview: string;
  type: string;
}

/**
 * Extract item fields from query response data.
 * Takes the first item of an array, or the object itself.
 */
export function extractItemFields(data: any): ItemField[] {
  if (!data) return [];
  const sample = Array.isArray(data) ? data[0] : data;
  if (!sample || typeof sample !== 'object') return [];
  return Object.entries(sample).map(([key, val]) => ({
    key,
    type: typeof val === 'object' && val !== null
      ? (Array.isArray(val) ? 'array' : 'object')
      : typeof val,
    preview: typeof val === 'string'
      ? val.slice(0, 20)
      : typeof val === 'number'
      ? String(val)
      : typeof val,
  }));
}
