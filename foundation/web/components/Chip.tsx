import React from 'react';
import { useTheme } from '../../theme/providers/ThemeProvider';
import { resolveWebSpacing, resolveWebRadius } from '../utils/themeUtils';

export interface WebChipProps {
  label: string;
  onDismiss?: () => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Chip: React.FC<WebChipProps> = ({
  label,
  onDismiss,
  onClick,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: resolveWebSpacing('xs') || '4px',
        padding: `4px ${resolveWebSpacing('sm') || '8px'}`,
        fontSize: '12px',
        fontWeight: 500,
        borderRadius: resolveWebRadius('full') || '9999px',
        backgroundColor: theme.secondary,
        color: theme.secondaryForeground,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        ...style,
      }}
    >
      {label}
      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          style={{
            border: 'none',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            fontSize: '12px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      )}
    </span>
  );
};
