import React from 'react';
import type { UiName, UiProps } from '../contract';
import { useAdapter } from '../providers/provider';
import { componentsOf } from './resolve';

/** A component that renders, at each render, the one the mounted provider offers (flipova's when it has none). */
export function createUi<K extends UiName>(name: K) {
  const Resolved = (props: UiProps[K]) => {
    const Component = componentsOf(useAdapter())[name] as unknown as React.ComponentType<UiProps[K]>;
    return <Component {...props} />;
  };
  Resolved.displayName = `Ui.${name}`;
  return Resolved;
}
