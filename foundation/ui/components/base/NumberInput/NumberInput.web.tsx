import React from 'react';
import { useNumberInputLogic, NumberInputProps } from './NumberInput.logic';
import { useNumberInputStyle } from './NumberInput.style';

/**
 * @component NumberInput (Web)
 * @description A specialized input for numbers with increment/decrement steppers.
 */
const NumberInputWeb: React.FC<NumberInputProps> = (rawProps) => {
  const logic = useNumberInputLogic(rawProps);
  const styles = useNumberInputStyle(logic);

  return (

    <div style={styles.wrapper as any} {...logic.rest}>
      <div style={styles.container as any}>
        <button onClick={logic.decrement} style={styles.button as any}>-</button>
        <input 
          style={styles.input as any}
          value={logic.textValue}
          onChange={(e) => logic.handleTextChange(e.target.value)}
          onFocus={() => logic.setIsFocused(true)}
          onBlur={logic.handleBlur}
        />
        <button onClick={logic.increment} style={styles.button as any}>+</button>
      </div>
      {logic.error && <span style={styles.errorText as any}>{logic.error}</span>}
    </div>
  );
};

export default NumberInputWeb;
