import React from "react";
import { RootLayout } from "../../../flipova_modules/flipova/foundation";
import { Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { useExplorerScreen } from "./ExplorerScreen.hook";

export default function ExplorerScreen() {
  const { getusers, handleRootLayoutScreenFocus } = useExplorerScreen();

  return (
    <RootLayout scrollable onScreenFocus={handleRootLayoutScreenFocus} style={styles.s_root_lb2b7lz} />
);
}

const styles = StyleSheet.create({
  s_root_lb2b7lz: { flex: 1 }
});
