import { useMemo, useState, useCallback } from 'react';
import TabsMeta from './Tabs.meta.yaml';

/**
 * Props for the Tabs component.
 */
export interface TabsProps {
  /**
   * An array of tab objects. Each tab must have a unique `key`, a `title` for the tab label,
   * and an optional `content` node to display when active.
   */
  tabs: { key: string; title: string; content?: React.ReactNode }[];

  /**
   * The key of the tab that should be active by default upon initial render.
   */
  defaultActiveKey?: string;

  /**
   * Callback invoked when the user selects a different tab.
   * Receives the key of the newly selected tab.
   */
  onChange?: (key: string) => void;

  /**
   * Additional custom props that will be passed down to the root container.
   */
  [key: string]: any;
}

export function useTabsLogic(props: TabsProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (TabsMeta?.props) {
      TabsMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { tabs = [], defaultActiveKey, onChange, ...rest } = merged;

  const initialKey = defaultActiveKey || (tabs.length > 0 ? tabs[0].key : '');
  const [activeKey, setActiveKey] = useState(initialKey);

  const handleTabPress = useCallback((key: string) => {
    setActiveKey(key);
    onChange?.(key);
  }, [onChange]);

  return { tabs, activeKey, handleTabPress, rest };
}
