import React from 'react';
import { useAvatarLogic, AvatarProps } from './Avatar.logic';
import { useAvatarStyle } from './Avatar.style';

/**
 * @component Avatar (Web)
 * @description A graphical representation of a user or entity, displaying either an image or initials.
 * @useCases Used in user profiles, comment sections, and navigation bars to identify users.
 * @structure Contains an image element if a source is provided, otherwise falls back to a text span showing initials.
 * @accessibility The image includes an alt text property to describe the avatar to screen reader users.
 */
const Avatar: React.FC<AvatarProps> = (rawProps) => {
  const logic = useAvatarLogic(rawProps);
  const styles = useAvatarStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.src ? (
        <img src={logic.src} alt={logic.alt} style={{...styles.image, objectFit: 'cover'} as React.CSSProperties} />
      ) : (
        <span style={styles.initials as React.CSSProperties}>{logic.initials}</span>
      )}
    </div>
  );
};

export default Avatar;
