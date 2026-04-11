/**
 * AvatarBlock — Avatar with name, subtitle, and optional action.
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";
import Inline from "../primitives/Inline";
import Avatar from "../components/Avatar";

const META = getBlockMeta("AvatarBlock")!;

export interface AvatarBlockProps {
  children?: React.ReactNode; action?: React.ReactNode; name?: string; subtitle?: string;
  source?: string; initials?: string; size?: string; direction?: "row" | "column";
  spacing?: number; showSubtitle?: boolean;
}

const AvatarBlock: React.FC<AvatarBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, action, name, subtitle, source, initials, size, direction, spacing, showSubtitle } = applyDefaults(rawProps, META, theme) as Required<AvatarBlockProps>;
  const Wrapper = direction === "column" ? Stack : Inline;

  return (
    <Wrapper spacing={spacing as any} align="center">
      <Avatar source={source} initials={initials} size={size as any} />
      <Box flex={direction === "row" ? 1 : undefined}>
        {name ? <Text style={{ fontSize: 15, fontWeight: "600", color: theme.foreground }}>{name}</Text> : null}
        {showSubtitle && subtitle ? <Text style={{ fontSize: 13, color: theme.mutedForeground }}>{subtitle}</Text> : null}
        {children}
      </Box>
      {action}
    </Wrapper>
  );
};

export default AvatarBlock;
