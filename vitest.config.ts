import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "studio/**/*.test.ts",
      "studio/**/*.test.tsx",
      "foundation/**/*.test.ts",
      "foundation/**/*.test.tsx",
    ],
  },
});
