import { useMemo, useEffect, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import CollapsibleWrapperMeta from './CollapsibleWrapper.meta.yaml';

export interface CollapsibleWrapperProps {
  /** Whether the container is expanded */
  isExpanded?: boolean;
  [key: string]: any;
}

export function useCollapsibleWrapperLogic(props: CollapsibleWrapperProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (CollapsibleWrapperMeta?.props) {
      CollapsibleWrapperMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { isExpanded, ...rest } = merged;

  const [contentHeight, setContentHeight] = useState(0);
  const height = useSharedValue(0);
  
  useEffect(() => {
    height.value = withTiming(merged.isExpanded ? contentHeight : 0, { duration: 300 });
  }, [merged.isExpanded, contentHeight]);
  
  return { height, setContentHeight, rest, children: merged.children };

}
