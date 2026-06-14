import { StateCreator } from 'zustand';
import { TreeNode } from '../tree/types';
import { produce } from 'immer';

// Utility to generate a short random ID
export const gid = () => Math.random().toString(36).substring(2, 9);

function fnd(r: TreeNode, id: string): TreeNode | null {
  if (r.id === id) return r;
  for (const c of (r.children || [])) {
    const f = fnd(c, id);
    if (f) return f;
  }
  return null;
}

function fpar(r: TreeNode, id: string): TreeNode | null {
  for (const c of (r.children || [])) {
    if (c.id === id) return r;
    const f = fpar(c, id);
    if (f) return f;
  }
  return null;
}

function deepRemove(r: TreeNode, id: string): void {
  if (!r.children) return;
  r.children = r.children.filter(c => c.id !== id);
  for (const c of r.children) deepRemove(c, id);
}

export interface NodeSlice {
  clipboard: TreeNode | null;
  mutateTree: (fn: (root: TreeNode) => void) => void;
  addNode: (parentId: string, kind: string, rid: string, slotName?: string) => void;
  removeNode: (id: string) => void;
  updateProp: (id: string, k: string, v: any) => void;
  updateStyles: (id: string, styles: Record<string, any>) => void;
  moveNode: (id: string, newParentId: string, idx: number) => void;
  dropInto: (parentId: string, index: number, slotName?: string) => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  copyNode: (id: string) => void;
  pasteNode: (parentId: string) => void;
  duplicateNode: (id: string) => void;
}

export const createNodeSlice: StateCreator<NodeSlice & any, [], [], NodeSlice> = (set, get) => ({
  clipboard: null,
  mutateTree: (fn) => {
    const { project, pageId, saveHistory } = get();
    if (!project || !pageId) return;

    const pageIndex = project.pages.findIndex((p: any) => p.id === pageId);
    if (pageIndex === -1) return;

    const page = project.pages[pageIndex];
    
    // Save history before mutation
    saveHistory();

    // Mutate via immer
    const newRoot = produce(page.root, (draft: TreeNode) => {
      fn(draft);
    });

    const newProject = produce(project, (draft: any) => {
      draft.pages[pageIndex].root = newRoot;
      draft.pages[pageIndex].updatedAt = new Date().toISOString();
    });

    set({ project: newProject });
  },
  addNode: (parentId, kind, rid, slotName) => {
    const { mutateTree, setSel, setTargetSlot, reg } = get();
    const targetSlot = slotName || get().targetSlot;
    
    const m = (kind === 'layout' ? reg.layouts : kind === 'component' ? reg.components : kind === 'primitive' ? reg.primitives : reg.blocks).find((x: any) => x.id === rid);
    
    const n: TreeNode = { id: gid(), kind: kind as any, registryId: rid, props: {}, styles: { flex: 1 }, children: [] };
    if (targetSlot) n.slotName = targetSlot;
    
    if (m) {
      for (const p of (m.props as any) || []) if (p.default !== undefined) n.props[p.name] = p.default;
      if (m.variants?.length) n.variant = m.variants[0].name;
    }

    mutateTree((root: TreeNode) => {
      const p = fnd(root, parentId) || root;
      p.children.push(n);
    });

    setSel(n.id);
    if (setTargetSlot) setTargetSlot(null);
  },
  removeNode: (id) => {
    const { mutateTree, selId, setSel } = get();
    mutateTree((root: TreeNode) => {
      deepRemove(root, id);
    });
    if (selId === id) setSel(null);
  },
  updateProp: (id, k, v) => {
    get().mutateTree((root: TreeNode) => {
      const n = fnd(root, id);
      if (!n) return;
      if (k === '__variant__') n.variant = v;
      else n.props[k] = v;
    });
  },
  updateStyles: (id, styles) => {
    get().mutateTree((root: TreeNode) => {
      const n = fnd(root, id);
      if (!n) return;
      n.styles = { ...(n.styles || {}), ...styles };
    });
  },
  moveNode: (id, newParentId, idx) => {
    get().mutateTree((root: TreeNode) => {
      const n = fnd(root, id); if (!n) return;
      // remove from old parent
      const oldP = fpar(root, id); if (oldP) oldP.children = oldP.children.filter((c: any) => c.id !== id);
      // add to new parent
      const newP = fnd(root, newParentId) || root;
      newP.children.splice(idx, 0, n as any); // immer proxy requires casting or just passing n
    });
  },
  dropInto: (parentId, index, slotName) => {
    const { movingId, mutateTree, setMovingId } = get();
    if (!movingId) return;
    const mid = movingId;
    if (setMovingId) setMovingId(null);
    mutateTree((root: TreeNode) => {
      const n = fnd(root, mid);
      if (!n) return;
      const snapshot = JSON.parse(JSON.stringify(n));
      if (slotName !== undefined) snapshot.slotName = slotName;
      else delete snapshot.slotName;
      deepRemove(root, mid);
      const target = fnd(root, parentId) || root;
      target.children = target.children || [];
      const safeIdx = Math.min(index, target.children.length);
      if (!target.children.some((c: any) => c.id === snapshot.id)) {
        target.children.splice(safeIdx, 0, snapshot);
      }
    });
  },
  moveUp: (id) => {
    get().mutateTree((root: TreeNode) => {
      const p = fpar(root, id);
      if (!p) return;
      const idx = p.children.findIndex((c: any) => c.id === id);
      if (idx <= 0) return;
      [p.children[idx - 1], p.children[idx]] = [p.children[idx], p.children[idx - 1]];
    });
  },
  moveDown: (id) => {
    get().mutateTree((root: TreeNode) => {
      const p = fpar(root, id);
      if (!p) return;
      const idx = p.children.findIndex((c: any) => c.id === id);
      if (idx < 0 || idx >= p.children.length - 1) return;
      [p.children[idx], p.children[idx + 1]] = [p.children[idx + 1], p.children[idx]];
    });
  },
  copyNode: (id) => {
    const { project, pageId } = get();
    if (!project || !pageId) return;
    const page = project.pages.find((p: any) => p.id === pageId);
    if (!page) return;
    const n = fnd(page.root, id);
    if (n) set({ clipboard: JSON.parse(JSON.stringify(n)) });
  },
  pasteNode: (parentId) => {
    const { clipboard, mutateTree, setSel } = get();
    if (!clipboard) return;
    const clone = JSON.parse(JSON.stringify(clipboard));
    const reId = (n: TreeNode) => { n.id = gid(); for (const c of (n.children || [])) reId(c); };
    reId(clone);
    mutateTree((root: TreeNode) => {
      const t = fnd(root, parentId) || root;
      t.children.push(clone);
    });
    setSel(clone.id);
  },
  duplicateNode: (id) => {
    const { project, pageId, mutateTree, setSel } = get();
    if (!project || !pageId) return;
    const page = project.pages.find((p: any) => p.id === pageId);
    if (!page) return;
    const n = fnd(page.root, id);
    if (!n) return;
    const clone = JSON.parse(JSON.stringify(n));
    const reId = (nd: TreeNode) => { nd.id = gid(); for (const c of (nd.children || [])) reId(c); };
    reId(clone);
    mutateTree((root: TreeNode) => {
      const p = fpar(root, id);
      if (!p) return;
      const idx = p.children.findIndex((c: any) => c.id === id);
      p.children.splice(idx + 1, 0, clone);
    });
    setSel(clone.id);
  },
});
