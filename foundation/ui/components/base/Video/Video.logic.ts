import { useMemo, useEffect } from 'react';
import { useVideoPlayer } from 'expo-video';
import VideoMeta from './Video.meta.yaml';

/**
 * Props for the Video component.
 */
export interface VideoProps {
  /**
   * The URI or local path to the video file.
   */
  source: string | { uri: string };

  /**
   * If true, the video will start playing automatically once loaded.
   */
  autoPlay?: boolean;

  /**
   * If true, the video will restart from the beginning once it reaches the end.
   */
  loop?: boolean;

  /**
   * Determines whether native playback controls should be displayed. Defaults to true.
   */
  controls?: boolean;

  /**
   * If true, the video will be muted (useful for autoplay on web).
   */
  muted?: boolean;

  /**
   * Additional custom props that will be passed to the container View.
   */
  [key: string]: any;
}

export function useVideoLogic(props: VideoProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (VideoMeta?.props) {
      VideoMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { source, autoPlay, loop, controls, muted, ...rest } = merged;

  // Resolve source to a string URI for expo-video player
  const sourceUri = typeof source === 'string' ? source : (source as { uri: string })?.uri ?? '';

  const player = useVideoPlayer(sourceUri, player => {
    player.loop = loop ?? false;
    if (autoPlay) {
      player.play();
    }
  });

  useEffect(() => {
    if (player) {
      player.loop = loop ?? false;
      if (autoPlay && !player.playing) {
        player.play();
      }
    }
  }, [loop, autoPlay, player]);

  // isPlaying reflects the current autoPlay state for web sync
  const isPlaying = autoPlay ?? false;

  return { source, sourceUri, autoPlay, loop, controls, muted, isPlaying, player, rest };
}
