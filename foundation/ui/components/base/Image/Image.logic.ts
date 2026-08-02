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
   * Required for semantic HTML and screen reader support.
   */
  alt?: string;
  /**
   * Fallback image URI displayed if the primary image fails to load.
   * Useful for handling broken links or network errors gracefully.
   */
  fallbackSrc?: string;
  /**
   * Callback fired when the image fails to load.
   * @param error Error details from the image loading failure.
   */
  onError?: (error: Error) => void;
  /**
   * Callback fired when the image successfully loads.
   */
  onLoad?: () => void;
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
  const { src, alt, fallbackSrc, onError, onLoad, resizeMode, ...rest } = merged;

  // Validate that alt text is provided for accessibility
  if (!alt && typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(
      'Image component: alt prop is recommended for accessibility. Provide a meaningful description of the image content.'
    );
  }

  return { src, alt, fallbackSrc, onError, onLoad, resizeMode, rest };
}
