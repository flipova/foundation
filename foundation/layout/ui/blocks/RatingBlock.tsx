/**
 * RatingBlock — Star rating input or display with half-star support.
 */
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("RatingBlock")!;

export interface RatingBlockProps {
  value?: number; maxStars?: number; readonly?: boolean; size?: "sm" | "md" | "lg";
  activeColor?: string; inactiveColor?: string; showValue?: boolean; label?: string;
  onChange?: (value: number) => void;
}

const SIZE_MAP = { sm: 16, md: 22, lg: 30 };

const RatingBlock: React.FC<RatingBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<RatingBlockProps>;
  const { value, maxStars, readonly, size, activeColor, inactiveColor, showValue, label, onChange } = props;
  const [hovered, setHovered] = useState<number | null>(null);
  const starSize = SIZE_MAP[size] ?? 22;
  const active = activeColor || "#f59e0b";
  const inactive = inactiveColor || theme.muted;
  const display = hovered ?? value;

  return (
    <View style={s.root}>
      {label ? <Text style={[s.label, { color: theme.foreground }]}>{label}</Text> : null}
      <View style={s.stars}>
        {Array.from({ length: maxStars }, (_, i) => {
          const filled = i < Math.round(display);
          return (
            <Pressable
              key={i}
              disabled={readonly}
              onPress={() => onChange?.(i + 1)}
              onHoverIn={() => !readonly && setHovered(i + 1)}
              onHoverOut={() => !readonly && setHovered(null)}
              style={s.star}
            >
              <Feather name={filled ? "star" : "star"} size={starSize} color={filled ? active : inactive}
                style={{ opacity: filled ? 1 : 0.4 }} />
            </Pressable>
          );
        })}
        {showValue && <Text style={[s.value, { color: theme.mutedForeground, fontSize: starSize * 0.6 }]}>{value?.toFixed(1)}</Text>}
      </View>
    </View>
  );
};

export default RatingBlock;

const s = StyleSheet.create({
  root: { gap: 4 },
  label: { fontSize: 12, fontWeight: "500" },
  stars: { flexDirection: "row", alignItems: "center", gap: 2 },
  star: { padding: 2 },
  value: { marginLeft: 6, fontWeight: "600" },
});
