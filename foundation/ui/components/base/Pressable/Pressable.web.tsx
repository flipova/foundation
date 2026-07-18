import React from 'react';
import { usePressableLogic, PressableProps } from './Pressable.logic';
import { usePressableStyle } from './Pressable.style';

/**
 * Role: A base component that captures press/click interactions.
 * UseCases: Used to build custom buttons or interactive surfaces when standard HTML buttons are too restrictive.
 * Structure: Renders a standard `div` that responds to click events and handles disabled states.
 * Accessibility: Includes basic `role="button"` and `tabIndex` properties when an `onPress` handler is provided, allowing keyboard navigation.
 */
const Pressable: React.FC<PressableProps> = (rawProps) => {
  const logic = usePressableLogic(rawProps);
  const styles = usePressableStyle(logic);

  return (
    <div 
      style={{ ...styles.container, cursor: logic.disabled ? 'not-allowed' : logic.onPress ? 'pointer' : 'default' } as React.CSSProperties} 
      onClick={logic.disabled ? undefined : logic.onPress}
      role={logic.onPress ? 'button' : undefined}
      tabIndex={logic.onPress && !logic.disabled ? 0 : undefined}
      {...logic.rest}
    >
      {logic.children}
    </div>
  );
};

export default Pressable;
