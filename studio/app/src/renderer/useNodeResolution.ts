/**
 * useNodeResolution — Centralized, reactive prop resolution for the preview.
 *
 * Architecture:
 *   Static props  → resolveTokenValue() → design tokens only
 *   Bindings      → resolveForPreview() → full expression engine
 *   Result        → merged object, bindings win over static props
 *
 * This hook is the SINGLE place where props are resolved for rendering.
 * It is reactive: re-runs whenever queryContext, itemContext, or themeColors change.
 *
 * nodePropsContext is built from RESOLVED props (not raw static props),
 * so $node.id.prop references always return the live value.
 */
import React from 'react';
import { TreeNode } from '../store/StudioProvider';
import { resolveForPreview } from '../../../engine/tree/expressions';
import { resolveTokenValue } from '../store/tokens';

export interface ResolutionContext {
  itemContext?: Record<string, any>;
  queryContext?: Record<string, any>;
  themeColors?: Record<string, string>;
  globalContext?: Record<string, any>;
  /** Resolved props of all nodes — built from resolved values, not raw static */
  nodePropsContext?: Record<string, Record<string, any>>;
}

/**
 * Resolve a single expression value for preview.
 * Handles both token expressions ($spacing.4) and dynamic expressions ($state.x).
 */
export function resolveExprForPreview(
  expr: string,
  ctx: ResolutionContext
): any {
  if (!expr || typeof expr !== 'string') return expr;

  // Design tokens — resolve statically (no context needed)
  if (expr.startsWith('$') && !expr.startsWith('$state.') && !expr.startsWith('$global.')
    && !expr.startsWith('$query.') && !expr.startsWith('$node.') && !expr.startsWith('$const.')
    && !expr.startsWith('$env.') && !expr.startsWith('$device.') && !expr.startsWith('$date.')
    && !expr.startsWith('$nav.') && !expr.startsWith('$response') && !expr.startsWith('$error')) {
    const tokenVal = resolveTokenValue(expr, ctx.themeColors);
    if (tokenVal !== expr) return tokenVal;
  }

  // Dynamic expressions — use the full expression engine
  return resolveForPreview(expr, ctx);
}

/**
 * Resolve all props for a node, merging static props and bindings.
 * Bindings always take precedence over static props.
 */
export function resolveNodeProps(
  node: TreeNode,
  ctx: ResolutionContext
): Record<string, any> {
  const result: Record<string, any> = {};

  // 1. Resolve static props (tokens + literals)
  for (const [k, v] of Object.entries(node.props || {})) {
    if (typeof v === 'string' && v.startsWith('$')) {
      result[k] = resolveExprForPreview(v, ctx);
    } else {
      result[k] = v;
    }
  }

  // 2. Apply bindings — override static props with dynamic expressions
  for (const [k, expr] of Object.entries(node.bindings || {})) {
    if (!expr) continue;
    const resolved = resolveForPreview(expr, ctx);
    if (resolved !== undefined) {
      result[k] = resolved;
    }
  }

  return result;
}

/**
 * Build a nodePropsContext from the RESOLVED props of all nodes in the tree.
 * This ensures $node.id.prop references return live values, not static ones.
 *
 * Note: This is a two-pass approach:
 *   Pass 1: Resolve all props without nodePropsContext (can't self-reference)
 *   Pass 2: Re-resolve $node.* expressions with the built context
 */
export function buildNodePropsContext(
  root: TreeNode,
  ctx: Omit<ResolutionContext, 'nodePropsContext'>
): Record<string, Record<string, any>> {
  const nodeCtx: Record<string, Record<string, any>> = {};

  // Pass 1: resolve all props without nodePropsContext
  const walk = (n: TreeNode) => {
    nodeCtx[n.id] = resolveNodeProps(n, { ...ctx, nodePropsContext: undefined });
    nodeCtx[n.id].__registryId = n.registryId;
    for (const c of n.children) walk(c);
  };
  walk(root);

  // Pass 2: re-resolve any $node.* expressions now that we have the context
  const walkPass2 = (n: TreeNode) => {
    const props = nodeCtx[n.id];
    for (const [k, v] of Object.entries(props)) {
      if (typeof v === 'string' && v.startsWith('$node.')) {
        props[k] = resolveForPreview(v, { ...ctx, nodePropsContext: nodeCtx });
      }
    }
    for (const c of n.children) walkPass2(c);
  };
  walkPass2(root);

  return nodeCtx;
}

/**
 * React hook: builds a reactive nodePropsContext that updates when
 * queryContext, themeColors, or the page tree changes.
 */
export function useNodePropsContext(
  root: TreeNode | undefined,
  ctx: Omit<ResolutionContext, 'nodePropsContext'>
): Record<string, Record<string, any>> {
  return React.useMemo(() => {
    if (!root) return {};
    return buildNodePropsContext(root, ctx);
  }, [root, ctx.queryContext, ctx.themeColors, ctx.globalContext, ctx.itemContext]);
}
