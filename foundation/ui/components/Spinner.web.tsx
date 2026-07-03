/**
 * Spinner — Web Component
 *
 * Indicateur de chargement. Miroir web du composant RN Spinner.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Spinner")!;

export interface SpinnerProps extends ExtractComponentProps<"Spinner"> {
  className?: string;
  style?: CSSProperties;
}

const SIZE_PX: Record<string, number> = { sm: 16, md: 24, lg: 36 };

const Spinner: React.FC<SpinnerProps> = (rawProps) => {
  const { theme } = useTheme();
  const merged = applyDefaults(rawProps, META, theme) as Required<SpinnerProps> & typeof rawProps;
  const { size, color, className, style } = merged;
  const px = SIZE_PX[size] ?? SIZE_PX.md;
  const c = color ?? theme.primary;

  return (
    <>
      <style>{`
        @keyframes foundation-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span
        role="status"
        aria-label="loading"
        className={className}
        style={{
          display: "inline-block",
          width: px,
          height: px,
          border: `${Math.max(2, px / 8)}px solid ${c}33`,
          borderTopColor: c,
          borderRadius: "50%",
          animation: "foundation-spin 0.65s linear infinite",
          flexShrink: 0,
          ...style,
        }}
      />
    </>
  );
};

export default Spinner;
