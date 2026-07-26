import React, { useRef, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useVideoLogic, VideoProps } from './Video.logic';
import { useVideoStyle } from './Video.style';
import { isWeb } from '@/ui/utils/platform';

// Only import native video on non-web platforms
let VideoView: any = null;
if (!isWeb) {
  try {
    const ExpoVideoModule = require('expo-video');
    VideoView = ExpoVideoModule.VideoView;
  } catch (e) {
    // expo-video not available
  }
}

/**
 * A media component for video playback.
 * 
 * @role
 * Embeds and plays video content from a given URI or source.
 * 
 * @useCases
 * - Showing tutorials, promotional videos, or user-generated content.
 * - Background videos for landing pages (using autoPlay and loop).
 * 
 * @structure
 * - Native: Uses `expo-video`'s `VideoView` component for native playback capabilities.
 * - Web: Uses HTML5 `<video>` element with standard controls and playback.
 * - Container is a standard `View` to apply layout constraints.
 * 
 * @accessibility
 * - Native: Controls are made accessible by `expo-video`.
 * - Web: Uses native HTML5 video controls which are WCAG 2.1 compliant.
 * - When controls are hidden (e.g., background video), ensure the video content is strictly decorative or alternate text/captions are provided elsewhere.
 */
const Video: React.FC<VideoProps> = (rawProps) => {
  const logic = useVideoLogic(rawProps);
  const styles = useVideoStyle(logic);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Web-specific synchronization
  useEffect(() => {
    if (!isWeb || !videoRef.current) return;

    const video = videoRef.current;

    // Sync playback state if available
    if (logic.isPlaying) {
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .catch((error) => {
            // Handle autoplay policy restrictions and other errors
            if (error.name === 'NotAllowedError') {
              console.warn('Video autoplay not allowed by browser policy');
            } else if (error.name === 'NotSupportedError') {
              console.warn('Video format not supported');
            } else {
              console.warn('Video playback error:', error.message);
            }
            // Fail silently - user can still click play
          });
      }
    } else {
      video.pause();
    }
  }, [logic.isPlaying]);

  // Native rendering
  if (!isWeb) {
    return (
      <View style={[styles.container as any, logic.rest.style]}>
        {logic.player && VideoView ? (
          <VideoView
            style={{ width: '100%', height: '100%' }}
            player={logic.player}
            nativeControls={logic.controls ?? true}
          />
        ) : null}
      </View>
    );
  }

  // Web rendering with HTML5 video
  return (
    <View style={[styles.container as any, logic.rest.style]}>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        controls={logic.controls ?? true}
        autoPlay={logic.autoPlay}
        loop={logic.loop}
        muted={logic.muted}
        playsInline
        onError={(e) => {
          const error = e.currentTarget.error;
          if (error) {
            const errorMessages: { [key: number]: string } = {
              1: 'Video loading aborted',
              2: 'Network error loading video',
              3: 'Video decoding failed',
              4: 'Video format not supported',
            };
            console.error('Video error:', errorMessages[error.code] || 'Unknown error');
          }
        }}
        aria-label="Video player"
      >
        <source src={logic.sourceUri} />
        Your browser does not support the video tag.
      </video>
    </View>
  );
};

export default Video;
