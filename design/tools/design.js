#!/usr/bin/env node
/**
 * design/tools/design.js — cross-platform npm entry point for the design
 * toolchain (mirrors design/tools/windows/*.cmd and design/tools/unix/*.sh).
 *
 * Usage:
 *   node design/tools/design.js <target> [extra args...]
 *
 * Targets (same semantics as the .cmd/.sh wrappers):
 *   gen        generate.py   — compile tokens/themes into the gluestack config
 *   check      checker.py    — determinism rules + XSD pass + ruff lint of sources/
 *   verify     checker.py    — verify committed canonical index
 *   canonical  checker.py    — re-emit design/canonical.index.txt
 *   lint       linter.py     — XSD-validate every design XML
 *   doc        docgen.py     — regenerate docs/generated from documentation.xml
 *   edit       xmleditor.py  — visual, XSD-driven XML block editor (GUI by default)
 *   run        passthrough   — run any sources/*.py with the resolved python
 *
 * Python resolution order:
 *   1. $FOUNDATION_PYTHON (explicit override)
 *   2. $FOUNDATION_VENV, else design/tools/.venv
 *      (Scripts/python.exe on Windows, bin/python otherwise)
 *   3. `python3` then `python` on PATH, when `lxml` is importable
 *
 * Environment:
 *   FOUNDATION_DESIGN_DIR     registry root (defaults to design/ next to tools/)
 *   FOUNDATION_PROJECT_ROOT   output root for the generated artifacts
 *   FOUNDATION_DOCS_OUT       docs output root (defaults to <root>/docs/generated)
 *   FOUNDATION_VENV           venv directory holding the design dependencies
 *
 * Examples:
 *   node design/tools/design.js gen --check
 *   node design/tools/design.js gen --element Button
 *   node design/tools/design.js run checker.py --list-rules -m design/manifest.xml
 */
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOOLS_DIR = __dirname;
const DESIGN_DIR = process.env.FOUNDATION_DESIGN_DIR
  ? path.resolve(process.env.FOUNDATION_DESIGN_DIR)
  : path.join(TOOLS_DIR, '..');
// The tools always come from the package that runs them. `DESIGN_DIR` is the
// registry root, and an app that adopts the registries owns them without owning
// the toolchain: deriving the sources from it meant `sources/` had to be copied
// too, which is the duplication the CLI exists to avoid - and a copy without
// `tools/` simply had no generator to run.
const SOURCES_DIR = path.join(TOOLS_DIR, 'sources');
const REPO_ROOT = process.env.FOUNDATION_PROJECT_ROOT
  ? path.resolve(process.env.FOUNDATION_PROJECT_ROOT)
  : path.join(DESIGN_DIR, '..');

const MANIFEST = path.join(DESIGN_DIR, 'manifest.xml');
const SCHEMA = path.join(DESIGN_DIR, 'schema.xsd');
const DOCUMENTATION = path.join(DESIGN_DIR, 'documentation.xml');
const DOCS_OUT = process.env.FOUNDATION_DOCS_OUT
  ? path.resolve(process.env.FOUNDATION_DOCS_OUT)
  : path.join(REPO_ROOT, 'docs', 'generated');

const TARGETS = {
  gen: {
    script: 'generate.py',
    args: ['--manifest', MANIFEST, '--root', REPO_ROOT],
  },
  check: {
    script: 'checker.py',
    args: ['--manifest', MANIFEST, '--root', REPO_ROOT, '--schema', SCHEMA, '--check'],
  },
  verify: {
    script: 'checker.py',
    args: ['--manifest', MANIFEST, '--root', REPO_ROOT, '--verify-canonical'],
  },
  canonical: {
    script: 'checker.py',
    args: ['--manifest', MANIFEST, '--root', REPO_ROOT, '--emit-canonical'],
  },
  lint: {
    script: 'linter.py',
    args: ['--schema', SCHEMA, '--manifest', MANIFEST, '--dir', DESIGN_DIR],
  },
  doc: {
    script: 'docgen.py',
    args: ['--manifest', MANIFEST, '--documentation', DOCUMENTATION,
           '--root', REPO_ROOT, '--out', DOCS_OUT],
  },
  pipeline: {
    script: null,
    args: [],
  },
  edit: {
    script: 'xmleditor.py',
    // No default args: an optional positional XML file and every CLI flag
    // (--list-roots, --validate, --new, ...) pass through untouched.
    args: [],
  },
  run: {
    script: null, // passthrough: first extra arg is the script name
    args: [],
  },
};

function findPython() {
  if (process.env.FOUNDATION_PYTHON) return process.env.FOUNDATION_PYTHON;

  const venvDirs = [];
  if (process.env.FOUNDATION_VENV) venvDirs.push(path.resolve(process.env.FOUNDATION_VENV));
  venvDirs.push(path.join(TOOLS_DIR, '.venv'));
  if (REPO_ROOT !== DESIGN_DIR) venvDirs.push(path.join(REPO_ROOT, 'design', 'tools', '.venv'));

  for (const dir of venvDirs) {
    const candidates = process.platform === 'win32'
      ? [path.join(dir, 'Scripts', 'python.exe')]
      : [path.join(dir, 'bin', 'python3'), path.join(dir, 'bin', 'python')];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate;
    }
  }

  const pathExes = process.platform === 'win32'
    ? ['python.exe', 'python3.exe']
    : ['python3', 'python'];
  for (const exe of pathExes) {
    try {
      const probe = spawnSync(exe, ['-c', 'import lxml.etree'], { stdio: 'ignore' });
      if (probe.status === 0) return exe;
    } catch (_) { /* not on PATH */ }
  }
  return null;
}

function main() {
  const [target, ...extra] = process.argv.slice(2);
  const spec = TARGETS[target];
  if (!spec) {
    process.stderr.write(
      'Unknown target: %s\nAvailable targets: %s\n'.replace('%s', String(target))
        .replace('%s', Object.keys(TARGETS).join(', ')));
    process.exit(2);
  }

  let scriptPath;
  let args;
  if (target === 'pipeline') {
    for (const step of ['gen', 'check', 'verify', 'lint', 'doc']) {
      const result = spawnSync(process.execPath, [__filename, step, ...extra], {
        stdio: 'inherit',
        env: process.env,
      });
      if (result.status !== 0) process.exit(result.status == null ? 1 : result.status);
    }
    process.exit(0);
  }
  if (target === 'run') {
    const scriptName = extra.shift();
    if (!scriptName) {
      process.stderr.write('Usage: node design/tools/design.js run <script.py> [args...]\n');
      process.exit(2);
    }
    scriptPath = path.join(SOURCES_DIR, scriptName);
    args = extra;
  } else {
    scriptPath = path.join(SOURCES_DIR, spec.script);
    args = spec.args.concat(extra);
  }

  const python = findPython();
  if (!python) {
    process.stderr.write(
      'No suitable Python found. Create the project venv or set FOUNDATION_PYTHON.\n' +
      '  C:/opt/Python38-32/python3.exe -m venv --without-pip --system-site-packages design/tools/.venv\n');
    process.exit(2);
  }

  const result = spawnSync(python, [scriptPath].concat(args), { stdio: 'inherit' });
  if (result.error) {
    process.stderr.write(String(result.error) + '\n');
    process.exit(1);
  }
  process.exit(result.status == null ? 1 : result.status);
}

main();
