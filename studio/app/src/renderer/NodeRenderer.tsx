/**
 * NodeRenderer
 *
 * Renders TreeNode using real foundation components.
 * Expression resolution delegates to studio/engine/tree/expressions.ts.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useStudio, TreeNode, ActionDef } from '../store/StudioProvider';
import { getComponent } from './componentMap';
import { deriveSlotConfig } from './slotConfig';
import { Feather } from '@expo/vector-icons';
import { resolveForPreview, isSafeUrl } from '../../../engine/tree/expressions';
import { resolveNodeProps, buildNodePropsContext, resolveExprForPreview } from './useNodeResolution';
import { getThemeColors } from '../store/tokens';
import { ItemsRenderer, registerNodeRenderer, registerInsertZone } from './ItemsRenderer';
import { usePreviewOverlay } from './PreviewOverlayContext';

/**
 * Resolve a binding expression to a runtime value for the preview.
 * Delegates to the centralized resolveForPreview from expressions.ts.
 */
function resolveBindingExpr(
  expr: string,
  ctx: { itemContext?: Record<string, any>; queryContext?: Record<string, any>; themeColors?: Record<string, string>; globalContext?: Record<string, any>; nodePropsContext?: Record<string, Record<string, any>> }
): any {
  return resolveForPreview(expr, ctx);
}

function applyTransformStep(data: any, step: { op: string; arg?: string; arg2?: string; field?: string }, ctx: any): any {
  const resolve = (v: any) => {
    if (typeof v !== 'string') return v;
    return resolveForPreview(v, { queryContext: ctx.queryContext || {}, globalContext: ctx.globalContext, itemContext: ctx.itemContext });
  };
  const arg = resolve(step.arg);
  const arg2 = resolve(step.arg2);
  const field = step.field;

  try {
    switch (step.op) {
      // Array
      case 'filter':    return Array.isArray(data) ? data.filter(item => { try { return new Function('item', `return !!(${arg})`)(item); } catch { return true; } }) : data;
      case 'map':       return Array.isArray(data) ? data.map(item => { try { return new Function('item', `return (${arg})`)(item); } catch { return item; } }) : data;
      case 'find':      return Array.isArray(data) ? data.find(item => { try { return new Function('item', `return !!(${arg})`)(item); } catch { return false; } }) : data;
      case 'findIndex': return Array.isArray(data) ? data.findIndex(item => { try { return new Function('item', `return !!(${arg})`)(item); } catch { return false; } }) : -1;
      case 'sort':      return Array.isArray(data) ? [...data].sort((a, b) => field ? (a[field] > b[field] ? 1 : -1) : 0) : data;
      case 'reverse':   return Array.isArray(data) ? [...data].reverse() : data;
      case 'slice':     return Array.isArray(data) ? data.slice(Number(arg) || 0, arg2 !== undefined ? Number(arg2) : undefined) : data;
      case 'flatten':   return Array.isArray(data) ? data.flat() : data;
      case 'unique':    return Array.isArray(data) ? [...new Set(data)] : data;
      case 'count':     return Array.isArray(data) ? data.length : 0;
      case 'first':     return Array.isArray(data) ? data[0] : data;
      case 'last':      return Array.isArray(data) ? data[data.length - 1] : data;
      case 'sum':       return Array.isArray(data) ? data.reduce((s: number, i: any) => s + (field ? Number(i[field]) : Number(i)), 0) : 0;
      case 'min':       return Array.isArray(data) ? Math.min(...data.map((i: any) => field ? Number(i[field]) : Number(i))) : data;
      case 'max':       return Array.isArray(data) ? Math.max(...data.map((i: any) => field ? Number(i[field]) : Number(i))) : data;
      case 'avg':       return Array.isArray(data) && data.length ? data.reduce((s: number, i: any) => s + (field ? Number(i[field]) : Number(i)), 0) / data.length : 0;
      case 'groupBy':   return Array.isArray(data) && field ? data.reduce((acc: any, i: any) => { const k = i[field]; (acc[k] = acc[k] || []).push(i); return acc; }, {}) : data;
      case 'pluck':     return Array.isArray(data) && field ? data.map((i: any) => i[field]) : data;
      case 'push':      return Array.isArray(data) ? [...data, arg] : data;
      case 'concat':    return Array.isArray(data) ? [...data, ...(Array.isArray(arg) ? arg : [arg])] : data;
      case 'removeAt':  return Array.isArray(data) ? data.filter((_: any, i: number) => i !== Number(arg)) : data;
      case 'updateAt':  return Array.isArray(data) && field !== undefined ? data.map((item: any, i: number) => i === Number(arg) ? { ...item, [field]: arg2 } : item) : data;
      case 'join':      return Array.isArray(data) ? data.join(arg ?? ',') : data;
      // String
      case 'uppercase':   return String(data).toUpperCase();
      case 'lowercase':   return String(data).toLowerCase();
      case 'capitalize':  return String(data).charAt(0).toUpperCase() + String(data).slice(1);
      case 'trim':        return String(data).trim();
      case 'split':       return String(data).split(arg ?? ',');
      case 'replace':     return String(data).replace(new RegExp(String(arg), 'g'), String(arg2 ?? ''));
      case 'includes':    return String(data).includes(String(arg));
      case 'startsWith':  return String(data).startsWith(String(arg));
      case 'endsWith':    return String(data).endsWith(String(arg));
      case 'substring':   return String(data).substring(Number(arg) || 0, arg2 !== undefined ? Number(arg2) : undefined);
      case 'padStart':    return String(data).padStart(Number(arg) || 0, String(arg2 ?? ' '));
      case 'padEnd':      return String(data).padEnd(Number(arg) || 0, String(arg2 ?? ' '));
      case 'repeat':      return String(data).repeat(Number(arg) || 1);
      case 'template':    return String(arg ?? '').replace(/\{(\w+)\}/g, (_: string, k: string) => (data as any)?.[k] ?? '');
      case 'regex':       return new RegExp(String(arg)).test(String(data));
      case 'match':       return String(data).match(new RegExp(String(arg), 'g')) || [];
      case 'length':      return String(data).length;
      case 'charCodeAt':  return String(data).charCodeAt(Number(arg) || 0);
      case 'toNumber':    return Number(data);
      case 'toBoolean':   return !!data && data !== '0' && data !== 'false';
      // Number
      case 'add':         return Number(data) + Number(arg);
      case 'subtract':    return Number(data) - Number(arg);
      case 'multiply':    return Number(data) * Number(arg);
      case 'divide':      return Number(arg) !== 0 ? Number(data) / Number(arg) : 0;
      case 'modulo':      return Number(data) % Number(arg);
      case 'power':       return Math.pow(Number(data), Number(arg));
      case 'abs':         return Math.abs(Number(data));
      case 'floor':       return Math.floor(Number(data));
      case 'ceil':        return Math.ceil(Number(data));
      case 'round':       return Math.round(Number(data));
      case 'clamp':       return Math.min(Math.max(Number(data), Number(arg)), Number(arg2));
      case 'toFixed':     return Number(data).toFixed(Number(arg) || 2);
      case 'toString':    return String(data);
      case 'isNaN':       return isNaN(Number(data));
      case 'isFinite':    return isFinite(Number(data));
      // Object
      case 'get':         return field ? (data as any)?.[field] : data;
      case 'set':         return field ? { ...(data as any), [field]: arg } : data;
      case 'delete':      return field ? Object.fromEntries(Object.entries(data as any).filter(([k]) => k !== field)) : data;
      case 'keys':        return Object.keys(data as any);
      case 'values':      return Object.values(data as any);
      case 'entries':     return Object.entries(data as any);
      case 'hasKey':      return field ? field in (data as any) : false;
      case 'merge':       return { ...(data as any), ...(typeof arg === 'object' ? arg : {}) };
      case 'toArray':     return Object.entries(data as any).map(([k, v]) => ({ key: k, value: v }));
      case 'stringify':   return JSON.stringify(data);
      case 'parse':       return typeof data === 'string' ? JSON.parse(data) : data;
      case 'clone':       return JSON.parse(JSON.stringify(data));
      case 'pick':        return arg && typeof arg === 'string' ? Object.fromEntries(arg.split(',').map(k => k.trim()).filter(k => k in (data as any)).map(k => [k, (data as any)[k]])) : data;
      case 'omit':        return arg && typeof arg === 'string' ? Object.fromEntries(Object.entries(data as any).filter(([k]) => !arg.split(',').map(s => s.trim()).includes(k))) : data;
      // Boolean
      case 'not':         return !data;
      case 'and':         return !!data && !!arg;
      case 'or':          return !!data || !!arg;
      case 'xor':         return !!data !== !!arg;
      // Date
      case 'now':         return Date.now();
      case 'toTimestamp': return new Date(data).getTime();
      case 'toISO':       return new Date(data).toISOString();
      case 'toLocale':    return new Date(data).toLocaleDateString();
      case 'toLocaleTime':return new Date(data).toLocaleTimeString();
      case 'addDays':     return new Date(new Date(data).getTime() + Number(arg) * 86400000).toISOString();
      case 'diff':        return Math.round((new Date(String(arg2 ?? Date.now())).getTime() - new Date(data).getTime()) / 86400000);
      case 'format':      return new Date(data).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      default:            return data;
    }
  } catch { return data; }
}

