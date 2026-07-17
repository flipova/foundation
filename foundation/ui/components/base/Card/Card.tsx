import React from 'react';
import { View } from 'react-native';
import { useCardLogic, CardProps } from './Card.logic';
import { useCardStyle } from './Card.style';

/**
 * A container component used to group related content and actions.
 * 
 * @description
 * The Card component provides a distinct visual boundary (usually with a border, background,
 * and subtle shadow) to separate discrete pieces of information from the rest of the UI.
 * 
 * @useCases
 * - Displaying a summary of an item (e.g., a product, user profile, or article snippet).
 * - Grouping related form fields or settings.
 * - Creating modular dashboard widgets.
 * 
 * @structure
 * - Wraps its children inside a styled `View`.
 * - Applies theming to backgrounds, borders, and shadows out of the box.
 * 
 * @accessibility
 * - Cards themselves are typically just presentational containers.
 * - If a card is interactive as a whole, consider wrapping it in a `Pressable` or passing accessibility roles via `rest`.
 * - Ensure logical heading structures and reading orders inside the card content.
 */
const Card: React.FC<CardProps> = (rawProps) => {
  const logic = useCardLogic(rawProps);
  const styles = useCardStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      {logic.children}
    </View>
  );
};

export default Card;
