import { useMemo } from 'react';
import ImageMeta from './Image.meta.yaml';

/**
 * Props for the Image component.
 */
export interface ImageProps {
  /**
   * The source URI of the image to display.
   */
  src: string;
  /**
   * Alternative text description for accessibility.
   */
  alt?: string;
  /**
   * Determines how the image should be resized to fit its container.
   * Maps to `expo-image`'s `contentFit` prop.
   * - 'cover': Scales the image uniformly so both dimensions are equal to or greater than the corresponding limits.
   * - 'contain': Scales the image uniformly so both dimensions are equal to or less than the corresponding limits.
   * - 'stretch': Scales the image non-uniformly to exactly match the container bounds.
   */
  resizeMode?: 'cover' | 'contain' | 'stretch';
  /**
   * Additional props to pass to the outer container View.
   */
  [key: string]: any;
}

export function useImageLogic(props: ImageProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (ImageMeta?.props) {
      ImageMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { src, alt, resizeMode, ...rest } = merged;

  return { src, alt, resizeMode, rest };
}
