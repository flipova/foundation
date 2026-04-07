/**
 * ToastBlock — Notification toast with icon, message, and auto-dismiss.
 */
import React from "react";
import { Text, Pressable } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Inline from "../primitives/Inline";

const META = getBlockMeta("ToastBlock")!;

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  info: { icon: "ℹ️", color: "#3b82f6" },
  success: { icon: "✅", color: "#22c55e" },
  warning: { icon: "⚠️", color: "#f59e0b" },
  error: { icon: "❌", color: "#ef4444" },
};

export interface ToastBlockProps {
  children?: React.ReactNode; message?: string; type?: "info" | "success" | "warning" | "error";
  position?: "top" | "bottom"; duration?: number; showIcon?: boolean;
  dismissible?: boolean; borderRadius?: string; onDismiss?: () => void;
}

const ToastBlock: React.FC<ToastBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, message, type, showIcon, dismissible, borderRadius } = applyDefaults(rawProps, META, theme) as Required<ToastBlockProps>;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;

  return (
    <Box bg={theme.card} borderRadius={borderRadius as any} px={4 as any} py={3 as any}
      style={{ borderLeftWidth: 4, borderLeftColor: cfg.color, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
      <Inline spacing={3 as any} align="center">
        {showIcon && <Text style={{ fontSize: 16 }}>{cfg.icon}</Text>}
        <Box flex={1}>
          {children || <Text style={{ fontSize: 14, color: theme.foreground }}>{message || "Notification"}</Text>}
        </Box>
        {dismissible && (
          <Pressable><Text style={{ fontSize: 14, color: theme.mutedForeground }}>✕</Text></Pressable>
        )}
      </Inline>
    </Box>
  );
};

export default ToastBlock;
