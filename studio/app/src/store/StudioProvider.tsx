import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import type {
  TreeNode,
  AnimationConfig,
  ActionDef,
  PageState,
  PageDocument as PageDoc,
  ProjectDocument,
  ScreenGroup,
  GlobalStateVar,
  AppConstant,
  EnvVar,
  DataQuery,
} from '../../../engine/tree/types';

export type { TreeNode, AnimationConfig, ActionDef, PageState, ScreenGroup, GlobalStateVar, AppConstant, EnvVar, DataQuery };
export type { PageDoc };

export interface Variable { id: string; name: string; type: 'string' | 'number' | 'boolean' | 'color'; value: unknown; scope?: 'page' | 'app'; computed?: string; persist?: 'none' | 'async' | 'secure'; }
/** Extended ProjectDocument for the studio — adds studio-specific fields not in engine/tree/types */
export interface ProjectDoc extends ProjectDocument { variables: Variable[]; }
export interface RegItem { id: string; label: string; description: string; category: string; props: unknown[]; slots?: unknown[]; variants?: unknown[]; tags?: string[]; themeMapping?: Record<string, string>; }
export interface Reg { layouts: RegItem[]; components: RegItem[]; blocks: RegItem[]; primitives: RegItem[]; }
export interface CustomTemplate { id: string; name: string; category: string; tree: TreeNode; createdAt: string; }

export { FOUNDATION_TOKENS as TOKENS, getAllTokens, getThemeTokens, resolveTokenValue, resolveProps, THEME_REGISTRY, AVAILABLE_THEMES, getThemeColors } from './tokens';

interface Ctx {
  reg: Reg; project: ProjectDoc | null; pageId: string | null; selId: string | null; zoom: number; device: string;
  movingId: string | null; targetSlot: string | null;
  libTab: 'layouts' | 'components' | 'blocks' | 'primitives'; rightTab: 'properties' | 'design' | 'config' | 'code'; bottomTab: 'layers' | 'screens';
  setPageId: (id: string) => void; setSel: (id: string | null) => void; setZoom: (z: number) => void; setDevice: (d: string) => void;
  setLibTab: (t: any) => void; setRightTab: (t: any) => void; setBottomTab: (t: any) => void;
  selectSlot: (parentId: string, slotName: string) => void;
  startMove: (id: string) => void; cancelMove: () => void;
  dropInto: (parentId: string, index: number, slotName?: string) => void;
  moveUp: (id: string) => void; moveDown: (id: string) => void;
  addNode: (parentId: string, kind: string, rid: string, slotName?: string) => void; removeNode: (id: string) => void; moveNode: (id: string, newParentId: string, idx: number) => void;
  updateProp: (id: string, k: string, v: any) => void; updateStyles: (id: string, styles: Record<string, any>) => void;
  addVariable: (v: Variable) => void; updateVariable: (id: string, updates: Partial<Variable>) => void; removeVariable: (id: string) => void;
  updateEvents: (id: string, event: string, actions: ActionDef[]) => void;
  updateBindings: (id: string, bindings: Record<string, string>) => void;
  updateConditional: (id: string, cond: TreeNode['conditionalRender']) => void;
  updateRepeat: (id: string, repeat: TreeNode['repeatBinding']) => void;
  updateSlotBinding: (id: string, slotProp: string, binding: NonNullable<TreeNode['slotBindings']>[string] | undefined) => void;
  updateDataContext: (id: string, ctx: TreeNode['dataContext']) => void;
  updateAnimation: (id: string, anim: AnimationConfig | undefined) => void;
  addPageState: (ps: PageState) => void; removePageState: (name: string) => void; updatePageState: (name: string, updates: Partial<PageState>) => void;
  undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean;
  copyNode: (id: string) => void; pasteNode: (parentId: string) => void; duplicateNode: (id: string) => void; clipboard: TreeNode | null;
  previewMode: boolean; setPreviewMode: (v: boolean) => void;
  addQuery: (q: DataQuery) => void; updateQuery: (id: string, updates: Partial<DataQuery>) => void; removeQuery: (id: string) => void;
  addPage: (name: string) => Promise<void>; deletePage: (id: string) => Promise<void>; renamePage: (id: string, newName: string) => Promise<void>;
  updateProject: (u: Partial<ProjectDoc>) => Promise<void>; resetProject: () => Promise<void>; generate: () => Promise<string[]>;
  page: () => PageDoc | undefined; node: (id: string) => TreeNode | null; meta: (kind: string, rid: string) => RegItem | undefined;
  templates: CustomTemplate[]; saveAsTemplate: (nodeId: string, name: string, category?: string) => void; removeTemplate: (id: string) => void; addFromTemplate: (parentId: string, templateId: string) => void;
  addScreenGroup: (g: ScreenGroup) => void; removeScreenGroup: (id: string) => void; updateScreenGroup: (id: string, u: Partial<ScreenGroup>) => void;
  addGlobalState: (g: GlobalStateVar) => void; removeGlobalState: (name: string) => void;
  addConstant: (c: AppConstant) => void; removeConstant: (key: string) => void;
}

