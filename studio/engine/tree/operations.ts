/**
 * Tree Operations
 *
 * Pure functions to manipulate the document tree.
 * All operations are immutable — they return new trees.
 */

import type { TreeNode, PageDocument } from "./types";

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

export function createPage(name: string, layoutId: string = "VoidLayout"): PageDocument {
  return {
    id: generateId(),
    name,
    root: createNode("layout", layoutId),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
