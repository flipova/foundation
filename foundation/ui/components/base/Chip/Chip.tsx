import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useChipLogic, ChipProps } from './Chip.logic';
import { useChipStyle } from './Chip.style';
import { X } from 'lucide-react-native';

/**
 * A compact, interactive element used for input, attribute, or action representation.
 * 
 * @description
 * Chips are used to represent small blocks of information. They are most commonly used either for 
 * tags/categories, selectable options, or deletable items.
 * 
 * @useCases
 * - Displaying tags or categories for an article.
 * - Showing applied filters that the user can dismiss.
 * - Offering selectable choices in a compact form.
 * 
 * @structure
 * - `Pressable`: Wraps the chip to handle main interactions (like selecting).
 * - `Text`: Displays the chip's label.
 * - An optional delete icon (X) wrapped in a `Pressable` for dismissal.
 * 
 * @accessibility
 * - The delete button has a `hitSlop` to increase its touchable area without increasing its visual size.
 * - Consider passing accessibility labels to the delete button if used, to clarify its purpose (e.g., "Remove [tag name]").
 */
const Chip: React.FC<ChipProps> = (rawProps) => {
  const logic = useChipLogic(rawProps);
  const styles = useChipStyle(logic);

  return (
    <Pressable style={[styles.container as any, logic.rest.style]} onPress={logic.onPress} disabled={logic.disabled || !logic.onPress}>
      <Text style={styles.label as any}>{logic.label}</Text>
      {logic.onDelete && (
        <Pressable onPress={logic.onDelete} hitSlop={8} disabled={logic.disabled}>
          <X size={14} color={styles.iconColor} />
        </Pressable>
      )}
    </Pressable>
  );
};

export default Chip;
