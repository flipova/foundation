/**
 * AuthLayout — Web Layout
 *
 * Panel branding (desktop) + formulaire centré. Mobile : plein écran.
 * Miroir web du composant RN AuthLayout.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken, spacing, SpacingToken } from "../../tokens";
import { applyDefaults, getLayoutMeta } from "../../layout/registry";

const META = getLayoutMeta("AuthLayout")!;

export interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  branding?: React.ReactNode;
  brandingBackground?: string;
  background?: string;
  borderRadius?: RadiusToken;
  spacing?: SpacingToken;
  brandingRatio?: number;
  padding?: SpacingToken;
  shadowed?: boolean;
  formMaxWidth?: number;
  formScrollPaddingY?: SpacingToken;
  formScrollPaddingX?: SpacingToken;
}

const AuthLayout: React.FC<AuthLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    branding, brandingBackground, background, borderRadius, spacing: spacingToken,
    brandingRatio, padding: paddingToken, shadowed, formMaxWidth,
    formScrollPaddingY, formScrollPaddingX, children, style, ...rest
  } = applyDefaults(rawProps, META, theme) as Required<AuthLayoutProps> & typeof rawProps;

  const ratio = brandingRatio ?? 0.5;
  const pad = paddingToken != null ? spacing[paddingToken] : spacing[5];
  const pyPad = formScrollPaddingY != null ? spacing[formScrollPaddingY] : spacing[8];
  const pxPad = formScrollPaddingX != null ? spacing[formScrollPaddingX] : spacing[4];

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: background ?? theme.background,
    boxSizing: "border-box",
    ...style,
  };

  const brandingStyle: CSSProperties = {
    flex: ratio,
    backgroundColor: brandingBackground ?? theme.card,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // Hide on mobile
  };

  const formSideStyle: CSSProperties = {
    flex: 1 - ratio,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
    paddingTop: pyPad,
    paddingBottom: pyPad,
    paddingLeft: pxPad,
    paddingRight: pxPad,
    boxSizing: "border-box",
  };

  const formCardStyle: CSSProperties = {
    width: "100%",
    maxWidth: formMaxWidth ?? 520,
    backgroundColor: theme.card,
    borderRadius: borderRadius ? radii[borderRadius] : "none",
    padding: pad,
    boxShadow: shadowed ? "0 4px 24px rgba(0,0,0,0.1)" : "none",
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .flipova-auth-branding { display: none !important; }
          .flipova-auth-form-side { flex: 1 !important; }
        }
      `}</style>
      <div style={containerStyle} {...rest}>
        {branding && (
          <div className="flipova-auth-branding" style={brandingStyle}>
            {branding}
          </div>
        )}
        <div className="flipova-auth-form-side" style={formSideStyle}>
          <div style={formCardStyle}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
