import React from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';

interface FallbackProps {
  componentName: string;
  message?: string;
  children?: React.ReactNode;
}

/**
 * Generic fallback for unsupported components on web
 */
export const WebUnsupportedFallback: React.FC<FallbackProps> = ({
  componentName,
  message,
  children,
}) => {
  if (typeof window === 'undefined') {
    // Native environment, render nothing
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{componentName} not available</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {children && <View style={styles.content}>{children}</View>}
    </View>
  );
};

/**
 * Camera fallback - displays placeholder for web
 */
export const CameraFallback: React.FC<{ width?: DimensionValue; height?: number }> = ({
  width = '100%',
  height = 300,
}) => (
  <WebUnsupportedFallback
    componentName="Camera"
    message="Camera is not available on web. Use browser camera permissions."
  >
    <View
      style={{
        width,
        height,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#666' }}>📷 Camera Placeholder</Text>
    </View>
  </WebUnsupportedFallback>
);

/**
 * Video fallback - suggests HTML5 video element
 */
export const VideoFallback: React.FC<{ width?: DimensionValue; height?: number }> = ({
  width = '100%',
  height = 300,
}) => (
  <WebUnsupportedFallback
    componentName="Video"
    message="Use HTML5 &lt;video&gt; element on web"
  >
    <View
      style={{
        width,
        height,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#666' }}>🎬 Video Placeholder</Text>
    </View>
  </WebUnsupportedFallback>
);

/**
 * MapView fallback
 */
export const MapViewFallback: React.FC<{ width?: DimensionValue; height?: number }> = ({
  width = '100%',
  height = 300,
}) => (
  <WebUnsupportedFallback
    componentName="MapView"
    message="Use Mapbox, Leaflet, or Google Maps Web API on web"
  >
    <View
      style={{
        width,
        height,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#666' }}>🗺️ Map Placeholder</Text>
    </View>
  </WebUnsupportedFallback>
);

/**
 * Lottie animation fallback
 */
export const LottieFallback: React.FC<{ width?: DimensionValue; height?: number }> = ({
  width = '100%',
  height = 100,
}) => (
  <WebUnsupportedFallback
    componentName="LottieAnimation"
    message="Use lottie-web library on web"
  >
    <View
      style={{
        width,
        height,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#666' }}>🎨 Animation Placeholder</Text>
    </View>
  </WebUnsupportedFallback>
);

/**
 * Gradient fallback - shows solid color instead
 */
export const GradientFallback: React.FC<{
  colors?: string[];
  width?: DimensionValue;
  height?: number;
  children?: React.ReactNode;
}> = ({ colors, width = '100%', height = 100, children }) => {
  const backgroundColor = colors?.[0] || '#ffffff';

  return (
    <View
      style={{
        width,
        height,
        backgroundColor,
      }}
    >
      {children}
    </View>
  );
};

/**
 * BlurView fallback - shows with reduced opacity instead
 */
export const BlurViewFallback: React.FC<{
  intensity?: number;
  width?: DimensionValue;
  height?: number;
  children?: React.ReactNode;
}> = ({ intensity = 50, width = '100%', height = 100, children }) => {
  const opacity = Math.min((intensity || 50) / 100, 0.5);

  return (
    <View
      style={{
        width,
        height,
        opacity,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      }}
    >
      {children}
    </View>
  );
};


/**
 * Audio fallback - suggests Web Audio API
 */
export const AudioFallback: React.FC<{}> = () => (
  <WebUnsupportedFallback
    componentName="Audio"
    message="Use HTML5 &lt;audio&gt; element or Web Audio API on web"
  />
);

/**
 * FilePicker fallback - suggests file input
 */
export const FilePickerFallback: React.FC<{}> = () => (
  <WebUnsupportedFallback
    componentName="FilePicker"
    message="Use &lt;input type='file'&gt; or DocumentPicker API on web"
  />
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 8,
  },
  content: {
    marginTop: 8,
  },
});
