import React from 'react';
import { useBadgeLogic, BadgeProps } from './Badge.logic';
import { useBadgeStyle } from './Badge.style';

/**
 * @component Badge (Web)
 * @description A small visual indicator typically used to display counts, status, or labels.
 * @useCases Used on icons or avatars to show unread notifications, or to label items with a specific status.
 * @structure A simple inline container wrapping a text span for the label.
 * @accessibility Since badges often contain visual cues, they should be accompanied by visually hidden text or aria-labels on their parent elements for screen readers.
 */
const Badge: React.FC<BadgeProps> = (rawProps) => {
  const logic = useBadgeLogic(rawProps);
  const styles = useBadgeStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'inline-flex' } as React.CSSProperties} {...logic.rest}>
      <span style={styles.label as React.CSSProperties}>{logic.label}</span>
    </div>
  );
};

export default Badge;
