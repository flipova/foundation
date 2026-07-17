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
  source: string;

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
  const { source, autoPlay, loop, controls, ...rest } = merged;

  const player = useVideoPlayer(source, player => {
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

  return { source, autoPlay, loop, controls, player, rest };
}
