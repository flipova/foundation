/**
 * ItemsRenderer
 *
 * Standard renderer for multi-item layouts (DeckLayout, SwiperLayout, GridLayout,
 * BentoLayout, MasonryLayout, ParallaxLayout, CrossTabLayout, FlipLayout...).
 *
 * Supports three modes, resolved in priority order:
 *
 * 1. DATA mode   — layout has repeatBinding → resolve data source → render template per item
 * 2. TEMPLATE mode — single child with repeatBinding → repeat N times (edit preview)
 * 3. STATIC mode — N children dropped manually → pass as-is
 *
 * Usage in NodeRenderer (mode === 'items'):
 *   <ItemsRenderer
 *     node={node}
 *     itemsProp="cards"
 *     previewCount={4}
 *     Component={Component}
 *     rProps={rProps}
 *     ...ctx
 *   />
 *
 * To add a new multi-item layout:
 *   1. Set slot name != "children" with array:true in registry (e.g. "cards", "slides", "items")
 *   2. Set previewItemCount in registry
 *   3. Accept the prop in the component (+ backward compat children)
 *   Done — ItemsRenderer handles the rest automatically.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TreeNode } from '../store/StudioProvider';
import { resolveForPreview } from '../../../engine/tree/expressions';
import { resolveNodeProps } from './useNodeResolution';
import { useStudio } from '../store/StudioProvider';

// ---------------------------------------------------------------------------
// Shared context type passed from NodeRenderer
// ---------------------------------------------------------------------------

export interface ItemsRenderCtx {
  depth: number;
  itemContext?: Record<string, any>;
  queryContext?: Record<string, any>;
  globalContext?: Record<string, any>;
  themeColors?: Record<string, string>;
  nodePropsContext?: Record<string, Record<string, any>>;
  onQueryContextUpdate?: (key: string, val: any) => void;
  project?: any;
  previewMode: boolean;
}

// ---------------------------------------------------------------------------
// Placeholder items used when no data source is available
// ---------------------------------------------------------------------------

const PLACEHOLDER_DATA = [
  { id: 1, name: 'Alice Martin',  email: 'alice@example.com',  title: 'Item 1', body: 'Preview' },
  { id: 2, name: 'Bob Dupont',    email: 'bob@example.com',    title: 'Item 2', body: 'Preview' },
  { id: 3, name: 'Carol Smith',   email: 'carol@example.com',  title: 'Item 3', body: 'Preview' },
  { id: 4, name: 'David Lee',     email: 'david@example.com',  title: 'Item 4', body: 'Preview' },
  { id: 5, name: 'Eva Müller',    email: 'eva@example.com',    title: 'Item 5', body: 'Preview' },
];

// ---------------------------------------------------------------------------
// Data resolution hook — resolves a $state.alias source to an array
// ---------------------------------------------------------------------------

function useDataItems(
  source: string,
  queryContext: Record<string, any> | undefined,
  project: any,
  onQueryContextUpdate?: (key: string, val: any) => void,
): any[] {
  const [items, setItems] = React.useState<any[]>(PLACEHOLDER_DATA.slice(0, 3));

  React.useEffect(() => {
    if (!source) {
      setItems(PLACEHOLDER_DATA.slice(0, 3));
      return;
    }

    // $state.alias
    if (source.startsWith('$state.')) {
      const alias = source.slice(7).split('.')[0];
      const data = queryContext?.[alias];
      if (Array.isArray(data) && data.length > 0) {
        setItems(data.slice(0, 20));
        return;
      }
      // Try to fetch from query
      const query = (project?.queries || []).find((q: any) => q.alias === alias);
      if (query) {
        const svc = (project?.services || []).find((sv: any) => sv.id === query.serviceId);
        const base = (svc?.config as any)?.baseUrl || '';
        if (base) {
          fetch(base.replace(/\/$/, '') + query.path)
            .then(r => r.json())
            .then(d => {
              const arr = Array.isArray(d) ? d : (d?.data || d?.results || d?.items || []);
              const resolved = arr.length > 0 ? arr.slice(0, 20) : PLACEHOLDER_DATA.slice(0, 3);
              setItems(resolved);
              onQueryContextUpdate?.(alias, d);
            })
            .catch(() => setItems(PLACEHOLDER_DATA.slice(0, 3)));
          return;
        }
      }
      setItems(PLACEHOLDER_DATA.slice(0, 3));
      return;
    }

    setItems(PLACEHOLDER_DATA.slice(0, 3));
  }, [source, queryContext, project]);

  return items;
}

// ---------------------------------------------------------------------------
// NodeRenderer forward ref — avoids circular import
// We use a ref pattern: NodeRenderer registers itself here on mount.
// ---------------------------------------------------------------------------

type NodeRendererFn = (props: {
  node: TreeNode;
  depth: number;
  itemContext?: Record<string, any>;
  queryContext?: Record<string, any>;
  globalContext?: Record<string, any>;
  themeColors?: Record<string, string>;
  nodePropsContext?: Record<string, Record<string, any>>;
  onQueryContextUpdate?: (key: string, val: any) => void;
}) => React.ReactElement | null;

let _NodeRenderer: NodeRendererFn | null = null;

export function registerNodeRenderer(fn: NodeRendererFn) {
  _NodeRenderer = fn;
}

// ---------------------------------------------------------------------------
// InsertZone forward ref — same pattern
// ---------------------------------------------------------------------------

type InsertZoneFn = (props: {
  parentId: string;
  index: number;
  label: string;
  slotName?: string;
}) => React.ReactElement | null;

let _InsertZone: InsertZoneFn | null = null;

export function registerInsertZone(fn: InsertZoneFn) {
  _InsertZone = fn;
}

// ---------------------------------------------------------------------------
// ItemsRenderer — main export
// ---------------------------------------------------------------------------

interface ItemsRendererProps {
  node: TreeNode;
  itemsProp: string;
  previewCount: number;
  Component: React.ComponentType<any>;
  rProps: Record<string, any>;
  ctx: ItemsRenderCtx;
  /** Secondary array slot props (e.g. backContent for FlipLayout) */
  secondarySlotProps?: Record<string, React.ReactNode[]>;
}

