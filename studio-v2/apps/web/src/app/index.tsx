import React, { useEffect, useRef } from 'react';
import StudioLayout from '../ui/layout/index';
import { useStudioStore } from '@flipova/studio-core';
import { layoutRegistry }   from '@flipova/foundation/layout/registry/layouts';
import { componentRegistry } from '@flipova/foundation/layout/registry/components';
import { blockRegistry }     from '@flipova/foundation/layout/registry/blocks';
import { primitiveRegistry } from '@flipova/foundation/layout/registry/primitives';

function makeDefaultPage() {
  const now = new Date().toISOString();
  const id = 'page_home';
  return {
    id,
    name: 'Home',
    route: 'home',
    root: {
      id: 'root_home',
      kind: 'layout' as const,
      registryId: 'RootLayout',
      props: { background: undefined, scrollable: true },
      styles: { flex: 1 },
      children: [],
    },
    createdAt: now,
    updatedAt: now,
  };
}

export default function StudioScreen() {
  const setProject  = useStudioStore(s => s.setProject);
  const setRegistry = useStudioStore(s => s.setRegistry);
  const setPageId   = useStudioStore(s => s.setPageId);
  const project     = useStudioStore(s => s.project);
  const pageId      = useStudioStore(s => s.pageId);
  const isLoaded    = useRef(false);

  // Populate registry from foundation — pure client-side, no API needed
  useEffect(() => {
    setRegistry({
      layouts:    layoutRegistry,
      components: componentRegistry,
      blocks:     blockRegistry,
      primitives: primitiveRegistry,
    });
  }, [setRegistry]);

  // Load project from disk on mount
  useEffect(() => {
    fetch('/api/project/state')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.project) {
          const proj = data.project;
          // Ensure at least one screen exists
          if (!proj.pages || proj.pages.length === 0) {
            const defaultPage = makeDefaultPage();
            proj.pages = [defaultPage];
            proj.navigation = proj.navigation || { type: 'stack', screens: [] };
            if (!proj.navigation.screens.find((s: any) => s.pageId === defaultPage.id)) {
              proj.navigation.screens = [{ name: 'Home', pageId: defaultPage.id, route: 'home' }];
            }
          }
          setProject(proj);
          // Activate first page if none is selected
          setPageId(proj.pages[0].id);
        } else {
          const defaultPage = makeDefaultPage();
          setProject({
            id: crypto.randomUUID ? crypto.randomUUID() : '1',
            name: 'My App',
            slug: 'my-app',
            version: '1.0.0',
            theme: 'light',
            pages: [defaultPage],
            services: [{
              id: 'jsonplaceholder',
              type: 'rest',
              name: 'JSONPlaceholder (Demo)',
              config: { baseUrl: 'https://jsonplaceholder.typicode.com' }
            }],
            queries: [{
              id: 'users_query',
              name: 'Get Users',
              serviceId: 'jsonplaceholder',
              method: 'GET',
              path: '/users',
              alias: 'users',
              autoFetch: true
            }],
            navigation: { type: 'stack', screens: [{ name: 'Home', pageId: defaultPage.id, route: 'home' }] },
          } as any);
          setPageId(defaultPage.id);
        }
        isLoaded.current = true;
      })
      .catch(() => {
        const defaultPage = makeDefaultPage();
        setProject({
          id: '1',
          name: 'My App',
          slug: 'my-app',
          version: '1.0.0',
          theme: 'light',
          pages: [defaultPage],
          services: [{
            id: 'jsonplaceholder',
            type: 'rest',
            name: 'JSONPlaceholder (Demo)',
            config: { baseUrl: 'https://jsonplaceholder.typicode.com' }
          }],
          queries: [{
            id: 'users_query',
            name: 'Get Users',
            serviceId: 'jsonplaceholder',
            method: 'GET',
            path: '/users',
            alias: 'users',
            autoFetch: true
          }],
          navigation: { type: 'stack', screens: [{ name: 'Home', pageId: defaultPage.id, route: 'home' }] },
        } as any);
        setPageId(defaultPage.id);
        isLoaded.current = true;
      });
  }, [setProject, setPageId]);

  // Auto-save and auto-generate project whenever it changes (debounced 800ms)
  useEffect(() => {
    if (!isLoaded.current || !project) return;
    const timer = setTimeout(async () => {
      try {
        await fetch('/api/project/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project),
        });
        
        await fetch('/api/project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(project),
        });
      } catch (err) {
        console.warn('[Studio] Auto-save/generate failed:', err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [project]);

  return <StudioLayout />;
}