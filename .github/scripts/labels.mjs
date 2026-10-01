#!/usr/bin/env node
/**
 * Declarative repository labels.
 *
 * `.github/labels.yml` lists every label the automation depends on.
 * `actions/labeler` fails outright on an unknown label, so a label deleted by
 * hand would silently break every pull request: this script turns that into an
 * explicit, actionable signal.
 *
 *   node .github/scripts/labels.mjs --list     what the repository has today
 *   node .github/scripts/labels.mjs --check    verify (read-only, no token)
 *   GITHUB_TOKEN=<pat> node .github/scripts/labels.mjs --create
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// js-yaml is a CommonJS package: load it through createRequire so the script
// works whatever the interop of the installed version.
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');

const OWNER = process.env.GITHUB_REPOSITORY_OWNER ?? 'flipova';
const REPO = process.env.GITHUB_REPOSITORY_NAME ?? 'foundation';
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

const { labels: declared = [] } = yaml.load(
  readFileSync(join(root, '.github', 'labels.yml'), 'utf8')
);

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
const existing = new Map((await api('/labels?per_page=100')).map((l) => [l.name, l]));
const missing = declared.filter((l) => !existing.has(l.name));

const ghCommand = (l) =>
  `gh label create "${l.name}" --color ${l.color} --description ${JSON.stringify(l.description ?? '')}`;

if (mode === '--list') {
  console.log(`declared: ${declared.length} | present: ${declared.length - missing.length} | missing: ${missing.length}\n`);
  for (const l of declared) {
    const found = existing.get(l.name);
    console.log(`  ${found ? 'ok     ' : 'MISSING'}  ${l.name.padEnd(18)} ${found ? `#${found.color}` : `#${l.color}`}  ${l.description ?? ''}`);
  }
  console.log('\nother labels in the repository:');
  for (const name of [...existing.keys()].filter((n) => !declared.some((l) => l.name === n)).sort()) {
    console.log(`          ${name}`);
  }
} else if (mode === '--check') {
  if (missing.length === 0) {
    console.log(`labels: all ${declared.length} declared label(s) present.`);
  } else {
    console.error(`labels: ${missing.length} declared label(s) missing:\n`);
    for (const l of missing) console.error(`  - ${l.name}`);
    console.error('\ncreate them with:\n');
    for (const l of missing) console.error(`  ${ghCommand(l)}`);
    console.error('\nor all of them at once, without gh:');
    console.error('  GITHUB_TOKEN=<pat> node .github/scripts/labels.mjs --create');
    process.exitCode = 1;
  }
} else if (mode === '--create') {
  if (!token) {
    console.error('--create needs a token: set GITHUB_TOKEN (a fine-grained PAT with issues:write).');
    process.exitCode = 2;
  } else if (missing.length === 0) {
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
} else {
  console.error('usage: labels.mjs [--list | --check | --create]');
  process.exitCode = 2;
}