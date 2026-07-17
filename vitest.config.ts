import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
  },
  test: {
    environment: "happy-dom",
    setupFiles: [], // We can add a setup file later if needed
    include: [
      "studio/**/*.test.ts",
      "studio/**/*.test.tsx",
      "studio-v2/**/*.test.ts",
      "studio-v2/**/*.test.tsx",
      "foundation/**/*.test.ts",
      "foundation/**/*.test.tsx",
    ],
  },
});
