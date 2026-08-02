import React from 'react';
import { Pressable } from 'react-native';
import { useIconButtonLogic, IconButtonProps } from './IconButton.logic';
import { useIconButtonStyle } from './IconButton.style';
import * as LucideIcons from 'lucide-react-native';

/**
 * IconButton component renders a pressable icon with customizable variants and sizes.
 * 
 * Role & Use Cases:
 * Ideal for standalone icon actions like 'close', 'edit', 'favorite', or navigation triggers.
 * 
 * Structure:
 * Wraps a dynamic vector icon (`lucide-react-native`) inside a `Pressable`.
 * Supports theming variants ('default', 'ghost', 'outline').
 * 
 * Accessibility:
 * Includes `accessibilityRole="button"`. Ensure consumers provide a meaningful `accessibilityLabel` 
 * (via `rest` props) since icons do not contain visible text.
 */
const IconButton: React.FC<IconButtonProps> = (rawProps) => {
  const logic = useIconButtonLogic(rawProps);
  const styles = useIconButtonStyle(logic);
  
  const IconComponent = (LucideIcons as any)[logic.icon] || LucideIcons.HelpCircle;

  return (
    <Pressable 
      style={[styles.container as any, logic.rest.style]} 
      onPress={logic.onPress} 
      disabled={logic.disabled}
      accessibilityRole="button"
    >
      <IconComponent size={styles.iconSize} color={styles.iconColor} />
    </Pressable>
  );
};

export default IconButton;
