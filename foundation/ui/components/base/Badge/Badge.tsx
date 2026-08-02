import React from 'react';
import { View, Text } from 'react-native';
import { useBadgeLogic, BadgeProps } from './Badge.logic';
import { useBadgeStyle } from './Badge.style';

/**
 * `Badge` is a small visual indicator used to highlight status, counts, or categories.
 * 
 * **Role:**
 * Draws attention to metadata, state changes (like "New" or "Error"), or 
 * categorization tags.
 * 
 * **Use cases:**
 * - Displaying unread message counts on an icon.
 * - Tagging items with categories (e.g., "Music", "Video").
 * - Showing status indicators (e.g., "Active", "Pending", "Deleted").
 * 
 * **Structure:**
 * A simple container `View` with a rounded pill shape, wrapping a highly legible `Text` label.
 * It uses variants to map to specific theme colors (default, destructive, etc.).
 * 
 * **Accessibility:**
 * Rendered as text. If the badge provides context to another element (like a notification icon),
 * ensure the parent element has an `accessibilityLabel` that includes the badge's information.
 */
const Badge: React.FC<BadgeProps> = (rawProps) => {
  const logic = useBadgeLogic(rawProps);
  const styles = useBadgeStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      <Text style={styles.label as any}>{logic.label}</Text>
    </View>
  );
};

export default React.memo(Badge);
