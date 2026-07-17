import React from 'react';
import { useRadioGroupLogic, RadioGroupProps } from './RadioGroup.logic';
import { useRadioGroupStyle } from './RadioGroup.style';

/**
 * Role: Allows users to select a single option from a list of mutually exclusive choices.
 * UseCases: Ideal for settings or forms where one explicit choice must be made among a few options.
 * Structure: Groups multiple radio inputs under a single `radiogroup` container, visually mimicking radio buttons with custom DOM elements.
 * Accessibility: Uses semantic `<input type="radio">` wrapped in `<label>` elements and assigns a `role="radiogroup"` to the container. Fully supports keyboard navigation and screen readers.
 */
const RadioGroup: React.FC<RadioGroupProps> = (rawProps) => {
  const logic = useRadioGroupLogic(rawProps);
  const styles = useRadioGroupStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} role="radiogroup" {...logic.rest}>
      {logic.options.map((opt, i) => {
        const isSelected = logic.value === opt.value;
        // Generate a random name for the input group to avoid conflicts
        const groupName = `radiogroup-${logic.rest.id || 'default'}`;
        return (
          <label key={opt.value} style={{ ...styles.item, display: 'inline-flex', cursor: logic.disabled ? 'not-allowed' : 'pointer' } as React.CSSProperties}>
            <input 
              type="radio" 
              name={groupName}
              value={opt.value}
              checked={isSelected}
              onChange={() => logic.onValueChange?.(opt.value)}
              disabled={logic.disabled}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
            />
            <div style={{ ...styles.radio, ...(isSelected ? {} : styles.radioUnchecked) } as React.CSSProperties}>
              {isSelected && <div style={styles.dot as React.CSSProperties} />}
            </div>
            <span style={styles.label as React.CSSProperties}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioGroup;
