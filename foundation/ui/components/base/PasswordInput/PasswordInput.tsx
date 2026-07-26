import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { usePasswordInputLogic, PasswordInputProps } from './PasswordInput.logic';
import { usePasswordInputStyle } from './PasswordInput.style';
import { isWeb } from '@/ui/utils/platform';
import { getInputAccessibilityProps } from '@/ui/utils/inputHelpers';

/**
 * @component PasswordInput
 * @description A secure text input with visibility toggle and a visual strength meter.
 * 
 * @web Optimized for HTML5 with proper password input types, accessibility, and caps lock detection
 * @native Uses secureTextEntry and Pressable for visibility toggle
 * 
 * Features:
 * - Password strength meter with 4-level indicator (Weak, Fair, Good, Strong)
 * - Visibility toggle (show/hide password)
 * - Web: Caps Lock detection with visual warning
 * - Web: Better UX with native HTML5 password input
 * - Native: secureTextEntry for secure text rendering
 * - ARIA labels and descriptions for accessibility
 */
const PasswordInput: React.FC<PasswordInputProps> = (rawProps) => {
  const logic = usePasswordInputLogic(rawProps);
  const styles = usePasswordInputStyle(logic);
  const [isFocused, setIsFocused] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const activeBars = logic.strength.score > 0 ? logic.strength.score : 0;
  const inputType = logic.isVisible ? 'text' : 'password';
  const a11yProps = getInputAccessibilityProps(
    'Password input',
    undefined,
    logic.placeholder
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const capsLockOn = e.getModifierState('CapsLock');
    setIsCapsLockOn(capsLockOn);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const capsLockOn = e.getModifierState('CapsLock');
    setIsCapsLockOn(capsLockOn);
  };

  return (
    <View style={styles.wrapper as any}>
      <View style={[styles.container as any, isFocused && styles.containerFocused as any, logic.rest.style]} {...logic.rest}>
        {isWeb ? (
          <>
            {/* Web: Native HTML5 password input with better UX */}
            <input
              type={inputType}
              value={logic.value}
              onChange={(e) => logic.onChangeText?.(e.target.value)}
              placeholder={logic.placeholder}
              style={{
                ...styles.input,
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: 16,
                fontFamily: 'inherit',
                backgroundColor: 'transparent',
              } as any}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                setIsCapsLockOn(false);
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              autoComplete="current-password"
              {...a11yProps}
            />
            <Pressable
              onPress={logic.toggleVisibility}
              style={styles.icon as any}
              accessible
              accessibilityLabel={logic.isVisible ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
            >
              <Text style={styles.iconText as any}>{logic.isVisible ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </>
        ) : (
          <>
            {/* Native: React Native TextInput with secureTextEntry */}
            <TextInput
              secureTextEntry={!logic.isVisible}
              value={logic.value}
              onChangeText={logic.onChangeText}
              placeholder={logic.placeholder}
              placeholderTextColor="#bfbfbf"
              style={styles.input as any}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...a11yProps}
            />
            <Pressable
              onPress={logic.toggleVisibility}
              style={styles.icon as any}
              accessible
              accessibilityLabel={logic.isVisible ? 'Hide password' : 'Show password'}
              accessibilityRole="button"
            >
              <Text style={styles.iconText as any}>{logic.isVisible ? 'Hide' : 'Show'}</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Caps Lock Warning (Web only) */}
      {isWeb && isFocused && isCapsLockOn && !logic.isVisible && (
        <View
          style={{
            padding: 8,
            marginTop: 4,
            backgroundColor: '#fff3cd',
            borderRadius: 4,
            border: '1px solid #ffc107',
          } as any}
          role="alert"
          aria-live="polite"
        >
          <Text style={{ color: '#856404', fontSize: 12 }}>
            ⚠️ Caps Lock is on
          </Text>
        </View>
      )}

      {logic.showStrengthMeter && (
        <View style={styles.strengthContainer as any}>
          <View style={styles.barsContainer as any}>
            {[1, 2, 3, 4].map(index => (
              <View
                key={index}
                style={[
                  styles.strengthBar as any,
                  index <= activeBars && styles.strengthBarActive as any
                ]}
                accessible={index === 1}
                accessibilityLabel={`Password strength: ${logic.value ? logic.strength.label : 'empty'}`}
              />
            ))}
          </View>
          <Text style={styles.strengthText as any} accessibilityLiveRegion="polite">
            {logic.value ? logic.strength.label : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PasswordInput;
