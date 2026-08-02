import React from 'react';
import { View } from 'react-native';
import { useIconLogic, IconProps } from './Icon.logic';
import { useIconStyle } from './Icon.style';
import * as LucideIcons from 'lucide-react-native';

/**
 * Icon component provides a generic wrapper for rendering vector icons.
 * 
 * Role & Use Cases:
 * Used to display visual symbols for actions, navigation, or status.
 * Relies on `lucide-react-native` for the icon set.
 * 
 * Structure:
 * Dynamically imports and renders an icon based on the provided name string. Fallbacks to `HelpCircle` if the name is not found.
 * 
 * Accessibility:
 * Decorative by default. Wrap in a `Pressable` with an `accessibilityLabel` or add accessibility props if the icon conveys standalone semantic meaning.
 */
const Icon: React.FC<IconProps> = (rawProps) => {
  const logic = useIconLogic(rawProps);
  const styles = useIconStyle(logic);
  
  // Dynamic icon component
  const IconComponent = (LucideIcons as any)[logic.name] || LucideIcons.HelpCircle;

  return (
    <View style={logic.rest.style}>
      <IconComponent size={styles.size} color={styles.color} />
    </View>
  );
};

export default Icon;
