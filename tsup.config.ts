import { defineConfig } from "tsup";
import * as fs from "fs";
import * as yaml from "js-yaml";

const yamlPlugin = {
  name: 'yaml',
  setup(build: any) {
    build.onLoad({ filter: /\.yaml$/ }, async (args: any) => {
      const text = await fs.promises.readFile(args.path, 'utf8');
      return {
        contents: JSON.stringify(yaml.load(text)),
        loader: 'json',
      };
    });
  },
};
// All native / RN packages that must never end up in web bundles.
// Consumers that import @flipova/foundation/web get a pure browser build.
const nativeExternal = [
  "@expo/vector-icons",
  "expo-linear-gradient",
  "expo-haptics",
  "expo-status-bar",
  "expo-navigation-bar",
  "expo-camera",
  "expo-blur",
  "expo-video",
  "react-native-gesture-handler",
  "react-native-reanimated",
  "react-native-safe-area-context",
  "react-native-screens",
  "lucide-react-native",
  "react-native-maps",
  "react-native-webview",
  "lottie-react-native",
  "@react-native-picker/picker",
  "react-native-date-picker",
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
    esbuildPlugins: [yamlPlugin],
  },

  // ── Web-only build (browser pure, zero React Native/Expo deps) ─────────────
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
    // For web: all native packages PLUS native-only platforms
    external: sharedExternal,
    outDir: "dist",
    esbuildPlugins: [yamlPlugin],
    resolveExtensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".jsx", ".js"],
  },

  // ── Studio CLI ─────────────────────────────────────────────────────────────
  {
    entry: {
      "cli/flipova": "scripts/init-cli.ts",
      "cli/ds": "scripts/cli/index.ts",
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
