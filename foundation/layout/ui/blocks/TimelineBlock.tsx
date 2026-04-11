/**
 * TimelineBlock — Vertical timeline with events, icons, and timestamps.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("TimelineBlock")!;

export interface TimelineEvent {
  title: string; description?: string; timestamp?: string;
  iconName?: string; iconColor?: string; completed?: boolean;
}

export interface TimelineBlockProps {
  events?: TimelineEvent[]; accentColor?: string; lineColor?: string;
  spacing?: number; showConnector?: boolean;
}

const TimelineBlock: React.FC<TimelineBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<TimelineBlockProps>;
  const { events = [], accentColor, lineColor, spacing, showConnector } = props;
  const accent = accentColor || theme.primary;
  const line = lineColor || theme.border;

  return (
    <View style={{ gap: spacing * 4 }}>
      {events.map((ev, i) => {
        const color = ev.iconColor || (ev.completed ? accent : theme.mutedForeground);
        return (
          <View key={i} style={s.row}>
            <View style={s.left}>
              <View style={[s.dot, { backgroundColor: ev.completed ? accent : theme.muted, borderColor: color }]}>
                <Feather name={(ev.iconName || "circle") as any} size={12} color={ev.completed ? "#fff" : color} />
              </View>
              {showConnector && i < events.length - 1 && <View style={[s.line, { backgroundColor: line }]} />}
            </View>
            <View style={s.content}>
              <View style={s.titleRow}>
                <Text style={[s.title, { color: theme.foreground }]}>{ev.title}</Text>
                {ev.timestamp ? <Text style={[s.ts, { color: theme.mutedForeground }]}>{ev.timestamp}</Text> : null}
              </View>
              {ev.description ? <Text style={[s.desc, { color: theme.mutedForeground }]}>{ev.description}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default TimelineBlock;

const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  left: { alignItems: "center", width: 28 },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 2, zIndex: 1 },
  line: { flex: 1, width: 2, marginTop: 4 },
  content: { flex: 1, paddingBottom: 4 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 14, fontWeight: "600" },
  ts: { fontSize: 10 },
  desc: { fontSize: 12, lineHeight: 16, marginTop: 2 },
});
