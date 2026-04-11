/**
 * QuoteBlock — Stylized quote/testimonial with author, avatar, and accent bar.
 */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("QuoteBlock")!;

export interface QuoteBlockProps {
  quote?: string; author?: string; role?: string; avatarUrl?: string;
  accentColor?: string; background?: string; borderRadius?: string; padding?: number;
  showQuoteIcon?: boolean; variant?: "left-bar" | "card" | "minimal";
}

const QuoteBlock: React.FC<QuoteBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<QuoteBlockProps>;
  const { quote, author, role, avatarUrl, accentColor, background, padding, showQuoteIcon, variant } = props;
  const accent = accentColor || theme.primary;

  return (
    <View style={[
      s.root,
      { padding: padding * 4, backgroundColor: background || (variant === "card" ? theme.card : "transparent") },
      variant === "left-bar" && { borderLeftWidth: 4, borderLeftColor: accent },
      variant === "card" && { borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
    ]}>
      {showQuoteIcon && <Feather name="message-square" size={24} color={accent} style={s.quoteIcon} />}
      <Text style={[s.quote, { color: theme.foreground }]}>{quote}</Text>
      {(author || avatarUrl) && (
        <View style={s.authorRow}>
          {avatarUrl && <Image source={{ uri: avatarUrl }} style={[s.avatar, { backgroundColor: theme.muted }]} />}
          <View>
            {author ? <Text style={[s.author, { color: theme.foreground }]}>{author}</Text> : null}
            {role ? <Text style={[s.role, { color: theme.mutedForeground }]}>{role}</Text> : null}
          </View>
        </View>
      )}
    </View>
  );
};

export default QuoteBlock;

const s = StyleSheet.create({
  root: { gap: 12 },
  quoteIcon: { marginBottom: 4 },
  quote: { fontSize: 15, lineHeight: 22, fontStyle: "italic" },
  authorRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  author: { fontSize: 13, fontWeight: "600" },
  role: { fontSize: 11 },
});
