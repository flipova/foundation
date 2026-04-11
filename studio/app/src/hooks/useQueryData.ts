/**
 * useQueryData — Centralized query data fetching for the studio.
 *
 * Single source of truth for fetching query data in the studio UI.
 * Used by: SmartInput (LinkerModal Q tab), PropertiesPanel (item fields),
 *          PageQueryProvider (preview), RepeatRenderer (repeat preview).
 *
 * Caches results in module-level cache to avoid redundant fetches
 * across components that mount/unmount frequently.
 */
import React from 'react';
import { useStudio } from '../store/StudioProvider';

// Module-level cache — survives component re-renders
const queryCache: Record<string, { data: any; ts: number }> = {};
const CACHE_TTL_MS = 30_000; // 30 seconds

function isCacheValid(key: string): boolean {
  const entry = queryCache[key];
  return !!entry && Date.now() - entry.ts < CACHE_TTL_MS;
}

/**
 * Resolve the base URL for a service, handling relative URLs.
 */
export function resolveServiceBaseUrl(baseUrl: string): string {
  if (!baseUrl) return '';
  if (baseUrl.startsWith('http')) return baseUrl;
  // Relative URL — resolve against current origin in web context
  if (typeof window !== 'undefined') return window.location.origin + baseUrl;
  return baseUrl;
}

/**
 * Fetch data for a single query by ID.
 * Returns cached data if available and fresh.
 */
export async function fetchQueryData(
  queryId: string,
  queries: any[],
  services: any[]
): Promise<any | null> {
  if (isCacheValid(queryId)) return queryCache[queryId].data;

  const query = queries.find((q: any) => q.id === queryId);
  if (!query) return null;

  const svc = services.find((sv: any) => sv.id === query.serviceId);
  const base = resolveServiceBaseUrl((svc?.config as any)?.baseUrl || '');
  if (!base) return null;

  try {
    const res = await fetch(base.replace(/\/$/, '') + query.path);
    if (!res.ok) return null;
    const data = await res.json();
    queryCache[queryId] = { data, ts: Date.now() };
    return data;
  } catch {
    return null;
  }
}

/**
 * Hook: fetch data for a single query.
 */
export function useQueryData(queryId: string | null): {
  data: any;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const { project } = useStudio();
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refetch = React.useCallback(async () => {
    if (!queryId || !project) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchQueryData(queryId, project.queries || [], project.services || []);
      setData(result);
    } catch (e: any) {
      setError(e.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }, [queryId, project]);

  React.useEffect(() => { refetch(); }, [queryId]);

  return { data, loading, error, refetch };
}

/**
 * Hook: fetch data for ALL queries in the project.
 * Returns a map of queryId → data.
 * Used by PageQueryProvider and SmartInput LinkerModal.
 */
export function useAllQueryData(): {
  dataMap: Record<string, any>;
  loading: boolean;
  refetchAll: () => void;
} {
  const { project } = useStudio();
  const [dataMap, setDataMap] = React.useState<Record<string, any>>({});
  const [loading, setLoading] = React.useState(false);

  const refetchAll = React.useCallback(async () => {
    if (!project) return;
    setLoading(true);
    const results: Record<string, any> = {};
    await Promise.allSettled(
      (project.queries || []).map(async (q: any) => {
        const data = await fetchQueryData(q.id, project.queries || [], project.services || []);
        if (data !== null) results[q.id] = data;
      })
    );
    setDataMap(results);
    setLoading(false);
  }, [project]);

  React.useEffect(() => { refetchAll(); }, [project?.queries?.length]);

  return { dataMap, loading, refetchAll };
}

/**
 * Hook: fetch data for queries referenced in a specific context.
 * Returns a queryContext map keyed by varName (e.g. "jpUsersData").
 * Used by PageQueryProvider.
 */
export function usePageQueryContext(queryVarNames: Set<string>): Record<string, any> {
  const { project } = useStudio();
  const [queryContext, setQueryContext] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    if (!project || queryVarNames.size === 0) return;

    queryVarNames.forEach(async varName => {
      const baseName = varName.endsWith('Data') ? varName.slice(0, -4) : varName;
      const query = (project.queries || []).find(
        (q: any) => q.name.replace(/[^a-zA-Z0-9]/g, '') === baseName || q.name === baseName
      );
      if (!query) return;

      const data = await fetchQueryData(query.id, project.queries || [], project.services || []);
      if (data !== null) {
        setQueryContext(prev => ({ ...prev, [varName]: data }));
      }
    });
  }, [project, queryVarNames.size]);

  return queryContext;
}
