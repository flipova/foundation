#!/usr/bin/env node

/**
 * Flipova Studio CLI
 *
 * Usage:
 *   npx flipova-studio                Start the builder (serves pre-built UI)
 *   npx flipova-studio --port 3000    Start on a custom port
 *   npx flipova-studio generate       Generate code from the saved project
 */

import fs from "fs";
import path from "path";
import { startServer } from "../server";
import { generateProject } from "../engine/codegen";

const args = process.argv.slice(2);
const portArg = args.indexOf("--port");
const port = portArg !== -1 ? parseInt(args[portArg + 1], 10) : 4200;

if (args.includes("generate")) {
  const studioDir = path.join(process.cwd(), ".flipova-studio");
  const projectFile = path.join(studioDir, "project.json");
  if (!fs.existsSync(projectFile)) { console.error("No project found. Run `flipova-studio` first."); process.exit(1); }
  const project = JSON.parse(fs.readFileSync(projectFile, "utf-8"));
  const { files } = generateProject(project);
  const outputDir = path.join(process.cwd(), "generated");
  for (const file of files) {
    const filePath = path.join(outputDir, file.path);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, file.content);
  }
  console.log(`\n  ✓ Generated ${files.length} files in ./generated/\n`);
  process.exit(0);
}

console.log(`\n  ✦ Flipova Studio`);
console.log(`  http://localhost:${port}\n`);
startServer({ port });
