/**
 * @role Video Component
 * @description A media component for embedding and playing video content.
 * @useCases Displaying promotional videos, tutorials, user-uploaded media, or background videos.
 * @structure Wraps a native HTML `<video>` element within a flex container.
 * @accessibility Should be provided with captions or transcripts if containing meaningful audio. Native controls are enabled by default for keyboard and screen reader accessibility.
 */
import React from 'react';
import { useVideoLogic, VideoProps } from './Video.logic';
import { useVideoStyle } from './Video.style';

const Video: React.FC<VideoProps> = (rawProps) => {
  const logic = useVideoLogic(rawProps);
  const styles = useVideoStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.source && (
        <video 
          src={logic.source} 
          autoPlay={logic.autoPlay} 
          loop={logic.loop} 
          controls={logic.controls !== false} 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
        />
      )}
    </div>
  );
};

export default Video;
