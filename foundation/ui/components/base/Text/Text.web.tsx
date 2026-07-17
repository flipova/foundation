/**
 * @role Text Component
 * @description A foundational typography component for rendering text in various styles and semantic tags.
 * @useCases Displaying paragraphs, headings, labels, and general copy across the application.
 * @structure Dynamically renders an HTML text tag (e.g., `p`, `h1`, `span`) based on the provided variant prop.
 * @accessibility Uses semantic HTML tags to ensure proper document outline and screen reader navigation. Allows passing standard ARIA attributes if needed.
 */
import React from 'react';
import { useTextLogic, TextProps } from './Text.logic';
import { useTextStyle } from './Text.style';

const Text: React.FC<TextProps> = (rawProps) => {
  const logic = useTextLogic(rawProps);
  const styles = useTextStyle(logic);

  const Tag = (logic.variant === 'p' ? 'p' : (logic.variant?.startsWith('h') ? logic.variant : 'span')) as any;

  return (
    <Tag style={{ ...styles.text, margin: 0, marginBottom: styles.text.marginBottom } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </Tag>
  );
};

export default Text;
