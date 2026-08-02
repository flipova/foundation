import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';

/**
 * Props for the Audio component.
 */
export interface AudioProps {
  /** The source URI of the audio file */
  source: string;
  /** Whether the audio should auto-play */
  autoPlay?: boolean;
  /** Any other props for the container */
  [key: string]: any;
}

export function useAudioLogic(rawProps: AudioProps) {
  const { source, autoPlay = false, ...rest } = rawProps;
  
  const player = useAudioPlayer(source);

  useEffect(() => {
    if (autoPlay && player) {
      player.play();
    }
  }, [autoPlay, player]);

  const togglePlayPause = () => {
    if (!player) return;
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return {
    isPlaying: player ? player.playing : false,
    position: player ? player.currentTime * 1000 : 0,
    duration: player ? player.duration * 1000 : 1,
    togglePlayPause,
    rest
  };
}


