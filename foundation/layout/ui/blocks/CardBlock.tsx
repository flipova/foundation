/**
 * CardBlock — Content card with optional media, title, description, and actions.
 */
import React from "react";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";

const META = getBlockMeta("CardBlock")!;

export interface CardBlockProps {
  children?: React.ReactNode; media?: React.ReactNode; actions?: React.ReactNode;
  padding?: number; spacing?: number; background?: string; borderRadius?: string;
  shadow?: string; pressable?: boolean;
}

const CardBlock: React.FC<CardBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, media, actions, padding, spacing, background, borderRadius } = applyDefaults(rawProps, META, theme) as Required<CardBlockProps>;

  return (
    <Box bg={background || theme.card} borderRadius={borderRadius as any} overflow="hidden"
      style={{ shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
      {media}
      <Box p={padding as any}>
        <Stack spacing={spacing as any}>
          {children}
          {actions}
        </Stack>
      </Box>
    </Box>
  );
};

export default CardBlock;
