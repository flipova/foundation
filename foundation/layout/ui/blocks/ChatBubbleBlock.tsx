/**
 * ChatBubbleBlock — Chat message bubble with sender/receiver layout, timestamp, and read status.
 */
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("ChatBubbleBlock")!;

export interface ChatBubbleBlockProps {
  message?: string; timestamp?: string; isSent?: boolean; isRead?: boolean;
  senderName?: string; avatarUrl?: string; showAvatar?: boolean;
  accentColor?: string; background?: string; maxWidth?: number;
}

const ChatBubbleBlock: React.FC<ChatBubbleBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<ChatBubbleBlockProps>;
  const { message, timestamp, isSent, isRead, senderName, avatarUrl, showAvatar, accentColor, background, maxWidth } = props;
  const accent = accentColor || theme.primary;
  const bubbleBg = isSent ? accent : (background || theme.card);
  const textColor = isSent ? "#fff" : theme.foreground;
  const metaColor = isSent ? "rgba(255,255,255,0.7)" : theme.mutedForeground;

  return (
    <View style={[s.root, isSent ? s.rootSent : s.rootReceived]}>
      {!isSent && showAvatar && (
        avatarUrl
          ? <Image source={{ uri: avatarUrl }} style={[s.avatar, { backgroundColor: theme.muted }]} />
          : <View style={[s.avatar, { backgroundColor: theme.muted }]}><Feather name="user" size={14} color={theme.mutedForeground} /></View>
      )}
      <View style={[s.bubble, { backgroundColor: bubbleBg, maxWidth, borderRadius: 16,
        borderBottomLeftRadius: !isSent ? 4 : 16, borderBottomRightRadius: isSent ? 4 : 16 }]}>
        {!isSent && senderName ? <Text style={[s.sender, { color: accent }]}>{senderName}</Text> : null}
        <Text style={[s.message, { color: textColor }]}>{message}</Text>
        <View style={[s.footer, isSent ? s.footerSent : s.footerReceived]}>
          {timestamp ? <Text style={[s.ts, { color: metaColor }]}>{timestamp}</Text> : null}
          {isSent && (
            <Feather name={isRead ? "check-circle" : "check"} size={11} color={isRead ? "#fff" : "rgba(255,255,255,0.6)"} />
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatBubbleBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "flex-end", gap: 6, marginVertical: 2 },
  rootSent: { justifyContent: "flex-end" },
  rootReceived: { justifyContent: "flex-start" },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bubble: { paddingHorizontal: 12, paddingVertical: 8, gap: 2 },
  sender: { fontSize: 11, fontWeight: "700" },
  message: { fontSize: 14, lineHeight: 19 },
  footer: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  footerSent: { justifyContent: "flex-end" },
  footerReceived: { justifyContent: "flex-start" },
  ts: { fontSize: 10 },
});
