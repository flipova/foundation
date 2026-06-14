import { StateCreator } from 'zustand';

export interface HistorySlice {
  past: any[];
  future: any[];
  canUndo: boolean;
  canRedo: boolean;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 50;

export const createHistorySlice: StateCreator<HistorySlice & any, [], [], HistorySlice> = (set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  saveHistory: () => set((state: HistorySlice & any) => {
    const currentState = {
      project: state.project ? JSON.parse(JSON.stringify(state.project)) : null,
      activePageId: state.activePageId,
      selectedNodeId: state.selectedNodeId
    };

    const newPast = [...state.past, currentState].slice(-MAX_HISTORY);
    return { past: newPast, future: [], canUndo: true, canRedo: false };
  }),

  undo: () => set((state: HistorySlice & any) => {
    if (state.past.length === 0) return state;

    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);

    const currentState = {
      project: state.project ? JSON.parse(JSON.stringify(state.project)) : null,
      activePageId: state.activePageId,
      selectedNodeId: state.selectedNodeId
    };

    return {
      past: newPast,
      future: [currentState, ...state.future],
      canUndo: newPast.length > 0,
      canRedo: true,
      project: previous.project,
      activePageId: previous.activePageId,
      selectedNodeId: previous.selectedNodeId
    };
  }),

  redo: () => set((state: HistorySlice & any) => {
    if (state.future.length === 0) return state;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    const currentState = {
      project: state.project ? JSON.parse(JSON.stringify(state.project)) : null,
      activePageId: state.activePageId,
      selectedNodeId: state.selectedNodeId
    };

    return {
      past: [...state.past, currentState],
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
      project: next.project,
      activePageId: next.activePageId,
      selectedNodeId: next.selectedNodeId
    };
  })
});
