import React from 'react';
import { useIconButtonLogic, IconButtonProps } from './IconButton.logic';
import { useIconButtonStyle } from './IconButton.style';
import * as LucideIcons from 'lucide-react';

/**
 * Role: A clickable button containing only an icon.
 * UseCases: Useful for toolbars, action bars, or constrained spaces where text labels are not practical.
 * Structure: A standard `button` element containing an `Icon` component.
 * Accessibility: Must have an `aria-label` passed via props to ensure screen reader users understand the button's purpose. Disabled state is natively supported.
 */
const IconButton: React.FC<IconButtonProps> = (rawProps) => {
  const logic = useIconButtonLogic(rawProps);
  const styles = useIconButtonStyle(logic);
  
  const IconComponent = (LucideIcons as any)[logic.icon] || LucideIcons.HelpCircle;

  return (
    <button 
      style={{ ...styles.container, display: 'inline-flex', cursor: logic.disabled ? 'not-allowed' : 'pointer', border: logic.variant === 'outline' ? `1px solid ${styles.container.borderColor}` : 'none' } as React.CSSProperties} 
      onClick={logic.disabled ? undefined : logic.onPress}
      disabled={logic.disabled}
      {...logic.rest}
    >
      <IconComponent size={styles.iconSize} color={styles.iconColor} />
    </button>
  );
};

export default IconButton;