function executeAction(
  action: ActionDef,
  ctx: {
    setPageId: (id: string) => void;
    project: any;
    onQueryContextUpdate?: (key: string, val: any) => void;
    queryContext?: Record<string, any>;
    globalContext?: Record<string, any>;
    nodePropsContext?: Record<string, Record<string, any>>;
    itemContext?: Record<string, any>;
    // Preview overlay callbacks
    showToast?: (msg: string, variant?: 'success' | 'error' | 'info' | 'warning') => void;
    showAlert?: (title: string, message: string) => void;
    openModal?: (name: string) => void;
    closeModal?: (name: string) => void;
  }
) {
  // Resolve any expression — handles $state.*, $node.*, bare field names (repeat context), etc.
  const resolveActionValue = (val: any): any => {
    if (typeof val !== 'string' || !val) return val;
    return resolveForPreview(val, {
      queryContext: ctx.queryContext || {},
      globalContext: ctx.globalContext,
      nodePropsContext: ctx.nodePropsContext,
      itemContext: ctx.itemContext,
    });
  };
  switch (action.type as string) {
    case 'navigate': {
      const screen = String(action.payload.screen || '');
      const pg = ctx.project?.pages?.find((p: any) => p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === screen);
      if (pg) ctx.setPageId(pg.id);
      break;
    }
    case 'alert': {
      const title = String(resolveActionValue((action.payload as any).title) || '');
      const message = String(resolveActionValue((action.payload as any).message) || '');
      if (ctx.showAlert) ctx.showAlert(title, message);
      break;
    }
    case 'consoleLog': console.log('[Preview]', resolveActionValue((action.payload as any).message)); break;
    case 'openURL': {
      const url = String(resolveActionValue((action.payload as any).url) || '');
      if (isSafeUrl(url) && typeof window !== 'undefined') window.open(url, '_blank');
      else console.warn('[Preview] openURL bloqué — URL non sécurisée:', url);
      break;
    }
    case 'toast': {
      const msg = String(resolveActionValue((action.payload as any).message) || '');
      const variant = (action.payload as any).variant || 'info';
      if (ctx.showToast) ctx.showToast(msg, variant);
      break;
    }
    case 'openModal': {
      const name = String((action.payload as any).name || '');
      if (name) {
        ctx.openModal?.(name);
        // Also set state key for conditional bindings
        const key = `show${name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9]/g, '')}`;
        ctx.onQueryContextUpdate?.(key, true);
      }
      break;
    }
    case 'closeModal': {
      const name = String((action.payload as any).name || '');
      if (name) {
        ctx.closeModal?.(name);
        const key = `show${name.charAt(0).toUpperCase() + name.slice(1).replace(/[^a-zA-Z0-9]/g, '')}`;
        ctx.onQueryContextUpdate?.(key, false);
      }
      break;
    }
    case 'setState': {
      const key = String(action.payload.key || '');
      if (key) ctx.onQueryContextUpdate?.(key, resolveActionValue(action.payload.value));
      break;
    }
    case 'setGlobalState': {
      const key = String(action.payload.key || '');
      if (key && ctx.globalContext) ctx.globalContext[key] = resolveActionValue(action.payload.value);
      break;
    }
    case 'resetState': {
      const key = String(action.payload.key || '');
      if (key) ctx.onQueryContextUpdate?.(key, action.payload.defaultValue ?? null);
      break;
    }
    case 'mergeState': {
      const key = String(action.payload.key || '');
      if (key) {
        const existing = ctx.queryContext?.[key] || {};
        const patch = resolveActionValue(action.payload.value);
        ctx.onQueryContextUpdate?.(key, typeof patch === 'object' && patch ? { ...existing, ...patch } : existing);
      }
      break;
    }
    case 'toggleState': {
      const key = String(action.payload.key || '');
      if (key) ctx.onQueryContextUpdate?.(key, !ctx.queryContext?.[key]);
      break;
    }
    case 'incrementState': {
      const key = String(action.payload.key || '');
      if (key) {
        const by = Number(action.payload.by ?? 1);
        let val = (Number(ctx.queryContext?.[key]) || 0) + by;
        if (action.payload.min !== undefined) val = Math.max(Number(action.payload.min), val);
        if (action.payload.max !== undefined) val = Math.min(Number(action.payload.max), val);
        ctx.onQueryContextUpdate?.(key, val);
      }
      break;
    }
    case 'transform': {
      const p = action.payload as any;
      const source = resolveActionValue(p.source);
      if (p.storeAs && source !== undefined) {
        let result = source;
        for (const step of (p.steps || []) as any[]) {
          result = applyTransformStep(result, step, ctx);
        }
        ctx.onQueryContextUpdate?.(p.storeAs, result);
      }
      break;
    }
    case 'compute': {
      const p = action.payload as any;
      if (p.storeAs && p.expression) {
        try {
          // Safe eval with context variables injected
          const qc = ctx.queryContext || {};
          const gc = ctx.globalContext || {};
          const stateProxy = new Proxy(qc, { get: (t, k) => t[k as string] });
          const globalProxy = new Proxy(gc, { get: (t, k) => t[k as string] });
          // eslint-disable-next-line no-new-func
          const fn = new Function('$state', '$global', '$item', 'Math', 'JSON', 'Date', 'parseInt', 'parseFloat', 'String', 'Number', 'Boolean', 'Array', `return (${p.expression})`);
          const result = fn(stateProxy, globalProxy, ctx.itemContext || {}, Math, JSON, Date, parseInt, parseFloat, String, Number, Boolean, Array);
          ctx.onQueryContextUpdate?.(p.storeAs, result);
        } catch (e) {
          console.warn('[compute error]', e);
        }
      }
      break;
    }
    case 'loop': {
      const p = action.payload as any;
      const arr = resolveActionValue(p.source);
      if (Array.isArray(arr) && p.body?.length) {
        arr.forEach((item, index) => {
          const loopCtx = { ...ctx, itemContext: { ...ctx.itemContext, [p.itemVar || 'item']: item, $loop: { item, index, total: arr.length } } };
          for (const a of p.body) executeAction(a, loopCtx);
        });
      }
      break;
    }
    case 'parallel': {
      const p = action.payload as any;
      const lanes: ActionDef[][] = Array.isArray(p.lanes) ? p.lanes : [];
      const join = p.join as { mode?: 'all' | 'any' | 'first'; timeoutMs?: number; onComplete?: ActionDef[]; onTimeout?: ActionDef[] } | undefined;

      if (!lanes.length) break;

      // Execute each lane as a micro-pipeline, collecting promises
      const lanePromises = lanes.map(lane =>
        new Promise<void>(resolve => {
          // Run actions sequentially within the lane (delays respected)
          const runLane = async () => {
            for (const a of lane) {
              if ((a.type as string) === 'delay') {
                await new Promise<void>(r => setTimeout(r, Number(a.payload.ms) || 500));
              } else {
                executeAction(a, ctx);
              }
            }
          };
          runLane().then(resolve).catch(resolve);
        })
      );

      if (!join) {
        // No barrier — fire and forget
        Promise.all(lanePromises);
        break;
      }

      const mode = join.mode || 'all';
      const raceOrAll = mode === 'all'
        ? Promise.all(lanePromises)
        : Promise.race(lanePromises);

      let timedOut = false;
      const withTimeout = join.timeoutMs
        ? Promise.race([
            raceOrAll,
            new Promise<void>((_, reject) => setTimeout(() => { timedOut = true; reject(new Error('timeout')); }, join.timeoutMs)),
          ])
        : raceOrAll;

      withTimeout
        .then(() => {
          if (join.onComplete?.length) {
            for (const a of join.onComplete) executeAction(a, ctx);
          }
        })
        .catch(() => {
          if (timedOut && join.onTimeout?.length) {
            for (const a of join.onTimeout) executeAction(a, ctx);
          }
        });
      break;
    }
    case 'delay': {
      const ms = Number(action.payload.ms) || 500;
      const next = action.payload.then as ActionDef[] | undefined;
      if (next?.length) {
        setTimeout(() => {
          for (const a of next) executeAction(a, ctx);
        }, ms);
      }
      break;
    }
    case 'conditional': {
      const expr = String(action.payload.condition || '');
      const val = resolveActionValue(expr);
      const isTruthy = !!val && val !== '0' && val !== 'false';
      const branch = isTruthy ? (action.payload.then as ActionDef[] | undefined) : (action.payload.else as ActionDef[] | undefined);
      if (branch?.length) {
        for (const a of branch) executeAction(a, ctx);
      }
      break;
    }
    case 'callApi': {
      const p = action.payload as any;
      const queryName = String(p.queryName || '');
      const query = ctx.project?.queries?.find((q: any) => q.id === queryName || q.name === queryName);
      if (!query) break;
      const svc = ctx.project?.services?.find((sv: any) => sv.id === query.serviceId);
      const base = (svc?.config as any)?.baseUrl || '';
      if (!base) break;
      const method = query.method || 'GET';
      const fetchOpts: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
      if (p.body && method !== 'GET' && method !== 'DELETE') {
        const resolvedBody: Record<string, any> = {};
        for (const [k, v] of Object.entries(p.body as Record<string, string>)) {
          resolvedBody[k] = resolveActionValue(v);
        }
        fetchOpts.body = JSON.stringify(resolvedBody);
      }
      fetch(base.replace(/\/$/, '') + query.path, fetchOpts)
        .then(r => r.json())
        .then(data => {
          if (query.alias) ctx.onQueryContextUpdate?.(query.alias, data);
          if (p.storeResponseAs) ctx.onQueryContextUpdate?.(p.storeResponseAs, data);
          if (Array.isArray(p.onSuccess)) {
            for (const sa of p.onSuccess) {
              if (sa.type === 'setState' && sa.payload?.key) {
                const val = sa.payload.value === '$response' ? data
                  : typeof sa.payload.value === 'string' && sa.payload.value.startsWith('$response.')
                  ? data?.[sa.payload.value.slice(10)]
                  : resolveActionValue(sa.payload.value);
                ctx.onQueryContextUpdate?.(sa.payload.key, val);
              }
            }
          }
        })
        .catch(err => {
          console.warn('[Preview callApi error]', err);
          if (Array.isArray(p.onError)) {
            for (const ea of p.onError) {
              if (ea.type === 'setState' && ea.payload?.key) {
                ctx.onQueryContextUpdate?.(ea.payload.key, err?.message || 'Error');
              }
            }
          }
        });
      break;
    }
    default: console.log('[Action]', action.type, action.payload); break;
  }
}