export const ItemsRenderer: React.FC<ItemsRendererProps> = ({
  node,
  itemsProp,
  previewCount,
  Component,
  rProps,
  ctx,
  secondarySlotProps = {},
}) => {
  const { previewMode, queryContext, globalContext, themeColors, nodePropsContext, onQueryContextUpdate, project, depth } = ctx;
  // Primary slot children only (exclude secondary array slot children)
  const secondarySlotNames = new Set(Object.keys(secondarySlotProps));
  const children = (node.children || []).filter(c => !c.slotName || !secondarySlotNames.has(c.slotName));

  // Read explicit slot binding set via SlotModeSection
  const explicitBinding = node.slotBindings?.[itemsProp];

  // ── MODE 1: DATA — layout itself has repeatBinding OR explicit data mode ─
  const hasLayoutRepeat = !!node.repeatBinding?.source || (explicitBinding?.mode === 'data' && !!explicitBinding.source);
  const dataSource = explicitBinding?.mode === 'data' && explicitBinding.source
    ? explicitBinding.source
    : node.repeatBinding?.source || '';
  const keyProp = explicitBinding?.keyProp || node.repeatBinding?.keyProp || 'id';

  const dataItems = useDataItems(
    hasLayoutRepeat ? dataSource : '',
    queryContext,
    project,
    onQueryContextUpdate,
  );

  if (hasLayoutRepeat) {
    const displayItems = previewMode ? dataItems : dataItems.slice(0, previewCount);
    const templateNode = children[0]; // first child is the template

    if (!templateNode || !_NodeRenderer) {
      return <Component {...rProps} {...{ [itemsProp]: [] }} {...secondarySlotProps}>{null}</Component>;
    }

    const renderedItems = displayItems.map((item, idx) => {
      const NR = _NodeRenderer!;
      return (
        <NR
          key={item[keyProp] ?? idx}
          node={{ ...templateNode, repeatBinding: undefined }}
          depth={depth + 1}
          itemContext={item}
          queryContext={queryContext}
          globalContext={globalContext}
          themeColors={themeColors}
          nodePropsContext={nodePropsContext}
          onQueryContextUpdate={onQueryContextUpdate}
        />
      );
    });

    return (
      <Component {...rProps} {...{ [itemsProp]: renderedItems }} {...secondarySlotProps}>
        {!previewMode && (
          <View style={s.badge} pointerEvents="none">
            <Feather name="database" size={9} color="#a78bfa" />
            <Text style={s.badgeText}>{dataSource} × {dataItems.length}</Text>
          </View>
        )}
        {null}
      </Component>
    );
  }

  // ── MODE 2: TEMPLATE — single child with repeatBinding OR explicit template mode
  const templateSource = explicitBinding?.mode === 'template' && explicitBinding.source
    ? explicitBinding.source
    : (children.length === 1 ? children[0].repeatBinding?.source : undefined) || '';
  const templateKey = explicitBinding?.keyProp || (children.length === 1 ? children[0].repeatBinding?.keyProp : undefined) || 'id';
  const isTemplateMode = (explicitBinding?.mode === 'template' && !!explicitBinding.source)
    || (children.length === 1 && !!children[0].repeatBinding);

  if (isTemplateMode && children.length > 0) {
    const templateNode = children[0];

    // In preview mode, resolve real data; in edit mode, show N copies
    if (previewMode && templateSource && _NodeRenderer) {
      return (
        <TemplateDataRenderer
          node={node}
          templateNode={templateNode}
          templateSource={templateSource}
          templateKey={templateKey}
          itemsProp={itemsProp}
          Component={Component}
          rProps={rProps}
          secondarySlotProps={secondarySlotProps}
          ctx={ctx}
        />
      );
    }

    // Edit mode: show previewCount copies of the template
    const NR = _NodeRenderer;
    const items = NR
      ? Array.from({ length: previewCount }, (_, idx) => (
          <NR
            key={`tpl-${templateNode.id}-${idx}`}
            node={{ ...templateNode, repeatBinding: undefined }}
            depth={depth + 1}
            queryContext={queryContext}
            globalContext={globalContext}
            themeColors={themeColors}
            nodePropsContext={nodePropsContext}
            onQueryContextUpdate={onQueryContextUpdate}
          />
        ))
      : [];

    return (
      <>
        {!previewMode && (
          <View style={s.badge} pointerEvents="none">
            <Feather name="repeat" size={9} color="#22d3ee" />
            <Text style={s.badgeText}>template ×{previewCount}</Text>
          </View>
        )}
        <Component {...rProps} {...{ [itemsProp]: items }} {...secondarySlotProps}>{null}</Component>
      </>
    );
  }

  // ── MODE 3: STATIC — N children dropped manually ────────────────────────
  if (children.length > 0) {
    const NR = _NodeRenderer;
    const items = NR
      ? children.map(c => (
          <NR
            key={c.id}
            node={c}
            depth={depth + 1}
            itemContext={ctx.itemContext}
            queryContext={queryContext}
            globalContext={globalContext}
            themeColors={themeColors}
            nodePropsContext={nodePropsContext}
            onQueryContextUpdate={onQueryContextUpdate}
          />
        ))
      : [];
    return <Component {...rProps} {...{ [itemsProp]: items }} {...secondarySlotProps}>{null}</Component>;
  }

  // ── EMPTY — render InsertZone as overlay outside the Component ───────────
  const IZ = _InsertZone;
  if (!previewMode && IZ) {
    return (
      <View style={{ flex: 1, position: 'relative' }}>
        <Component {...rProps} {...{ [itemsProp]: [] }} {...secondarySlotProps} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, alignItems: 'center', justifyContent: 'center' }} pointerEvents="box-none">
          <IZ parentId={node.id} index={0} label={`Drop ${itemsProp}`} />
        </View>
      </View>
    );
  }
  // preview mode or no IZ registered — fall through to useStudioItems placeholders
  return <Component {...rProps} {...{ [itemsProp]: [] }} {...secondarySlotProps} />;
};

