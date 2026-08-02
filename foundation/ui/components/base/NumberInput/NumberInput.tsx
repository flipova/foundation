import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useNumberInputLogic, NumberInputProps } from './NumberInput.logic';
import { useNumberInputStyle } from './NumberInput.style';

/**
 * @component NumberInput
 * @description A highly robust numeric input with increment/decrement steppers and format validation.
 */
const NumberInput: React.FC<NumberInputProps> = (rawProps) => {
  const logic = useNumberInputLogic(rawProps);
  const styles = useNumberInputStyle(logic);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, logic.rest.style]} {...logic.rest}>
        <Pressable 
          onPress={logic.decrement} 
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        
        <TextInput
          style={styles.input}
          value={logic.textValue}
          onChangeText={logic.handleTextChange}
          onFocus={() => logic.setIsFocused(true)}
          onBlur={logic.handleBlur}
          keyboardType={logic.allowDecimal ? 'decimal-pad' : 'number-pad'}
        />

        <Pressable 
          onPress={logic.increment} 
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
      {logic.error ? <Text style={styles.errorText}>{logic.error}</Text> : null}
    </View>
  );
};

export default NumberInput;
