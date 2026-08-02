import { ViewStyle } from "react-native";
import { spacing, SpacingToken } from '../../tokens';

type SpacingShorthand = SpacingToken | number;

/**
 * Converts spacing shorthands into React Native padding ViewStyle properties.
 *
 * @param value - Spacing token/number or array tuple (vertical/horizontal or top/right/bottom/left).
 * @returns A partial ViewStyle object with resolved padding properties.
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
