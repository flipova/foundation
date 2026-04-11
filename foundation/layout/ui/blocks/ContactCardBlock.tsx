/**
 * ContactCardBlock — Contact card with avatar, name, role, and action buttons (call, email, message).
 */
import React from "react";
import { View, Text, Pressable, Image, StyleSheet, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("ContactCardBlock")!;

export interface ContactCardBlockProps {
  name?: string; role?: string; company?: string; avatarUrl?: string; initials?: string;
  phone?: string; email?: string; website?: string;
  background?: string; accentColor?: string; borderRadius?: string; padding?: number;
  showActions?: boolean; onPress?: () => void;
}

const ContactCardBlock: React.FC<ContactCardBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<ContactCardBlockProps>;
  const { name, role, company, avatarUrl, initials, phone, email, website, background, accentColor, padding, showActions, onPress } = props;
  const accent = accentColor || theme.primary;

  return (
    <Pressable onPress={onPress} style={[s.root, { backgroundColor: background || theme.card, padding: padding * 4, borderRadius: 16,
      shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }]}>
      <View style={s.top}>
        {avatarUrl
          ? <Image source={{ uri: avatarUrl }} style={[s.avatar, { backgroundColor: theme.muted }]} />
          : <View style={[s.avatar, { backgroundColor: accent + "20" }]}>
              <Text style={[s.initials, { color: accent }]}>{initials || name?.slice(0, 2).toUpperCase()}</Text>
            </View>
        }
        <View style={s.info}>
          <Text style={[s.name, { color: theme.foreground }]}>{name}</Text>
          {role ? <Text style={[s.role, { color: theme.mutedForeground }]}>{role}</Text> : null}
          {company ? <Text style={[s.company, { color: theme.mutedForeground }]}>{company}</Text> : null}
        </View>
      </View>
      {showActions && (
        <View style={s.actions}>
          {phone && (
            <Pressable onPress={() => Linking.openURL(`tel:${phone}`)} style={[s.actionBtn, { backgroundColor: accent + "15" }]}>
              <Feather name="phone" size={16} color={accent} />
            </Pressable>
          )}
          {email && (
            <Pressable onPress={() => Linking.openURL(`mailto:${email}`)} style={[s.actionBtn, { backgroundColor: accent + "15" }]}>
              <Feather name="mail" size={16} color={accent} />
            </Pressable>
          )}
          {website && (
            <Pressable onPress={() => Linking.openURL(website)} style={[s.actionBtn, { backgroundColor: accent + "15" }]}>
              <Feather name="globe" size={16} color={accent} />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
};

export default ContactCardBlock;

const s = StyleSheet.create({
  root: {},
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  initials: { fontSize: 18, fontWeight: "700" },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: "700" },
  role: { fontSize: 13 },
  company: { fontSize: 12 },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  actionBtn: { flex: 1, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
