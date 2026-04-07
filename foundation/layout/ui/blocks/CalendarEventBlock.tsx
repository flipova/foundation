/**
 * CalendarEventBlock — Event card with date badge, title, time, location, and attendees.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("CalendarEventBlock")!;

export interface CalendarEventBlockProps {
  title?: string; date?: string; dayNumber?: string; month?: string;
  startTime?: string; endTime?: string; location?: string;
  attendeeCount?: number; color?: string; background?: string;
  borderRadius?: string; padding?: number;
  onPress?: () => void;
}

const CalendarEventBlock: React.FC<CalendarEventBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<CalendarEventBlockProps>;
  const { title, date, dayNumber, month, startTime, endTime, location, attendeeCount, color, background, padding, onPress } = props;
  const accent = color || theme.primary;

  return (
    <View style={[s.root, { backgroundColor: background || theme.card, padding: padding * 4, borderRadius: 14,
      borderLeftWidth: 4, borderLeftColor: accent,
      shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }]}>
      <View style={[s.dateBadge, { backgroundColor: accent + "15" }]}>
        <Text style={[s.dayNum, { color: accent }]}>{dayNumber}</Text>
        <Text style={[s.month, { color: accent }]}>{month}</Text>
      </View>
      <View style={s.content}>
        <Text style={[s.title, { color: theme.foreground }]} numberOfLines={2}>{title}</Text>
        {(startTime || endTime) && (
          <View style={s.row}>
            <Feather name="clock" size={11} color={theme.mutedForeground} />
            <Text style={[s.meta, { color: theme.mutedForeground }]}>{[startTime, endTime].filter(Boolean).join(" – ")}</Text>
          </View>
        )}
        {location && (
          <View style={s.row}>
            <Feather name="map-pin" size={11} color={theme.mutedForeground} />
            <Text style={[s.meta, { color: theme.mutedForeground }]} numberOfLines={1}>{location}</Text>
          </View>
        )}
        {attendeeCount ? (
          <View style={s.row}>
            <Feather name="users" size={11} color={theme.mutedForeground} />
            <Text style={[s.meta, { color: theme.mutedForeground }]}>{attendeeCount} attendees</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default CalendarEventBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  dateBadge: { width: 48, borderRadius: 10, alignItems: "center", justifyContent: "center", paddingVertical: 8 },
  dayNum: { fontSize: 20, fontWeight: "800", lineHeight: 22 },
  month: { fontSize: 10, fontWeight: "600", textTransform: "uppercase" },
  content: { flex: 1, gap: 4 },
  title: { fontSize: 14, fontWeight: "600", lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 5 },
  meta: { fontSize: 11 },
});
