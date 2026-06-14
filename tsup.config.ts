import { defineConfig } from "tsup";

// Shared external deps for all builds
const sharedExternal = [
  "react",
  "react-dom",
  "react-native",
  "@expo/vector-icons",
  "expo-linear-gradient",
  "expo-haptics",
  "expo-status-bar",
  "expo-navigation-bar",
  "expo-camera",
  "react-native-gesture-handler",
  "react-native-reanimated",
  "react-native-safe-area-context",
  "lucide-react-native",
  "express",
  "ws",
];

export default defineConfig([
  // ── Platform-agnostic entries (React Native + shared) ──────────────────────
  {
    entry: {
      index:           "foundation/index.ts",
      "tokens/index":  "foundation/tokens/index.ts",
      "theme/index":   "foundation/theme/index.ts",
      "layout/index":  "foundation/layout/index.ts",
      "config/index":  "foundation/config/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: { preset: "recommended", moduleSideEffects: false },
    splitting: true,
    minify: false,
    external: sharedExternal,
    outDir: "dist",
  },

  // ── Web entry — platform:"browser" so esbuild resolves *.web.ts first ──────
  //
  // With platform:"browser", esbuild resolves useColorScheme.web.ts before
  // useColorScheme.ts, so react-native is never imported in the web bundle.
  {
    entry: {
      "web/index": "foundation/web/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: false,
    treeshake: { preset: "recommended", moduleSideEffects: false },
    splitting: true,
    minify: false,
    platform: "browser",
    // react-native intentionally absent — if it leaks through, the build fails loudly
    external: sharedExternal.filter((e) => e !== "react-native"),
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
