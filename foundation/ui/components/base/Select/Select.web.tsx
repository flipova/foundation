import React from 'react';
import { useSelectLogic, SelectProps } from './Select.logic';
import { useSelectStyle } from './Select.style';

/**
 * Role: Provides a dropdown menu for users to pick a single value from a list.
 * UseCases: Best suited for forms or settings where options are numerous and space is limited.
 * Structure: Renders a native `<select>` element styled customly with an absolute-positioned dropdown icon overlay.
 * Accessibility: Native `<select>` elements are naturally accessible and support standard keyboard interactions and screen reader announcements.
 */
const Select: React.FC<SelectProps> = (rawProps) => {
  const logic = useSelectLogic(rawProps);
  const styles = useSelectStyle(logic);

  return (
    <div style={{ ...logic.rest.style, position: 'relative' } as React.CSSProperties} {...logic.rest}>
      <select
        style={{
          ...styles.container,
          width: '100%',
          appearance: 'none',
          outline: 'none',
          boxShadow: logic.isFocused ? `0 0 0 2px ${styles.container.borderColor}40` : 'none',
          cursor: logic.disabled ? 'not-allowed' : 'pointer',
          color: styles.text.color,
          fontSize: styles.text.fontSize,
        } as React.CSSProperties}
        value={logic.value || ''}
        onChange={(e) => logic.onValueChange?.(e.target.value)}
        disabled={logic.disabled}
        onFocus={() => logic.setIsFocused(true)}
        onBlur={() => logic.setIsFocused(false)}
      >
        {logic.placeholder && <option value="" disabled>{logic.placeholder}</option>}
        {logic.options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={styles.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default Select;
