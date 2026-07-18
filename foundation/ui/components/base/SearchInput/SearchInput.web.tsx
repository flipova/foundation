import React from 'react';
import { useSearchInputLogic, SearchInputProps } from './SearchInput.logic';
import { useSearchInputStyle } from './SearchInput.style';

/**
 * @component SearchInput (Web)
 * @description A specialized input for searching with a clear button.
 */
const SearchInputWeb: React.FC<SearchInputProps> = (rawProps) => {
  const logic = useSearchInputLogic(rawProps);
  const styles = useSearchInputStyle(logic);

  return (

    <div style={styles.container as any} {...logic.rest}>
      <span style={styles.iconLeft as any}>🔍</span>
      <input type="text" value={logic.value} onChange={(e) => logic.handleChangeText?.(e.target.value)} placeholder={logic.placeholder} style={styles.input as any} />
      {logic.value.length > 0 && <button onClick={logic.clear} style={styles.iconRight as any}>✖</button>}
    </div>
  );
};

export default SearchInputWeb;
