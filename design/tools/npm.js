#!/usr/bin/env node
/**
 * Project entry point for the design toolchain shipped by @flipova/foundation.
 *
 * Design philosophy: the registries live in the INSTALLED package, never in the
 * consumer project. `npx flipova-design` therefore drives the tooling that
 * already sits in `node_modules/@flipova/foundation/design`, and only injects
 * the app-level wiring (Tailwind / PostCSS / global CSS + npm scripts) into the
 * project.
 *
 * Usage:
 *   npx flipova-design init            inject app-level wiring (never overwrites)
 *   npx flipova-design init --force    overwrite the injected files
 *   npx flipova-design inject          re-run the injection only
 *   npx flipova-design where           print the resolved paths (diagnostics)
 *   npx flipova-design gen [--check]    compile registries -> gluestack artifacts
 *   npx flipova-design check|verify|canonical|lint|doc|edit|run|pipeline
 *
 * Registry resolution:
 *   1. <projectRoot>/design/manifest.xml  (explicit project override, opt-in)
 *   2. <packageRoot>/design/manifest.xml  (the installed package, default)
 *
 * `gen` writes into the resolved output root, so by default it refreshes
 * `node_modules/@flipova/foundation/components/ui/gluestack-ui-provider/*` -- the
 * exact files consumed by `@flipova/foundation/tokens` and `@flipova/foundation/ui`.
 */
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
const PACKAGE_DESIGN = path.join(PACKAGE_ROOT, 'design');
const TOOL = path.join(PACKAGE_DESIGN, 'tools', 'design.js');
const PROJECT_ROOT = process.cwd();
const PROJECT_DESIGN = path.join(PROJECT_ROOT, 'design');

/* ------------------------------------------------------------------ *
 * Resolution
 * ------------------------------------------------------------------ */

function resolution() {
  const override = fs.existsSync(path.join(PROJECT_DESIGN, 'manifest.xml'));
  return {
    override,
    designDir: override ? PROJECT_DESIGN : PACKAGE_DESIGN,
    outputRoot: override ? PROJECT_ROOT : PACKAGE_ROOT,
  };
}

function readPackageVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).version;
  } catch (_) {
    return 'unknown';
  }
}
/* ------------------------------------------------------------------ *
 * Injected app-level files (never copied registries)
 * ------------------------------------------------------------------ */

const TAILWIND_CONFIG = `// tailwind.config.js
// Injected by \`npx flipova-design init\` -- safe to edit, safe to regenerate.
// The whole design system is the generated theme below: it holds no design value.
const tokens = require('@flipova/foundation/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{tsx,ts,jsx,js}',
    './components/**/*.{tsx,ts,jsx,js}',
    './src/**/*.{tsx,ts,jsx,js}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  theme: { extend: tokens.theme },
};
`;

const POSTCSS_CONFIG = `// postcss.config.js
// Injected by \`npx flipova-design init\` -- safe to edit, safe to regenerate.
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
`;

const GLOBALS_CSS = `/* globals.css */
/* Injected by \`npx flipova-design init\` -- safe to edit, safe to regenerate. */
@tailwind base;
@tailwind components;
@tailwind utilities;

/*
 * Some registry families delegate to the app fonts through these variables
 * (font-sans / font-body / font-heading). font-system, font-mono and font-serif
 * are self-contained and need no variable.
 */
:root {
  --font-sans: Inter, system-ui, sans-serif;
  --font-heading: Inter, system-ui, sans-serif;
}
`;

const NPM_SCRIPTS = {
  'design:gen': 'flipova-design gen',
  'design:gen:check': 'flipova-design gen --check',
  'design:check': 'flipova-design check',
  'design:verify': 'flipova-design verify',
  'design:canonical': 'flipova-design canonical',
  'design:lint': 'flipova-design lint',
  'design:doc': 'flipova-design doc',
  'design:pipeline': 'flipova-design pipeline',
};

const INJECTED_FILES = [
  ['tailwind.config.js', TAILWIND_CONFIG],
  ['postcss.config.js', POSTCSS_CONFIG],
  ['globals.css', GLOBALS_CSS],
];