// ---------------------------------------------------------------------------
// TemplateDataRenderer — resolves data for template mode in preview
// ---------------------------------------------------------------------------

const TemplateDataRenderer: React.FC<{
  node: TreeNode;
  templateNode: TreeNode;
  templateSource: string;
  templateKey: string;
  itemsProp: string;
  Component: React.ComponentType<any>;
  rProps: Record<string, any>;
  secondarySlotProps?: Record<string, React.ReactNode[]>;
  ctx: ItemsRenderCtx;
}> = ({ node, templateNode, templateSource, templateKey, itemsProp, Component, rProps, secondarySlotProps = {}, ctx }) => {
  const { queryContext, globalContext, themeColors, nodePropsContext, onQueryContextUpdate, project, depth } = ctx;

  const dataItems = useDataItems(templateSource, queryContext, project, onQueryContextUpdate);

  const NR = _NodeRenderer;
  if (!NR) return <Component {...rProps} {...{ [itemsProp]: [] }} {...secondarySlotProps}>{null}</Component>;

  const items = dataItems.map((item, idx) => (
    <NR
      key={item[templateKey] ?? idx}
      node={{ ...templateNode, repeatBinding: undefined }}
      depth={depth + 1}
      itemContext={item}
      queryContext={queryContext}
      globalContext={globalContext}
      themeColors={themeColors}
      nodePropsContext={nodePropsContext}
      onQueryContextUpdate={onQueryContextUpdate}
    />
  ));

  return <Component {...rProps} {...{ [itemsProp]: items }} {...secondarySlotProps}>{null}</Component>;
};

const s = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(167,139,250,0.1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.2)',
    marginBottom: 2,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#a78bfa',
    fontSize: 8,
    fontWeight: '600',
    fontFamily: 'monospace' as any,
  },
});
