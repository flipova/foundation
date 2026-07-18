import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useMapViewLogic, MapViewProps } from './MapView.logic';
import { useMapViewStyle } from './MapView.style';
// Using react-native-maps
import RNMapView, { PROVIDER_GOOGLE } from 'react-native-maps';

/**
 * MapView component integrates `react-native-maps` for displaying interactive maps.
 * 
 * Role & Use Cases:
 * Useful for showing locations, tracking routes, or displaying geographical data.
 * Defaults to using the Google Maps provider (`PROVIDER_GOOGLE`).
 * 
 * Structure:
 * Wraps `RNMapView` inside a stylized `View` container. Uses `StyleSheet.absoluteFill` 
 * to ensure the map fills its container completely.
 * 
 * Accessibility:
 * Map interactions can be complex for screen readers. Ensure to provide alternative representations
 * of the map data (like a list of locations) if the map is central to the user experience.
 */
const MapView: React.FC<MapViewProps> = (rawProps) => {
  const logic = useMapViewLogic(rawProps);
  const styles = useMapViewStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      <RNMapView 
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: logic.latitude,
          longitude: logic.longitude,
          latitudeDelta: 10 / logic.zoom,
          longitudeDelta: 10 / logic.zoom,
        }}
      />
    </View>
  );
};

export default MapView;
