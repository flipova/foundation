import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useSearchInputLogic, SearchInputProps } from './SearchInput.logic';
import { useSearchInputStyle } from './SearchInput.style';

/**
 * @component SearchInput
 * @description A specialized input for searching with debounce and a clear button.
 */
const SearchInput: React.FC<SearchInputProps> = (rawProps) => {
  const logic = useSearchInputLogic(rawProps);
  const styles = useSearchInputStyle(logic);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper as any}>
      <View style={[styles.container as any, isFocused && styles.containerFocused as any, logic.rest.style]} {...logic.rest}>
        <View style={styles.iconLeft as any}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </View>
        
        <TextInput 
          value={logic.value} 
          onChangeText={logic.handleChangeText} 
          placeholder={logic.placeholder} 
          placeholderTextColor="#94a3b8"
          style={styles.input as any} 
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {logic.value.length > 0 && (
          <Pressable onPress={logic.clear} style={styles.iconRight as any}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default SearchInput;
