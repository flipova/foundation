import React, { useMemo } from 'react';
import AvatarMeta from './Avatar.meta.yaml';

/**
 * Properties for the Avatar component.
 */
export interface AvatarProps {
  /** The URL of the image to display. If omitted, initials will be shown. */
  src?: string;
  /** Explicit initials to display. Overrides derived initials from the alt prop. */
  initials?: string;
  /** The size variant of the avatar. Dictates width, height, and font size. Defaults to 'md'. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Alternative text for screen readers. Also used to derive initials if `initials` is not provided. */
  alt?: string;
  /** Any other props (including style) to spread onto the root element. */
  [key: string]: any;
}

export function useAvatarLogic(props: AvatarProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (AvatarMeta?.props) {
      AvatarMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { src, initials, size = 'md', alt, ...rest } = merged;

  // Derive initials if not provided but alt is
  const displayInitials = initials || (alt ? alt.substring(0, 2).toUpperCase() : '');

  return { src, initials: displayInitials, size, alt, rest };
}
