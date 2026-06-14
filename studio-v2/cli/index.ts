#!/usr/bin/env node

/**
 * Flipova Studio V2 CLI
 *
 * Usage:
 *   npx flipova-studio              Serve the pre-built studio (production)
 *   npx flipova-studio --dev        Start Expo dev server with hot-reload
 *   npx flipova-studio --port 3000  Custom port (default: 4200)
 *
 * Without --dev: serves the static export from studio-v2/apps/web/dist/
 *   using a lightweight Express server. Requires a prior `npm run build:studio-v2`.
 *
 * With --dev: starts `expo start --web` for full hot-reload development.
 */

import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const args = process.argv.slice(2);
const isDev   = args.includes("--dev");
const portArg = args.indexOf("--port");
const port    = portArg !== -1 ? parseInt(args[portArg + 1], 10) : 4200;
const isWin   = /^win/.test(process.platform);

/**
 * Locate the studio-v2/apps/web directory.
 * Compiled to dist/studio-v2/cli/index.js → 3 levels up = package root.
 */
function findStudioAppDir(): string {
  const candidates = [
    path.resolve(__dirname, "../../../studio-v2/apps/web"),
    path.resolve(process.cwd(), "studio-v2/apps/web"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, "app.json"))) return dir;
  }
  return candidates[0];
}

const studioAppDir = findStudioAppDir();

console.log(`\n  ✦ Flipova Studio V2`);

// ── Dev mode: Expo hot-reload ────────────────────────────────────────────────
if (isDev) {
  console.log(`  Mode:   development (hot-reload)`);
  console.log(`  URL:    http://localhost:${port}\n`);

  // On Windows, batch files (.cmd) must be spawned with shell:true.
  const expoProcess = spawn(
    isWin ? "npx.cmd" : "npx",
    ["expo", "start", "--web", "--port", String(port)],
    {
      cwd: studioAppDir,
      stdio: "inherit",
      shell: isWin,
      env: { ...process.env, EXPO_NO_TELEMETRY: "1" },
    }
  );

  expoProcess.on("error", (err) => {
    console.error("Failed to start Expo:", err.message);
    process.exit(1);
  });
  expoProcess.on("exit", (code) => process.exit(code ?? 0));

} else {

// ── Production mode: serve pre-built static dist ─────────────────────────────
const distDir = path.join(studioAppDir, "dist");

if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, "index.html"))) {
  console.error(`\n  ✗ Studio not built yet.\n`);
  console.error(`  Run first:  npm run build:studio-v2`);
  console.error(`  Or use:     npx flipova-studio --dev\n`);
  process.exit(1);
}

// Dynamically require express — it's a dependency of @flipova/foundation
const expressPath = (() => {
  try {
    return require.resolve("express", { paths: [path.resolve(__dirname, "../../..")] });
  } catch {
    return require.resolve("express");
  }
})();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require(expressPath);

const app = express();

// Serve static files from the Expo export
app.use(express.static(distDir));

// SPA fallback — all routes serve index.html
app.get("*", (_req: any, res: any) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
  console.log(`  Mode:   production (static)`);
  console.log(`  URL:    http://localhost:${port}\n`);
});

}
