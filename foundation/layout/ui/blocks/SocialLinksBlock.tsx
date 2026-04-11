/**
 * SocialLinksBlock — Row of social network icon buttons with optional labels.
 * Supports onPress per platform, customizable size, layout direction, and colors.
 */
import React from "react";
import { Pressable, Text, View, StyleSheet, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("SocialLinksBlock")!;

export type SocialPlatform = "twitter" | "instagram" | "facebook" | "linkedin" | "github" | "youtube" | "tiktok" | "discord" | "website" | "email";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface SocialLinksBlockProps {
  links?: SocialLink[];
  direction?: "row" | "column";
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "icon-label" | "label";
  spacing?: number;
  color?: string;
  background?: string;
  borderRadius?: string;
  showLabels?: boolean;
  onPress?: (platform: SocialPlatform, url: string) => void;
}

const PLATFORM_ICONS: Record<SocialPlatform, string> = {
  twitter: "twitter", instagram: "instagram", facebook: "facebook",
  linkedin: "linkedin", github: "github", youtube: "youtube",
  tiktok: "music", discord: "message-circle", website: "globe", email: "mail",
};

const PLATFORM_COLORS: Record<SocialPlatform, string> = {
  twitter: "#1DA1F2", instagram: "#E1306C", facebook: "#1877F2",
  linkedin: "#0A66C2", github: "#333", youtube: "#FF0000",
  tiktok: "#010101", discord: "#5865F2", website: "#6366f1", email: "#f59e0b",
};

const SIZE_MAP = { sm: 16, md: 22, lg: 28 };
const PAD_MAP  = { sm: 6,  md: 10, lg: 14 };

const SocialLinksBlock: React.FC<SocialLinksBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<SocialLinksBlockProps>;
  const { links = [], direction, size, variant, spacing, color, background, borderRadius, onPress } = props;

  const iconSize = SIZE_MAP[size] ?? 22;
  const pad = PAD_MAP[size] ?? 10;

  const handlePress = (platform: SocialPlatform, url: string) => {
    if (onPress) { onPress(platform, url); return; }
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[s.root, { flexDirection: direction === "column" ? "column" : "row", gap: spacing * 4 }]}>
      {links.map((link, i) => {
        const iconName = PLATFORM_ICONS[link.platform] ?? "link";
        const iconColor = color || PLATFORM_COLORS[link.platform] || theme.foreground;
        return (
          <Pressable
            key={i}
            onPress={() => handlePress(link.platform, link.url)}
            style={({ pressed }) => [
              s.btn,
              { padding: pad, borderRadius: 999, backgroundColor: background || "transparent", opacity: pressed ? 0.7 : 1 },
            ]}
            accessibilityRole="link"
            accessibilityLabel={link.label || link.platform}
          >
            <Feather name={iconName as any} size={iconSize} color={iconColor} />
            {(variant === "icon-label" || variant === "label") && (
              <Text style={[s.label, { color: iconColor, fontSize: iconSize * 0.6 }]}>
                {link.label || link.platform}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default SocialLinksBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  btn: { alignItems: "center", justifyContent: "center" },
  label: { marginTop: 2, fontWeight: "500" },
});
