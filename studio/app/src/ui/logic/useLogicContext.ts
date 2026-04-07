/**
 * useLogicContext — Centralized hook for the logic panel.
 *
 * Provides:
 * - Selected node + its registry metadata
 * - Repeat ancestor detection (are we inside a list?)
 * - Item fields from the repeat source (with nested array support)
 * - All page state variables
 */
import React from 'react';
import { useStudio, TreeNode } from '../../store/StudioProvider';

export interface ItemField {
  key: string;
  /** Human-readable preview of the value */
  preview: string;
  type: string;
  /** Sub-fields if this field is an object or array */
  children?: ItemField[];
}

export interface LogicContext {
  sel: TreeNode | null;
  pageState: any[];
  queries: any[];
  pages: any[];
  services: any[];
  /** Nearest ancestor with repeatBinding — null if not in a list */
  repeatAncestor: TreeNode | null;
  /** Item fields from the repeat source (flat list including nested) */
  itemFields: ItemField[];
  /** All state variable names on this page */
  stateVarNames: string[];
}

/** Extract fields from a data sample, including nested arrays */
function extractFields(data: any, depth = 0): ItemField[] {
  if (!data || depth > 2) return [];
  const sample = Array.isArray(data) ? data[0] : data;
  if (!sample || typeof sample !== 'object') return [];

  return Object.entries(sample).map(([key, val]) => {
    const isArr = Array.isArray(val);
    const isObj = val !== null && typeof val === 'object' && !isArr;
    const type = isArr ? 'array' : isObj ? 'object' : typeof val;
    const preview = typeof val === 'string'
      ? val.slice(0, 24)
      : typeof val === 'number'
      ? String(val)
      : isArr
      ? `[${(val as any[]).length} items]`
      : type;

    const field: ItemField = { key, type, preview };

    // For arrays: show sub-fields of the first element
    if (isArr && (val as any[]).length > 0) {
      const subSample = (val as any[])[0];
      if (subSample && typeof subSample === 'object') {
        field.children = extractFields(subSample, depth + 1).map(f => ({
          ...f,
          key: `${key}[0].${f.key}`,
        }));
      }
    }
    // For objects: show sub-fields
    if (isObj && depth < 1) {
      field.children = extractFields(val, depth + 1).map(f => ({
        ...f,
        key: `${key}.${f.key}`,
      }));
    }

    return field;
  });
}

/** Flatten nested ItemFields into a flat list for SmartInput */
export function flattenItemFields(fields: ItemField[]): ItemField[] {
  const result: ItemField[] = [];
  for (const f of fields) {
    result.push(f);
    if (f.children) result.push(...f.children);
  }
  return result;
}

function findAncestorWith(
  root: TreeNode,
  targetId: string,
  predicate: (n: TreeNode) => boolean,
  ancestors: TreeNode[] = [],
): TreeNode | null {
  if (root.id === targetId) return ancestors.find(predicate) || null;
  for (const child of root.children) {
    const found = findAncestorWith(child, targetId, predicate, [...ancestors, root]);
    if (found !== null) return found;
  }
  return null;
}

/**
 * Derive the effective repeat source for a node that acts as a repeat ancestor.
 * Checks both the legacy repeatBinding and the new slotBindings system.
 * Returns the source expression or null if none is configured.
 */
function getRepeatSource(ancestor: TreeNode, child: TreeNode): string | null {
  // Legacy: repeatBinding on the ancestor itself (DATA mode)
  if (ancestor.repeatBinding?.source) return ancestor.repeatBinding.source;

  // New system: slotBindings on the ancestor for the slot that contains the child
  if (ancestor.slotBindings) {
    for (const [, binding] of Object.entries(ancestor.slotBindings)) {
      if (binding && binding.mode !== 'static' && binding.source) {
        return binding.source;
      }
    }
  }

  // Legacy: repeatBinding on the child itself (TEMPLATE mode)
  if (child.repeatBinding?.source) return child.repeatBinding.source;

  return null;
}

function collectStateNamesFromTree(root: TreeNode, out: Set<string>) {
  if (root.events) {
    for (const acts of Object.values(root.events)) {
      for (const a of (acts as any[])) {
        if (a.type === 'setState' && a.payload?.key) out.add(String(a.payload.key));
        if (a.type === 'callApi' && a.payload?.storeResponseAs) out.add(String(a.payload.storeResponseAs));
        if (a.type === 'transform' && a.payload?.storeAs) out.add(String(a.payload.storeAs));
        if (a.type === 'compute' && a.payload?.storeAs) out.add(String(a.payload.storeAs));
        if (a.type === 'setGlobalState' && a.payload?.key) out.add(String(a.payload.key));
        if (a.type === 'mergeState' && a.payload?.key) out.add(String(a.payload.key));
        if (a.type === 'toggleState' && a.payload?.key) out.add(String(a.payload.key));
        if (a.type === 'incrementState' && a.payload?.key) out.add(String(a.payload.key));
      }
    }
  }
  for (const c of root.children) collectStateNamesFromTree(c, out);
}

