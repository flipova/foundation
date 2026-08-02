import React, { useState } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { useSearchInputLogic, SearchInputProps } from './SearchInput.logic';
import { useSearchInputStyle } from './SearchInput.style';
import { isWeb, prefersReducedMotion } from '@/ui/utils/platform';
import { createDebounce, getInputAccessibilityProps } from '@/ui/utils/inputHelpers';

/**
 * @component SearchInput
 * @description A specialized input for searching with configurable debounce and a clear button.
 * 
 * Features:
 * - Configurable debounce delay (default 300ms, 0 for no debounce)
 * - Auto-focus on mount (web only)
 * - Clear button for quick reset
 * - Accessibility optimized with ARIA labels and descriptions
 * - Respects prefers-reduced-motion
 * - Web: Better focus states and smooth transitions
 * - Native: Standard TextInput with Pressable clear button
 * 
 * @web Optimized with debounced search, better focus states, and accessibility
 * @native Uses standard TextInput with Pressable clear button
 */
const SearchInput: React.FC<SearchInputProps> = (rawProps) => {
  const logic = useSearchInputLogic(rawProps);
  const styles = useSearchInputStyle(logic);
  const [isFocused, setIsFocused] = useState(false);
  const a11yProps = getInputAccessibilityProps('Search input', undefined, logic.placeholder);

  const SearchIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: '#64748b' }}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const ClearIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: '#94a3b8' }}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  return (
    <View style={styles.wrapper as any}>
      <View
        style={[
          styles.container as any,
          isFocused && styles.containerFocused as any,
          logic.rest.style,
        ]}
        {...logic.rest}
      >
        <View style={styles.iconLeft as any}>
          <SearchIcon />
        </View>

        {isWeb ? (
          <input
            type="search"
            value={logic.value}
            onChange={(e) => logic.handleChangeText(e.target.value)}
            placeholder={logic.placeholder}
            style={{
              ...styles.input,
              width: 'calc(100% - 60px)',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              fontFamily: 'inherit',
              backgroundColor: 'transparent',
              transition: prefersReducedMotion
                ? 'none'
                : 'box-shadow 0.2s ease-in-out',
            } as any}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            spellCheck="false"
            {...a11yProps}
          />
        ) : (
          <TextInput
            value={logic.value}
            onChangeText={logic.handleChangeText}
            placeholder={logic.placeholder}
            placeholderTextColor="#94a3b8"
            style={styles.input as any}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...a11yProps}
          />
        )}

        {logic.value.length > 0 && (
          <Pressable
            onPress={logic.clear}
            style={styles.iconRight as any}
            accessible
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <ClearIcon />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default SearchInput;
