/**
 * MapPinBlock — Location display card with address, coordinates, and open-in-maps action.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, Linking, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("MapPinBlock")!;

export interface MapPinBlockProps {
  address?: string; city?: string; country?: string;
  latitude?: number; longitude?: number; label?: string;
  background?: string; accentColor?: string; borderRadius?: string; padding?: number;
  showCoordinates?: boolean; showOpenButton?: boolean;
  onPress?: () => void;
}

const MapPinBlock: React.FC<MapPinBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<MapPinBlockProps>;
  const { address, city, country, latitude, longitude, label, background, accentColor, padding, showCoordinates, showOpenButton, onPress } = props;
  const accent = accentColor || theme.primary;

  const openMaps = () => {
    if (onPress) { onPress(); return; }
    const query = address ? encodeURIComponent(`${address}, ${city}`) : `${latitude},${longitude}`;
    const url = Platform.OS === "ios"
      ? `maps:?q=${query}`
      : `geo:${latitude},${longitude}?q=${query}`;
    Linking.openURL(url).catch(() => Linking.openURL(`https://maps.google.com/?q=${query}`));
  };

  return (
    <View style={[s.root, { backgroundColor: background || theme.card, padding: padding * 4, borderRadius: 12, borderWidth: 1, borderColor: theme.border }]}>
      <View style={[s.iconWrap, { backgroundColor: accent + "15" }]}>
        <Feather name="map-pin" size={20} color={accent} />
      </View>
      <View style={s.content}>
        {label ? <Text style={[s.label, { color: theme.mutedForeground }]}>{label}</Text> : null}
        {address ? <Text style={[s.address, { color: theme.foreground }]}>{address}</Text> : null}
        {(city || country) ? <Text style={[s.city, { color: theme.mutedForeground }]}>{[city, country].filter(Boolean).join(", ")}</Text> : null}
        {showCoordinates && latitude && longitude ? (
          <Text style={[s.coords, { color: theme.mutedForeground }]}>{latitude.toFixed(4)}, {longitude.toFixed(4)}</Text>
        ) : null}
      </View>
      {showOpenButton && (
        <Pressable onPress={openMaps} style={[s.openBtn, { backgroundColor: accent }]}>
          <Feather name="navigation" size={14} color="#fff" />
        </Pressable>
      )}
    </View>
  );
};

export default MapPinBlock;

const s = StyleSheet.create({
  root: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  content: { flex: 1, gap: 2 },
  label: { fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  address: { fontSize: 14, fontWeight: "500" },
  city: { fontSize: 12 },
  coords: { fontSize: 10, fontFamily: "monospace" },
  openBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
});
