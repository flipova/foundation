import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useMapViewLogic, MapViewProps } from './MapView.logic';
import { useMapViewStyle } from './MapView.style';
import { isWeb } from '@/ui/utils/platform';

// Only import react-native-maps on non-web platforms
let RNMapView: any = null;
let PROVIDER_GOOGLE: any = null;

if (!isWeb) {
  try {
    const MapsModule = require('react-native-maps');
    RNMapView = MapsModule.default;
    PROVIDER_GOOGLE = MapsModule.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn('react-native-maps not available');
  }
}

export interface MapViewWebConfig {
  provider?: 'leaflet' | 'mapbox' | 'google';
  accessToken?: string;
  apiKey?: string;
  tileLayer?: string;
  style?: string;
}

/**
 * MapView component integrates `react-native-maps` for native and web mapping.
 * 
 * @description
 * - Native: Uses `react-native-maps` with Google Maps provider
 * - Web: Provides instruction and placeholder, or web map provider config
 * 
 * @webConfig
 * Pass `webConfig` prop to enable web maps:
 * - Leaflet: Free, open-source
 * - Mapbox: Requires access token
 * - Google Maps: Requires API key
 * 
 * @example
 * ```tsx
 * <MapView
 *   latitude={40}
 *   longitude={-74}
 *   zoom={10}
 *   webConfig={{
 *     provider: 'leaflet',
 *     tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
 *   }}
 * />
 * ```
 * 
 * @accessibility
 * Maps are inherently visual. Always provide:
 * - Text description of location
 * - List of coordinates/addresses
 * - Alternative data representation
 */
const MapView: React.FC<MapViewProps & { webConfig?: MapViewWebConfig }> = (rawProps) => {
  const logic = useMapViewLogic(rawProps);
  const styles = useMapViewStyle(logic);
  const webMapRef = useRef<HTMLDivElement | null>(null);
  const [webMapReady, setWebMapReady] = useState(false);
  const [webMapError, setWebMapError] = useState<string | null>(null);

  const { webConfig } = rawProps as any;

  // Sanitize coordinates to prevent injection
  const sanitizeNumber = (num: number): number => {
    const parsed = parseFloat(String(num));
    if (isNaN(parsed) || !isFinite(parsed)) {
      console.warn(`Invalid coordinate: ${num}`);
      return 0;
    }
    if (Math.abs(parsed) > 180) {
      console.warn(`Coordinate out of range: ${num}`);
      return Math.max(-180, Math.min(180, parsed));
    }
    return parsed;
  };

  const latitude = sanitizeNumber(logic.latitude);
  const longitude = sanitizeNumber(logic.longitude);
  const zoom = Math.max(1, Math.min(20, logic.zoom || 10));

  // Web map initialization
  useEffect(() => {
    if (!isWeb || !webMapRef.current) return;

    try {
      setWebMapError(null);

      if (!webConfig?.provider) {
        // Show placeholder if no provider configured
        webMapRef.current.innerHTML = renderMapPlaceholder(latitude, longitude);
        return;
      }

      // Initialize requested provider
      switch (webConfig.provider) {
        case 'leaflet':
          initLeafletMap();
          break;
        case 'mapbox':
          initMapboxMap();
          break;
        case 'google':
          initGoogleMap();
          break;
        default:
          setWebMapError(`Unknown provider: ${webConfig.provider}`);
      }
    } catch (error: any) {
      console.error('Failed to initialize web map:', error);
      setWebMapError(error?.message || 'Failed to initialize map');
    }

    return () => {
      // Cleanup
      if (webMapRef.current) {
        webMapRef.current.innerHTML = '';
      }
    };
  }, [latitude, longitude, zoom, webConfig]);

  const initLeafletMap = () => {
    if (!webMapRef.current) return;

    try {
      // Check if Leaflet is loaded
      if (!(window as any).L) {
        setWebMapError('Leaflet library not loaded. Install: npm install leaflet');
        return;
      }

      const L = (window as any).L;
      const map = L.map(webMapRef.current).setView([latitude, longitude], zoom);

      const tileLayer = webConfig?.tileLayer || 
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileLayer, {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);

      setWebMapReady(true);
    } catch (error: any) {
      setWebMapError(error?.message || 'Leaflet initialization failed');
    }
  };

  const initMapboxMap = () => {
    if (!webConfig?.accessToken) {
      setWebMapError('Mapbox requires accessToken in webConfig');
      return;
    }

    try {
      if (!(window as any).mapboxgl) {
        setWebMapError('Mapbox GL JS not loaded. Install: npm install mapbox-gl');
        return;
      }

      const mapboxgl = (window as any).mapboxgl;
      mapboxgl.accessToken = webConfig.accessToken;

      const map = new mapboxgl.Map({
        container: webMapRef.current,
        style: webConfig.style || 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: zoom,
      });

      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);

      setWebMapReady(true);
    } catch (error: any) {
      setWebMapError(error?.message || 'Mapbox initialization failed');
    }
  };

  const initGoogleMap = () => {
    if (!webConfig?.apiKey) {
      setWebMapError('Google Maps requires apiKey in webConfig');
      return;
    }

    try {
      if (!(window as any).google?.maps) {
        setWebMapError('Google Maps API not loaded. Add script tag in HTML');
        return;
      }

      const google = (window as any).google;
      const map = new google.maps.Map(webMapRef.current, {
        zoom: zoom,
        center: { lat: latitude, lng: longitude },
      });

      new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
      });

      setWebMapReady(true);
    } catch (error: any) {
      setWebMapError(error?.message || 'Google Maps initialization failed');
    }
  };

  const renderMapPlaceholder = (lat: number, lng: number): string => {
    // Use textContent to prevent XSS
    const coords = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    return `
      <div role="region" aria-label="map placeholder" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: #f0f0f0; flex-direction: column; gap: 16px; padding: 20px; text-align: center;">
        <div style="font-size: 16px; font-weight: bold; color: #666;">Map Placeholder</div>
        <div style="font-size: 12px; color: #666;">Location: <code style="background: #e0e0e0; padding: 2px 4px; border-radius: 2px;">${coords}</code></div>
        <div style="font-size: 11px; color: #999; max-width: 200px;">Configure a web map provider (Leaflet, Mapbox, or Google Maps) via the webConfig prop</div>
      </div>
    `;
  };

  // Native rendering
  if (!isWeb) {
    if (!RNMapView) {
      return (
        <View style={[styles.container as any, logic.rest.style]}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Map library not available</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container as any, logic.rest.style]}>
        <RNMapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 10 / zoom,
            longitudeDelta: 10 / zoom,
          }}
        />
      </View>
    );
  }

  // Web rendering
  return (
    <View
      style={[styles.container as any, logic.rest.style]}
      role="application"
      aria-label="Interactive map"
    >
      {webMapError ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#d32f2f', textAlign: 'center' }}>
            {webMapError}
          </Text>
        </View>
      ) : !webMapReady && webConfig?.provider ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      ) : null}
      
      <div
        ref={webMapRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
        role="img"
        aria-label={`Map showing location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
      />
    </View>
  );
};

export default MapView;
