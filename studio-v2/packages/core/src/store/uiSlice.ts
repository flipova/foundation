import { StateCreator } from 'zustand';

export interface UiSlice {
  pageId: string | null;
  selId: string | null;
  zoom: number;
  device: string;
  movingId: string | null;
  targetSlot: string | null;
  libTab: 'layouts' | 'components' | 'blocks' | 'primitives';
  rightTab: 'properties' | 'design' | 'config' | 'code';
  bottomTab: 'layers' | 'screens';
  previewMode: boolean;

  setPageId: (id: string | null) => void;
  setSel: (id: string | null) => void;
  setZoom: (z: number) => void;
  setDevice: (d: string) => void;
  setLibTab: (t: any) => void;
  setRightTab: (t: any) => void;
  setBottomTab: (t: any) => void;
  selectSlot: (parentId: string, slotName: string) => void;
  startMove: (id: string) => void;
  cancelMove: () => void;
  setPreviewMode: (v: boolean) => void;
}

export const createUiSlice: StateCreator<UiSlice & any, [], [], UiSlice> = (set) => ({
  pageId: null,
  selId: null,
  zoom: 90,
  device: 'iPhone 14 Pro',
  movingId: null,
  targetSlot: null,
  libTab: 'layouts',
  rightTab: 'properties',
  bottomTab: 'layers',
  previewMode: false,

  setPageId: (id) => set({ pageId: id }),
  setSel: (id) => set({ selId: id, targetSlot: null }),
  setZoom: (z) => set({ zoom: z }),
  setDevice: (d) => set({ device: d }),
  setLibTab: (t) => set({ libTab: t }),
  setRightTab: (t) => set({ rightTab: t }),
  setBottomTab: (t) => set({ bottomTab: t }),
  selectSlot: (parentId, slotName) => set({ selId: parentId, targetSlot: slotName }),
  startMove: (id) => set({ movingId: id }),
  cancelMove: () => set({ movingId: null }),
  setPreviewMode: (v) => set({ previewMode: v }),
});
