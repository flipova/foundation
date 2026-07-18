import React, { useId } from 'react';
import { useAccordionLogic, AccordionProps } from './Accordion.logic';
import { useAccordionStyle } from './Accordion.style';
import { ChevronDown } from 'lucide-react';

/**
 * @component Accordion (Web)
 * @description A web-optimized collapsible content panel that allows users to toggle visibility of sections.
 * @useCases Used for FAQs, settings panels, or grouping related information to save space.
 * @structure Composed of a header button that toggles the state, and a region container for the expandable content.
 * @accessibility Implements ARIA expanded state, aria-controls, and uses proper button and region roles.
 */
const Accordion: React.FC<AccordionProps> = (rawProps) => {
  const logic = useAccordionLogic(rawProps);
  const styles = useAccordionStyle(logic);
  const contentId = useId();

  return (
    <div style={styles.container as React.CSSProperties} {...logic.rest}>
      <button
        type="button"
        style={styles.headerWeb as React.CSSProperties}
        onClick={logic.handleToggle}
        aria-expanded={logic.isOpen}
        aria-controls={contentId}
      >
        <h3 style={styles.title as React.CSSProperties}>{logic.title}</h3>
        <div 
          style={{
            transform: logic.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronDown size={20} color={styles.icon.color as string} />
        </div>
      </button>
      
      <div 
        id={contentId}
        role="region"
        style={{
          display: 'grid',
          gridTemplateRows: logic.isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.2s ease-in-out',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={styles.content as React.CSSProperties}>
            {logic.children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
