import React, { useState, useEffect } from 'react';

/**
 * Props for the SortableGridLayout component.
 * 
 * @typeParam T - The type of data items in the grid.
 */
export interface SortableGridLayoutProps<T> {
  /** 
   * The list of data items to render. 
   */
  data: T[];
  
  /** 
   * Function to extract a unique key from an item. 
   */
  keyExtractor: (item: T, index: number) => string;
  
  /** 
   * Function to render each item. 
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  
  /** 
   * Number of columns in the grid. Default is 3. 
   */
  columns?: number;
  
  /** 
   * Spacing between items in pixels. Default is 8. 
   */
  spacing?: number;
  
  /** 
   * Callback fired when items are successfully reordered. 
   */
  onReorder?: (newData: T[]) => void;
  
  /** Any other props for the container View. */
  [key: string]: any;
}

export function useSortableGridLayoutLogic<T>(rawProps: SortableGridLayoutProps<T>) {
  const {
    data,
    keyExtractor,
    renderItem,
    columns = 3,
    spacing = 8,
    onReorder,
    ...rest
  } = rawProps;

  const [items, setItems] = useState<T[]>(data);

  // Sync state if external prop changes
  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleReorder = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
    onReorder?.(newItems);
  };

  return {
    items,
    keyExtractor,
    renderItem,
    columns,
    spacing,
    handleReorder,
    rest
  };
}
