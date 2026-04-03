/**
 * AuthLayout
 *
 * Authentication layout with a branding panel (desktop) and a centered form.
 * On mobile, the form is full-screen with a background or gradient.
 */

import React from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken } from "../../tokens/radii";
import { SpacingToken } from "../../tokens/spacing";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Center from "./primitives/Center";
import Inline from "./primitives/Inline";
import Scroll from "./primitives/Scroll";
import Stack from "./primitives/Stack";

const META = getLayoutMeta("AuthLayout")!;

export interface AuthLayoutProps {
  children: React.ReactNode;
  branding?: React.ReactNode;
  brandingBackground?: string;
  background?: string | string[];
  borderRadius?: RadiusToken;
  spacing?: SpacingToken;
  brandingRatio?: number;
  padding?: SpacingToken;
  shadowed?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    children, branding, brandingBackground, background,
    borderRadius, spacing, brandingRatio, padding, shadowed,
  } = applyDefaults(rawProps, META, theme) as Required<AuthLayoutProps>;

  const { breakpoint, isMobile } = useBreakpoint();

  if (!breakpoint) return null;

  const rootBg = !isMobile ? (Array.isArray(background) ? undefined : background) : undefined;
  const rootGradient = !isMobile && Array.isArray(background) && background.length >= 2
    ? (background.slice(0, 2) as [string, string])
    : undefined;

  const formBg = isMobile ? (Array.isArray(background) ? undefined : background) : theme.card;
  const formGradient = isMobile && Array.isArray(background) && background.length >= 2
    ? (background.slice(0, 2) as [string, string])
    : undefined;

  return (
    <Box flex={1} bg={rootBg} gradient={rootGradient}>
      <Box flex={1} borderRadius={borderRadius} overflow="hidden">
        <Inline flex={1} spacing={spacing} align="stretch">

          {!isMobile && branding && (
            <Box flex={brandingRatio} bg={brandingBackground}>
              {branding}
            </Box>
          )}

          <Box flex={1} bg={formBg} gradient={formGradient}>
            <Scroll py={8} px={4}>
              <Center flex={1}>
                <Stack
                  spacing={8}
                  width="100%"
                  maxWidth={520}
                  align="stretch"
                  p={isMobile ? padding : 0}
                  borderRadius={isMobile ? "3xl" : "none"}
                  shadow={isMobile && shadowed ? "xl" : undefined}
                  bg={isMobile ? theme.card : "transparent"}
                >
                  {children}
                </Stack>
              </Center>
            </Scroll>
          </Box>

        </Inline>
      </Box>
    </Box>
  );
};

export default AuthLayout;
