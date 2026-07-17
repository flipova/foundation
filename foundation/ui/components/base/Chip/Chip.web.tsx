import React from 'react';
import { useChipLogic, ChipProps } from './Chip.logic';
import { useChipStyle } from './Chip.style';
import { X } from 'lucide-react';

/**
 * @component Chip (Web)
 * @description A compact interactive element that represents an input, attribute, or action.
 * @useCases Used for displaying tags, selected categories, filtering options, or interactive contact pills.
 * @structure A small container with a label and an optional delete button icon.
 * @accessibility The delete button includes interactive focus states, though aria-labels should be provided if the icon acts alone without text.
 */
const Chip: React.FC<ChipProps> = (rawProps) => {
  const logic = useChipLogic(rawProps);
  const styles = useChipStyle(logic);

  return (
    <div 
      style={{ ...styles.container, display: 'inline-flex', cursor: logic.disabled ? 'not-allowed' : logic.onPress ? 'pointer' : 'default' } as React.CSSProperties} 
      onClick={logic.disabled ? undefined : logic.onPress}
      {...logic.rest}
    >
      <span style={styles.label as React.CSSProperties}>{logic.label}</span>
      {logic.onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); logic.onDelete!(); }} 
          disabled={logic.disabled}
          style={{ background: 'transparent', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <X size={14} color={styles.iconColor} />
        </button>
      )}
    </div>
  );
};

export default Chip;
