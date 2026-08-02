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

// Native & React Native packages that are external dependencies.
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
];

export default defineConfig([
  // ── React Native Entry Point (builds for both native and web via React Native web) ──────────────────────────
  {
    entry: {
      "index":          "foundation/index.ts",
      "tokens/index":   "foundation/tokens/index.ts",
      "theme/index":    "foundation/theme/index.ts",
      "config/index":   "foundation/config/index.ts",
      "registry/index": "foundation/registry/index.ts",
      "types/index":    "foundation/types/index.ts",
      "ui/index":       "foundation/ui/index.ts",
      "cli/flipova":     "scripts/init-cli.ts",
      "cli/ds":          "scripts/cli/index.ts",
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
    esbuildPlugins: [yamlPlugin],
  },
]);
