/**
 * EmptyStateBlock — Placeholder for empty lists with icon, title, description, and action.
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";
import Center from "../primitives/Center";

const META = getBlockMeta("EmptyStateBlock")!;

export interface EmptyStateBlockProps {
  children?: React.ReactNode; illustration?: React.ReactNode; title?: string;
  description?: string; spacing?: number; showAction?: boolean; actionVariant?: string;
  actionLabel?: string; onAction?: () => void;
}

const EmptyStateBlock: React.FC<EmptyStateBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, illustration, title, description, spacing, showAction, actionLabel } = applyDefaults(rawProps, META, theme) as Required<EmptyStateBlockProps>;

  return (
    <Center py={8 as any}>
      <Stack spacing={spacing as any} align="center">
        {illustration || <Text style={{ fontSize: 48, opacity: 0.3 }}>📭</Text>}
        {title ? <Text style={{ fontSize: 18, fontWeight: "600", color: theme.foreground, textAlign: "center" }}>{title}</Text> : null}
        {description ? <Text style={{ fontSize: 14, color: theme.mutedForeground, textAlign: "center", maxWidth: 280 }}>{description}</Text> : null}
        {children}
        {showAction && (
          <Box bg={theme.primary} borderRadius="md" px={4} py={2}>
            <Text style={{ color: theme.primaryForeground, fontWeight: "600" }}>{actionLabel || "Get started"}</Text>
          </Box>
        )}
      </Stack>
    </Center>
  );
};

export default EmptyStateBlock;
