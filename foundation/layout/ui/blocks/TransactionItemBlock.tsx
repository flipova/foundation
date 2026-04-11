/**
 * TransactionItemBlock — Financial transaction row with icon, merchant, amount, date, and status.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("TransactionItemBlock")!;

export interface TransactionItemBlockProps {
  merchant?: string; category?: string; amount?: string; date?: string;
  type?: "debit" | "credit"; status?: "completed" | "pending" | "failed";
  iconName?: string; iconColor?: string; background?: string; padding?: number; showDivider?: boolean;
}

const STATUS_CONFIG = {
  completed: { color: "#22c55e", label: "Completed" },
  pending:   { color: "#f59e0b", label: "Pending" },
  failed:    { color: "#ef4444", label: "Failed" },
};

const TransactionItemBlock: React.FC<TransactionItemBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<TransactionItemBlockProps>;
  const { merchant, category, amount, date, type, status, iconName, iconColor, background, padding, showDivider } = props;
  const isCredit = type === "credit";
  const amountColor = isCredit ? "#22c55e" : theme.foreground;
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.completed;
  const accent = iconColor || theme.primary;

  return (
    <View style={[s.root, { backgroundColor: background || "transparent", padding: padding * 4,
      borderBottomWidth: showDivider ? 0.5 : 0, borderBottomColor: theme.border }]}>
      <View style={[s.iconWrap, { backgroundColor: accent + "15" }]}>
        <Feather name={(iconName || "credit-card") as any} size={18} color={accent} />
      </View>
      <View style={s.info}>
        <Text style={[s.merchant, { color: theme.foreground }]} numberOfLines={1}>{merchant}</Text>
        <View style={s.meta}>
          {category ? <Text style={[s.metaText, { color: theme.mutedForeground }]}>{category}</Text> : null}
          {date ? <Text style={[s.metaText, { color: theme.mutedForeground }]}>{date}</Text> : null}
        </View>
      </View>
      <View style={s.right}>
        <Text style={[s.amount, { color: amountColor }]}>{isCredit ? "+" : "-"}{amount}</Text>
        <View style={[s.statusBadge, { backgroundColor: statusCfg.color + "15" }]}>
          <Text style={[s.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
        </View>
      </View>
    </View>
  );
};

export default TransactionItemBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  info: { flex: 1 },
  merchant: { fontSize: 14, fontWeight: "500" },
  meta: { flexDirection: "row", gap: 6, marginTop: 2 },
  metaText: { fontSize: 11 },
  right: { alignItems: "flex-end", gap: 4 },
  amount: { fontSize: 15, fontWeight: "700" },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 9, fontWeight: "700" },
});
