import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { usePasswordInputLogic, PasswordInputProps } from './PasswordInput.logic';
import { usePasswordInputStyle } from './PasswordInput.style';

/**
 * @component PasswordInput
 * @description A secure text input with visibility toggle and a visual strength meter.
 */
const PasswordInput: React.FC<PasswordInputProps> = (rawProps) => {
  const logic = usePasswordInputLogic(rawProps);
  const styles = usePasswordInputStyle(logic);
  const [isFocused, setIsFocused] = useState(false);

  const activeBars = logic.strength.score > 0 ? logic.strength.score : 0;

  return (
    <View style={styles.wrapper as any}>
      <View style={[styles.container as any, isFocused && styles.containerFocused as any, logic.rest.style]} {...logic.rest}>
        <TextInput 
          secureTextEntry={!logic.isVisible} 
          value={logic.value} 
          onChangeText={logic.onChangeText} 
          placeholder={logic.placeholder} 
          placeholderTextColor="#bfbfbf"
          style={styles.input as any} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Pressable onPress={logic.toggleVisibility} style={styles.icon as any}>
          <Text style={styles.iconText as any}>{logic.isVisible ? 'Hide' : 'Show'}</Text>
        </Pressable>
      </View>
      
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
              />
            ))}
          </View>
          <Text style={styles.strengthText as any}>
            {logic.value ? logic.strength.label : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PasswordInput;
