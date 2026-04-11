/**
 * OnboardingSlideBlock — Single onboarding slide with illustration, title, description, and dots.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("OnboardingSlideBlock")!;

export interface OnboardingSlideBlockProps {
  title?: string; description?: string; illustration?: React.ReactNode;
  totalSlides?: number; currentSlide?: number; ctaLabel?: string; skipLabel?: string;
  accentColor?: string; background?: string; padding?: number;
  onNext?: () => void; onSkip?: () => void;
}

const OnboardingSlideBlock: React.FC<OnboardingSlideBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<OnboardingSlideBlockProps>;
  const { title, description, illustration, totalSlides, currentSlide, ctaLabel, skipLabel, accentColor, background, padding, onNext, onSkip } = props;
  const accent = accentColor || theme.primary;
  const isLast = currentSlide >= totalSlides - 1;

  return (
    <View style={[s.root, { backgroundColor: background || theme.background, padding: padding * 4 }]}>
      {onSkip && !isLast && (
        <Pressable onPress={onSkip} style={s.skip}>
          <Text style={[s.skipText, { color: theme.mutedForeground }]}>{skipLabel}</Text>
        </Pressable>
      )}
      <View style={s.illustrationWrap}>
        {illustration || <View style={[s.illustrationPlaceholder, { backgroundColor: accent + "15" }]}>
          <Feather name="star" size={48} color={accent} />
        </View>}
      </View>
      <View style={s.textWrap}>
        <Text style={[s.title, { color: theme.foreground }]}>{title}</Text>
        {description ? <Text style={[s.desc, { color: theme.mutedForeground }]}>{description}</Text> : null}
      </View>
      {totalSlides > 1 && (
        <View style={s.dots}>
          {Array.from({ length: totalSlides }, (_, i) => (
            <View key={i} style={[s.dot, { backgroundColor: i === currentSlide ? accent : theme.muted,
              width: i === currentSlide ? 20 : 8 }]} />
          ))}
        </View>
      )}
      {onNext && (
        <Pressable onPress={onNext} style={({ pressed }) => [s.cta, { backgroundColor: accent, opacity: pressed ? 0.85 : 1 }]}>
          <Text style={s.ctaText}>{isLast ? ctaLabel : "Next"}</Text>
          {!isLast && <Feather name="arrow-right" size={16} color="#fff" />}
        </Pressable>
      )}
    </View>
  );
};

export default OnboardingSlideBlock;

const s = StyleSheet.create({
  root: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },
  skip: { position: "absolute", top: 16, right: 16 },
  skipText: { fontSize: 13 },
  illustrationWrap: { width: "100%", alignItems: "center" },
  illustrationPlaceholder: { width: 180, height: 180, borderRadius: 90, alignItems: "center", justifyContent: "center" },
  textWrap: { alignItems: "center", gap: 10, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  desc: { fontSize: 14, lineHeight: 20, textAlign: "center" },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: { height: 8, borderRadius: 4 },
  cta: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, alignSelf: "stretch", justifyContent: "center" },
  ctaText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
