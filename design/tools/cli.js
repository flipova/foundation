#!/usr/bin/env node
/**
 * flipova-design — the design toolchain of @flipova/foundation. Node only, no dependency.
 *
 *   npx flipova-design init            inject app-level wiring (never overwrites)
 *   npx flipova-design init --force    overwrite the injected files
 *   npx flipova-design adopt           copy the registries into the project (it then owns its design system)
 *   npx flipova-design gui [--port N] [--no-open]   edit the registries visually (local, nothing leaves the machine)
 *   npx flipova-design where           print the resolved paths (diagnostics)
 *   npx flipova-design gen [--check|--list]   compile tokens/themes -> config.ts + tokens.js
 *   npx flipova-design check [--list-rules] [--sync-version] [-v]   determinism rules + XSD
 *   npx flipova-design verify          the committed canonical index matches the registries
 *   npx flipova-design canonical       re-emit design/canonical.index.txt
 *   npx flipova-design lint            XSD-validate every registry file
 *   npx flipova-design pipeline        gen, check, verify, lint
 *
 * Registry resolution: <project>/design/manifest.xml when present (the project adopted them), else the installed package.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
const PACKAGE_DESIGN = path.join(PACKAGE_ROOT, 'design');
const PROJECT_ROOT = process.cwd();
const PROJECT_DESIGN = path.join(PROJECT_ROOT, 'design');

function resolution() {
  const override = fs.existsSync(path.join(PROJECT_DESIGN, 'manifest.xml'));
  return {
    override,
    designDir: process.env.FOUNDATION_DESIGN_DIR
      ? path.resolve(process.env.FOUNDATION_DESIGN_DIR)
      : override
        ? PROJECT_DESIGN
        : PACKAGE_DESIGN,
    outputRoot: process.env.FOUNDATION_PROJECT_ROOT
      ? path.resolve(process.env.FOUNDATION_PROJECT_ROOT)
      : override
        ? PROJECT_ROOT
        : PACKAGE_ROOT,
  };
}

function readPackageVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).version;
  } catch (_) {
    return 'unknown';
  }
}

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
  const artifacts = path.join(outputRoot, 'components', 'providers', 'gluestack', 'ui', 'gluestack-ui-provider');

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

/* ------------------------------------------------------------------ *
 * Adopting the registries (owning the design system)
 * ------------------------------------------------------------------ */

// The registries and nothing else: the toolchain stays in the package, which is
// the whole point of the split. `tools/` is what must never be copied.
const REGISTRY_FILES = [
  'manifest.xml',
  'schema.xsd',
  'tokens.xml',
  'themes.xml',
  // The emitted index of the registries: without it `verify` reports the copy as
  // drifting, which is the opposite of what adopting them should feel like.
  'canonical.index.txt',
];

const ADOPTED_OUTPUTS = {
  gluestackConfig: 'theme/config.ts',
  gluestackTokens: 'theme/tokens.js',
  designTheme: 'theme/design-theme.ts',
};

const PROVIDER = `// theme/provider.tsx
// Generated by \`npx flipova-design adopt\` -- safe to edit.
//
// Your themes live in design/*.xml; \`npm run design:gen\` turns them into ./design-theme.ts (components) and
// ./config.ts + ./tokens.js (Tailwind / NativeWind). This provider hands them to the components.
//
// To change the component library, change the next two lines only:
//   flipova (default) | gluestack | reusables | paper | tamagui   -> '@flipova/foundation/providers/<name>'
import { FlipovaProvider } from '@flipova/foundation';
import { flipova } from '@flipova/foundation/providers/flipova';
import type { ReactNode } from 'react';
import { designTheme } from './design-theme';

export function AppThemeProvider({
  children,
  mode = 'system',
  variant,
}: {
  children?: ReactNode;
  mode?: 'light' | 'dark' | 'system';
  variant?: string;
}) {
  return (
    <FlipovaProvider adapter={flipova} theme={designTheme} mode={mode} variant={variant}>
      {children}
    </FlipovaProvider>
  );
}

export default AppThemeProvider;
`;

