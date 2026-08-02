import React from 'react';

export interface WebImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: number;
  borderRadius?: number | string;
}

export const Image: React.FC<WebImageProps> = ({
  src,
  alt = '',
  aspectRatio,
  borderRadius,
  style,
  ...rest
}) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        height: aspectRatio ? 'auto' : '100%',
        aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        objectFit: 'cover',
        display: 'block',
        ...style,
      }}
      {...rest}
    />
  );
};
