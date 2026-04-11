/**
 * BannerBlock — Dismissible info/warning/error/success banner with icon and action.
 */
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("BannerBlock")!;

export interface BannerBlockProps {
  type?: "info" | "success" | "warning" | "error"; title?: string; message?: string;
  actionLabel?: string; dismissible?: boolean; icon?: string;
  borderRadius?: string; padding?: number;
  onAction?: () => void; onDismiss?: () => void;
}

const TYPE_CONFIG = {
  info:    { bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  icon: "info",          color: "#3b82f6" },
  success: { bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   icon: "check-circle",  color: "#22c55e" },
  warning: { bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  icon: "alert-triangle", color: "#f59e0b" },
  error:   { bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.3)",   icon: "alert-circle",  color: "#ef4444" },
};

const BannerBlock: React.FC<BannerBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<BannerBlockProps>;
  const { type, title, message, actionLabel, dismissible, icon, padding, onAction, onDismiss } = props;
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;

  const handleDismiss = () => { setDismissed(true); onDismiss?.(); };

  return (
    <View style={[s.root, { backgroundColor: cfg.bg, borderColor: cfg.border, padding: padding * 4 }]}>
      <Feather name={(icon || cfg.icon) as any} size={16} color={cfg.color} style={s.icon} />
      <View style={s.content}>
        {title ? <Text style={[s.title, { color: cfg.color }]}>{title}</Text> : null}
        {message ? <Text style={[s.message, { color: theme.foreground }]}>{message}</Text> : null}
        {actionLabel && onAction && (
          <Pressable onPress={onAction} style={s.action}>
            <Text style={[s.actionText, { color: cfg.color }]}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
      {dismissible && (
        <Pressable onPress={handleDismiss} style={s.dismiss}>
          <Feather name="x" size={14} color={theme.mutedForeground} />
        </Pressable>
      )}
    </View>
  );
};

export default BannerBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderWidth: 1, borderRadius: 10 },
  icon: { marginTop: 1, flexShrink: 0 },
  content: { flex: 1, gap: 3 },
  title: { fontSize: 13, fontWeight: "700" },
  message: { fontSize: 12, lineHeight: 16 },
  action: { marginTop: 4 },
  actionText: { fontSize: 12, fontWeight: "600" },
  dismiss: { padding: 2 },
});
