import { useMemo, useEffect, useState } from 'react';
import KeyboardAvoidWrapperMeta from './KeyboardAvoidWrapper.meta.yaml';

export interface KeyboardAvoidWrapperProps {
  /** Extra offset above keyboard */
  offset?: number;
  [key: string]: any;
}

export function useKeyboardAvoidWrapperLogic(props: KeyboardAvoidWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (KeyboardAvoidWrapperMeta?.props) {
      KeyboardAvoidWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { offset, ...rest } = merged;

  return { offset: merged.offset, rest, children: merged.children };

}
