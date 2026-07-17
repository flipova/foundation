import React, { useRef, useEffect, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { useAudioStyle } from './Audio.style';
import { AudioProps } from './Audio.logic';

/**
 * @component Audio (Web)
 * @description Web-optimized Audio player using the native HTML5 `<audio>` element. Provides the exact same UI as the native version but avoids heavy media libraries on the web.
 * @useCases Used for playing audio tracks, podcasts, or sound effects within the application.
 * @structure Consists of a hidden `<audio>` element, a play/pause toggle button, and a visual progress track.
 * @accessibility Includes a pressable button with descriptive text for screen readers. Further enhancements could include keyboard controls for the timeline.
 */
const AudioWeb: React.FC<AudioProps> = (rawProps) => {
  const { source, autoPlay = false, ...rest } = rawProps;
  // We mock a logic object for the style to consume
  const logic = { isPlaying: false, position: 0, duration: 1, togglePlayPause: () => {}, rest };
  const styles = useAudioStyle(logic as any);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setPosition(audio.currentTime * 1000);
    const onDurationChange = () => setDuration(audio.duration * 1000 || 1);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    if (autoPlay) {
      audio.play().catch(e => console.log('Auto-play prevented by browser', e));
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [source, autoPlay]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const progressPercent = (position / duration) * 100;

  return (
    <View style={[styles.container as any, rest.style]} {...rest}>
      <audio ref={audioRef} src={source} />
      <Pressable onPress={togglePlayPause} style={styles.button as any}>
        <Text style={styles.buttonText as any}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </Pressable>
      <View style={styles.progressContainer as any}>
        <View style={[styles.progressBar as any, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

export default AudioWeb;
