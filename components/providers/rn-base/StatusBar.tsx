import React from 'react';
import { StatusBar as RNStatusBar } from 'react-native';
import type { StatusBarProps } from '../../contract';
import { useResolvedTheme } from '../provider';

export function StatusBar({ style = 'auto' }: StatusBarProps) {
  const t = useResolvedTheme();
  const bar =
    style === 'auto'
      ? t.mode === 'dark'
        ? 'light-content'
        : 'dark-content'
      : style === 'light'
        ? 'light-content'
        : 'dark-content';
  return <RNStatusBar barStyle={bar} />;
}
