import { useMemo } from 'react';
import FlatListMeta from './FlatList.meta.yaml';

/**
 * Props for the FlatList component.
 */
export interface FlatListProps {
  /**
   * An array of data objects to be rendered as a list.
   */
  data: any[];
  /**
   * Function that takes an item from the data array and returns a React element to render.
   */
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactNode;
  /**
   * Function to extract a unique key for a given item at the specified index.
   * If not provided, it defaults to using `item.id` or the index as a fallback.
   */
  keyExtractor?: (item: any, index: number) => string;
  /**
   * If true, renders items horizontally instead of vertically.
   */
  horizontal?: boolean;
  /**
   * Additional properties to pass directly to the React Native FlatList.
   */
  [key: string]: any;
}

export function useFlatListLogic(props: FlatListProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (FlatListMeta?.props) {
      FlatListMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { data = [], renderItem, keyExtractor, horizontal, ...rest } = merged;

  const safeKeyExtractor = keyExtractor || ((item: any, index: number) => item?.id || String(index));

  return { data, renderItem, keyExtractor: safeKeyExtractor, horizontal, rest };
}
