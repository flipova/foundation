import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "foundation/index.ts",
    "tokens/index": "foundation/tokens/index.ts",
    "theme/index": "foundation/theme/index.ts",
    "layout/index": "foundation/layout/index.ts",
    "config/index": "foundation/config/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: {
    preset: "recommended",
    moduleSideEffects: false,
  },
  splitting: false,
  minify: false,
  external: [
    "react",
    "react-native",
    "expo-linear-gradient",
    "expo-haptics",
    "expo-status-bar",
    "expo-navigation-bar",
    "expo-camera",
    "react-native-gesture-handler",
    "react-native-reanimated",
    "react-native-safe-area-context",
    "lucide-react-native",
  ],
});