export function useLogicContext(): LogicContext {
  const { selId, node, page, project } = useStudio();
  const sel = selId ? node(selId) : null;
  const pg = page();
  const queries: any[] = project?.queries || [];
  const pages: any[] = project?.pages || [];
  const services: any[] = project?.services || [];
  const pageState: any[] = pg?.state || [];

  const [dataCache, setDataCache] = React.useState<Record<string, any>>({});

  const repeatAncestor = React.useMemo(() => {
    if (!pg || !sel) return null;
    // Detect ancestor with repeatBinding (legacy DATA mode)
    // OR ancestor with slotBindings that has an active template/data source
    return findAncestorWith(pg.root, sel.id, n =>
      !!n.repeatBinding ||
      Object.values(n.slotBindings ?? {}).some(b => b && b.mode !== 'static' && !!b.source)
    );
  }, [pg, sel]);

  // Fetch data for the repeat source to get item fields
  React.useEffect(() => {
    const fetchForSource = (source: string) => {
      const alias = source.startsWith('$state.') ? source.slice(7).split('.')[0] : null;
      if (!alias) return;
      const query = queries.find((q: any) => q.alias === alias);
      if (!query || dataCache[query.id] !== undefined) return;
      const svc = services.find((sv: any) => sv.id === query.serviceId);
      const base = (svc?.config as any)?.baseUrl || '';
      if (!base) return;
      fetch(base.replace(/\/$/, '') + query.path)
        .then(r => r.json())
        .then(d => setDataCache(prev => ({ ...prev, [query.id]: d })))
        .catch(() => setDataCache(prev => ({ ...prev, [query.id]: null })));
    };

    if (!sel) return;

    // Repeat ancestor source
    if (repeatAncestor) {
      const source = getRepeatSource(repeatAncestor, sel);
      if (source) fetchForSource(source);
    }

    // Node's own slot bindings
    if (sel.slotBindings) {
      for (const [, binding] of Object.entries(sel.slotBindings)) {
        if (binding && binding.mode !== 'static' && binding.source) fetchForSource(binding.source);
      }
    }

    // Node's own repeatBinding
    if (sel.repeatBinding?.source) fetchForSource(sel.repeatBinding.source);
  }, [repeatAncestor, sel, queries, services]);

  const itemFields = React.useMemo((): ItemField[] => {
    if (!sel) return [];

    // 1. Inside a repeat ancestor — use the ancestor's data source
    if (repeatAncestor) {
      const source = getRepeatSource(repeatAncestor, sel);
      if (source) {
        const alias = source.startsWith('$state.') ? source.slice(7).split('.')[0] : null;
        if (alias) {
          const query = queries.find((q: any) => q.alias === alias);
          if (query && dataCache[query.id]) return extractFields(dataCache[query.id]);
        }
      }
    }

    // 2. The node itself has array slot bindings (items-mode layout with data source)
    if (sel.slotBindings) {
      for (const [, binding] of Object.entries(sel.slotBindings)) {
        if (binding && binding.mode !== 'static' && binding.source) {
          const source = binding.source;
          const alias = source.startsWith('$state.') ? source.slice(7).split('.')[0] : null;
          if (alias) {
            const query = queries.find((q: any) => q.alias === alias);
            if (query && dataCache[query.id]) return extractFields(dataCache[query.id]);
          }
        }
      }
    }

    // 3. The node itself has a repeatBinding (legacy DATA mode)
    if (sel.repeatBinding?.source) {
      const alias = sel.repeatBinding.source.startsWith('$state.') ? sel.repeatBinding.source.slice(7).split('.')[0] : null;
      if (alias) {
        const query = queries.find((q: any) => q.alias === alias);
        if (query && dataCache[query.id]) return extractFields(dataCache[query.id]);
      }
    }

    return [];
  }, [repeatAncestor, sel, queries, dataCache]);

  const stateVarNames = React.useMemo((): string[] => {
    const names = new Set<string>();
    pageState.forEach((ps: any) => names.add(ps.name));
    queries.forEach((q: any) => { if (q.alias) names.add(q.alias); });
    if (pg?.root) collectStateNamesFromTree(pg.root, names);
    return Array.from(names);
  }, [pageState, queries, pg]);

  return {
    sel,
    pageState,
    queries,
    pages,
    services,
    repeatAncestor,
    itemFields,
    stateVarNames,
  };
}
