import { defineConfig } from "tsup";

// All native / RN packages that must never end up in web bundles.
// Consumers that import @flipova/foundation/web get a pure browser build.
const nativeExternal = [
  "@expo/vector-icons",
  "expo-linear-gradient",
  "expo-haptics",
  "expo-status-bar",
  "expo-navigation-bar",
  "expo-camera",
  "react-native-gesture-handler",
  "react-native-reanimated",
  "react-native-safe-area-context",
  "react-native-screens",
  "lucide-react-native",
];

const sharedExternal = [
  "react",
  "react-dom",
  "react-native",
  ...nativeExternal,
  "express",
  "ws",
];

export default defineConfig([
  // ── Platform-agnostic entries (React Native + shared) ──────────────────────
  {
    entry: {
      "index":          "foundation/index.ts",
      "tokens/index":   "foundation/tokens/index.ts",
      "theme/index":    "foundation/theme/index.ts",
      "config/index":   "foundation/config/index.ts",
      "registry/index": "foundation/registry/index.ts",
      "types/index":    "foundation/types/index.ts",
      "ui/index":       "foundation/ui/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: { preset: "recommended", moduleSideEffects: false },
    splitting: true,
    minify: false,
    // Explicitly external: ALL native packages so they never leak into chunks
    external: sharedExternal,
    outDir: "dist",
  },

  // ── Studio CLI ─────────────────────────────────────────────────────────────
  {
    entry: {
      "studio-v2/cli/index": "studio-v2/cli/index.ts",
    },
    format: ["cjs"],
    dts: false,
    sourcemap: false,
    clean: false,
    splitting: false,
    minify: false,
    external: [],
    outDir: "dist",
  },
]);
