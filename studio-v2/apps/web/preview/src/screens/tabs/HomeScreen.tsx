import React from "react";
import { AuthFormBlock, AuthLayout, RootLayout } from "@flipova/foundation";
import { Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { useHomeScreen } from "./HomeScreen.hook";

export default function HomeScreen() {
  const { getusers } = useHomeScreen();

  return (
    <RootLayout scrollable style={styles.s_root_home}>
      <AuthLayout borderRadius="none" spacing={0} brandingRatio={0.5} padding={5} shadowed formMaxWidth={520} formScrollPaddingY={8} formScrollPaddingX={4} style={styles.s_us0sdq6}>
        <AuthFormBlock mode="login" showRemember showForgot spacing={4} borderRadius="xl" padding={5} buttonVariant="primary" inputVariant="outlined" submitLabel="Sign In" forgotLabel="Forgot password?" style={styles.s_jejlj5d} />
      </AuthLayout>
    </RootLayout>
);
}

const styles = StyleSheet.create({
  s_root_home: { flex: 1, height: 20 },
  s_us0sdq6: { flex: 1 },
  s_jejlj5d: { flex: 1 }
});
