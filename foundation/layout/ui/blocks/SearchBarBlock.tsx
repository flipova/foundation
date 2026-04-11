/**
 * SearchBarBlock — Search input with icon and optional filter button.
 */
import React from "react";
import { TextInput as RNTextInput, Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Inline from "../primitives/Inline";

const META = getBlockMeta("SearchBarBlock")!;

export interface SearchBarBlockProps {
  children?: React.ReactNode; filters?: React.ReactNode; value?: string;
  onChangeText?: (t: string) => void; placeholder?: string; background?: string;
  borderRadius?: string; showFilter?: boolean; inputVariant?: string;
}

const SearchBarBlock: React.FC<SearchBarBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { filters, value, onChangeText, placeholder, background, borderRadius, showFilter } = applyDefaults(rawProps, META, theme) as Required<SearchBarBlockProps>;

  return (
    <Box bg={background || theme.muted} borderRadius={borderRadius as any} px={3} py={2}>
      <Inline spacing={2} align="center">
        <Text style={{ fontSize: 16, color: theme.mutedForeground }}>🔍</Text>
        <RNTextInput value={value} onChangeText={onChangeText} placeholder={placeholder || "Search..."}
          placeholderTextColor={theme.mutedForeground}
          style={{ flex: 1, fontSize: 15, color: theme.foreground, paddingVertical: 6 }} />
        {showFilter && filters}
      </Inline>
    </Box>
  );
};

export default SearchBarBlock;
