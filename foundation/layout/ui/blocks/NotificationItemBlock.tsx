/**
 * NotificationItemBlock — Notification row with icon, title, body, timestamp, and read state.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("NotificationItemBlock")!;

export interface NotificationItemBlockProps {
  title?: string; body?: string; timestamp?: string; read?: boolean;
  iconName?: string; iconColor?: string; background?: string;
  padding?: number; showDivider?: boolean; pressable?: boolean;
  onPress?: () => void; onDismiss?: () => void;
}

const NotificationItemBlock: React.FC<NotificationItemBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<NotificationItemBlockProps>;
  const { title, body, timestamp, read, iconName, iconColor, background, padding, showDivider, pressable, onPress, onDismiss } = props;
  const Wrapper = pressable ? Pressable : View;

  return (
    <Wrapper onPress={pressable ? onPress : undefined}
      style={[s.root, { backgroundColor: read ? "transparent" : (background || theme.card), padding: padding * 4,
        borderBottomWidth: showDivider ? 0.5 : 0, borderBottomColor: theme.border }]}>
      <View style={[s.dot, { backgroundColor: read ? "transparent" : theme.primary }]} />
      <View style={[s.iconWrap, { backgroundColor: (iconColor || theme.primary) + "20" }]}>
        <Feather name={(iconName || "bell") as any} size={18} color={iconColor || theme.primary} />
      </View>
      <View style={s.content}>
        <Text style={[s.title, { color: theme.foreground, fontWeight: read ? "400" : "600" }]} numberOfLines={1}>{title}</Text>
        {body ? <Text style={[s.body, { color: theme.mutedForeground }]} numberOfLines={2}>{body}</Text> : null}
        {timestamp ? <Text style={[s.ts, { color: theme.mutedForeground }]}>{timestamp}</Text> : null}
      </View>
      {onDismiss && (
        <Pressable onPress={onDismiss} style={s.dismiss}>
          <Feather name="x" size={14} color={theme.mutedForeground} />
        </Pressable>
      )}
    </Wrapper>
  );
};

export default NotificationItemBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6, flexShrink: 0 },
  iconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  content: { flex: 1, gap: 2 },
  title: { fontSize: 14, lineHeight: 18 },
  body: { fontSize: 12, lineHeight: 16 },
  ts: { fontSize: 10, marginTop: 2 },
  dismiss: { padding: 4 },
});
