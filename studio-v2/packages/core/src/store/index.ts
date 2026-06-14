import { create } from 'zustand';
import { ProjectSlice, createProjectSlice } from './projectSlice';
import { UiSlice, createUiSlice } from './uiSlice';
import { HistorySlice, createHistorySlice } from './historySlice';
import { NodeSlice, createNodeSlice } from './nodeSlice';

export type StudioState = ProjectSlice & UiSlice & HistorySlice & NodeSlice;

export const useStudioStore = create<StudioState>()((set, get, store) => ({
  ...createProjectSlice(set, get, store),
  ...createUiSlice(set, get, store),
  ...createHistorySlice(set, get, store),
  ...createNodeSlice(set, get, store),
}));