/**
 * Copy the registries into the project and point their outputs at the project.
 *
 * An app that adopts them owns its design system: it edits design/tokens.xml and
 * design/themes.xml, runs the pipeline, and gets its own theme/config.ts and
 * theme/tokens.js instead of the package's. The package still provides the
 * components, the generator and every token it does not override.
 */
function adopt(force) {
  if (fs.existsSync(PROJECT_DESIGN) && !force) {
    process.stderr.write(`A design directory already exists at ${PROJECT_DESIGN}.\n`);
    process.stderr.write('Nothing was copied. Remove it first, or pass --force to overwrite it.\n');
    process.exit(2);
  }

  fs.mkdirSync(PROJECT_DESIGN, { recursive: true });
  const created = [];
  for (const file of REGISTRY_FILES) {
    const from = path.join(PACKAGE_DESIGN, file);
    if (!fs.existsSync(from)) continue;
    fs.copyFileSync(from, path.join(PROJECT_DESIGN, file));
    created.push(`design/${file}`);
  }

  // The manifest keeps declaring the package's own outputs; a project that owns
  // the registries must write its own artifacts, so the two paths are rewritten
  // here rather than by hand afterwards.
  const manifestPath = path.join(PROJECT_DESIGN, 'manifest.xml');
  const manifest = fs.readFileSync(manifestPath, 'utf8');
  const rewritten = manifest.replace(
    /<(gluestackConfig|gluestackTokens|designTheme)>[^<]*<\/\1>/g,
    (line, kind) => `<${kind}>${ADOPTED_OUTPUTS[kind]}</${kind}>`,
  );
  if (rewritten !== manifest) {
    fs.writeFileSync(manifestPath, rewritten, 'utf8');
    created.push('design/manifest.xml (outputs -> theme/)');
  }

  // The wiring the app-level files need, created only when missing for the same
  // reason `init` never overwrites: these are the app's files.
  fs.mkdirSync(path.join(PROJECT_ROOT, 'theme'), { recursive: true });
  const providerPath = path.join(PROJECT_ROOT, 'theme', 'provider.tsx');
  if (fs.existsSync(providerPath) && !force) created.push('theme/provider.tsx (kept)');
  else {
    fs.writeFileSync(providerPath, PROVIDER, 'utf8');
    created.push('theme/provider.tsx');
  }

  process.stdout.write(`Adopted the design registries into ${PROJECT_DESIGN}\n`);
  for (const what of created) process.stdout.write(`  created  : ${what}\n`);
  process.stdout.write('\nNext steps:\n');
  process.stdout.write('  1. edit design/tokens.xml and design/themes.xml - that is now your design system\n');
  process.stdout.write('     (or visually: npx flipova-design gui)\n');
  process.stdout.write('  2. npm run design:gen        -> theme/design-theme.ts + theme/config.ts + theme/tokens.js\n');
  process.stdout.write("  3. tailwind.config.js        -> require('./theme/tokens')\n");
  process.stdout.write('  4. wrap the app in <AppThemeProvider mode="system"> from ./theme/provider\n');
  process.stdout.write('  5. npm run design:verify     -> the registries are in step with the artifacts\n');
}

/** `gui`: adopt the registries when the project has none yet, then serve the editor. Resolves when the server stops. */
function gui(args) {
  const { override } = resolution();
  if (!override && !process.env.FOUNDATION_DESIGN_DIR) {
    process.stdout.write(
      'This project has not adopted the design registries yet: adopting the neutral starter first.\n',
    );
    adopt(false);
  }
  const { designDir, outputRoot } = resolution();
  const at = args.indexOf('--port');
  const port = at >= 0 ? Number(args[at + 1]) : 0;
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    process.stderr.write('--port expects a number between 0 and 65535\n');
    return 2;
  }
  require('./lib/gui')
    .start({ designDir, outputRoot, port })
    .then(({ url, close }) => {
      if (!args.includes('--no-open')) openBrowser(url);
      process.stdout.write('Press Ctrl+C to stop.\n');
      process.once('SIGINT', () => close().then(() => process.exit(0)));
    })
    .catch((e) => {
      process.stderr.write(`gui: ${e.message}\n`);
      process.exitCode = 1;
    });
  return undefined;
}

