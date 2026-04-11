/**
 * StatCardBlock — Metric card with value, label, and trend indicator.
 */
import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";
import Inline from "../primitives/Inline";

const META = getBlockMeta("StatCardBlock")!;

export interface StatCardBlockProps {
  children?: React.ReactNode; icon?: React.ReactNode; value?: string; label?: string;
  trend?: string; trendUp?: boolean; background?: string; borderRadius?: string;
  padding?: number; showTrend?: boolean; shadow?: string;
}

const StatCardBlock: React.FC<StatCardBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, icon, value, label, trend, trendUp, background, borderRadius, padding, showTrend } = applyDefaults(rawProps, META, theme) as Required<StatCardBlockProps>;

  return (
    <Box bg={background || theme.card} borderRadius={borderRadius as any} p={padding as any}
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
      <Stack spacing={2}>
        <Inline spacing={2} align="center">
          {icon}
          <Box flex={1} />
          {showTrend && trend ? <Text style={{ fontSize: 12, fontWeight: "600", color: trendUp ? theme.success : theme.error }}>{trend}</Text> : null}
        </Inline>
        <Text style={{ fontSize: 28, fontWeight: "700", color: theme.foreground }}>{value || "0"}</Text>
        <Text style={{ fontSize: 13, color: theme.mutedForeground }}>{label || ""}</Text>
        {children}
      </Stack>
    </Box>
  );
};

export default StatCardBlock;
