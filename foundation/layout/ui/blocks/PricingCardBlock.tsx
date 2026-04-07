/**
 * PricingCardBlock — Pricing plan card with features list, price, and CTA.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("PricingCardBlock")!;

export interface PricingCardBlockProps {
  planName?: string; price?: string; period?: string; description?: string;
  features?: string[]; ctaLabel?: string; highlighted?: boolean;
  background?: string; accentColor?: string; borderRadius?: string;
  padding?: number; spacing?: number; shadow?: string;
  onPress?: () => void;
}

const PricingCardBlock: React.FC<PricingCardBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<PricingCardBlockProps>;
  const { planName, price, period, description, features = [], ctaLabel, highlighted, background, accentColor, borderRadius, padding, spacing, onPress } = props;
  const accent = accentColor || theme.primary;
  const bg = background || (highlighted ? accent : theme.card);
  const textColor = highlighted ? "#fff" : theme.foreground;
  const mutedColor = highlighted ? "rgba(255,255,255,0.7)" : theme.mutedForeground;

  return (
    <View style={[s.root, { backgroundColor: bg, borderRadius: 16, padding: padding * 4, gap: spacing * 4,
      borderWidth: highlighted ? 2 : 1, borderColor: highlighted ? accent : theme.border,
      shadowColor: "#000", shadowOpacity: highlighted ? 0.18 : 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: highlighted ? 6 : 2 }]}>
      {highlighted && (
        <View style={[s.badge, { backgroundColor: "#fff" }]}>
          <Text style={[s.badgeText, { color: accent }]}>Most Popular</Text>
        </View>
      )}
      <Text style={[s.planName, { color: mutedColor }]}>{planName}</Text>
      <View style={s.priceRow}>
        <Text style={[s.price, { color: textColor }]}>{price}</Text>
        {period ? <Text style={[s.period, { color: mutedColor }]}>/{period}</Text> : null}
      </View>
      {description ? <Text style={[s.desc, { color: mutedColor }]}>{description}</Text> : null}
      <View style={s.features}>
        {features.map((f, i) => (
          <View key={i} style={s.featureRow}>
            <Feather name="check" size={14} color={highlighted ? "#fff" : accent} />
            <Text style={[s.featureText, { color: textColor }]}>{f}</Text>
          </View>
        ))}
      </View>
      <Pressable onPress={onPress} style={({ pressed }) => [s.cta, { backgroundColor: highlighted ? "#fff" : accent, opacity: pressed ? 0.85 : 1 }]}>
        <Text style={[s.ctaText, { color: highlighted ? accent : "#fff" }]}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );
};

export default PricingCardBlock;

const s = StyleSheet.create({
  root: { position: "relative" },
  badge: { position: "absolute", top: -12, alignSelf: "center", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 10, fontWeight: "700" },
  planName: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  priceRow: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
  price: { fontSize: 36, fontWeight: "800" },
  period: { fontSize: 14, marginBottom: 6 },
  desc: { fontSize: 13, lineHeight: 18 },
  features: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 13, flex: 1 },
  cta: { borderRadius: 10, paddingVertical: 14, alignItems: "center" },
  ctaText: { fontSize: 14, fontWeight: "700" },
});