/** Best effort: the URL is printed anyway. */
function openBrowser(url) {
  const { spawn } = require('child_process');
  // Only the local console is ever opened: a loopback http(s) address with no space or shell character in it.
  if (!/^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?(\/[\w\-./?=&%#]*)?$/.test(String(url))) return;
  const [cmd, ...a] =
    process.platform === 'darwin'
      ? ['open', url]
      : process.platform === 'win32'
        ? ['rundll32', 'url.dll,FileProtocolHandler', url]
        : ['xdg-open', url];
  try {
    // nosemgrep: javascript.lang.security.detect-child-process.detect-child-process -- url validated above (loopback only), no shell
    spawn(cmd, a, { stdio: 'ignore', detached: true, shell: false })
      .on('error', () => {})
      .unref();
  } catch (_) {
    /* no browser: use the printed link */
  }
}

function printWhere() {
  const { override, designDir, outputRoot } = resolution();
  process.stdout.write(`package      ${PACKAGE_ROOT}\n`);
  process.stdout.write(`version      ${readPackageVersion()}\n`);
  process.stdout.write(`project      ${PROJECT_ROOT}\n`);
  process.stdout.write(`registries   ${designDir}${override ? '  (adopted by this project)' : '  (node_modules)'}\n`);
  process.stdout.write(
    override
      ? `artifacts    ${path.join(outputRoot, 'theme')}  (owned by this project)\n`
      : `artifacts    ${path.join(outputRoot, 'components', 'theme')}  (+ components/providers/gluestack/ui/gluestack-ui-provider)\n`,
  );
  process.stdout.write(`tool         ${__filename}\n`);
}

// --- commands ----------------------------------------------------------------------------------------------------

function tool(command, args) {
  const { designDir, outputRoot } = resolution();
  const manifest = path.join(designDir, 'manifest.xml');
  const schema = path.join(designDir, 'schema.xsd');
  const flag = (f) => args.includes(f);
  switch (command) {
    case 'gen':
      return require('./lib/generate').run({
        root: outputRoot,
        manifest,
        check: flag('--check'),
        list: flag('--list'),
      });
    case 'check':
      return require('./lib/check').run({
        root: outputRoot,
        manifest,
        schema,
        check: true,
        listRules: flag('--list-rules'),
        syncVersion: flag('--sync-version'),
        verbose: flag('--verbose') || flag('-v'),
      });
    case 'verify':
      return require('./lib/check').run({
        root: outputRoot,
        manifest,
        check: false,
        verifyCanonical: true,
        outFile: path.join(designDir, 'canonical.index.txt'),
      });
    case 'canonical':
      return require('./lib/check').run({
        root: outputRoot,
        manifest,
        check: false,
        emitCanonical: true,
        outFile: path.join(designDir, 'canonical.index.txt'),
      });
    case 'lint':
      return require('./lib/lint').run({ schema, manifest, dir: designDir, verbose: flag('--verbose') || flag('-v') });
    case 'pipeline': {
      for (const step of ['gen', 'check', 'verify', 'lint']) {
        const code = tool(step, args);
        if (code !== 0) return code;
      }
      return 0;
    }
    default:
      return null;
  }
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'init' || command === 'inject') {
    inject(args.includes('--force'));
    return 0;
  }
  if (command === 'where') {
    printWhere();
    return 0;
  }
  if (command === 'adopt') {
    adopt(args.includes('--force'));
    return 0;
  }
  if (command === 'gui') return gui(args);
  if (command === undefined) {
    process.stderr.write('Usage: npx flipova-design <init|adopt|gui|where|gen|check|verify|canonical|lint|pipeline>\n');
    return 2;
  }
  const code = tool(command, args);
  if (code === null) {
    process.stderr.write(
      `Unknown command: ${command}\nAvailable: init, inject, adopt, gui, where, gen, check, verify, canonical, lint, pipeline\n`,
    );
    return 2;
  }
  return code;
}

if (require.main === module) {
  const code = main();
  if (code !== undefined) process.exitCode = code;
}

module.exports = { main, tool, resolution };
