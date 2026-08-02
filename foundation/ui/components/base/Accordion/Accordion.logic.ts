import React, { useState, useCallback, useMemo } from 'react';
import AccordionMeta from './Accordion.meta.yaml';

/**
 * Properties for the Accordion component.
 */
export interface AccordionProps {
  /** The text displayed in the header of the accordion. */
  title?: string;
  /** Whether the accordion should be open by default on initial mount. */
  defaultOpen?: boolean;
  /** Background color of the accordion container. */
  background?: string;
  /** Border radius of the accordion container. Can be a theme token size (e.g. 'sm') or a number. */
  borderRadius?: string | number;
  /** Border color of the accordion container. */
  borderColor?: string;
  /** The content to be revealed when the accordion is expanded. */
  children?: React.ReactNode;
  /** Callback fired when the accordion's open state changes. */
  onToggle?: (isOpen: boolean) => void;
  /** Any other props to pass down to the container element. */
  [key: string]: any;
}

export function useAccordionLogic(props: AccordionProps) {
  // Extract defaults safely from meta
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (AccordionMeta && Array.isArray(AccordionMeta.props)) {
      AccordionMeta.props.forEach((p: any) => {
        if (p.default !== undefined) {
          defaults[p.name] = p.default;
        }
      });
    }
    return defaults;
  }, []);

  const mergedProps = { ...metaDefaults, ...props };
  const { 
    title, 
    defaultOpen, 
    background, 
    borderRadius, 
    borderColor, 
    children,
    onToggle,
    ...rest 
  } = mergedProps;

  const [isOpen, setIsOpen] = useState(!!defaultOpen);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  }, [onToggle]);

  return {
    isOpen,
    handleToggle,
    title,
    background,
    borderRadius,
    borderColor,
    children,
    rest
  };
}