const C = createContext<Ctx | null>(null);
export const useStudio = () => { const c = useContext(C); if (!c) throw new Error('useStudio outside provider'); return c; };

const API = Platform.OS === 'web' ? '/api' : 'http://localhost:4200/api';
async function api<T = any>(m: string, p: string, b?: any): Promise<T> {
  const o: RequestInit = { method: m, headers: { 'Content-Type': 'application/json' } };
  if (b) o.body = JSON.stringify(b);
  return (await fetch(API + p, o)).json();
}

function fnd(r: TreeNode, id: string): TreeNode | null { if (r.id === id) return r; for (const c of (r.children || [])) { const f = fnd(c, id); if (f) return f; } return null; }
function fpar(r: TreeNode, id: string): TreeNode | null { for (const c of (r.children || [])) { if (c.id === id) return r; const f = fpar(c, id); if (f) return f; } return null; }
function deepRemove(r: TreeNode, id: string): void { r.children = (r.children || []).filter(c => c.id !== id); for (const c of r.children) deepRemove(c, id); }
import { gid } from './gid';
export { gid } from './gid';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reg, setReg] = useState<Reg>({ layouts: [], components: [], blocks: [], primitives: [] });
  const [project, setProject] = useState<ProjectDoc | null>(null);
  const [pageId, setPageId] = useState<string | null>(null);
  const [selId, setSelRaw] = useState<string | null>(null);
  const setSel = useCallback((id: string | null) => { setSelRaw(id); setTargetSlot(null); }, []);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [targetSlot, setTargetSlot] = useState<string | null>(null);
  const [zoom, setZoom] = useState(90);
  const [device, setDevice] = useState('iPhone 14 Pro');
  const [libTab, setLibTab] = useState<'layouts' | 'components' | 'blocks' | 'primitives'>('layouts');
  const [rightTab, setRightTab] = useState<'properties' | 'design' | 'config' | 'code'>('properties');
  const [bottomTab, setBottomTab] = useState<'layers' | 'screens'>('layers');
  const historyRef = React.useRef<{ past: string[]; future: string[] }>({ past: [], future: [] });
  const [historyLen, setHistoryLen] = useState<{ past: number; future: number }>({ past: 0, future: 0 });
  const MAX_HISTORY = 50;

  useEffect(() => {
    (async () => {
      const r = await api<Reg>('GET', '/registry');
      setReg(r);
      let p = await api<ProjectDoc>('GET', '/project');
      if (!p) p = { name: 'My App', version: '1.0.0', theme: 'light', slug: 'my-app', bundleId: 'com.example.app', orientation: 'portrait', pages: [], services: [], navigation: { type: 'tabs', screens: [] }, themeOverrides: {}, variables: [] };
      if (!p.themeOverrides) p.themeOverrides = {};
      if (!p.variables) p.variables = [];
      if (!p.navigation) p.navigation = { type: 'tabs', screens: [] };
      if (!p.navigation.screens) p.navigation.screens = [];
      if (!p.pages) p.pages = [];
      if (!p.slug) p.slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (!p.bundleId) p.bundleId = 'com.example.app';
      if (!p.orientation) p.orientation = 'portrait';
      if (!p.pages.length) { const pg = await api<PageDoc>('POST', '/pages', { name: 'Home', layoutId: 'RootLayout' }); p.pages.push(pg); }

      // ── Data integrity: normalize navigation state ──────────────────────
      // 1. Ensure every page has a navigation.screens entry
      const navPageIds = new Set(p.navigation.screens.map((s: any) => s.pageId));
      for (const pg of p.pages) {
        if (!navPageIds.has(pg.id)) {
          p.navigation.screens.push({ name: pg.name, pageId: pg.id });
        }
      }
      // 2. Keep navigation.screens[].name in sync with page.name (page.name is authoritative)
      p.navigation.screens = p.navigation.screens.map((s: any) => {
        const pg = p.pages.find((pg: any) => pg.id === s.pageId);
        return pg ? { ...s, name: pg.name } : s;
      });
      // 3. Remove nav screens for deleted pages
      p.navigation.screens = p.navigation.screens.filter((s: any) =>
        p.pages.some((pg: any) => pg.id === s.pageId)
      );
      // 4. Ensure every page is in exactly one screenGroup
      const screenGroups: any[] = (p as any).screenGroups || [];
      if (screenGroups.length === 0) {
        // Create default tabs group with all pages
        (p as any).screenGroups = [{ id: 'grp_default', name: 'tabs', type: 'tabs', screenIds: p.pages.map((pg: any) => pg.id) }];
      } else {
        // Remove deleted page IDs from all groups
        const pageIds = new Set(p.pages.map((pg: any) => pg.id));
        const cleanedGroups = screenGroups.map((g: any) => ({
          ...g, screenIds: (g.screenIds || []).filter((sid: string) => pageIds.has(sid)),
        }));
        // Find pages not in any group → add to first group
        const groupedIds = new Set(cleanedGroups.flatMap((g: any) => g.screenIds));
        const ungrouped = p.pages.filter((pg: any) => !groupedIds.has(pg.id));
        if (ungrouped.length > 0) {
          cleanedGroups[0] = { ...cleanedGroups[0], screenIds: [...cleanedGroups[0].screenIds, ...ungrouped.map((pg: any) => pg.id)] };
        }
        (p as any).screenGroups = cleanedGroups;
      }
      // ────────────────────────────────────────────────────────────────────

      // Inject default placeholder services + queries on first load
      if (!p.services?.length) {
        p.services = [
          {
            id: 'placeholderApi',
            type: 'rest',
            name: 'Placeholder API',
            config: { baseUrl: '/api/placeholder', apiKey: '' },
          },
          {
            id: 'jsonplaceholder',
            type: 'rest',
            name: 'JSONPlaceholder',
            config: { baseUrl: 'https://jsonplaceholder.typicode.com', apiKey: '' },
          },
        ];
        p.queries = [
          // GET queries — auto-fetch, store in $state.alias
          { id: 'q_users',    name: 'getUsers',    serviceId: 'placeholderApi',  method: 'GET',  path: '/users',    autoFetch: true,  alias: 'users'    },
          { id: 'q_posts',    name: 'getPosts',    serviceId: 'placeholderApi',  method: 'GET',  path: '/posts',    autoFetch: false, alias: 'posts'    },
          { id: 'q_products', name: 'getProducts', serviceId: 'placeholderApi',  method: 'GET',  path: '/products', autoFetch: false, alias: 'products' },
          { id: 'q_stats',    name: 'getStats',    serviceId: 'placeholderApi',  method: 'GET',  path: '/stats',    autoFetch: false, alias: 'stats'    },
          // POST/PUT/DELETE — manual trigger via callApi action
          { id: 'q_login',    name: 'login',       serviceId: 'placeholderApi',  method: 'POST', path: '/auth/login', autoFetch: false, alias: 'session',
            body: { email: '$state.email', password: '$state.password' } },
          { id: 'q_create_user', name: 'createUser', serviceId: 'placeholderApi', method: 'POST', path: '/users', autoFetch: false, alias: 'newUser',
            body: { name: '$state.name', email: '$state.email' } },
          { id: 'q_update_user', name: 'updateUser', serviceId: 'placeholderApi', method: 'PUT',  path: '/users/1', autoFetch: false, alias: 'updatedUser',
            body: { name: '$state.name' } },
          { id: 'q_delete_user', name: 'deleteUser', serviceId: 'placeholderApi', method: 'DELETE', path: '/users/1', autoFetch: false, alias: 'deleteResult' },
          // JSONPlaceholder
          { id: 'q_jp_users',   name: 'jpUsers',   serviceId: 'jsonplaceholder', method: 'GET', path: '/users',   autoFetch: false, alias: 'jpUsers'   },
          { id: 'q_jp_posts',   name: 'jpPosts',   serviceId: 'jsonplaceholder', method: 'GET', path: '/posts',   autoFetch: false, alias: 'jpPosts'   },
          { id: 'q_jp_todos',   name: 'jpTodos',   serviceId: 'jsonplaceholder', method: 'GET', path: '/todos',   autoFetch: false, alias: 'jpTodos'   },
          { id: 'q_jp_create',  name: 'jpCreatePost', serviceId: 'jsonplaceholder', method: 'POST', path: '/posts', autoFetch: false, alias: 'jpNewPost',
            body: { title: '$state.title', body: '$state.body', userId: '$state.userId' } },
        ];
        await api('PUT', '/project', p);
      }

      setProject(p);
      setPageId(p.pages[0]?.id || null);
    })();
  }, []);

  const save = useCallback(async (pg: PageDoc) => { await api('PUT', '/pages/' + pg.id, pg); }, []);

  // WebSocket — listen for page:renamed events and apply local state update
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'page:renamed') {
          const { id, name, route } = msg;
          setProject(prev => {
            if (!prev) return prev;
            const pages = prev.pages.map(p =>
              p.id === id ? { ...p, name, route } : p
            );
            const screens = prev.navigation.screens.map(s =>
              s.pageId === id ? { ...s, name } : s
            );
            return { ...prev, pages, navigation: { ...prev.navigation, screens } };
          });
        }
      } catch {}
    };

    return () => { ws.close(); };
  }, []);

  const page = useCallback(() => project?.pages.find(p => p.id === pageId), [project, pageId]);
  const node = useCallback((id: string) => { const pg = page(); return pg ? fnd(pg.root, id) : null; }, [page]);
  const meta = useCallback((kind: string, rid: string) => {
    const l = kind === 'layout' ? reg.layouts : kind === 'component' ? reg.components : kind === 'primitive' ? reg.primitives : reg.blocks;
    return l.find(m => m.id === rid);
  }, [reg]);

  const mut = useCallback((fn: (root: TreeNode) => void) => {
    setProject(prev => {
      if (!prev) return prev;
      const pages = prev.pages.map(pg => {
        if (pg.id !== pageId) return pg;
        const h = historyRef.current;
        h.past.push(JSON.stringify(pg.root));
        if (h.past.length > MAX_HISTORY) h.past.shift();
        h.future = [];
        const root = JSON.parse(JSON.stringify(pg.root));
        fn(root);
        const u = { ...pg, root, updatedAt: new Date().toISOString() };
        save(u);
        return u;
      });
      return { ...prev, pages };
    });
    setHistoryLen({ past: historyRef.current.past.length, future: 0 });
  }, [pageId, save]);

  const undo = useCallback(() => {
    setProject(prev => {
      if (!prev) return prev;
      const h = historyRef.current;
      if (!h.past.length) return prev;
      const pages = prev.pages.map(pg => {
        if (pg.id !== pageId) return pg;
        h.future.push(JSON.stringify(pg.root));
        const root = JSON.parse(h.past.pop()!);
        const u = { ...pg, root, updatedAt: new Date().toISOString() };
        save(u);
        return u;
      });
      return { ...prev, pages };
    });
    setHistoryLen({ past: historyRef.current.past.length, future: historyRef.current.future.length });
  }, [pageId, save]);

  const redo = useCallback(() => {
    setProject(prev => {
      if (!prev) return prev;
      const h = historyRef.current;
      if (!h.future.length) return prev;
      const pages = prev.pages.map(pg => {
        if (pg.id !== pageId) return pg;
        h.past.push(JSON.stringify(pg.root));
        const root = JSON.parse(h.future.pop()!);
        const u = { ...pg, root, updatedAt: new Date().toISOString() };
        save(u);
        return u;
      });
      return { ...prev, pages };
    });
    setHistoryLen({ past: historyRef.current.past.length, future: historyRef.current.future.length });
  }, [pageId, save]);

  const canUndo = historyLen.past > 0;
  const canRedo = historyLen.future > 0;

  const [clipboard, setClipboard] = useState<TreeNode | null>(null);

  const copyNode = useCallback((id: string) => {
    const pg = page();
    if (!pg) return;
    const n = fnd(pg.root, id);
    if (n) setClipboard(JSON.parse(JSON.stringify(n)));
  }, [page]);

  const pasteNode = useCallback((parentId: string) => {
    if (!clipboard) return;
    const clone = JSON.parse(JSON.stringify(clipboard));
    const reId = (n: TreeNode) => { n.id = gid(); for (const c of n.children) reId(c); };
    reId(clone);
    mut(root => { const t = fnd(root, parentId) || root; t.children.push(clone); });
    setSel(clone.id);
  }, [clipboard, mut, setSel]);

  const duplicateNode = useCallback((id: string) => {
    const pg = page();
    if (!pg) return;
    const n = fnd(pg.root, id);
    if (!n) return;
    const parent = fpar(pg.root, id);
    if (!parent) return;
    const clone = JSON.parse(JSON.stringify(n));
    const reId = (nd: TreeNode) => { nd.id = gid(); for (const c of nd.children) reId(c); };
    reId(clone);
    mut(root => {
      const p = fpar(root, id);
      if (!p) return;
      const idx = p.children.findIndex(c => c.id === id);
      p.children.splice(idx + 1, 0, clone);
    });
    setSel(clone.id);
  }, [page, mut, setSel]);

  const [previewMode, setPreviewMode] = useState(false);

  const addQuery = useCallback((q: DataQuery) => {
    setProject(prev => {
      if (!prev) return prev;
      const queries = [...(prev.queries || []), q];
      const next = { ...prev, queries };
      api('PUT', '/project', next);
      return next;
    });
  }, []);

  const updateQuery = useCallback((id: string, updates: Partial<DataQuery>) => {
    setProject(prev => {
      if (!prev) return prev;
      const queries = (prev.queries || []).map(q => q.id === id ? { ...q, ...updates } : q);
      const next = { ...prev, queries };
      api('PUT', '/project', next);
      return next;
    });
  }, []);

  const removeQuery = useCallback((id: string) => {
    setProject(prev => {
      if (!prev) return prev;
      const queries = (prev.queries || []).filter(q => q.id !== id);
      const next = { ...prev, queries };
      api('PUT', '/project', next);
      return next;
    });
  }, []);

  const selectSlot = useCallback((parentId: string, slotName: string) => {
    setSel(parentId);
    setTargetSlot(slotName);
  }, []);

  const addNode = useCallback((parentId: string, kind: string, rid: string, slotName?: string) => {
    const slot = slotName || targetSlot;
    const n: TreeNode = { id: gid(), kind: kind as TreeNode['kind'], registryId: rid, props: {}, styles: { flex: 1 }, children: [] };
    if (slot) n.slotName = slot;
    const m = meta(kind, rid);
    if (m) { for (const p of m.props as Array<{ name: string; default?: any }>) if (p.default !== undefined) n.props[p.name] = p.default; if (m.variants?.length) n.variant = (m.variants[0] as { name: string }).name; }
    mut(root => { const t = fnd(root, parentId) || root; t.children.push(n); });
    setSel(n.id);
    setTargetSlot(null);
  }, [meta, mut, targetSlot]);

  const removeNode = useCallback((id: string) => {
    mut(root => { const p = fpar(root, id); if (p) p.children = p.children.filter(c => c.id !== id); });
    if (selId === id) setSel(null);
  }, [mut, selId]);

  const moveNode = useCallback((id: string, newParentId: string, idx: number) => {
    mut(root => {
      const n = fnd(root, id); if (!n) return;
      const oldP = fpar(root, id); if (oldP) oldP.children = oldP.children.filter(c => c.id !== id);
      const newP = fnd(root, newParentId) || root;
      newP.children.splice(idx, 0, n);
    });
  }, [mut]);

  const updateProp = useCallback((id: string, k: string, v: any) => {
    if (k === '__variant__') {
      mut(root => { const n = fnd(root, id); if (n) n.variant = v; });
    } else {
      mut(root => { const n = fnd(root, id); if (n) n.props[k] = v; });
    }
  }, [mut]);
  const updateStyles = useCallback((id: string, styles: Record<string, any>) => { mut(root => { const n = fnd(root, id); if (n) n.styles = { ...(n.styles || {}), ...styles }; }); }, [mut]);
  const addVariable = useCallback((v: Variable) => { setProject(prev => prev ? { ...prev, variables: [...(prev.variables || []), v] } : prev); }, []);
  const updateVariable = useCallback((id: string, updates: Partial<Variable>) => { setProject(prev => { if (!prev) return prev; const variables = (prev.variables || []).map(v => v.id === id ? { ...v, ...updates } : v); const next = { ...prev, variables }; api('PUT', '/project', next); return next; }); }, []);
  const removeVariable = useCallback((id: string) => { setProject(prev => { if (!prev) return prev; const variables = (prev.variables || []).filter(v => v.id !== id); const next = { ...prev, variables }; api('PUT', '/project', next); return next; }); }, []);

  const updateEvents = useCallback((id: string, event: string, actions: ActionDef[]) => {
    mut(root => { const n = fnd(root, id); if (n) { n.events = { ...(n.events || {}), [event]: actions }; } });
  }, [mut]);

  const updateBindings = useCallback((id: string, bindings: Record<string, string>) => {
    mut(root => {
      const n = fnd(root, id);
      if (!n) return;
      const merged = { ...(n.bindings || {}), ...bindings };
      // Remove keys with empty/undefined values so bindings are cleanly deleted
      n.bindings = Object.fromEntries(
        Object.entries(merged).filter(([, v]) => v !== undefined && v !== null && v !== '')
      );
      if (Object.keys(n.bindings).length === 0) n.bindings = undefined as any;
    });
  }, [mut]);

  const updateConditional = useCallback((id: string, cond: TreeNode['conditionalRender']) => {
    mut(root => { const n = fnd(root, id); if (n) n.conditionalRender = cond; });
  }, [mut]);

  const updateRepeat = useCallback((id: string, repeat: TreeNode['repeatBinding']) => {
    mut(root => { const n = fnd(root, id); if (n) n.repeatBinding = repeat; });
  }, [mut]);

  const updateSlotBinding = useCallback((id: string, slotProp: string, binding: NonNullable<TreeNode['slotBindings']>[string] | undefined) => {
    mut(root => {
      const n = fnd(root, id);
      if (!n) return;
      if (binding === undefined) {
        if (n.slotBindings) {
          const { [slotProp]: _, ...rest } = n.slotBindings;
          n.slotBindings = Object.keys(rest).length > 0 ? rest : undefined;
        }
      } else {
        n.slotBindings = { ...n.slotBindings, [slotProp]: binding };
      }
    });
  }, [mut]);

  const updateDataContext = useCallback((id: string, ctx: TreeNode['dataContext']) => {
    mut(root => { const n = fnd(root, id); if (n) n.dataContext = ctx; });
  }, [mut]);

  const updateAnimation = useCallback((id: string, anim: AnimationConfig | undefined) => {
    mut(root => { const n = fnd(root, id); if (n) n.animation = anim; });
  }, [mut]);

  const addPageState = useCallback((ps: PageState) => {
    setProject(prev => {
      if (!prev) return prev;
      const pages = prev.pages.map(pg => {
        if (pg.id !== pageId) return pg;
        const state = [...(pg.state || []), ps];
        const u = { ...pg, state, updatedAt: new Date().toISOString() };
        save(u);
        return u;
      });
      return { ...prev, pages };
    });
  }, [pageId, save]);

  const removePageState = useCallback((name: string) => {
    setProject(prev => {
      if (!prev) return prev;
      const pages = prev.pages.map(pg => {
        if (pg.id !== pageId) return pg;
        const state = (pg.state || []).filter(s => s.name !== name);
        const u = { ...pg, state, updatedAt: new Date().toISOString() };
        save(u);
        return u;
      });
      return { ...prev, pages };
    });
  }, [pageId, save]);

  const updatePageState = useCallback((name: string, updates: Partial<PageState>) => {
    setProject(prev => {
      if (!prev) return prev;
      const pages = prev.pages.map(pg => {
        if (pg.id !== pageId) return pg;
        const state = (pg.state || []).map(s => s.name === name ? { ...s, ...updates } : s);
        const u = { ...pg, state, updatedAt: new Date().toISOString() };
        save(u);
        return u;
      });
      return { ...prev, pages };
    });
  }, [pageId, save]);

  const startMove = useCallback((id: string) => { setMovingId(id); }, []);
  const cancelMove = useCallback(() => { setMovingId(null); }, []);

  const dropInto = useCallback((parentId: string, index: number, slotName?: string) => {
    if (!movingId) return;
    const mid = movingId;
    setMovingId(null);
    mut(root => {
      if (!fnd(root, mid)) return;
      const snapshot = JSON.parse(JSON.stringify(fnd(root, mid)));
      if (slotName !== undefined) snapshot.slotName = slotName;
      else delete snapshot.slotName;
      deepRemove(root, mid);
      const target = fnd(root, parentId) || root;
      target.children = target.children || [];
      const safeIdx = Math.min(index, target.children.length);
      if (!target.children.some((c: TreeNode) => c.id === snapshot.id)) {
        target.children.splice(safeIdx, 0, snapshot);
      }
    });
  }, [movingId, mut]);

  const moveUp = useCallback((id: string) => {
    mut(root => {
      const parent = fpar(root, id);
      if (!parent) return;
      const idx = parent.children.findIndex(c => c.id === id);
      if (idx <= 0) return;
      [parent.children[idx - 1], parent.children[idx]] = [parent.children[idx], parent.children[idx - 1]];
    });
  }, [mut]);

  const moveDown = useCallback((id: string) => {
    mut(root => {
      const parent = fpar(root, id);
      if (!parent) return;
      const idx = parent.children.findIndex(c => c.id === id);
      if (idx < 0 || idx >= parent.children.length - 1) return;
      [parent.children[idx], parent.children[idx + 1]] = [parent.children[idx + 1], parent.children[idx]];
    });
  }, [mut]);

  const addPage = useCallback(async (name: string) => {
    const pg = await api<PageDoc>('POST', '/pages', { name, layoutId: 'RootLayout' });
    setProject(prev => {
      if (!prev) return prev;
      const pages = [...prev.pages, pg];
      const screens = [...(prev.navigation?.screens || []), { name, pageId: pg.id }];
      // Auto-assign new page to the default group (first group).
      // If no group exists, create a default tabs group.
      let screenGroups = prev.screenGroups || [];
      if (screenGroups.length === 0) {
        screenGroups = [{ id: 'grp_default', name: 'tabs', type: 'tabs', screenIds: [pg.id] }];
      } else {
        const defaultGroup = screenGroups[0];
        screenGroups = screenGroups.map((g, i) =>
          i === 0 ? { ...g, screenIds: [...(g.screenIds || []), pg.id] } : g
        );
      }
      const next = { ...prev, pages, navigation: { ...prev.navigation, screens }, screenGroups };
      api('PUT', '/project', next);
      return next;
    });
    setPageId(pg.id);
  }, []);
  const deletePage = useCallback(async (id: string) => {
    await api('DELETE', '/pages/' + id);
    setProject(prev => {
      if (!prev) return prev;
      const pages = prev.pages.filter(p => p.id !== id);
      const screens = (prev.navigation?.screens || []).filter(s => s.pageId !== id);
      // Also remove from any group's screenIds
      const screenGroups = (prev.screenGroups || []).map(g => ({
        ...g, screenIds: (g.screenIds || []).filter((sid: string) => sid !== id),
      }));
      if (pageId === id) setPageId(pages[0]?.id || null);
      const next = { ...prev, pages, navigation: { ...prev.navigation, screens }, screenGroups };
      api('PUT', '/project', next);
      return next;
    });
  }, [pageId]);
  const renamePage = useCallback(async (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      const result = await api<{ id: string; name: string; route: string; oldRoute: string }>(
        'PUT', `/pages/${id}/rename`, { name: trimmed }
      );
      // Apply the server's authoritative result to local state
      setProject(prev => {
        if (!prev) return prev;
        const pages = prev.pages.map(p =>
          p.id === id ? { ...p, name: result.name, route: result.route } : p
        );
        const screens = (prev.navigation?.screens || []).map((s: any) =>
          s.pageId === id ? { ...s, name: result.name } : s
        );
        return { ...prev, pages, navigation: { ...prev.navigation, screens } };
      });
    } catch (e: any) {
      console.error('[renamePage]', e.message);
    }
  }, []);
  const updateProject = useCallback(async (u: Partial<ProjectDoc>) => { setProject(prev => { if (!prev) return prev; const next = { ...prev, ...u }; api('PUT', '/project', next); return next; }); }, []);
  const resetProject = useCallback(async () => {
    const fresh = await api<ProjectDoc>('POST', '/project/reset');
    if (!fresh.pages?.length) {
      const pg = await api<PageDoc>('POST', '/pages', { name: 'Home', layoutId: 'RootLayout' });
      fresh.pages = [pg];
      fresh.navigation = { type: 'tabs', screens: [{ name: 'Home', pageId: pg.id }] };
      fresh.screenGroups = [{ id: 'grp_default', name: 'tabs', type: 'tabs', screenIds: [pg.id] }];
    } else if (!fresh.screenGroups?.length) {
      // Migrate: put all existing pages into a default tabs group
      fresh.screenGroups = [{ id: 'grp_default', name: 'tabs', type: 'tabs', screenIds: fresh.pages.map((p: any) => p.id) }];
    }
    if (!fresh.themeOverrides) fresh.themeOverrides = {};
    if (!fresh.variables) fresh.variables = [];
    if (!fresh.slug) fresh.slug = 'my-app';
    if (!fresh.bundleId) fresh.bundleId = 'com.example.app';
    if (!fresh.orientation) fresh.orientation = 'portrait';
    setProject(fresh);
    setPageId(fresh.pages[0]?.id || null);
    setSel(null);
  }, [setSel]);
  const generate = useCallback(async () => { const r = await api<{ files: string[] }>('POST', '/generate'); return r.files; }, []);

  const [templates, setTemplates] = useState<CustomTemplate[]>([]);

  const saveAsTemplate = useCallback((nodeId: string, name: string, category: string = 'custom') => {
    const pg = page();
    if (!pg) return;
    const n = fnd(pg.root, nodeId);
    if (!n) return;
    const tpl: CustomTemplate = { id: 'tpl_' + Date.now(), name, category, tree: JSON.parse(JSON.stringify(n)), createdAt: new Date().toISOString() };
    setTemplates(prev => [...prev, tpl]);
  }, [page]);

  const removeTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  const addFromTemplate = useCallback((parentId: string, templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return;
    const clone = JSON.parse(JSON.stringify(tpl.tree));
    const reId = (n: TreeNode) => { n.id = gid(); for (const c of n.children) reId(c); };
    reId(clone);
    mut(root => { const t = fnd(root, parentId) || root; t.children.push(clone); });
    setSel(clone.id);
  }, [templates, mut, setSel]);

  const addScreenGroup = useCallback((g: ScreenGroup) => {
    setProject(prev => { if (!prev) return prev; const next = { ...prev, screenGroups: [...(prev.screenGroups || []), g] }; api('PUT', '/project', next); return next; });
  }, []);
  const removeScreenGroup = useCallback((id: string) => {
    setProject(prev => { if (!prev) return prev; const next = { ...prev, screenGroups: (prev.screenGroups || []).filter(g => g.id !== id) }; api('PUT', '/project', next); return next; });
  }, []);
  const updateScreenGroup = useCallback((id: string, u: Partial<ScreenGroup>) => {
    setProject(prev => { if (!prev) return prev; const next = { ...prev, screenGroups: (prev.screenGroups || []).map(g => g.id === id ? { ...g, ...u } : g) }; api('PUT', '/project', next); return next; });
  }, []);
  const addGlobalState = useCallback((g: GlobalStateVar) => {
    setProject(prev => { if (!prev) return prev; const next = { ...prev, globalState: [...(prev.globalState || []), g] }; api('PUT', '/project', next); return next; });
  }, []);
  const removeGlobalState = useCallback((name: string) => {
    setProject(prev => { if (!prev) return prev; const next = { ...prev, globalState: (prev.globalState || []).filter(g => g.name !== name) }; api('PUT', '/project', next); return next; });
  }, []);
  const addConstant = useCallback((c: AppConstant) => {
    setProject(prev => { if (!prev) return prev; const next = { ...prev, constants: [...(prev.constants || []), c] }; api('PUT', '/project', next); return next; });
  }, []);
  const removeConstant = useCallback((key: string) => {
    setProject(prev => { if (!prev) return prev; const next = { ...prev, constants: (prev.constants || []).filter(c => c.key !== key) }; api('PUT', '/project', next); return next; });
  }, []);

  const value = useMemo<Ctx>(() => ({
    reg, project, pageId, selId, zoom, device, movingId, targetSlot, libTab, rightTab, bottomTab,
    setPageId, setSel, setZoom, setDevice, setLibTab, setRightTab, setBottomTab,
    selectSlot, startMove, cancelMove, dropInto, moveUp, moveDown,
    addNode, removeNode, moveNode, updateProp, updateStyles, addVariable, updateVariable, removeVariable,
    updateEvents, updateBindings, updateConditional, updateRepeat, updateSlotBinding, updateDataContext, updateAnimation, addPageState, removePageState, updatePageState,
    undo, redo, canUndo, canRedo,
    copyNode, pasteNode, duplicateNode, clipboard,
    previewMode, setPreviewMode,
    addQuery, updateQuery, removeQuery,
    addPage, deletePage, renamePage, updateProject, resetProject, generate, page, node, meta,
    templates, saveAsTemplate, removeTemplate, addFromTemplate,
    addScreenGroup, removeScreenGroup, updateScreenGroup,
    addGlobalState, removeGlobalState, addConstant, removeConstant,
  }), [reg, project, pageId, selId, zoom, device, movingId, targetSlot, libTab, rightTab, bottomTab, selectSlot, startMove, cancelMove, dropInto, moveUp, moveDown, addNode, removeNode, moveNode, updateProp, updateStyles, addVariable, updateVariable, removeVariable, updateEvents, updateBindings, updateConditional, updateRepeat, updateAnimation, addPageState, removePageState, updatePageState, undo, redo, canUndo, canRedo, copyNode, pasteNode, duplicateNode, clipboard, previewMode, setPreviewMode, addQuery, updateQuery, removeQuery, addPage, deletePage, updateProject, resetProject, generate, page, node, meta, setSel, templates, saveAsTemplate, removeTemplate, addFromTemplate, addScreenGroup, removeScreenGroup, updateScreenGroup, addGlobalState, removeGlobalState, addConstant, removeConstant]);

  if (!project) return null;
  return <C.Provider value={value}>{children}</C.Provider>;
};