// ---------------------------------------------------------------------------
// PageQueryProvider — fetches all queries referenced in the page tree
// ---------------------------------------------------------------------------

const PLACEHOLDER_ITEMS = [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', username: 'alice', title: 'Item 1', body: 'Preview item', userId: 1 },
  { id: 2, name: 'Bob Dupont',   email: 'bob@example.com',   username: 'bob',   title: 'Item 2', body: 'Preview item', userId: 1 },
  { id: 3, name: 'Carol Smith',  email: 'carol@example.com', username: 'carol', title: 'Item 3', body: 'Preview item', userId: 2 },
];

export const PageQueryProvider: React.FC<{ node: TreeNode; depth?: number }> = ({ node, depth = 0 }) => {
  const { project, page } = useStudio();
  const overlay = usePreviewOverlay();
  const [queryContext, setQueryContext] = React.useState<Record<string, any>>({});

  const onQueryContextUpdate = React.useCallback((key: string, val: any) => {
    setQueryContext(prev => ({ ...prev, [key]: val }));
  }, []);

  // Build globalContext from project.globalState defaults (preview simulation)
  const globalContext = React.useMemo(() => {
    const ctx: Record<string, any> = {};
    ((project as any)?.globalState || []).forEach((g: any) => {
      ctx[g.name] = g.default ?? (g.type === 'array' ? [] : g.type === 'object' ? {} : g.type === 'boolean' ? false : g.type === 'number' ? 0 : '');
    });
    return ctx;
  }, [project]);

  // Resolve theme colors
  const themeColors = React.useMemo(() => {
    if (!project?.theme) return undefined;
    try { return getThemeColors(project.theme); } catch { return undefined; }
  }, [project?.theme]);

  // Build nodePropsContext using the new resolution system.
  // This gives $node.id.prop references LIVE resolved values (not raw static props).
  const nodePropsContext = React.useMemo(() => {
    const pg = page?.();
    if (!pg?.root) return {};
    return buildNodePropsContext(pg.root, { queryContext, themeColors, globalContext });
  }, [page, queryContext, themeColors, globalContext]);

  React.useEffect(() => {
    const queries = project?.queries || [];
    queries.forEach(async (query: any) => {
      if (!query.autoFetch || !query.alias) return;
      const svc = (project?.services || []).find((sv: any) => sv.id === query.serviceId);
      const base = (svc?.config as any)?.baseUrl || '';
      if (!base) return;
      try {
        const res = await fetch(base.replace(/\/$/, '') + query.path);
        if (res.ok) {
          const data = await res.json();
          setQueryContext(prev => ({ ...prev, [query.alias]: data }));
        }
      } catch {}
    });

    // Fire onAppLoad on the root node (depth=0) in preview mode
    const pg = page?.();
    if (pg?.root?.events?.onAppLoad) {
      const actions = pg.root.events.onAppLoad as ActionDef[];
      if (actions.length > 0) {
        // Slight delay to let the tree mount first
        setTimeout(() => {
          for (const a of actions) {
            executeAction(a, { setPageId: () => {}, project, onQueryContextUpdate, queryContext: {}, globalContext, nodePropsContext: {}, showToast: overlay?.showToast, showAlert: overlay?.showAlert, openModal: overlay?.openModal, closeModal: overlay?.closeModal });
          }
        }, 50);
      }
    }
  }, [node, project]);

  return (
    <NodeRenderer
      node={node}
      depth={depth}
      queryContext={queryContext}
      globalContext={globalContext}
      themeColors={themeColors}
      nodePropsContext={nodePropsContext}
      onQueryContextUpdate={onQueryContextUpdate}
    />
  );
};

