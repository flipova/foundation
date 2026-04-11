/**
 * ProductCardBlock — E-commerce product card with image, name, price, rating, and add-to-cart.
 */
import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { applyDefaults, getBlockMeta } from "../../registry";

const META = getBlockMeta("ProductCardBlock")!;

export interface ProductCardBlockProps {
  name?: string; price?: string; originalPrice?: string; imageUrl?: string;
  rating?: number; reviewCount?: number; badge?: string; inStock?: boolean;
  background?: string; borderRadius?: string; padding?: number; shadow?: string;
  onPress?: () => void; onAddToCart?: () => void; onWishlist?: () => void;
}

const ProductCardBlock: React.FC<ProductCardBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const props = applyDefaults(rawProps, META, theme) as Required<ProductCardBlockProps>;
  const { name, price, originalPrice, imageUrl, rating, reviewCount, badge, inStock, background, padding, onPress, onAddToCart, onWishlist } = props;

  return (
    <Pressable onPress={onPress} style={[s.root, { backgroundColor: background || theme.card, borderRadius: 14, overflow: "hidden",
      shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }]}>
      <View style={s.imageWrap}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={s.image} resizeMode="cover" /> : <View style={[s.imagePlaceholder, { backgroundColor: theme.muted }]} />}
        {badge ? <View style={[s.badge, { backgroundColor: theme.primary }]}><Text style={s.badgeText}>{badge}</Text></View> : null}
        {onWishlist && (
          <Pressable onPress={onWishlist} style={[s.wishlist, { backgroundColor: theme.card }]}>
            <Feather name="heart" size={14} color={theme.foreground} />
          </Pressable>
        )}
      </View>
      <View style={{ padding: padding * 4, gap: 6 }}>
        <Text style={[s.name, { color: theme.foreground }]} numberOfLines={2}>{name}</Text>
        {rating !== undefined && (
          <View style={s.ratingRow}>
            {[1,2,3,4,5].map(i => <Feather key={i} name="star" size={11} color={i <= Math.round(rating) ? "#f59e0b" : theme.muted} />)}
            {reviewCount ? <Text style={[s.reviewCount, { color: theme.mutedForeground }]}>({reviewCount})</Text> : null}
          </View>
        )}
        <View style={s.priceRow}>
          <Text style={[s.price, { color: theme.foreground }]}>{price}</Text>
          {originalPrice ? <Text style={[s.originalPrice, { color: theme.mutedForeground }]}>{originalPrice}</Text> : null}
        </View>
        {onAddToCart && (
          <Pressable onPress={onAddToCart} disabled={!inStock}
            style={({ pressed }) => [s.cartBtn, { backgroundColor: inStock ? theme.primary : theme.muted, opacity: pressed ? 0.85 : 1 }]}>
            <Feather name="shopping-cart" size={13} color="#fff" />
            <Text style={s.cartText}>{inStock ? "Add to cart" : "Out of stock"}</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default ProductCardBlock;

const s = StyleSheet.create({
  root: {},
  imageWrap: { position: "relative" },
  image: { width: "100%", height: 180 },
  imagePlaceholder: { width: "100%", height: 180 },
  badge: { position: "absolute", top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  wishlist: { position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 14, fontWeight: "500", lineHeight: 18 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  reviewCount: { fontSize: 10, marginLeft: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  price: { fontSize: 16, fontWeight: "700" },
  originalPrice: { fontSize: 12, textDecorationLine: "line-through" },
  cartBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 8, paddingVertical: 10 },
  cartText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
