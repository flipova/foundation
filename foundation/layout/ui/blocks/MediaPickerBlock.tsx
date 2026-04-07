/**
 * MediaPickerBlock — Image/video picker with preview grid and add button.
 */
import React from "react";
import { View, Text, Pressable, Image, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("MediaPickerBlock")!;

export interface MediaItem { uri: string; type?: "image" | "video"; }

export interface MediaPickerBlockProps {
  items?: MediaItem[]; maxItems?: number; label?: string; columns?: number;
  itemSize?: number; background?: string; accentColor?: string;
  onAdd?: () => void; onRemove?: (index: number) => void; onPress?: (item: MediaItem, index: number) => void;
}

const MediaPickerBlock: React.FC<MediaPickerBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<MediaPickerBlockProps>;
  const { items = [], maxItems, label, columns, itemSize, background, accentColor, onAdd, onRemove, onPress } = props;
  const accent = accentColor || theme.primary;
  const canAdd = !maxItems || items.length < maxItems;

  return (
    <View style={s.root}>
      {label ? <Text style={[s.label, { color: theme.foreground }]}>{label}</Text> : null}
      <View style={[s.grid, { gap: 8 }]}>
        {items.map((item, i) => (
          <Pressable key={i} onPress={() => onPress?.(item, i)}
            style={[s.item, { width: itemSize, height: itemSize, borderRadius: 10, backgroundColor: background || theme.muted }]}>
            <Image source={{ uri: item.uri }} style={[StyleSheet.absoluteFill, { borderRadius: 10 }]} resizeMode="cover" />
            {item.type === "video" && (
              <View style={s.videoOverlay}><Feather name="play" size={18} color="#fff" /></View>
            )}
            {onRemove && (
              <Pressable onPress={() => onRemove(i)} style={[s.removeBtn, { backgroundColor: theme.destructive }]}>
                <Feather name="x" size={10} color="#fff" />
              </Pressable>
            )}
          </Pressable>
        ))}
        {canAdd && onAdd && (
          <Pressable onPress={onAdd}
            style={[s.addBtn, { width: itemSize, height: itemSize, borderRadius: 10, borderColor: accent, backgroundColor: accent + "10" }]}>
            <Feather name="plus" size={24} color={accent} />
            <Text style={[s.addText, { color: accent }]}>Add</Text>
          </Pressable>
        )}
      </View>
      {maxItems && <Text style={[s.count, { color: theme.mutedForeground }]}>{items.length}/{maxItems}</Text>}
    </View>
  );
};

export default MediaPickerBlock;

const s = StyleSheet.create({
  root: { gap: 8 },
  label: { fontSize: 12, fontWeight: "500" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  item: { overflow: "hidden", position: "relative" },
  videoOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  removeBtn: { position: "absolute", top: 4, right: 4, width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  addBtn: { alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderStyle: "dashed", gap: 4 },
  addText: { fontSize: 10, fontWeight: "600" },
  count: { fontSize: 10, textAlign: "right" },
});
