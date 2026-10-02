#!/usr/bin/env node
/**
 * Declarative repository labels, and the labeler rules derived from them.
 *
 * `.github/labels.yml` is the single source of truth: each label declares its
 * name, colour, description and - optionally - the paths that trigger it.
 * `actions/labeler` requires its own schema, so `.github/labeler.yml` is
 * GENERATED from the labels that have `paths`, and `--check` fails when the
 * committed file drifts. That removes the two failure modes of a hand-written
 * labeler: referencing a label that does not exist, and labelling rules that
 * nobody notices are broken.
 *
 *   --list          what the repository has today, and what is missing
 *   --check         read-only verification (labels + labeler drift); run by CI
 *   --sync-labeler  regenerate .github/labeler.yml from labels.yml
 *   --create        create the labels missing in the repository
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// js-yaml is a CommonJS package: load it through createRequire so the script
// works whatever the interop of the installed version.
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const LABELS = join(root, '.github', 'labels.yml');
const LABELER = join(root, '.github', 'labeler.yml');

const OWNER = process.env.GITHUB_REPOSITORY_OWNER ?? 'flipova';
const REPO = process.env.GITHUB_REPOSITORY_NAME ?? 'foundation';
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

const loadDeclared = () => {
  const doc = yaml.load(readFileSync(LABELS, 'utf8'));
  return Array.isArray(doc?.labels) ? doc.labels : [];
};

const declared = loadDeclared();
const automatic = declared.filter((l) => Array.isArray(l.paths) && l.paths.length > 0);

const renderLabeler = () => {
  const lines = [
    '# GENERATED FILE - do not edit by hand.',
    '# Source of truth: .github/labels.yml (the `paths` of each label).',
    '# Regenerate with: node .github/scripts/labels.mjs --sync-labeler',
    '',
  ];
  for (const label of automatic) {
    lines.push(`"${label.name}":`);
    for (const p of label.paths) {
      lines.push('  - changed-files:');
      lines.push(`      - any-glob-to-any-file: "${p}"`);
    }
  }
  return lines.join('\n') + '\n';
};

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
if (token) headers.Authorization = `Bearer ${token}`;

async function api(path, init = {}) {
  const res = await fetch(API + path, { ...init, headers: { ...headers, ...(init.headers ?? {}) } });
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

const mode = process.argv[2] ?? '--check';
const ghCommand = (l) =>
  `gh label create "${l.name}" --color ${l.color} --description ${JSON.stringify(l.description ?? '')}`;

const labelerIsCurrent = () => {
  try {
    return readFileSync(LABELER, 'utf8') === renderLabeler();
  } catch {
    return false;
  }
};

// --- modes that need no registry access ------------------------------------
if (mode === '--sync-labeler') {
  writeFileSync(LABELER, renderLabeler(), 'utf8');
  console.log(`labeler: wrote .github/labeler.yml (${automatic.length} label(s) with paths).`);
} else if (mode === '--check') {
  const needsWrite = !labelerIsCurrent();
  let ok = true;
  if (needsWrite) {
    ok = false;
    console.error('labeler: .github/labeler.yml is missing or out of date with .github/labels.yml.\n');
    console.error('regenerate it with:\n\n  node .github/scripts/labels.mjs --sync-labeler\n');
  } else {
    console.log(`labeler: up to date (${automatic.length} label(s) with paths).`);
  }
  const existing = new Map((await api('/labels?per_page=100')).map((l) => [l.name, l]));
  const missing = declared.filter((l) => !existing.has(l.name));
  if (missing.length === 0) {
    console.log(`labels: all ${declared.length} declared label(s) present.`);
  } else {
    ok = false;
    console.error(`\nlabels: ${missing.length} declared label(s) missing:\n`);
    for (const l of missing) console.error(`  - ${l.name}`);
    console.error('\ncreate them with:\n');
    for (const l of missing) console.error(`  ${ghCommand(l)}`);
    console.error('\nor all of them at once:\n  GITHUB_TOKEN=<pat> node .github/scripts/labels.mjs --create');
  }
  process.exitCode = ok ? 0 : 1;
} else if (mode === '--list') {
  const existing = new Map((await api('/labels?per_page=100')).map((l) => [l.name, l]));
  const missing = declared.filter((l) => !existing.has(l.name));
  console.log(`declared: ${declared.length} | present: ${declared.length - missing.length} | missing: ${missing.length}`);
  console.log(`labeler: ${labelerIsCurrent() ? 'up to date' : 'OUT OF DATE'} (run --sync-labeler)\n`);
  for (const l of declared) {
    const found = existing.get(l.name);
    console.log(`  ${found ? 'ok     ' : 'MISSING'}  ${l.name.padEnd(18)} ${(l.paths ?? []).length ? '[auto] ' : '[manual]'} ${l.description ?? ''}`);
  }
  console.log('\nother labels in the repository:');
  for (const name of [...existing.keys()].filter((n) => !declared.some((l) => l.name === n)).sort()) {
    console.log(`          ${name}`);
  }
} else if (mode === '--create') {
  if (!token) {
    console.error('--create needs a token: set GITHUB_TOKEN (a fine-grained PAT with issues:write).');
    process.exitCode = 2;
  } else {
    const existing = new Map((await api('/labels?per_page=100')).map((l) => [l.name, l]));
    const missing = declared.filter((l) => !existing.has(l.name));
    if (missing.length === 0) {
      console.log(`labels: nothing to create, all ${declared.length} already present.`);
    } else {
      for (const l of missing) {
        await api('/labels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: l.name, color: l.color, description: l.description ?? '' }),
        });
        console.log(`  created  ${l.name}`);
      }
      console.log(`labels: ${missing.length} created.`);
    }
  }
} else {
  console.error('usage: labels.mjs [--list | --check | --create | --sync-labeler]');
  process.exitCode = 2;
}