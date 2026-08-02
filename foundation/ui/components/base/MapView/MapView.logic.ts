import { useMemo } from 'react';
import MapViewMeta from './MapView.meta.yaml';

/**
 * Props for the MapView component.
 */
export interface MapViewProps {
  /**
   * The initial latitude coordinate for the center of the map. Defaults to 48.8566 (Paris).
   */
  latitude?: number;
  /**
   * The initial longitude coordinate for the center of the map. Defaults to 2.3522 (Paris).
   */
  longitude?: number;
  /**
   * The initial zoom level of the map. Higher values zoom in closer. Defaults to 12.
   */
  zoom?: number;
  /**
   * Additional properties to pass to the outer View container.
   */
  [key: string]: any;
}

export function useMapViewLogic(props: MapViewProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (MapViewMeta?.props) {
      MapViewMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { latitude = 48.8566, longitude = 2.3522, zoom = 12, ...rest } = merged;

  return { latitude, longitude, zoom, rest };
}
