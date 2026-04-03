/**
 * HeaderBlock
 *
 * Top navigation bar with title, optional back/left action, and right actions.
 */

import React from "react";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { SpacingToken } from "../../../tokens";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Inline from "../primitives/Inline";

const META = getBlockMeta("HeaderBlock")!;

export interface HeaderBlockProps {
  title: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode[];
  height?: number;
  background?: string;
  borderBottom?: boolean;
  padding?: SpacingToken;
  transparent?: boolean;
}

const HeaderBlock: React.FC<HeaderBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    title, left, right, height, background,
    borderBottom, padding, transparent,
  } = applyDefaults(rawProps, META, theme) as Required<HeaderBlockProps>;

  const bg = transparent ? "transparent" : background;

  return (
    <Box
      height={height}
      bg={bg}
      px={padding}
      justifyContent="center"
      style={borderBottom ? { borderBottomWidth: 1, borderBottomColor: theme.border } : undefined}
    >
      <Inline justify="space-between" align="center" fillWidth>
        <Box width={44} alignItems="flex-start">
          {left}
        </Box>

        <Box flex={1} alignItems="center">
          {typeof title === "string" ? null : title}
        </Box>

        <Inline spacing={2} align="center" justify="flex-end" style={{ minWidth: 44 }}>
          {right?.map((action, i) => (
            <React.Fragment key={i}>{action}</React.Fragment>
          ))}
        </Inline>
      </Inline>
    </Box>
  );
};

export default HeaderBlock;
