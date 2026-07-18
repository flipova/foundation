/**
 * @role Switch Component
 * @description A toggle control that allows users to switch between two states (e.g., on/off).
 * @useCases Settings menus, toggling features, and turning options on or off.
 * @structure Composed of a hidden checkbox input for state management and visual track/thumb elements for the UI.
 * @accessibility Uses standard HTML checkbox input with `role="switch"`, `aria-checked`, and handles focus and keyboard interactions natively. Supports a descriptive label for screen readers.
 */
import React from 'react';
import { useSwitchLogic, SwitchProps } from './Switch.logic';
import { useSwitchStyle } from './Switch.style';

const Switch: React.FC<SwitchProps> = (rawProps) => {
  const logic = useSwitchLogic(rawProps);
  const styles = useSwitchStyle(logic);

  return (
    <label style={{ ...styles.wrapper, display: 'inline-flex', cursor: logic.disabled ? 'not-allowed' : 'pointer' } as React.CSSProperties} {...logic.rest}>
      <input 
        type="checkbox" 
        role="switch"
        aria-checked={logic.checked}
        checked={logic.checked} 
        onChange={logic.handlePress} 
        disabled={logic.disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{ ...styles.track, position: 'relative', transition: 'background-color 0.2s ease' } as React.CSSProperties}>
        <div style={{ 
          ...styles.thumb, 
          position: 'absolute', 
          transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
          transform: logic.checked ? 'translateX(20px)' : 'translateX(0px)' 
        } as React.CSSProperties} />
      </div>
      {logic.label && <span style={styles.label as React.CSSProperties}>{logic.label}</span>}
    </label>
  );
};

export default Switch;
