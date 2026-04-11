/**
 * ModalBlock — Modal overlay with content, close button, and backdrop.
 */
import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";
import Center from "../primitives/Center";

const META = getBlockMeta("ModalBlock")!;

export interface ModalBlockProps {
  children?: React.ReactNode; footer?: React.ReactNode; padding?: number;
  background?: string; borderRadius?: string; maxWidth?: number;
  showClose?: boolean; backdropClose?: boolean; onClose?: () => void;
}

const ModalBlock: React.FC<ModalBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, footer, padding, background, borderRadius, maxWidth, showClose } = applyDefaults(rawProps, META, theme) as Required<ModalBlockProps>;

  return (
    <Box bg={background || theme.card} borderRadius={borderRadius as any} p={padding as any}
      style={{ maxWidth, width: "100%", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8 }}>
      {showClose && (
        <Pressable style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
          <Text style={{ fontSize: 18, color: theme.mutedForeground }}>✕</Text>
        </Pressable>
      )}
      <Stack spacing={4 as any}>
        {children}
        {footer}
      </Stack>
    </Box>
  );
};

export default ModalBlock;
