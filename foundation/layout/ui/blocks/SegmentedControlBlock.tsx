/**
 * SegmentedControlBlock — iOS-style segmented control / tab switcher.
 */
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("SegmentedControlBlock")!;

export interface Segment { label: string; value: string; }

export interface SegmentedControlBlockProps {
  segments?: Segment[]; value?: string; background?: string;
  activeBackground?: string; activeColor?: string; inactiveColor?: string;
  size?: "sm" | "md" | "lg"; fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const SIZE_MAP = { sm: { h: 30, font: 11 }, md: { h: 38, font: 13 }, lg: { h: 46, font: 15 } };

const SegmentedControlBlock: React.FC<SegmentedControlBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<SegmentedControlBlockProps>;
  const { segments = [], value: extVal, background, activeBackground, activeColor, inactiveColor, size, fullWidth, onChange } = props;
  const [internal, setInternal] = useState(segments[0]?.value ?? "");
  const active = extVal ?? internal;
  const { h, font } = SIZE_MAP[size] ?? SIZE_MAP.md;
  const activeBg = activeBackground || theme.card;
  const bg = background || theme.muted;

  const select = (val: string) => { setInternal(val); onChange?.(val); };

  return (
    <View style={[s.root, { backgroundColor: bg, height: h, borderRadius: h / 2, padding: 3, alignSelf: fullWidth ? "stretch" : "flex-start" }]}>
      {segments.map(seg => {
        const isActive = seg.value === active;
        return (
          <Pressable key={seg.value} onPress={() => select(seg.value)}
            style={[s.seg, { flex: fullWidth ? 1 : undefined, height: h - 6, borderRadius: (h - 6) / 2,
              backgroundColor: isActive ? activeBg : "transparent",
              shadowColor: isActive ? "#000" : "transparent", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: isActive ? 2 : 0 }]}>
            <Text style={[s.label, { fontSize: font, color: isActive ? (activeColor || theme.foreground) : (inactiveColor || theme.mutedForeground),
              fontWeight: isActive ? "600" : "400" }]}>
              {seg.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SegmentedControlBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center" },
  seg: { paddingHorizontal: 14, alignItems: "center", justifyContent: "center" },
  label: {},
});
