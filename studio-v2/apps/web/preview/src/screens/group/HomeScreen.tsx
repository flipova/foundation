import React from "react";
import { AuthLayout, RootLayout } from "../../../flipova_modules/flipova/foundation";
import { Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { useHomeScreen } from "./HomeScreen.hook";

export default function HomeScreen() {
  const { getusers } = useHomeScreen();

  return (
    <RootLayout scrollable style={styles.s_root_home}>
      <AuthLayout borderRadius="none" spacing={0} brandingRatio={0.5} padding={5} shadowed formMaxWidth={520} formScrollPaddingY={8} formScrollPaddingX={4} style={styles.s_us0sdq6} />
    </RootLayout>
);
}

const styles = StyleSheet.create({
  s_root_home: { flex: 1, height: 20 },
  s_us0sdq6: { flex: 1 }
});