function writeIfMissing(name, contents, force, created, skipped) {
  const target = path.join(PROJECT_ROOT, name);
  if (fs.existsSync(target) && !force) {
    skipped.push(name);
    return;
  }
  fs.writeFileSync(target, contents, 'utf8');
  created.push(name);
}

function injectScripts(force, created, skipped) {
  const pkgPath = path.join(PROJECT_ROOT, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (error) {
    process.stderr.write(`Cannot parse ${pkgPath}: ${error.message}\n`);
    process.exit(2);
  }

  pkg.scripts = pkg.scripts || {};
  let changed = false;
  const added = [];
  const kept = [];

  for (const [name, command] of Object.entries(NPM_SCRIPTS)) {
    if (pkg.scripts[name] !== undefined && !force) {
      kept.push(name);
      continue;
    }
    if (pkg.scripts[name] !== command) changed = true;
    pkg.scripts[name] = command;
    added.push(name);
  }

  if (changed) {
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  }
  created.push(...added.map((name) => `package.json#scripts.${name}`));
  skipped.push(...kept.map((name) => `package.json#scripts.${name}`));
}

function inject(force) {
  const created = [];
  const skipped = [];

  for (const [name, contents] of INJECTED_FILES) {
    writeIfMissing(name, contents, force, created, skipped);
  }
  injectScripts(force, created, skipped);

  const { override, designDir, outputRoot } = resolution();
  const artifacts = path.join(outputRoot, 'components', 'ui', 'gluestack-ui-provider');

  process.stdout.write(`Flipova Foundation ${readPackageVersion()}\n`);
  process.stdout.write(`  registries : ${designDir}${override ? '  (project override)' : '  (from node_modules)'}\n`);
  process.stdout.write(`  artifacts  : ${artifacts}\n`);
  for (const name of created) process.stdout.write(`  created    : ${name}\n`);
  for (const name of skipped) process.stdout.write(`  kept       : ${name}\n`);

  process.stdout.write('\nNext steps:\n');
  process.stdout.write('  1. npm install gluestack-ui\n');
  process.stdout.write('  2. wrap the app in <GluestackUIProvider mode="system"> from @flipova/foundation/ui\n');
  process.stdout.write('  3. npx flipova-design lint   # verify\n');
}

function printWhere() {
  const { override, designDir, outputRoot } = resolution();
  process.stdout.write(`package      ${PACKAGE_ROOT}\n`);
  process.stdout.write(`version      ${readPackageVersion()}\n`);
  process.stdout.write(`project      ${PROJECT_ROOT}\n`);
  process.stdout.write(`registries   ${designDir}${override ? '  (project override)' : '  (node_modules)'}\n`);
  process.stdout.write(`artifacts    ${path.join(outputRoot, 'components', 'ui', 'gluestack-ui-provider')}\n`);
  process.stdout.write(`tool         ${TOOL}\n`);
  process.stdout.write(`python       ${process.env.FOUNDATION_PYTHON || '(auto-detect)'}\n`);
}

function runTool(command, args) {
  if (!fs.existsSync(TOOL)) {
    process.stderr.write(`Design toolchain missing at ${TOOL}. Reinstall @flipova/foundation.\n`);
    process.exit(2);
  }
  const { designDir, outputRoot } = resolution();
  const result = spawnSync(process.execPath, [TOOL, command, ...args], {
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      FOUNDATION_DESIGN_DIR: designDir,
      FOUNDATION_PROJECT_ROOT: outputRoot,
      FOUNDATION_DOCS_OUT: path.join(PROJECT_ROOT, 'docs', 'generated'),
    },
    stdio: 'inherit',
  });
  if (result.error) {
    process.stderr.write(`${result.error}\n`);
    process.exit(1);
  }
  process.exit(result.status == null ? 1 : result.status);
}

function main() {
  const argv = process.argv.slice(2);
  const command = argv[0];
  const args = argv.slice(1);

  if (command === 'init' || command === 'inject') {
    inject(args.includes('--force'));
    process.exit(0);
  }
  if (command === 'where') {
    printWhere();
    process.exit(0);
  }
  if (command === undefined) {
    process.stderr.write(
      'Usage: npx flipova-design <init|inject|where|gen|check|verify|canonical|lint|doc|edit|run|pipeline>\n');
    process.exit(2);
  }
  runTool(command, args);
}

main();