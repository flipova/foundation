import React from 'react';
import { FlatList as RNFlatList } from 'react-native';
import type { FlatListProps } from '../../contract';

export function FlatList(p: FlatListProps) {
  return (
    <RNFlatList
      testID={p.testID}
      data={p.data}
      horizontal={p.horizontal}
      keyExtractor={p.keyExtractor ?? ((_, i) => String(i))}
      renderItem={({ item, index }) => <>{p.renderItem(item, index)}</>}
      ListEmptyComponent={p.empty ? <>{p.empty}</> : undefined}
    />
  );
}
