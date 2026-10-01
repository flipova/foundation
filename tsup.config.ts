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

// Packages that must stay external (peer-resolved in the consumer's app)
// rather than bundled into dist.
const nativeExternal = [
  "react-native-safe-area-context",
  "react-native-reanimated",
  "react-native-gesture-handler",
  "@gorhom/bottom-sheet",
  "@react-native-community/datetimepicker",
  "expo",
  "expo-glass-effect",
  "@gluestack-ui/core",
  "@gluestack-ui/utils",
  "@gluestack/ui-next-adapter",
  "nativewind",
  "react-native-web",
  "react-native-svg",
  "react-aria",
  "react-stately",
  "@expo/html-elements",
  "tailwind-variants",
  "@legendapp/motion",
  "dom-helpers",
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
      "index":    "index.ts",
      "ui/index": "components/ui/index.ts",
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
