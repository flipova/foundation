import React from 'react';
import { useCardLogic, CardProps } from './Card.logic';
import { useCardStyle } from './Card.style';

/**
 * @component Card (Web)
 * @description A versatile container used to group related information and actions.
 * @useCases Ideal for displaying product summaries, user profiles, or dashboard widgets.
 * @structure A div container styled as a card, containing arbitrary nested children.
 * @accessibility Usually a generic container. Depending on its role, it may need aria-labelledby pointing to a nested title.
 */
const Card: React.FC<CardProps> = (rawProps) => {
  const logic = useCardLogic(rawProps);
  const styles = useCardStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex', flexDirection: 'column', boxSizing: 'border-box' } as React.CSSProperties} {...logic.rest}>
      {logic.children}
    </div>
  );
};

export default Card;
