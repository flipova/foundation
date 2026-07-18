import React from 'react';
import { useImageLogic, ImageProps } from './Image.logic';
import { useImageStyle } from './Image.style';

/**
 * Role: Displays an image from a provided source URL.
 * UseCases: Ideal for avatars, thumbnails, cover images, and other raster graphics.
 * Structure: Contains a standard HTML `img` tag wrapped in a flexible container, applying the requested resize mode (`object-fit`).
 * Accessibility: Requires an `alt` prop to describe the image content for screen readers. If decorative, an empty `alt` string can be used.
 */
const Image: React.FC<ImageProps> = (rawProps) => {
  const logic = useImageLogic(rawProps);
  const styles = useImageStyle(logic);

  return (
    <div style={{...styles.container, display: 'flex'} as React.CSSProperties} {...logic.rest}>
      <img 
        src={logic.src} 
        alt={logic.alt} 
        style={{...styles.image, objectFit: logic.resizeMode === 'contain' ? 'contain' : logic.resizeMode === 'stretch' ? 'fill' : 'cover'} as React.CSSProperties} 
      />
    </div>
  );
};

export default Image;
