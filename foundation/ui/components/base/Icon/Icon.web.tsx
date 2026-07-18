import React from 'react';
import { useIconLogic, IconProps } from './Icon.logic';
import { useIconStyle } from './Icon.style';
import * as LucideIcons from 'lucide-react';

/**
 * Role: Renders a scalable vector icon.
 * UseCases: Used to visually represent actions, statuses, or elements within the UI (e.g., in buttons, menus, or lists).
 * Structure: Renders a Lucide icon component inside an inline-flex container.
 * Accessibility: Icons should be accompanied by visible text or `aria-label` attributes for screen reader users, especially if used interactively.
 */
const Icon: React.FC<IconProps> = (rawProps) => {
  const logic = useIconLogic(rawProps);
  const styles = useIconStyle(logic);
  
  const IconComponent = (LucideIcons as any)[logic.name] || LucideIcons.HelpCircle;

  return (
    <div style={{ display: 'inline-flex' }} {...logic.rest}>
      <IconComponent size={styles.size} color={styles.color} />
    </div>
  );
};

export default Icon;
