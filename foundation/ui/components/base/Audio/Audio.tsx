import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useAudioLogic, AudioProps } from './Audio.logic';
import { useAudioStyle } from './Audio.style';

/**
 * @component Audio
 * @description
 * Base UI component for playing audio files. Uses `expo-av` under the hood to manage
 * the Audio.Sound instance safely.
 * 
 * @useCases
 * - Podcast or music mini-player.
 * - Voice note playback.
 * 
 * @structure
 * Renders a circular Play/Pause button next to a progress bar that advances 
 * automatically based on the playback state.
 * 
 * @accessibility
 * The play/pause button is accessible via a Pressable, though aria-labels should be passed
 * if screen-reader support is strictly required for the playback state.
 */
const Audio: React.FC<AudioProps> = (rawProps) => {
  const logic = useAudioLogic(rawProps);
  const styles = useAudioStyle(logic);

  const progressPercentage = logic.duration > 0 ? (logic.position / logic.duration) * 100 : 0;

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <Pressable 
        style={styles.button as any} 
        onPress={logic.togglePlayPause}
        accessibilityRole="button"
        accessibilityLabel={logic.isPlaying ? "Pause audio" : "Play audio"}
      >
        <Text style={styles.buttonText as any}>
          {logic.isPlaying ? '||' : '>'}
        </Text>
      </Pressable>
      <View style={styles.progressContainer as any}>
        <View style={[styles.progressBar as any, { width: `${progressPercentage}%` }]} />
      </View>
    </View>
  );
};

export default React.memo(Audio);
