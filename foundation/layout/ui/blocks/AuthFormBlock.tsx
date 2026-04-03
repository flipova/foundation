/**
 * AuthFormBlock
 *
 * Login/signup form combining TextInput and Button components.
 * Supports login, signup, and forgot-password modes.
 */

import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../../theme/providers/ThemeProvider";
import { RadiusToken, SpacingToken } from "../../../tokens";
import { applyDefaults, getBlockMeta } from "../../registry";
import Box from "../primitives/Box";
import Stack from "../primitives/Stack";
import Inline from "../primitives/Inline";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

const META = getBlockMeta("AuthFormBlock")!;

export interface AuthFormBlockProps {
  mode?: "login" | "signup" | "forgot";
  showRemember?: boolean;
  showForgot?: boolean;
  spacing?: SpacingToken;
  background?: string;
  borderRadius?: RadiusToken;
  padding?: SpacingToken;
  buttonVariant?: "primary" | "secondary" | "outline";
  inputVariant?: "outlined" | "filled" | "underline";
  header?: React.ReactNode;
  footer?: React.ReactNode;
  social?: React.ReactNode[];
  onSubmit?: (data: { email: string; password: string; name?: string }) => void;
  onForgotPassword?: () => void;
}

const AuthFormBlock: React.FC<AuthFormBlockProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    mode, showRemember, showForgot, spacing, background,
    borderRadius, padding, buttonVariant, inputVariant,
    header, footer, social, onSubmit, onForgotPassword,
  } = applyDefaults(rawProps, META, theme) as Required<AuthFormBlockProps>;

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const handleSubmit = () => {
    onSubmit?.({ email, password, name: mode === "signup" ? name : undefined });
  };

  const submitLabel = mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : "Reset password";

  return (
    <Box bg={background} borderRadius={borderRadius} p={padding}>
      <Stack spacing={spacing}>
        {header}

        {mode === "signup" && (
          <TextInput
            label="Name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            variant={inputVariant}
          />
        )}

        <TextInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          variant={inputVariant}
        />

        {mode !== "forgot" && (
          <TextInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureEntry
            variant={inputVariant}
          />
        )}

        {mode === "login" && (showRemember || showForgot) && (
          <Inline justify="space-between" fillWidth>
            {showRemember && (
              <Text style={{ fontSize: 13, color: theme.mutedForeground }}>Remember me</Text>
            )}
            {showForgot && (
              <Text
                onPress={onForgotPassword}
                style={{ fontSize: 13, color: theme.primary, fontWeight: "500" }}
              >
                Forgot password?
              </Text>
            )}
          </Inline>
        )}

        <Button label={submitLabel} variant={buttonVariant} fullWidth onPress={handleSubmit} />

        {social && social.length > 0 && (
          <Stack spacing={2} align="stretch">
            {social.map((provider, i) => (
              <React.Fragment key={i}>{provider}</React.Fragment>
            ))}
          </Stack>
        )}

        {footer}
      </Stack>
    </Box>
  );
};

export default AuthFormBlock;
