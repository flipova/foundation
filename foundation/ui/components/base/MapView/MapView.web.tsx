import React from 'react';
import { useMapViewLogic, MapViewProps } from './MapView.logic';
import { useMapViewStyle } from './MapView.style';

/**
 * Role: Displays a geographic map based on coordinates.
 * UseCases: Used to show locations, routes, or pin markers on a map interface.
 * Structure: A fallback web implementation using a Google Maps iframe embed based on provided latitude, longitude, and zoom.
 * Accessibility: The iframe should ideally have an informative title (e.g., `title="Map showing location"`). Screen readers may have difficulty navigating complex interactive maps.
 */
const MapView: React.FC<MapViewProps> = (rawProps) => {
  const logic = useMapViewLogic(rawProps);
  const styles = useMapViewStyle(logic);

  // Fallback map representation for web (requires specific setup or leaflet/google-maps-react normally)
  return (
    <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' } as React.CSSProperties} {...logic.rest}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://maps.google.com/maps?q=${logic.latitude},${logic.longitude}&z=${logic.zoom}&output=embed`}
      ></iframe>
    </div>
  );
};

export default MapView;
