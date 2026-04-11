/**
 * CommentBlock — Comment/review item with avatar, author, content, timestamp, and like action.
 */
import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("CommentBlock")!;

export interface CommentBlockProps {
  author?: string; avatarUrl?: string; initials?: string; content?: string;
  timestamp?: string; likeCount?: number; liked?: boolean; replyCount?: number;
  background?: string; padding?: number; showDivider?: boolean;
  onLike?: () => void; onReply?: () => void; onPress?: () => void;
}

const CommentBlock: React.FC<CommentBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<CommentBlockProps>;
  const { author, avatarUrl, initials, content, timestamp, likeCount, liked, replyCount, background, padding, showDivider, onLike, onReply, onPress } = props;

  return (
    <Pressable onPress={onPress} style={[s.root, { backgroundColor: background || "transparent", padding: padding * 4,
      borderBottomWidth: showDivider ? 0.5 : 0, borderBottomColor: theme.border }]}>
      <View style={s.avatarWrap}>
        {avatarUrl
          ? <Image source={{ uri: avatarUrl }} style={[s.avatar, { backgroundColor: theme.muted }]} />
          : <View style={[s.avatar, { backgroundColor: theme.primary + "30" }]}>
              <Text style={[s.initials, { color: theme.primary }]}>{initials || author?.slice(0, 2).toUpperCase()}</Text>
            </View>
        }
      </View>
      <View style={s.body}>
        <View style={s.header}>
          <Text style={[s.author, { color: theme.foreground }]}>{author}</Text>
          {timestamp ? <Text style={[s.ts, { color: theme.mutedForeground }]}>{timestamp}</Text> : null}
        </View>
        {content ? <Text style={[s.content, { color: theme.foreground }]}>{content}</Text> : null}
        <View style={s.actions}>
          {onLike && (
            <Pressable onPress={onLike} style={s.action}>
              <Feather name="heart" size={13} color={liked ? "#ef4444" : theme.mutedForeground} />
              {likeCount ? <Text style={[s.actionText, { color: theme.mutedForeground }]}>{likeCount}</Text> : null}
            </Pressable>
          )}
          {onReply && (
            <Pressable onPress={onReply} style={s.action}>
              <Feather name="message-circle" size={13} color={theme.mutedForeground} />
              {replyCount ? <Text style={[s.actionText, { color: theme.mutedForeground }]}>{replyCount}</Text> : null}
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default CommentBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", gap: 10 },
  avatarWrap: {},
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  initials: { fontSize: 13, fontWeight: "700" },
  body: { flex: 1, gap: 4 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  author: { fontSize: 13, fontWeight: "600" },
  ts: { fontSize: 10 },
  content: { fontSize: 13, lineHeight: 18 },
  actions: { flexDirection: "row", gap: 14, marginTop: 2 },
  action: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { fontSize: 11 },
});
