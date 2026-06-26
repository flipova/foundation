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
      "layout/index":   "foundation/layout/index.ts",
      "config/index":   "foundation/config/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    treeshake: { preset: "recommended", moduleSideEffects: false },
    splitting: true,
    minify: false,
    // Explicitly external: ALL native packages so they never leak into layout chunks
    external: sharedExternal,
    outDir: "dist",
  },

  // ── Web entry — platform:"browser" so esbuild resolves *.web.ts first ──────
  //
  // With platform:"browser", esbuild resolves useColorScheme.web.ts before
  // useColorScheme.ts, so react-native is never imported in the web bundle.
  // All native deps are also external so no chunk pulls them in transitively.
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
    // react-native intentionally absent from web build — if it leaks, the build fails loudly.
    // All other native packages are also external.
    external: [
      "react",
      "react-dom",
      ...nativeExternal,
    ],
    outDir: "dist",
  },

  // ── SSO SDK — pure web, browser-only ───────────────────────────────────────
  {
    entry: {
      "sso/index": "foundation/sso/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: false,
    treeshake: { preset: "recommended", moduleSideEffects: false },
    splitting: false,
    minify: false,
    platform: "browser",
    external: ["react", "react-dom"],
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
