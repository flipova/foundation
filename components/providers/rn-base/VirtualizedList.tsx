import React from 'react';
import { VirtualizedList as RNVirtualizedList } from 'react-native';
import type { VirtualizedListProps } from '../../contract';

export function VirtualizedList(p: VirtualizedListProps) {
  return (
    <RNVirtualizedList
      testID={p.testID}
      data={p.data}
      horizontal={p.horizontal}
      getItem={(data: unknown[], index: number) => data[index]}
      getItemCount={(data: unknown[]) => data.length}
      keyExtractor={p.keyExtractor ?? ((_: unknown, i: number) => String(i))}
      renderItem={({ item, index }: { item: unknown; index: number }) => <>{p.renderItem(item, index)}</>}
      ListEmptyComponent={p.empty ? <>{p.empty}</> : undefined}
    />
  );
}
