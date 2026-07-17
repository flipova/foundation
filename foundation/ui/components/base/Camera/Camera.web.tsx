import React, { useEffect, useRef } from 'react';
import { useCameraLogic, CameraProps } from './Camera.logic';
import { useCameraStyle } from './Camera.style';

/**
 * @component Camera (Web)
 * @description A web-based camera viewer that requests and displays video from the user's media devices.
 * @useCases Useful for capturing profile pictures, scanning barcodes, or participating in video calls.
 * @structure Uses a video element to stream the camera feed, with fallback text when inactive.
 * @accessibility Requires user permission to access the camera, which should be requested in a contextually clear manner. Falls back to text if the camera is inactive.
 */
const Camera: React.FC<CameraProps> = (rawProps) => {
  const logic = useCameraLogic(rawProps);
  const styles = useCameraStyle(logic);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (logic.isActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: logic.facing === 'front' ? 'user' : 'environment' } 
      })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Camera access denied', err));
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [logic.isActive, logic.facing]);

  return (
    <div style={{ ...styles.container, display: 'flex', overflow: 'hidden', position: 'relative' } as React.CSSProperties} {...logic.rest}>
      {logic.isActive ? (
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={styles.text as React.CSSProperties}>Camera is inactive</span>
      )}
    </div>
  );
};

export default Camera;