// ---------------------------------------------------------------------------
// RepeatRenderer — renders a list from query data
// ---------------------------------------------------------------------------

const RepeatRenderer: React.FC<{
  node: TreeNode; depth: number;
  queryContext?: Record<string, any>;
  globalContext?: Record<string, any>;
  themeColors?: Record<string, string>;
  nodePropsContext?: Record<string, Record<string, any>>;
  onQueryContextUpdate?: (key: string, val: any) => void;
}> = ({ node, depth, queryContext, globalContext, themeColors, nodePropsContext, onQueryContextUpdate }) => {
  const { project, previewMode } = useStudio();
  const [items, setItems] = React.useState<any[]>(PLACEHOLDER_ITEMS);
  const source = node.repeatBinding?.source || '';

  React.useEffect(() => {
    // $state.alias — look up in queryContext (where auto-fetched data is stored)
    if (source.startsWith('$state.')) {
      const alias = source.slice(7).split('.')[0];
      const data = queryContext?.[alias];
      if (Array.isArray(data) && data.length > 0) {
        setItems(data.slice(0, 20));
        return;
      }
      // Try to find the query with this alias and fetch it
      const query = (project?.queries || []).find((q: any) => q.alias === alias);
      if (query) {
        const svc = (project?.services || []).find((sv: any) => sv.id === query.serviceId);
        const base = (svc?.config as any)?.baseUrl || '';
        if (base) {
          fetch(base.replace(/\/$/, '') + query.path)
            .then(r => r.json())
            .then(d => {
              const arr = Array.isArray(d) ? d : (d?.data || d?.results || d?.items || []);
              setItems(arr.length > 0 ? arr.slice(0, 20) : PLACEHOLDER_ITEMS);
              onQueryContextUpdate?.(alias, d);
            })
            .catch(() => setItems(PLACEHOLDER_ITEMS));
          return;
        }
      }
      setItems(PLACEHOLDER_ITEMS);
      return;
    }

    // Legacy $query.* support
    if (source.startsWith('$query.')) {
      const varName = source.slice(7);
      if (queryContext?.[varName]) {
        const data = queryContext[varName];
        setItems(Array.isArray(data) && data.length > 0 ? data.slice(0, 20) : PLACEHOLDER_ITEMS);
        return;
      }
    }

    // No valid source — show placeholders
    setItems(PLACEHOLDER_ITEMS);
  }, [source, queryContext, project]);

  if (items.length === 0) return null;

  const keyProp = node.repeatBinding?.keyProp || 'id';
  // In edit mode, show max 3 items with a visual indicator
  const displayItems = previewMode ? items : items.slice(0, 3);

  // The repeat node renders ONCE as a container.
  // Its CHILDREN are repeated for each item.
  // This means: <Stack> renders once, and inside it each child renders N times.
  const originalChildren = node.children || []; // preserve before clearing
  return (
    <NodeRenderer
      node={{
        ...node,
        repeatBinding: undefined,
        // Override children: for each item, render all children with that item's context
        children: [], // we handle children manually below
      } as TreeNode}
      depth={depth}
      queryContext={queryContext}
      globalContext={globalContext}
      nodePropsContext={nodePropsContext}
      onQueryContextUpdate={onQueryContextUpdate}
      repeatItems={displayItems}
      repeatKeyProp={keyProp}
      repeatItemsTotal={items.length}
      repeatChildren={originalChildren}
      themeColors={themeColors}
    />
  );
};

