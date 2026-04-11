/**
 * FormBlock — Form container with submit button and optional reset.
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";

const META = getBlockMeta("FormBlock")!;

export interface FormBlockProps {
  children?: React.ReactNode; header?: React.ReactNode; footer?: React.ReactNode;
  spacing?: number; padding?: number; background?: string; borderRadius?: string;
  showReset?: boolean; submitLabel?: string; submitVariant?: string; validateOnBlur?: boolean;
  onSubmit?: () => void; onReset?: () => void;
}

const FormBlock: React.FC<FormBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, header, footer, spacing, padding, background, borderRadius, showReset, submitLabel } = applyDefaults(rawProps, META, theme) as Required<FormBlockProps>;

  return (
    <Box bg={background || theme.card} borderRadius={borderRadius as any} p={padding as any}>
      <Stack spacing={spacing as any}>
        {header}
        {children}
        {footer || (
          <Box bg={theme.primary} borderRadius="md" py={3} alignItems="center">
            <Text style={{ color: theme.primaryForeground, fontWeight: "600", fontSize: 15 }}>{submitLabel || "Submit"}</Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default FormBlock;
