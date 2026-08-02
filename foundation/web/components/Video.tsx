import React from 'react';

export interface WebVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  borderRadius?: number | string;
}

export const Video: React.FC<WebVideoProps> = ({
  src,
  poster,
  borderRadius,
  controls = true,
  autoPlay = false,
  loop = false,
  style,
  ...rest
}) => {
  return (
    <video
      src={src}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        display: 'block',
        ...style,
      }}
      {...rest}
    />
  );
};
