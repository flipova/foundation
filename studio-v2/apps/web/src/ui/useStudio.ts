import { useStudioStore, TreeNode, ActionDef, AnimationConfig, PageState, RegItem, PageDocument } from '@flipova/studio-core';

function fnd(r: TreeNode, id: string): TreeNode | null {
  if (r.id === id) return r;
  for (const c of (r.children || [])) {
    const f = fnd(c, id);
    if (f) return f;
  }
  return null;
}

export function useStudio() {
  const store = useStudioStore();

  const triggerSettingsModal = () => {
    window.dispatchEvent(new Event('open-settings'));
  };

  const updateNodeProps = (id: string, updater: (node: TreeNode) => void) => {
    store.mutateTree((root: TreeNode) => {
      const node = fnd(root, id);
      if (node) updater(node);
    });
  };

  const updateEvents = (id: string, event: string, actions: ActionDef[]) => {
    updateNodeProps(id, (node) => {
      node.events = node.events || {};
      node.events[event] = actions;
    });
  };

  const updateBindings = (id: string, bindings: Record<string, string>) => {
    updateNodeProps(id, (node) => {
      node.bindings = { ...(node.bindings || {}), ...bindings };
      // Remove empty bindings
      Object.keys(node.bindings).forEach(k => {
        if (!node.bindings![k]) delete node.bindings![k];
      });
    });
  };

  const updateConditional = (id: string, cond: TreeNode['conditionalRender']) => {
    updateNodeProps(id, (node) => {
      node.conditionalRender = cond;
    });
  };

  const updateRepeat = (id: string, repeat: TreeNode['repeatBinding']) => {
    updateNodeProps(id, (node) => {
      node.repeatBinding = repeat;
    });
  };

  const updateSlotBinding = (id: string, slotProp: string, binding: NonNullable<TreeNode['slotBindings']>[string] | undefined) => {
    updateNodeProps(id, (node) => {
      node.slotBindings = node.slotBindings || {};
      if (binding) {
        node.slotBindings[slotProp] = binding;
      } else {
        delete node.slotBindings[slotProp];
      }
    });
  };

  const updateDataContext = (id: string, ctx: TreeNode['dataContext']) => {
    updateNodeProps(id, (node) => {
      node.dataContext = ctx;
    });
  };

  const updateAnimation = (id: string, anim: AnimationConfig | undefined) => {
    updateNodeProps(id, (node) => {
      node.animation = anim;
    });
  };

  const page = (): PageDocument | undefined => {
    if (!store.project || !store.pageId) return undefined;
    return store.project.pages.find((p: PageDocument) => p.id === store.pageId);
  };

  const node = (id: string): TreeNode | null => {
    const pg = page();
    if (!pg) return null;
    return fnd(pg.root, id);
  };

  const meta = (kind: string, rid: string): RegItem | undefined => {
    const arr = kind === 'layout' ? store.reg.layouts :
                kind === 'component' ? store.reg.components :
                kind === 'primitive' ? store.reg.primitives :
                store.reg.blocks;
    return arr?.find((x: RegItem) => x.id === rid);
  };

  const addPageState = (ps: PageState) => {
    const pg = page();
    if (!pg) return;
    store.updateProject({
      pages: store.project!.pages.map((p: PageDocument) => {
        if (p.id === pg.id) {
          return { ...p, state: [...(p.state || []), ps] };
        }
        return p;
      })
    });
  };

  const removePageState = (name: string) => {
    const pg = page();
    if (!pg) return;
    store.updateProject({
      pages: store.project!.pages.map((p: PageDocument) => {
        if (p.id === pg.id) {
          return { ...p, state: (p.state || []).filter((s) => s.name !== name) };
        }
        return p;
      })
    });
  };

  const updatePageState = (name: string, updates: Partial<PageState>) => {
    const pg = page();
    if (!pg) return;
    store.updateProject({
      pages: store.project!.pages.map((p: PageDocument) => {
        if (p.id === pg.id) {
          return {
            ...p,
            state: (p.state || []).map((s) => s.name === name ? { ...s, ...updates } : s)
          };
        }
        return p;
      })
    });
  };

  // ── Page management ────────────────────────────────────────────────────────

  const addPage = (name: string) => {
    const now = new Date().toISOString();
    const id = 'page_' + Math.random().toString(36).substring(2, 9);
    const route = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newPage: PageDocument = {
      id,
      name,
      route,
      root: {
        id: 'root_' + Math.random().toString(36).substring(2, 9),
        kind: 'layout',
        registryId: 'RootLayout',
        props: { background: undefined, scrollable: true },
        styles: { flex: 1 },
        children: [],
      },
      createdAt: now,
      updatedAt: now,
    };
    store.addPage(newPage);
    store.setPageId(id);
    // Also register in navigation.screens so TabBar / navigate actions can reference it
    const navScreens = store.project?.navigation?.screens || [];
    if (!navScreens.find((s: any) => s.pageId === id)) {
      store.updateProject({
        navigation: {
          ...(store.project?.navigation || { type: 'stack' }),
          screens: [...navScreens, { name, pageId: id, route }],
        },
      });
    }
  };

  const deletePage = (id: string) => {
    store.removePage(id);
    // If the deleted page was active, switch to the first remaining page
    if (store.pageId === id) {
      const remaining = store.project?.pages.filter((p: PageDocument) => p.id !== id) || [];
      store.setPageId(remaining[0]?.id || null);
    }
    // Also remove from any screen group
    const groups: any[] = (store.project as any)?.screenGroups || [];
    if (groups.some((g: any) => (g.screenIds || []).includes(id))) {
      store.updateProject({
        screenGroups: groups.map((g: any) => ({
          ...g,
          screenIds: (g.screenIds || []).filter((s: string) => s !== id),
        })),
      } as any);
    }
    // Remove from navigation.screens
    const navScreens = store.project?.navigation?.screens || [];
    store.updateProject({
      navigation: {
        ...(store.project?.navigation || { type: 'stack' }),
        screens: navScreens.filter((s: any) => s.pageId !== id),
      },
    });
  };

  const renamePage = (id: string, name: string, route: string) => {
    store.renamePage(id, name, route);
    // Keep navigation.screens in sync
    const navScreens = store.project?.navigation?.screens || [];
    store.updateProject({
      navigation: {
        ...(store.project?.navigation || { type: 'stack' }),
        screens: navScreens.map((s: any) =>
          s.pageId === id ? { ...s, name, route } : s
        ),
      },
    });
  };

  // ── Screen groups ───────────────────────────────────────────────────────────

  const addScreenGroup = (group: any) => {
    const groups: any[] = (store.project as any)?.screenGroups || [];
    store.updateProject({ screenGroups: [...groups, group] } as any);
  };

  const removeScreenGroup = (id: string) => {
    const groups: any[] = (store.project as any)?.screenGroups || [];
    store.updateProject({ screenGroups: groups.filter((g: any) => g.id !== id) } as any);
  };

  const updateScreenGroup = (id: string, updates: any) => {
    const groups: any[] = (store.project as any)?.screenGroups || [];
    store.updateProject({
      screenGroups: groups.map((g: any) => g.id === id ? { ...g, ...updates } : g),
    } as any);
  };

  // ── Duplicate / Templates ───────────────────────────────────────────────────

  const duplicateNode = (id: string) => store.duplicateNode(id);

  const templates: any[] = store.templates || [];

  const saveAsTemplate = (nodeId: string, name: string) => {
    const pg = page();
    if (!pg) return;
    function fnd2(r: any, id: string): any {
      if (r.id === id) return r;
      for (const c of (r.children || [])) { const f = fnd2(c, id); if (f) return f; }
      return null;
    }
    const n = fnd2(pg.root, nodeId);
    if (!n) return;
    const tpl = {
      id: 'tpl_' + Math.random().toString(36).substring(2, 9),
      name,
      tree: JSON.parse(JSON.stringify(n)),
    };
    store.updateProject({ templates: [...(store.templates || []), tpl] } as any);
  };

  const addFromTemplate = (parentId: string, templateId: string) => {
    const tpl = (store.templates || []).find((t: any) => t.id === templateId);
    if (!tpl) return;
    const clone = JSON.parse(JSON.stringify(tpl.tree));
    const reId = (nd: any) => { nd.id = 'n_' + Math.random().toString(36).substring(2, 9); (nd.children || []).forEach(reId); };
    reId(clone);
    store.mutateTree((root: any) => {
      function fnd2(r: any, id: string): any {
        if (r.id === id) return r;
        for (const c of (r.children || [])) { const f = fnd2(c, id); if (f) return f; }
        return null;
      }
      const p = fnd2(root, parentId) || root;
      p.children.push(clone);
    });
    store.setSel(clone.id);
  };

  const removeTemplate = (id: string) => {
    store.updateProject({ templates: (store.templates || []).filter((t: any) => t.id !== id) } as any);
  };

  // ── Queries ─────────────────────────────────────────────────────────────────

  const addQuery = (q: any) => {
    const queries = store.project?.queries || [];
    store.updateProject({ queries: [...queries, q] });
  };

  const updateQuery = (id: string, updates: any) => {
    const queries = store.project?.queries || [];
    store.updateProject({ queries: queries.map((q: any) => q.id === id ? { ...q, ...updates } : q) });
  };

  const removeQuery = (id: string) => {
    const queries = store.project?.queries || [];
    store.updateProject({ queries: queries.filter((q: any) => q.id !== id) });
  };

  // ── Misc ────────────────────────────────────────────────────────────────────

  const generate = async () => {
    if (!store.project) return;
    try {
      // 1. Save state
      await fetch(`${API}/project/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store.project),
      });
      // 2. Generate local files
      await fetch(`${API}/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store.project),
      });
    } catch (e) {
      console.error("Generate failed:", e);
    }
  };
  const resetProject = async () => {
    try {
      await fetch('/api/project/state', { method: 'DELETE' });
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (e) {
      console.error("Reset failed:", e);
    }
  };

  return {
    ...store,
    triggerSettingsModal,
    updateEvents,
    updateBindings,
    updateConditional,
    updateRepeat,
    updateSlotBinding,
    updateDataContext,
    updateAnimation,
    page,
    node,
    meta,
    addPageState,
    removePageState,
    updatePageState,
    addPage,
    deletePage,
    renamePage,
    addScreenGroup,
    removeScreenGroup,
    updateScreenGroup,
    duplicateNode,
    addFromTemplate,
    removeTemplate,
    saveAsTemplate,
    templates,
    generate,
    resetProject,
    addQuery,
    updateQuery,
    removeQuery,
  };
}
