import { defineConfig } from "tsup";

export default defineConfig([
  // ── Foundation library — platform-agnostic entries ─────────────────────────
  {
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
    splitting: true,
    minify: false,
    external: [
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
    ],
    outDir: "dist",
  },

  // ── Foundation library — web entry (browser platform, no react-native) ──────
  //
  // Building web/index.ts with platform:"browser" causes esbuild to resolve
  // *.web.ts files before *.ts, so useColorScheme.web.ts wins over the RN version
  // and react-native is never referenced in the web bundle.
  {
    entry: {
      "web/index": "foundation/web/index.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
    clean: false,
    treeshake: {
      preset: "recommended",
      moduleSideEffects: false,
    },
    splitting: true,
    minify: false,
    platform: "browser",
    external: [
      "react",
      "react-dom",
      // react-native is intentionally NOT listed here — it should not be imported
      // at all in the web bundle. If it leaks through, the build will fail loudly.
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
    ],
    outDir: "dist",
  },

  // ── Studio V2 CLI (bin: flipova-studio) ────────────────────────────────────
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