// ---------------------------------------------------------------------------
// NodeRenderer — main component
// ---------------------------------------------------------------------------

const NodeRenderer: React.FC<{
  node: TreeNode;
  depth?: number;
  itemContext?: Record<string, any>;
  queryContext?: Record<string, any>;
  globalContext?: Record<string, any>;
  themeColors?: Record<string, string>;
  nodePropsContext?: Record<string, Record<string, any>>;
  onQueryContextUpdate?: (key: string, val: any) => void;
  repeatItems?: any[];
  repeatKeyProp?: string;
  repeatItemsTotal?: number;
  repeatChildren?: TreeNode[];
}> = ({ node, depth = 0, itemContext, queryContext, globalContext, themeColors: themeColorsProp, nodePropsContext, onQueryContextUpdate, repeatItems, repeatKeyProp, repeatItemsTotal, repeatChildren }) => {
  const { selId, setSel, meta, movingId, previewMode, setPageId, project } = useStudio();
  const overlay = usePreviewOverlay();
  const isSel = !previewMode && node.id === selId;
  const isMoving = node.id === movingId;
  const Component = getComponent(node.registryId);
  const m = meta(node.kind, node.registryId);
  const slotCfg = deriveSlotConfig(m?.slots as any);
  const children = node.children || [];

  // Use theme colors passed from parent (PageQueryProvider) — avoids recomputing per node
  const themeColors = themeColorsProp ?? React.useMemo(() => {
    if (!project?.theme) return undefined;
    try { return getThemeColors(project.theme); } catch { return undefined; }
  }, [project?.theme]);

  // Build the resolution context — single object passed everywhere
  const resCtx = React.useMemo(() => ({
    itemContext,
    queryContext: queryContext || {},
    themeColors,
    globalContext,
    nodePropsContext,
  }), [itemContext, queryContext, themeColors, globalContext, nodePropsContext]);

  // Resolve all props for this node using the centralized resolution system.
  // This merges static props (tokens) + bindings (dynamic expressions) in one pass.
  const rProps = React.useMemo(() => resolveNodeProps(node, resCtx), [node, resCtx]);

  // mergedQueryContext — alias for queryContext for clarity
  const mergedQueryContext = queryContext || {};

  // Resolve dataContext — if this node declares a dataContext, fetch/resolve it
  const resolvedDataContext = React.useMemo(() => {
    if (!node.dataContext?.source) return undefined;
    const src = node.dataContext.source;
    return resolveForPreview(src, resCtx);
  }, [node.dataContext, resCtx]);

  // Children inherit itemContext from repeat OR dataContext from parent
  const childItemContext = resolvedDataContext !== undefined ? resolvedDataContext : itemContext;

  // In preview mode, attach event handlers
  if (previewMode && node.events) {
    for (const [ev, actions] of Object.entries(node.events)) {
      if (actions && (actions as ActionDef[]).length > 0) {
        rProps[ev] = () => {
          for (const a of actions as ActionDef[]) {
            executeAction(a, { setPageId, project, onQueryContextUpdate, queryContext: mergedQueryContext, globalContext, nodePropsContext, itemContext, showToast: overlay?.showToast, showAlert: overlay?.showAlert, openModal: overlay?.openModal, closeModal: overlay?.closeModal });
          }
        };
      }
    }
  }

  // Fire onMount in preview mode via useEffect
  const onMountActions = previewMode ? (node.events?.onMount as ActionDef[] || []) : [];
  React.useEffect(() => {
    if (!previewMode || onMountActions.length === 0) return;
    for (const a of onMountActions) {
      executeAction(a, { setPageId, project, onQueryContextUpdate, queryContext: mergedQueryContext, globalContext, nodePropsContext, itemContext, showToast: overlay?.showToast, showAlert: overlay?.showAlert, openModal: overlay?.openModal, closeModal: overlay?.closeModal });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewMode]);

  // Evaluate conditionalRender in preview mode
  if (previewMode && node.conditionalRender) {
    const { expression, mode } = node.conditionalRender;
    const val = resolveBindingExpr(expression, { ...resCtx });
    const isTruthy = !!val && val !== '0' && val !== 'false' && !String(val).startsWith('[');
    if (mode === 'show' && !isTruthy) return null;
    if (mode === 'hide' && isTruthy) return null;
  }

  const hasChildrenSlot = m?.slots?.some((sl: any) => sl.name === 'children') ?? false;
  const isContainer = node.kind === 'layout' || node.kind === 'block' || node.kind === 'primitive' || hasChildrenSlot;

  let content: React.ReactNode;

  if (!Component) {
    content = (
      <View style={s.fallback}>
        <Text style={s.fallbackLabel}>{node.registryId}</Text>
        <ChildrenWithDropZones parentId={node.id} nodes={children} depth={depth} />
        {children.length === 0 && <InsertZone parentId={node.id} index={0} label="Drop here" />}
      </View>
    );
  } else if (slotCfg.mode === 'items') {
    const itemsProp = slotCfg.itemsProp || 'items';
    const previewCount = (m as any)?.previewItemCount ?? 3;

    // Build secondary array slot props (e.g. backContent for FlipLayout)
    const secondarySlotProps: Record<string, React.ReactNode[]> = {};
    for (const secondarySlot of slotCfg.secondaryArraySlots ?? []) {
      const slotChildren = children.filter(c => c.slotName === secondarySlot.prop);
      if (slotChildren.length > 0) {
        secondarySlotProps[secondarySlot.prop] = slotChildren.map(c => (
          <NodeRenderer key={c.id} node={c} depth={depth + 1} itemContext={itemContext} queryContext={mergedQueryContext} globalContext={globalContext} themeColors={themeColors} nodePropsContext={nodePropsContext} onQueryContextUpdate={onQueryContextUpdate} />
        ));
      } else {
        secondarySlotProps[secondarySlot.prop] = [];
      }
    }

    content = (
      <ItemsRenderer
        node={node}
        itemsProp={itemsProp}
        previewCount={previewCount}
        Component={Component}
        rProps={rProps}
        secondarySlotProps={secondarySlotProps}
        ctx={{
          depth,
          itemContext,
          queryContext: mergedQueryContext,
          globalContext,
          themeColors,
          nodePropsContext,
          onQueryContextUpdate,
          project,
          previewMode,
        }}
      />
    );
  } else if (slotCfg.mode === 'named' && slotCfg.slots) {
    const slotProps: Record<string, React.ReactNode> = {};
    const usedIds = new Set<string>();
    const childrenSlotExists = slotCfg.slots.some(sl => sl.prop === 'children');

    for (const slot of slotCfg.slots) {
      if (slot.prop === 'children') continue;
      const matched = children.filter(c => c.slotName === slot.prop);
      // Check if this slot is declared as array in the registry
      const slotDef = m?.slots?.find((sl: any) => sl.name === slot.prop) as any;
      const isArraySlot = slotDef?.kind === 'named-array' || (slotDef?.kind === undefined && slotDef?.array === true);
      // Read explicit slot binding (mode: static | template | data)
      const slotBinding = node.slotBindings?.[slot.prop];

      if (matched.length > 0) {
        if (isArraySlot) {
          const previewCount = (m as any)?.previewItemCount ?? 3;

          // DATA or TEMPLATE mode with a data source
          if (slotBinding && slotBinding.mode !== 'static' && slotBinding.source) {
            const { source, keyProp: kp = 'id' } = slotBinding;
            const templateNode = matched[0];
            // Resolve data items for preview
            const resolvedItems = resolveForPreview(source, {
              queryContext: mergedQueryContext,
              globalContext,
              nodePropsContext,
              itemContext,
            });
            const dataItems: any[] = Array.isArray(resolvedItems) && resolvedItems.length > 0
              ? resolvedItems.slice(0, previewCount)
              : Array.from({ length: previewCount }, (_, i) => ({ id: i, index: i }));

            slotProps[slot.prop] = dataItems.map((item, idx) => (
              <NodeRenderer
                key={item[kp] ?? idx}
                node={{ ...templateNode, repeatBinding: undefined }}
                depth={depth + 1}
                itemContext={item}
                queryContext={mergedQueryContext}
                globalContext={globalContext}
                themeColors={themeColors}
                nodePropsContext={nodePropsContext}
                onQueryContextUpdate={onQueryContextUpdate}
              />
            ));
          } else if (matched.length === 1 && matched[0].repeatBinding) {
            // Legacy TEMPLATE: single child with repeatBinding on the child node
            const templateNode = matched[0];
            slotProps[slot.prop] = Array.from({ length: previewCount }, (_, idx) => (
              <NodeRenderer
                key={`repeat-${templateNode.id}-${idx}`}
                node={{ ...templateNode, repeatBinding: undefined }}
                depth={depth + 1}
                queryContext={mergedQueryContext}
                globalContext={globalContext}
                themeColors={themeColors}
                nodePropsContext={nodePropsContext}
                onQueryContextUpdate={onQueryContextUpdate}
              />
            ));
          } else {
            // STATIC: render all matched children as-is
            slotProps[slot.prop] = matched.map(c => (
              <NodeRenderer key={c.id} node={c} depth={depth + 1} itemContext={itemContext} queryContext={mergedQueryContext} globalContext={globalContext} themeColors={themeColors} nodePropsContext={nodePropsContext} onQueryContextUpdate={onQueryContextUpdate} />
            ));
          }
        } else {
          slotProps[slot.prop] = (
            <View>
              <ChildrenWithDropZones parentId={node.id} nodes={matched} depth={depth} slotName={slot.prop} itemContext={itemContext} queryContext={mergedQueryContext} globalContext={globalContext} themeColors={themeColors} nodePropsContext={nodePropsContext} onQueryContextUpdate={onQueryContextUpdate} />
            </View>
          );
        }
        matched.forEach(c => usedIds.add(c.id));
      } else {
        slotProps[slot.prop] = isArraySlot ? [] : <InsertZone parentId={node.id} index={children.length} slotName={slot.prop} label={slot.label} />;
      }
    }

    const unmatched = children.filter(c => !usedIds.has(c.id) && (!c.slotName || c.slotName === 'children'));
    const jsxChildren = childrenSlotExists ? (
      <>
        <ChildrenWithDropZones parentId={node.id} nodes={unmatched} depth={depth} slotName="children" itemContext={itemContext} queryContext={mergedQueryContext} globalContext={globalContext} themeColors={themeColors} nodePropsContext={nodePropsContext} onQueryContextUpdate={onQueryContextUpdate} />
        {unmatched.length === 0 && <InsertZone parentId={node.id} index={children.length} slotName="children" label="Children" />}
      </>
    ) : unmatched.length > 0 ? (
      <>{unmatched.map(c => <NodeRenderer key={c.id} node={c} depth={depth + 1} itemContext={itemContext} queryContext={mergedQueryContext} globalContext={globalContext} themeColors={themeColors} nodePropsContext={nodePropsContext} onQueryContextUpdate={onQueryContextUpdate} />)}</>
    ) : null;

    content = <Component {...rProps} {...slotProps}>{jsxChildren}</Component>;
  } else if (isContainer) {
    // If repeatItems is set, render children repeated for each item inside this container
    if (repeatItems && repeatItems.length > 0) {
      const keyProp = repeatKeyProp || 'id';
      const childrenToRepeat = repeatChildren || children; // use explicit repeatChildren if available
      content = (
        <Component {...rProps}>
          {!previewMode && (
            <View style={rp.badge} pointerEvents="none">
              <Feather name="repeat" size={9} color="#22d3ee" />
              <Text style={rp.badgeText}>×{repeatItemsTotal ?? repeatItems.length} items</Text>
            </View>
          )}
          {repeatItems.map((item, idx) => (
            <React.Fragment key={item[keyProp] ?? idx}>
              <ChildrenWithDropZones
                parentId={node.id}
                nodes={childrenToRepeat}
                depth={depth}
                itemContext={item}
                queryContext={mergedQueryContext}
                globalContext={globalContext}
                themeColors={themeColors}
                nodePropsContext={nodePropsContext}
                onQueryContextUpdate={onQueryContextUpdate}
              />
            </React.Fragment>
          ))}
          {!previewMode && (repeatItemsTotal ?? 0) > repeatItems.length && (
            <View style={rp.more} pointerEvents="none">
              <Text style={rp.moreText}>+{(repeatItemsTotal ?? 0) - repeatItems.length} more items</Text>
            </View>
          )}
          {childrenToRepeat.length === 0 && <InsertZone parentId={node.id} index={0} label="Drop children" />}
        </Component>
      );
    } else {
      content = (
        <Component {...rProps}>
          <ChildrenWithDropZones parentId={node.id} nodes={children} depth={depth} itemContext={childItemContext} queryContext={mergedQueryContext} globalContext={globalContext} themeColors={themeColors} nodePropsContext={nodePropsContext} onQueryContextUpdate={onQueryContextUpdate} />
          {children.length === 0 && <InsertZone parentId={node.id} index={0} label="Drop children" />}
        </Component>
      );
    }
  } else {
    content = <Component {...rProps} />;
  }

  const nodeStyles = node.styles || {};
  const isAbsolute = nodeStyles.position === 'absolute';
  const hasCondition = !!node.conditionalRender;
  const hasRepeat = !!node.repeatBinding;
  const hasAnimation = !!node.animation && node.animation.preset !== 'none';
  const hasEvents = node.events && Object.values(node.events).some((a: any) => a?.length > 0);
  const pressActions = previewMode ? (node.events?.onPress as ActionDef[] || []) : [];
  const longPressActions = previewMode ? (node.events?.onLongPress as ActionDef[] || []) : [];
  const allStyles: Record<string, any> = { ...nodeStyles };

  if (isAbsolute) {
    if (!allStyles.width) allStyles.minWidth = 40;
    if (!allStyles.height) allStyles.minHeight = 30;
    if (allStyles.top === undefined) allStyles.top = 0;
    if (allStyles.left === undefined) allStyles.left = 0;
  }

  const hasPressHandler = pressActions.length > 0 || longPressActions.length > 0;
  const overlayCtx = { showToast: overlay?.showToast, showAlert: overlay?.showAlert, openModal: overlay?.openModal, closeModal: overlay?.closeModal };
  const wrappedContent = previewMode && hasPressHandler ? (
    <Pressable
      onPress={pressActions.length > 0 ? () => { for (const a of pressActions) executeAction(a, { setPageId, project, onQueryContextUpdate, queryContext: mergedQueryContext, globalContext, nodePropsContext, itemContext, ...overlayCtx }); } : undefined}
      onLongPress={longPressActions.length > 0 ? () => { for (const a of longPressActions) executeAction(a, { setPageId, project, onQueryContextUpdate, queryContext: mergedQueryContext, globalContext, nodePropsContext, itemContext, ...overlayCtx }); } : undefined}
    >
      {content}
    </Pressable>
  ) : content;

  // Handle repeat — only for children/named mode containers.
  // Items-mode layouts handle repeatBinding internally via ItemsRenderer (DATA mode).
  if (node.repeatBinding && slotCfg.mode !== 'items') {
    return <RepeatRenderer node={node} depth={depth} queryContext={mergedQueryContext} globalContext={globalContext} themeColors={themeColors} nodePropsContext={nodePropsContext} onQueryContextUpdate={onQueryContextUpdate} />;
  }

  return (
    <View
      style={[s.wrapper, isSel && s.wrapperSel, allStyles, isMoving && s.moving, depth === 0 && node.kind === 'layout' && s.rootWrapper, hasCondition && !previewMode && s.conditional]}
      {...(!previewMode && !isSel ? { onStartShouldSetResponder: () => true, onResponderRelease: () => setSel(node.id) } : {})}
    >
      {wrappedContent}
      {isSel && <View style={s.selBorder} pointerEvents="none" />}
      {isSel && (
        <View style={s.label} pointerEvents="none">
          <Text style={s.labelText}>
            {node.registryId}
            {hasCondition ? ' ' : ''}
            {hasCondition && <Feather name="eye" size={8} color="#fff" />}
            {hasRepeat ? ' ' : ''}
            {hasRepeat && <Feather name="repeat" size={8} color="#fff" />}
            {hasAnimation ? ' ' : ''}
            {hasAnimation && <Feather name="wind" size={8} color="#fff" />}
            {hasEvents ? ' ' : ''}
            {hasEvents && <Feather name="zap" size={8} color="#fff" />}
          </Text>
        </View>
      )}
      {!previewMode && hasCondition && !isSel && (
        <View style={s.condBadge} pointerEvents="none">
          <Text style={s.condBadgeText}>{node.conditionalRender!.mode === 'show' ? <Feather name="eye" size={9} color="#f59e0b" /> : <Feather name="eye-off" size={9} color="#ef4444" />}</Text>
        </View>
      )}
      {isSel && <ResizeHandles nodeId={node.id} styles={nodeStyles} isAbsolute={isAbsolute} />}
    </View>
  );
};

function ChildrenWithDropZones({ parentId, nodes, depth, slotName, itemContext, queryContext, globalContext, themeColors, nodePropsContext, onQueryContextUpdate }: {
  parentId: string; nodes: TreeNode[]; depth: number; slotName?: string;
  itemContext?: Record<string, any>; queryContext?: Record<string, any>;
  globalContext?: Record<string, any>; themeColors?: Record<string, string>;
  nodePropsContext?: Record<string, Record<string, any>>;
  onQueryContextUpdate?: (key: string, val: any) => void;
}) {
  const { movingId } = useStudio();
  if (nodes.length === 0) return null;
  return (
    <>
      {nodes.map((c, i) => (
        <React.Fragment key={c.id}>
          {movingId && movingId !== c.id && <InsertZone parentId={parentId} index={i} label="" slotName={slotName} mini />}
          <NodeRenderer node={c} depth={depth + 1} itemContext={itemContext} queryContext={queryContext} globalContext={globalContext} themeColors={themeColors} nodePropsContext={nodePropsContext} onQueryContextUpdate={onQueryContextUpdate} />
        </React.Fragment>
      ))}
      {movingId && <InsertZone parentId={parentId} index={nodes.length} label="" slotName={slotName} mini />}
    </>
  );
}

function InsertZone({ parentId, index, label, slotName, mini }: { parentId: string; index: number; label: string; slotName?: string; mini?: boolean }) {
  const { movingId, dropInto, selectSlot, selId, targetSlot } = useStudio();
  const active = !!movingId;
  const isTargeted = selId === parentId && targetSlot === slotName && !active;
  if (!active && mini) return null;

  const handlePress = () => {
    if (active) dropInto(parentId, index, slotName);
    else if (slotName) selectSlot(parentId, slotName);
  };

  return (
    <Pressable onPress={handlePress} style={[mini ? s.miniZone : s.dropZone, active && s.dropZoneActive, isTargeted && s.dropZoneTargeted]}>
      {!mini && (
        <View style={s.dropContent}>
          <Feather name={active ? 'download' : isTargeted ? 'check-circle' : 'plus-circle'} size={12} color={active ? '#3b82f6' : isTargeted ? '#22c55e' : 'rgba(59,130,246,0.4)'} />
          <Text style={[s.dropText, active && s.dropTextActive, isTargeted && s.dropTextTargeted]}>
            {active ? 'Drop here' : isTargeted ? `${label} (selected)` : label}
          </Text>
        </View>
      )}
      {mini && active && <View style={s.miniLine} />}
    </Pressable>
  );
}

// Static marker so useStudioItems can detect an InsertZone element by its type
// without relying on display name strings (survives minification and renames).
(InsertZone as typeof InsertZone & { $insertZone: boolean }).$insertZone = true;

function DragHandle({ axis, nodeId, styles: nodeStyles, style, children }: { axis: 'w' | 'h' | 'wh' | 'move'; nodeId: string; styles: Record<string, any>; style: any; children: React.ReactNode }) {
  const ref = React.useRef<View>(null);
  const { updateStyles } = useStudio();

  React.useEffect(() => {
    const el = ref.current as any;
    if (!el) return;
    const target = typeof document !== 'undefined' ? (el as any) : null;
    if (!target || !target.addEventListener) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const startX = e.pageX, startY = e.pageY;
      const startW = Number(nodeStyles.width) || 0;
      const startH = Number(nodeStyles.height) || 0;
      const startTop = Number(nodeStyles.top) || 0;
      const startLeft = Number(nodeStyles.left) || 0;

      const onMove = (ev: MouseEvent) => {
        ev.preventDefault();
        const dx = ev.pageX - startX, dy = ev.pageY - startY;
        const updates: Record<string, any> = {};
        if (axis === 'w') updates.width = Math.max(20, startW + dx);
        if (axis === 'h') updates.height = Math.max(20, startH + dy);
        if (axis === 'wh') { updates.width = Math.max(20, startW + dx); updates.height = Math.max(20, startH + dy); }
        if (axis === 'move') { updates.top = startTop + dy; updates.left = startLeft + dx; }
        updateStyles(nodeId, updates);
      };
      const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    };

    target.addEventListener('mousedown', handleMouseDown);
    return () => target.removeEventListener('mousedown', handleMouseDown);
  });

  return <View ref={ref} style={style}>{children}</View>;
}

