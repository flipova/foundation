import React, { createContext, useContext, useEffect, useId, useState, type ReactNode } from 'react';
import { View } from 'react-native';
import type { PortalProps } from '../../../contract';

interface Host {
  set(id: string, node: ReactNode): void;
  remove(id: string): void;
}
const HostContext = createContext<Host | null>(null);

/** Mounted once by the flipova Provider: whatever <Portal> receives is drawn here, above the rest of the tree. */
export function PortalHost({ children }: { children?: ReactNode }) {
  const [nodes, setNodes] = useState<Array<[string, ReactNode]>>([]);
  const [host] = useState<Host>(() => ({
    set: (id, node) =>
      setNodes((all) =>
        all.some(([k]) => k === id) ? all.map((e) => (e[0] === id ? [id, node] : e)) : [...all, [id, node]],
      ),
    remove: (id) => setNodes((all) => all.filter(([k]) => k !== id)),
  }));
  return (
    <HostContext.Provider value={host}>
      {children}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        {nodes.map(([id, node]) => (
          <React.Fragment key={id}>{node}</React.Fragment>
        ))}
      </View>
    </HostContext.Provider>
  );
}

export function Portal({ children }: PortalProps) {
  const host = useContext(HostContext);
  const id = useId();
  useEffect(() => {
    host?.set(id, children);
  });
  useEffect(() => () => host?.remove(id), [host, id]);
  // without a host (no provider mounted) the children stay where they are
  return host ? null : <>{children}</>;
}
