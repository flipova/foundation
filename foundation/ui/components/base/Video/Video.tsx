import React from 'react';
import { View } from 'react-native';
import { useVideoLogic, VideoProps } from './Video.logic';
import { useVideoStyle } from './Video.style';
import { VideoView } from 'expo-video';

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
 * - Uses a standard `View` for the container to apply layout constraints.
 * - Relies on `expo-video`'s `VideoView` component for native playback capabilities.
 * 
 * @accessibility
 * - Controls should be made accessible natively by `expo-video`. 
 * - When controls are hidden (e.g., background video), ensure the video content is strictly decorative or alternate text/captions are provided elsewhere.
 */
const Video: React.FC<VideoProps> = (rawProps) => {
  const logic = useVideoLogic(rawProps);
  const styles = useVideoStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      {logic.player ? (
        <VideoView
          style={{ width: '100%', height: '100%' }}
          player={logic.player}
          nativeControls={logic.controls ?? true}
        />
      ) : null}
    </View>
  );
};

export default Video;
