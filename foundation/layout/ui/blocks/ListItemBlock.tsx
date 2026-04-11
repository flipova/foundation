/**
 * ListItemBlock — Standard list row with leading, title, subtitle, and trailing.
 */
import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Inline from "../primitives/Inline";

const META = getBlockMeta("ListItemBlock")!;

export interface ListItemBlockProps {
  children?: React.ReactNode; leading?: React.ReactNode; trailing?: React.ReactNode;
  title?: string; subtitle?: string; height?: number; spacing?: number;
  showDivider?: boolean; pressable?: boolean; background?: string; padding?: number;
  onPress?: () => void;
}

const ListItemBlock: React.FC<ListItemBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, leading, trailing, title, subtitle, height, showDivider, pressable, background, padding, onPress } = applyDefaults(rawProps, META, theme) as Required<ListItemBlockProps>;
  const Wrapper = pressable ? Pressable : Box as any;

  return (
    <Wrapper onPress={pressable ? onPress : undefined} style={{ minHeight: height }}>
      <Box bg={background || theme.card} px={padding as any} py={3}
        style={showDivider ? { borderBottomWidth: 0.5, borderBottomColor: theme.border } : {}}>
        <Inline spacing={3} align="center">
          {leading}
          <Box flex={1}>
            {title ? <Text style={{ fontSize: 15, fontWeight: "500", color: theme.foreground }}>{title}</Text> : null}
            {subtitle ? <Text style={{ fontSize: 13, color: theme.mutedForeground }}>{subtitle}</Text> : null}
            {children}
          </Box>
          {trailing}
        </Inline>
      </Box>
    </Wrapper>
  );
};

export default ListItemBlock;
