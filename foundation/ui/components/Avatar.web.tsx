/**
 * Avatar — Web Component
 *
 * Avatar utilisateur avec image, initiales ou icône fallback.
 */

import React, { CSSProperties, useState } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii } from "../../tokens";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";

const META = getComponentMeta("Avatar")!;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, ExtractComponentProps<"Avatar"> {}

const Avatar: React.FC<AvatarProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    source,
    initials,
    variant,
    size,
    background,
    style,
    ...rest
  } = applyDefaults(rawProps, META, theme) as Required<AvatarProps> & typeof rawProps;
  const [imgError, setImgError] = useState(false);
  const px = (META.sizeMap?.[size] ?? META.sizeMap?.["md"]) as number;
  const bg = background ?? theme.muted;
  const radius = variant === "circle" ? "50%" : radii.md;

  const containerStyle: CSSProperties = {
    width: px,
    height: px,
    borderRadius: radius,
    backgroundColor: bg,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    userSelect: "none",
    ...style,
  };

  const showImage = source && !imgError;

  return (
    <div style={containerStyle} {...rest}>
      {showImage ? (
        <img
          src={source}
          alt={initials ?? "avatar"}
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : initials ? (
        <span style={{
          fontSize: px * 0.38,
          fontWeight: 600,
          color: theme.mutedForeground,
          fontFamily: "inherit",
          letterSpacing: 0.5,
        }}>
          {initials.slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <svg width={px * 0.5} height={px * 0.5} viewBox="0 0 24 24" fill="none" stroke={theme.mutedForeground} strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )}
    </div>
  );
};

export default Avatar;
