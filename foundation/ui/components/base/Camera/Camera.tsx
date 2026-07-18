import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useCameraLogic, CameraProps } from './Camera.logic';
import { useCameraStyle } from './Camera.style';
// Using expo-camera
import { Camera as ExpoCamera, CameraView, useCameraPermissions } from 'expo-camera';

/**
 * A camera component for capturing photos or videos.
 * 
 * @description
 * This component wraps `expo-camera` to provide a consistent interface for camera integration.
 * It handles permission requests automatically upon mounting.
 * 
 * @useCases
 * - Scanning QR codes or barcodes.
 * - Capturing user avatars or profile photos.
 * - Recording video clips within the application.
 * 
 * @structure
 * - Manages camera permissions using `useCameraPermissions`.
 * - Conditionally renders a loading state, permission denied state, or the actual `CameraView`.
 * - The `CameraView` fills its container using absolute positioning or flexbox depending on styles.
 * 
 * @accessibility
 * - Provides fallback text ("No access to camera") when permissions are denied, which is readable by screen readers.
 * - Ensure that any controls layered over the camera (buttons, overlays) have sufficient contrast and accessibility labels.
 */
const Camera: React.FC<CameraProps> = (rawProps) => {
  const logic = useCameraLogic(rawProps);
  const styles = useCameraStyle(logic);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return <View style={[styles.container as any, logic.rest.style]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container as any, logic.rest.style]}>
        <Text style={styles.text as any}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      {logic.isActive && (
        <CameraView style={{ width: '100%', height: '100%' }} facing={logic.facing} />
      )}
    </View>
  );
};

export default Camera;
