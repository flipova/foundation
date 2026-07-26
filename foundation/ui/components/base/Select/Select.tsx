import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import { useSelectLogic, SelectProps } from './Select.logic';
import { useSelectStyle } from './Select.style';
import { Picker } from '@react-native-picker/picker';
import { isWeb } from '@/ui/utils/platform';

/**
 * A dropdown selection component.
 * 
 * **Use Cases:**
 * - Forms requiring the user to choose one option from a long list.
 * - Filters or settings where space is limited and options are mutually exclusive.
 * 
 * **Structure:**
 * Wraps `@react-native-picker/picker` within a styled container view. The Picker fills the container seamlessly using `absoluteFill`.
 * 
 * **Accessibility Considerations:**
 * - The underlying Picker maps to native picker accessibility controls.
 * - Proper ARIA roles and labels for web (aria-invalid, aria-describedby).
 * - Error states with visual feedback and screen reader announcements.
 * - Native: accessibilityLabel and accessibilityRole provided.
 */
const Select: React.FC<SelectProps> = (rawProps) => {
  const logic = useSelectLogic(rawProps);
  const styles = useSelectStyle(logic);

  const combinedStyle = useMemo(() => {
    return [styles.container, logic.rest.style] as StyleProp<ViewStyle>;
  }, [styles.container, logic.rest.style]);

  if (isWeb) {
    return (
      <View style={combinedStyle}>
        <select
          value={logic.value || ''}
          onChange={(e) => logic.onValueChange?.(e.target.value)}
          disabled={logic.disabled}
          onFocus={() => logic.setIsFocused(true)}
          onBlur={() => logic.setIsFocused(false)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: `2px solid ${logic.error ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '6px',
            fontSize: '16px',
            fontFamily: 'inherit',
            backgroundColor: logic.disabled ? '#f3f4f6' : '#ffffff',
            cursor: logic.disabled ? 'not-allowed' : 'pointer',
            opacity: logic.disabled ? 0.6 : 1,
          } as any}
          aria-invalid={!!logic.error}
          aria-describedby={logic.error ? 'select-error' : undefined}
          aria-disabled={logic.disabled}
        >
          {logic.placeholder && (
            <option value="" disabled>
              {logic.placeholder}
            </option>
          )}
          {logic.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {logic.error && (
          <Text
            style={{
              marginTop: 8,
              color: '#ef4444',
              fontSize: 12,
            } as any}
            id="select-error"
            role="alert"
            aria-live="polite"
          >
            {logic.error}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={combinedStyle} {...logic.rest}>
      <Picker
        selectedValue={logic.value}
        onValueChange={(itemValue) => logic.onValueChange?.(itemValue)}
        enabled={!logic.disabled}
        style={StyleSheet.absoluteFill}
        onFocus={() => logic.setIsFocused(true)}
        onBlur={() => logic.setIsFocused(false)}
        accessible
        accessibilityRole="combobox"
        accessibilityLabel="Select option"
        accessibilityState={{ disabled: logic.disabled }}
      >
        {logic.placeholder ? <Picker.Item label={logic.placeholder} value="" color="#999" /> : null}
        {logic.options.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
      {logic.error && (
        <Text
          style={{ marginTop: 8, color: '#ef4444', fontSize: 12 } as any}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {logic.error}
        </Text>
      )}
    </View>
  );
};

export default Select;
