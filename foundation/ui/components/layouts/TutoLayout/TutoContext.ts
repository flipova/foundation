import { createContext, useContext, RefObject } from 'react';
import { LayoutRectangle, View } from 'react-native';

export type TutoElementRegistry = Map<string, LayoutRectangle>;

export interface TutoContextType {
  /** Register a component's layout rectangle */
  registerElement: (id: string, layout: LayoutRectangle) => void;
  /** Unregister a component */
  unregisterElement: (id: string) => void;
  /** The current registry map */
  registry: TutoElementRegistry;
  /** Reference to the root layout view for relative measurements */
  rootRef: any;
}

export const TutoContext = createContext<TutoContextType | null>(null);

export const useTutoContext = () => {
  const ctx = useContext(TutoContext);
  if (!ctx) {
    throw new Error('useTutoContext must be used within a TutoLayout');
  }
  return ctx;
};
