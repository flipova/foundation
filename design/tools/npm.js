#!/usr/bin/env node
/* Project-local entry point for the design tool shipped with the package. */
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageDesign = path.resolve(__dirname, '..');
const packageRoot = path.resolve(packageDesign, '..');
const projectRoot = process.cwd();
const projectDesign = path.join(projectRoot, 'design');
const packageGluestack = path.join(packageRoot, 'foundation', 'gluestack');
const projectGluestack = path.join(projectRoot, 'foundation', 'gluestack');
const tool = path.join(packageDesign, 'tools', 'design.js');

function copyDesign() {
  if (fs.existsSync(projectDesign)) {
    process.stderr.write(`A design directory already exists at ${projectDesign}.\n`);
    process.stderr.write('Use the existing project design files, or remove it before init.\n');
    process.exit(2);
  }
  if (fs.existsSync(projectGluestack)) {
    process.stderr.write(`A gluestack source directory already exists at ${projectGluestack}.\n`);
    process.stderr.write('Use the existing project sources, or remove it before init.\n');
    process.exit(2);
  }
  fs.cpSync(packageDesign, projectDesign, {
    recursive: true,
    filter: (source) => !source.endsWith(`${path.sep}.venv`)
      && !source.includes(`${path.sep}.venv${path.sep}`)
      && !source.endsWith(`${path.sep}__pycache__`)
      && !source.includes(`${path.sep}__pycache__${path.sep}`),
  });
  if (fs.existsSync(packageGluestack)) {
    fs.cpSync(packageGluestack, projectGluestack, { recursive: true });
  }
  process.stdout.write(`Initialized ${projectDesign}\n`);
}

const [command, ...args] = process.argv.slice(2);
if (command === 'init') {
  copyDesign();
  process.exit(0);
}

if (!fs.existsSync(path.join(projectDesign, 'schema.xsd'))) {
  process.stderr.write('No local design directory found. Run "npx flipova-design init" first.\n');
  process.exit(2);
}

const result = spawnSync(process.execPath, [tool, command || 'edit', ...args], {
  cwd: projectRoot,
  env: {
    ...process.env,
    FOUNDATION_DESIGN_DIR: projectDesign,
    FOUNDATION_PROJECT_ROOT: projectRoot,
  },
  stdio: 'inherit',
});
if (result.error) {
  process.stderr.write(`${result.error}\n`);
  process.exit(1);
}
process.exit(result.status == null ? 1 : result.status);