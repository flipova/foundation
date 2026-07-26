/**
 * spacingToStyle — Web Variant
 *
 * @description
 * Utility for converting spacing token shortcuts into CSS padding properties.
 * Handles single values, 2-value (vertical/horizontal), and 4-value (TRBL) shorthand.
 *
 * @platform Web (Browser)
 *
 * @implementation
 * Returns plain React.CSSProperties compatible with both web and React Native style objects.
 * Converts spacing token names to pixel values using tokens module.
 * Supports CSS-like shorthand syntax (1 value, 2 values, or 4 values).
 * Pure utility function with no side effects or imports from react-native.
 *
 * @notes
 * - Zero React Native imports guaranteed ✓
 * - Pure function suitable for any styling context
 * - Compatible with both web CSS and React Native ViewStyle
 * - Spacing tokens resolved from central tokens module
 *
 * @example
 * ```typescript
 * import { spacingToStyle } from './spacingToStyle.web';
 *
 * // Single value
 * spacingToStyle('md') // { padding: 16 }
 *
 * // Two values (vertical, horizontal)
 * spacingToStyle(['sm', 'lg']) // { paddingVertical: 8, paddingHorizontal: 24 }
 *
 * // Four values (top, right, bottom, left)
 * spacingToStyle(['xs', 'sm', 'md', 'lg'])
 * // { paddingTop: 4, paddingRight: 8, paddingBottom: 16, paddingLeft: 24 }
 * ```
 *
 * @see
 * - Spacing tokens definition
 * - PaddingStyle interface for type safety
 */

import { spacing, SpacingToken } from '../../tokens';

type SpacingShorthand = SpacingToken | number;

/** Padding object compatible with both React Native and web style objects. */
export interface PaddingStyle {
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
}

/**
 * Convertit des raccourcis d'espacement (spacing) en propriétés de style de padding.
 *
 * @param value - La valeur ou le tableau de valeurs d'espacement (nombres ou tokens).
 * @returns Un objet de padding compatible CSS et React Native.
 */
export const spacingToStyle = (
  value:
    | SpacingShorthand
    | [SpacingShorthand, SpacingShorthand]
    | [SpacingShorthand, SpacingShorthand, SpacingShorthand, SpacingShorthand],
): PaddingStyle => {
  const getValue = (v: SpacingShorthand): number =>
    typeof v === 'number' ? v : spacing[v];

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
