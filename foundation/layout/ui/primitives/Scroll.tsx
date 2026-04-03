/**
 * Scroll — Primitive niveau 1
 *
 * ScrollView prête à l'emploi avec :
 *   - Gestion du padding interne (tokens spacing)
 *   - Conteneur Box externe (overflow:hidden, flex:1)
 *   - Valeurs par défaut sensées (keyboardShouldPersistTaps, nestedScrollEnabled)
 *
 * Construit sur Box pour le conteneur externe.
 * Ne touche jamais ViewStyle directement (sauf contentContainerStyle pass-through).
 *
 * @example
 * // Scroll vertical simple
 * <Scroll px={4} py={6}>
 *   {items.map(…)}
 * </Scroll>
 *
 * // Scroll horizontal
 * <Scroll horizontal showsHorizontalScrollIndicator={false}>
 *   {cards.map(…)}
 * </Scroll>
 *
 * // Avec conteneur personnalisé
 * <Scroll containerProps={{ bg: theme.card, borderRadius: "xl" }} p={4}>
 *   {content}
 * </Scroll>
 */

import React, { useMemo } from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { spacing, SpacingToken } from "../../../tokens/spacing";
import Box, { BoxProps } from "./Box";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrollProps extends ScrollViewProps {
  /** Padding uniforme dans la zone de contenu. */
  p?: SpacingToken;
  px?: SpacingToken;
  py?: SpacingToken;
  pt?: SpacingToken;
  pr?: SpacingToken;
  pb?: SpacingToken;
  pl?: SpacingToken;
  /** Props transmises au conteneur Box externe. */
  containerProps?: Partial<BoxProps>;
}

// ─── Helper (module-private) ─────────────────────────────────────────────────

function sp(token: SpacingToken | undefined): number | undefined {
  return token != null ? spacing[token] : undefined;
}

// ─── Composant ────────────────────────────────────────────────────────────────

const Scroll: React.FC<ScrollProps> = ({
  p, px, py, pt, pr, pb, pl,
  contentContainerStyle,
  containerProps,
  children,
  ...rest
}) => {
  const paddingStyle = useMemo(
    () => ({
      padding:           sp(p),
      paddingHorizontal: sp(px),
      paddingVertical:   sp(py),
      paddingTop:        sp(pt),
      paddingRight:      sp(pr),
      paddingLeft:       sp(pl),
      // pb résout à 0 si absent — évite de couper le contenu en bas
      paddingBottom: pb != null ? spacing[pb] : 0,
    }),
    [p, px, py, pt, pr, pb, pl]
  );

  return (
    <Box flex={1} overflow="hidden" width="100%" {...containerProps}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[{ flexGrow: 1 }, paddingStyle, contentContainerStyle]}
        showsVerticalScrollIndicator={rest.showsVerticalScrollIndicator ?? true}
        nestedScrollEnabled={rest.nestedScrollEnabled ?? true}
        keyboardShouldPersistTaps={rest.keyboardShouldPersistTaps ?? "handled"}
        {...rest}
      >
        {children}
      </ScrollView>
    </Box>
  );
};

export default Scroll;