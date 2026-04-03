#!/usr/bin/env node

/**
 * Flipova Studio CLI
 *
 * Usage:
 *   npx @flipova/studio          → Start the builder on port 4200
 *   npx @flipova/studio --port 3000
 *   npx @flipova/studio generate  → Generate code without starting the server
 */

import { startServer } from "../server";

const args = process.argv.slice(2);

if (args.includes("generate")) {
  const fs = require("fs");
  const path = require("path");
  const { generateProject } = require("../engine/codegen");

  const studioDir = path.join(process.cwd(), ".flipova-studio");
  const projectFile = path.join(studioDir, "project.json");

  if (!fs.existsSync(projectFile)) {
    console.error("No project found. Run `flipova-studio` first to create a project.");
    process.exit(1);
  }

  const project = JSON.parse(fs.readFileSync(projectFile, "utf-8"));
  const files = generateProject(project);
  const outputDir = path.join(process.cwd(), "generated");

  for (const file of files) {
    const filePath = path.join(outputDir, file.path);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, file.content);
  }

  console.log(`Generated ${files.length} files in ./generated/`);
  process.exit(0);
}

const portArg = args.indexOf("--port");
const port = portArg !== -1 ? parseInt(args[portArg + 1], 10) : undefined;

startServer({ port });
