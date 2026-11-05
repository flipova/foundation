import React from 'react';
import { RefreshControl as RNRefreshControl } from 'react-native';
import type { RefreshControlProps } from '../../contract';
import { useResolvedTheme } from '../provider';

export function RefreshControl(p: RefreshControlProps) {
  const t = useResolvedTheme();
  return (
    <RNRefreshControl
      refreshing={p.refreshing}
      onRefresh={p.onRefresh}
      tintColor={t.colors.primary}
      colors={[t.colors.primary]}
    />
  );
}
