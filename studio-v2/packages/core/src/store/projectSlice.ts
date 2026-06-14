import { StateCreator } from 'zustand';
import { ProjectDocument, PageDocument, Reg, CustomTemplate } from '../tree/types';

export interface ProjectSlice {
  project: ProjectDocument | null;
  reg: Reg;
  templates: CustomTemplate[];
  setProject: (project: ProjectDocument) => void;
  setRegistry: (reg: Reg) => void;
  updateProject: (updates: Partial<ProjectDocument>) => void;
  addPage: (page: PageDocument) => void;
  removePage: (id: string) => void;
  renamePage: (id: string, name: string, route: string) => void;
}

export const createProjectSlice: StateCreator<ProjectSlice & any, [], [], ProjectSlice> = (set, get) => ({
  project: null,
  reg: { layouts: [], components: [], blocks: [], primitives: [] },
  templates: [],
  setProject: (project: ProjectDocument) => set({ project }),
  setRegistry: (reg: Reg) => set({ reg }),
  updateProject: (updates: Partial<ProjectDocument>) => set((state: ProjectSlice) => ({
    project: state.project ? { ...state.project, ...updates } : null
  })),
  addPage: (page: PageDocument) => set((state: ProjectSlice) => {
    if (!state.project) return {};
    return { project: { ...state.project, pages: [...state.project.pages, page] } };
  }),
  removePage: (id: string) => set((state: ProjectSlice) => {
    if (!state.project) return {};
    return { project: { ...state.project, pages: state.project.pages.filter((p: PageDocument) => p.id !== id) } };
  }),
  renamePage: (id: string, name: string, route: string) => set((state: ProjectSlice) => {
    if (!state.project) return {};
    return {
      project: {
        ...state.project,
        pages: state.project.pages.map((p: PageDocument) => p.id === id ? { ...p, name, route } : p)
      }
    };
  }),
});
