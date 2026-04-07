/**
 * FileItemBlock — File list item with icon, name, size, type badge, and actions.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("FileItemBlock")!;

export interface FileItemBlockProps {
  name?: string; size?: string; type?: string; updatedAt?: string;
  background?: string; padding?: number; showDivider?: boolean; pressable?: boolean;
  onPress?: () => void; onDownload?: () => void; onDelete?: () => void;
}

const EXT_ICONS: Record<string, { icon: string; color: string }> = {
  pdf:  { icon: "file-text", color: "#ef4444" },
  doc:  { icon: "file-text", color: "#3b82f6" },
  docx: { icon: "file-text", color: "#3b82f6" },
  xls:  { icon: "grid",      color: "#22c55e" },
  xlsx: { icon: "grid",      color: "#22c55e" },
  png:  { icon: "image",     color: "#a855f7" },
  jpg:  { icon: "image",     color: "#a855f7" },
  jpeg: { icon: "image",     color: "#a855f7" },
  mp4:  { icon: "film",      color: "#f59e0b" },
  zip:  { icon: "archive",   color: "#6b7280" },
};

const FileItemBlock: React.FC<FileItemBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<FileItemBlockProps>;
  const { name, size, type, updatedAt, background, padding, showDivider, pressable, onPress, onDownload, onDelete } = props;
  const ext = (type || name?.split(".").pop() || "").toLowerCase();
  const cfg = EXT_ICONS[ext] || { icon: "file", color: theme.mutedForeground };
  const Wrapper = pressable ? Pressable : View;

  return (
    <Wrapper onPress={pressable ? onPress : undefined}
      style={[s.root, { backgroundColor: background || "transparent", padding: padding * 4,
        borderBottomWidth: showDivider ? 0.5 : 0, borderBottomColor: theme.border }]}>
      <View style={[s.iconWrap, { backgroundColor: cfg.color + "15" }]}>
        <Feather name={cfg.icon as any} size={20} color={cfg.color} />
      </View>
      <View style={s.info}>
        <Text style={[s.name, { color: theme.foreground }]} numberOfLines={1}>{name}</Text>
        <View style={s.meta}>
          {size ? <Text style={[s.metaText, { color: theme.mutedForeground }]}>{size}</Text> : null}
          {updatedAt ? <Text style={[s.metaText, { color: theme.mutedForeground }]}>{updatedAt}</Text> : null}
        </View>
      </View>
      <View style={s.actions}>
        {onDownload && <Pressable onPress={onDownload} style={s.actionBtn}><Feather name="download" size={16} color={theme.mutedForeground} /></Pressable>}
        {onDelete && <Pressable onPress={onDelete} style={s.actionBtn}><Feather name="trash-2" size={16} color={theme.destructive} /></Pressable>}
      </View>
    </Wrapper>
  );
};

export default FileItemBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: { width: 42, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "500" },
  meta: { flexDirection: "row", gap: 8, marginTop: 2 },
  metaText: { fontSize: 11 },
  actions: { flexDirection: "row", gap: 4 },
  actionBtn: { padding: 6 },
});