function ResizeHandles({ nodeId, styles, isAbsolute }: { nodeId: string; styles: Record<string, any>; isAbsolute?: boolean }) {
  const w = styles.width, h = styles.height;
  return (
    <>
      {isAbsolute && (
        <DragHandle axis="move" nodeId={nodeId} styles={styles} style={s.moveHandle}>
          <View style={s.moveDot}><Feather name="move" size={8} color="#fff" /></View>
        </DragHandle>
      )}
      <DragHandle axis="w" nodeId={nodeId} styles={styles} style={[s.resizeHandle, s.resizeR]}><View style={s.resizeDot} /></DragHandle>
      <DragHandle axis="h" nodeId={nodeId} styles={styles} style={[s.resizeHandle, s.resizeB]}><View style={s.resizeDot} /></DragHandle>
      <DragHandle axis="wh" nodeId={nodeId} styles={styles} style={[s.resizeHandle, s.resizeBR]}><View style={s.resizeDotCorner} /></DragHandle>
      {(w || h) ? (
        <View style={s.sizeLabel} pointerEvents="none">
          <Text style={s.sizeLabelText}>{w ?? 'auto'} × {h ?? 'auto'}</Text>
        </View>
      ) : null}
    </>
  );
}

export default NodeRenderer;

// Register refs for ItemsRenderer (avoids circular import)
registerNodeRenderer((props) => <NodeRenderer {...props} />);
registerInsertZone((props) => <InsertZone {...props} />);

