import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useCameraLogic, CameraProps } from './Camera.logic';
import { useCameraStyle } from './Camera.style';
import { isWeb, hasFeature } from '@/ui/utils/platform';

// Only import native modules on native platforms
let CameraView: any = null;
let useCameraPermissions: any = null;

if (!isWeb) {
  try {
    const ExpoCameraModule = require('expo-camera');
    CameraView = ExpoCameraModule.CameraView;
    useCameraPermissions = ExpoCameraModule.useCameraPermissions;
  } catch (e) {
    console.warn('expo-camera not available');
  }
}

/**
 * A camera component for capturing photos or videos.
 * 
 * @description
 * - Native: Uses `expo-camera` with automatic permission handling
 * - Web: Uses browser MediaDevices API (requires HTTPS or localhost)
 * 
 * @webRequirements
 * - HTTPS protocol (except localhost)
 * - User permission to access camera
 * - Modern browser with getUserMedia support
 * 
 * @useCases
 * - Scanning QR codes or barcodes
 * - Capturing user avatars or profile photos
 * - Recording video clips within the application
 * 
 * @accessibility
 * - Provides fallback text when permissions are denied
 * - ARIA labels for video elements
 * - Error messages are descriptive and user-friendly
 * 
 * @security
 * - Validates feature availability before attempting access
 * - Handles permission denied gracefully
 * - Streams are properly cleaned up on unmount
 */
const Camera: React.FC<CameraProps> = (rawProps) => {
  const logic = useCameraLogic(rawProps);
  const styles = useCameraStyle(logic);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [webCameraReady, setWebCameraReady] = useState(false);
  const [webCameraError, setWebCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Native platform handling
  const [permission, requestPermission] = useCameraPermissions?.() || [null, null];

  // Cleanup function
  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Failed to stop track:', e);
        }
      });
      streamRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Initialize web camera
  const initWebCamera = useCallback(async () => {
    if (!isWeb || !videoRef.current || !logic.isActive) return;

    try {
      setIsLoading(true);
      setWebCameraError(null);

      // Check feature availability
      if (!hasFeature('camera')) {
        setWebCameraError('Camera is not available in this browser. Please check browser settings and permissions.');
        setIsLoading(false);
        return;
      }

      // Cleanup previous stream
      cleanupStream();

      // Request camera with timeout
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: logic.facing === 'back' ? 'environment' : 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Camera request timeout')), 5000)
        ),
      ]);

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Handle play errors
        try {
          await videoRef.current.play();
          setWebCameraReady(true);
        } catch (playError: any) {
          console.warn('Video play error:', playError);
          setWebCameraError('Failed to start camera preview. Try again.');
          cleanupStream();
        }
      }
    } catch (error: any) {
      let userMessage = 'Failed to access camera';

      // Provide specific error messages
      if (error.name === 'NotAllowedError') {
        userMessage = 'Camera permission denied. Please allow access in browser settings.';
      } else if (error.name === 'NotFoundError') {
        userMessage = 'No camera device found. Check that your device has a camera.';
      } else if (error.name === 'NotReadableError') {
        userMessage = 'Camera is in use by another application. Try again later.';
      } else if (error.message?.includes('timeout')) {
        userMessage = 'Camera request timed out. Try again.';
      } else if (error.message) {
        userMessage = `Camera error: ${error.message}`;
      }

      console.error('Camera initialization error:', error);
      setWebCameraError(userMessage);
      cleanupStream();
    } finally {
      setIsLoading(false);
    }
  }, [logic.isActive, logic.facing, cleanupStream, hasFeature]);

  // Web platform effect
  useEffect(() => {
    if (!isWeb) return;

    if (logic.isActive) {
      initWebCamera();
    } else {
      cleanupStream();
      setWebCameraReady(false);
    }

    return () => {
      cleanupStream();
    };
  }, [logic.isActive, isWeb, initWebCamera, cleanupStream]);

  // Native platform effect
  useEffect(() => {
    if (isWeb) return;

    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission?.();
    }
  }, [permission, requestPermission, isWeb]);

  // Native rendering
  if (!isWeb) {
    if (!permission) {
      return (
        <View 
          style={[styles.container as any, logic.rest.style]} 
          accessible
          accessibilityLabel="Camera loading"
        >
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View 
          style={[styles.container as any, logic.rest.style]}
          accessible
          accessibilityLabel="Camera access denied"
          accessibilityRole="alert"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={[styles.text as any, { color: '#d32f2f' }]}>
              Camera access denied
            </Text>
            <Text style={{ fontSize: 12, color: '#666', marginTop: 8, textAlign: 'center' }}>
              Please enable camera access in app settings to use this feature.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container as any, logic.rest.style]}>
        {logic.isActive && CameraView && (
          <CameraView 
            style={{ width: '100%', height: '100%' }} 
            facing={logic.facing}
            onMountError={(error: any) => {
              console.error('Camera mount error:', error);
            }}
          />
        )}
      </View>
    );
  }

  // Web rendering
  return (
    <View 
      style={[styles.container as any, logic.rest.style]}
      accessible
      accessibilityRole="none"
      accessibilityLabel="Camera"
    >
      {webCameraError ? (
        <View 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
          accessible
          accessibilityRole="alert"
          accessibilityLabel={`Camera error: ${webCameraError}`}
        >
          <Text style={{ color: '#d32f2f', textAlign: 'center', fontSize: 14 }}>
            {webCameraError}
          </Text>
        </View>
      ) : isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={{ marginTop: 12, color: '#666' }}>Initializing camera...</Text>
        </View>
      ) : (
        <video
          ref={videoRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            backgroundColor: '#000',
          }}
          playsInline
          muted
          autoPlay
          aria-label="Camera feed"
          aria-live="polite"
        />
      )}
    </View>
  );
};

export default Camera;
