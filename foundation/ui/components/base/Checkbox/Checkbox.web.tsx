import React from 'react';
import { useCheckboxLogic, CheckboxProps } from './Checkbox.logic';
import { useCheckboxStyle } from './Checkbox.style';
import { Check } from 'lucide-react';

/**
 * @component Checkbox (Web)
 * @description A control that allows the user to toggle between checked and unchecked states.
 * @useCases Used in forms for multiple selections, accepting terms of service, or enabling specific settings.
 * @structure A label wrapping a hidden native checkbox input and a custom styled visual box.
 * @accessibility Uses a hidden native input linked to a label to maintain standard keyboard navigation and screen reader support.
 */
const Checkbox: React.FC<CheckboxProps> = (rawProps) => {
  const logic = useCheckboxLogic(rawProps);
  const styles = useCheckboxStyle(logic);

  return (
    <label style={{ ...styles.wrapper, display: 'inline-flex', cursor: logic.disabled ? 'not-allowed' : 'pointer' } as React.CSSProperties} {...logic.rest}>
      <input 
        type="checkbox" 
        checked={logic.checked} 
        onChange={logic.handlePress} 
        disabled={logic.disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={styles.container as React.CSSProperties}>
        {logic.checked && <Check size={14} color={styles.iconColor} />}
      </div>
      {logic.label && <span style={styles.label as React.CSSProperties}>{logic.label}</span>}
    </label>
  );
};

export default Checkbox;