const s = StyleSheet.create({
  wrapper: { position: 'relative', minHeight: 2 },
  wrapperSel: { zIndex: 9990 },
  rootWrapper: { flex: 1, minHeight: '100%' },
  moving: { opacity: 0.35 },
  conditional: { borderLeftWidth: 3, borderLeftColor: 'rgba(245,158,11,0.4)' },
  condBadge: { position: 'absolute', top: 2, right: 2, zIndex: 999 },
  condBadgeText: { fontSize: 10 },
  selBorder: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 2, borderColor: '#3b82f6', borderRadius: 3, pointerEvents: 'none', zIndex: 999 },
  label: { position: 'absolute', top: -1, left: 4, backgroundColor: '#3b82f6', paddingHorizontal: 5, paddingVertical: 1, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, zIndex: 10000 },
  labelText: { color: '#fff', fontSize: 8, fontWeight: '700' },
  fallback: { padding: 8, minHeight: 30 },
  fallbackLabel: { color: '#6a7494', fontSize: 10, fontWeight: '600', marginBottom: 4 },
  dropZone: { minHeight: 36, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(59,130,246,0.25)', borderRadius: 6, alignItems: 'center', justifyContent: 'center', margin: 4, backgroundColor: 'rgba(59,130,246,0.02)' },
  dropZoneActive: { borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)' },
  dropZoneTargeted: { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)' },
  dropContent: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dropText: { color: 'rgba(59,130,246,0.4)', fontSize: 10, fontWeight: '500' },
  dropTextActive: { color: '#3b82f6' },
  dropTextTargeted: { color: '#22c55e' },
  miniZone: { height: 8, marginHorizontal: 4, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  miniLine: { width: '80%', height: 2, backgroundColor: '#3b82f6', borderRadius: 1 },
  resizeHandle: { position: 'absolute', zIndex: 10001 },
  resizeR: { right: -8, top: '50%', marginTop: -10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', cursor: 'ew-resize' as any },
  resizeB: { bottom: -8, left: '50%', marginLeft: -10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', cursor: 'ns-resize' as any },
  resizeBR: { right: -8, bottom: -8, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', cursor: 'nwse-resize' as any },
  resizeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6', borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 2, elevation: 4 },
  resizeDotCorner: { width: 12, height: 12, borderRadius: 3, backgroundColor: '#3b82f6', borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 2, elevation: 4 },
  moveHandle: { position: 'absolute', top: -10, left: '50%', marginLeft: -10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', zIndex: 10001, cursor: 'move' as any },
  moveDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 2, elevation: 4 },
  sizeLabel: { position: 'absolute', bottom: -16, right: 0, backgroundColor: 'rgba(59,130,246,0.9)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 },
  sizeLabelText: { color: '#fff', fontSize: 8, fontWeight: '600' },
});

const rp = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(34,211,238,0.1)', borderRadius: 4, borderWidth: 1, borderColor: 'rgba(34,211,238,0.2)', marginBottom: 2, alignSelf: 'flex-start' },
  badgeText: { color: '#22d3ee', fontSize: 8, fontWeight: '600', fontFamily: 'monospace' as any },
  more: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(34,211,238,0.05)', borderRadius: 4, borderWidth: 1, borderStyle: 'dashed' as any, borderColor: 'rgba(34,211,238,0.2)', alignItems: 'center' },
  moreText: { color: '#22d3ee', fontSize: 9, fontStyle: 'italic' },
});
