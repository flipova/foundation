import React from 'react';
import { Box, WebBoxProps } from './Box';
import { SpacingToken } from '../../tokens';
import { resolveWebSpacing } from '../utils/themeUtils';

export interface WebStackProps extends WebBoxProps {
  gap?: SpacingToken | number | string;
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

export const Stack: React.FC<WebStackProps> = ({
  gap, align, justify, style, children, ...rest
}) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
        justifyContent: justify,
        gap: resolveWebSpacing(gap),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};
