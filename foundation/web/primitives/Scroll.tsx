import React from 'react';
import { Box, WebBoxProps } from './Box';

export interface WebScrollProps extends WebBoxProps {
  direction?: 'vertical' | 'horizontal' | 'both';
  hideScrollbar?: boolean;
}

export const Scroll: React.FC<WebScrollProps> = ({
  direction = 'vertical',
  hideScrollbar = false,
  style,
  children,
  ...rest
}) => {
  const overflowY = direction === 'vertical' || direction === 'both' ? 'auto' : 'hidden';
  const overflowX = direction === 'horizontal' || direction === 'both' ? 'auto' : 'hidden';

  return (
    <Box
      style={{
        overflowY,
        overflowX,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: hideScrollbar ? 'none' : undefined,
        msOverflowStyle: hideScrollbar ? 'none' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};
