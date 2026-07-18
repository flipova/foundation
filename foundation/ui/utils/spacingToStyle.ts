import { ViewStyle } from "react-native";
import { spacing, SpacingToken } from '../../tokens';

type SpacingShorthand = SpacingToken | number;

/**
 * Convertit des raccourcis d'espacement (spacing) en propriétés de style de padding React Native.
 *
 * @param value - La valeur ou le tableau de valeurs d'espacement (nombres ou tokens).
 * @returns Un objet partiel ViewStyle avec les marges intérieures (padding) appliquées.
 */
export const spacingToStyle = (
  value:
    | SpacingShorthand
    | [SpacingShorthand, SpacingShorthand]
    | [SpacingShorthand, SpacingShorthand, SpacingShorthand, SpacingShorthand],
): Partial<ViewStyle> => {
  const getValue = (v: SpacingShorthand): number =>
    typeof v === "number" ? v : spacing[v];

  if (Array.isArray(value)) {
    if (value.length === 2) {
      return {
        paddingVertical: getValue(value[0]),
        paddingHorizontal: getValue(value[1]),
      };
    }
    return {
      paddingTop: getValue(value[0]),
      paddingRight: getValue(value[1]),
      paddingBottom: getValue(value[2]),
      paddingLeft: getValue(value[3]),
    };
  }

  return { padding: getValue(value) };
};
