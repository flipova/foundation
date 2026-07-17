import React from 'react';
import { Text as RNText } from 'react-native';
import { useTextLogic, TextProps } from './Text.logic';
import { useTextStyle } from './Text.style';

/**
 * A foundational typography component.
 * 
 * @role
 * Renders text on the screen using predefined design system variants.
 * 
 * @useCases
 * - Displaying headings, paragraphs, and labels.
 * - Enforcing consistent typography (font sizes, weights, and colors) across the app.
 * 
 * @structure
 * - Wraps the React Native `Text` component.
 * 
 * @accessibility
 * - Inherits React Native's `Text` accessibility features.
 * - Text content is automatically accessible to screen readers.
 */
const Text: React.FC<TextProps> = (rawProps) => {
  const logic = useTextLogic(rawProps);
  const styles = useTextStyle(logic);

  return (
    <RNText style={[styles.text as any, logic.rest.style]}>
      {logic.children}
    </RNText>
  );
};

export default Text;
