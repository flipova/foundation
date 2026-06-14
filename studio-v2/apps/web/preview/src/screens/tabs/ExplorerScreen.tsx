import React from "react";
import { Button, RootLayout } from "@flipova/foundation";
import { Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { useExplorerScreen } from "./ExplorerScreen.hook";

export default function ExplorerScreen() {
  const { getusers, handleRootLayoutScreenFocus } = useExplorerScreen();

  return (
    <RootLayout scrollable onScreenFocus={handleRootLayoutScreenFocus} style={styles.s_root_lb2b7lz}>
      <Button label="Button" variant="primary" size="md" disabled={false} loading={false} fullWidth={false} borderRadius="md" iconPosition="left" style={styles.s_p6sxml9} />
    </RootLayout>
);
}

const styles = StyleSheet.create({
  s_root_lb2b7lz: { flex: 1 },
  s_p6sxml9: { flex: 1 }
});
