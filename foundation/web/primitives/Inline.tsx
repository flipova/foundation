import React from 'react';
import { Box, WebBoxProps } from './Box';
import { SpacingToken } from '../../tokens';
import { resolveWebSpacing } from '../utils/themeUtils';

export interface WebInlineProps extends WebBoxProps {
  gap?: SpacingToken | number | string;
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: boolean;
}

export const Inline: React.FC<WebInlineProps> = ({
  gap, align = 'center', justify, wrap = false, style, children, ...rest
}) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: resolveWebSpacing(gap),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};
