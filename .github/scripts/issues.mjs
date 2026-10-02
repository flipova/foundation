#!/usr/bin/env node
/**
 * Local issue registry, synced to GitHub.
 *
 * `.github/issues/<id>.yml` declares one issue per file: id, title, labels and
 * a Markdown body. That file is the source of truth, so work can be tracked
 * (and reviewed) without a network round trip.
 *
 *   --list              the registry and, for each entry, its GitHub number
 *   --sync              create the issues that do not exist, fix drifted
 *                       titles/labels, and record the numbers
 *   --check             read-only verification (run by CI)
 *   --link <pr> [ids..]  rewrite `Closes #<local-id>` / commit trailers into a
 *                       real `Closes #<number>` at the top of the pull request
 *
 * Numbers live in `.github/issues/.numbers.json` (committed, like a lockfile):
 * the mapping must be reviewable, and CI needs it to verify anything.
 *
 * Requires a token for everything but `--list`: `GITHUB_TOKEN` or `GH_TOKEN`
 * (a fine-grained PAT with issues:write, pull-requests:write).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const DIR = join(root, '.github', 'issues');
const NUMBERS = join(DIR, '.numbers.json');

const OWNER = process.env.GITHUB_REPOSITORY_OWNER ?? 'flipova';
const REPO = process.env.GITHUB_REPOSITORY_NAME ?? 'foundation';
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const MARKER = '<!-- foundation:linked-issues -->';

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

const declared = readdirSync(DIR)
  .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
  .sort()
  .map((f) => {
    const doc = yaml.load(readFileSync(join(DIR, f), 'utf8'));
    if (!doc?.id || !doc?.title) throw new Error(`${f}: missing "id" or "title"`);
    return { ...doc, file: f, labels: Array.isArray(doc.labels) ? doc.labels : [] };
  });

const readNumbers = () => {
  if (!existsSync(NUMBERS)) return {};
  try {
    return JSON.parse(readFileSync(NUMBERS, 'utf8'));
  } catch {
    return {};
  }
};
const writeNumbers = (n) => writeFileSync(NUMBERS, JSON.stringify(n, null, 2) + '\n', 'utf8');

const getIssue = async (n) => api(`/issues/${n}`);
const isPullRequest = (issue) => Boolean(issue.pull_request);

// --- id resolution ---------------------------------------------------------
const idsFromCommits = () => {
  try {
    const base = execSync('git merge-base origin/main HEAD', { encoding: 'utf8' }).trim();
    const body = execSync(`git log ${base}..HEAD --pretty=%B`, { encoding: 'utf8' });
    const found = new Set();
    for (const m of body.matchAll(/^Issues:\s*(.+)$/gm)) {
      for (const raw of m[1].split(',')) {
        const id = raw.trim().replace(/^[-[\]]+/, '');
        if (id) found.add(id);
      }
    }
    return [...found];
  } catch {
    return [];
  }
};

const mode = process.argv[2] ?? '--list';

if (mode === '--list') {
  const numbers = readNumbers();
  console.log(`declared: ${declared.length} | linked: ${Object.keys(numbers).length}\n`);
  for (const d of declared) {
    const n = numbers[d.id];
    console.log(`  ${String(n ?? 'unlinked').padEnd(10)} ${d.id.padEnd(26)} ${d.title.slice(0, 60)}`);
  }
} else if (mode === '--sync' || mode === '--check') {
  if (!token) {
    console.error(`${mode} needs a token: set GITHUB_TOKEN (issues:write${mode === '--sync' ? ', pull-requests:write' : ''}).`);
    process.exitCode = 2;
  } else {
    const numbers = readNumbers();
    const problems = [];
    for (const d of declared) {
      const known = numbers[d.id];
      if (mode === '--sync' && !known) {
        const created = await api('/issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: d.title, body: d.body ?? '', labels: d.labels }),
        });
        numbers[d.id] = created.number;
        console.log(`  created  #${created.number}  ${d.id}`);
        continue;
      }
      if (!known) {
        problems.push(`${d.id}: not synced yet (no GitHub number)`);
        continue;
      }
      const issue = await getIssue(known);
      if (isPullRequest(issue)) {
        problems.push(`${d.id}: #${known} is a pull request, not an issue`);
        continue;
      }
      const drift = [];
      if (issue.title !== d.title) drift.push(`title: ${JSON.stringify(issue.title)} -> ${JSON.stringify(d.title)}`);
      const have = issue.labels.map((l) => l.name);
      const absent = d.labels.filter((l) => !have.includes(l));
      if (absent.length) drift.push(`missing labels: ${absent.join(', ')}`);
      if (drift.length) {
        if (mode === '--sync') {
          await api(`/issues/${known}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: d.title, labels: [...new Set([...d.labels, ...have])] }),
          });
          console.log(`  updated  #${known}  ${d.id}  (${drift.join('; ')})`);
        } else {
          problems.push(`${d.id}: #${known} drifted -> ${drift.join('; ')}`);
        }
      }
    }
    if (mode === '--sync') {
      writeNumbers(numbers);
      console.log(`issues: ${declared.length} declared, ${Object.keys(numbers).length} linked.`);
    } else if (problems.length) {
      console.error(`issues: ${problems.length} problem(s):\n`);
      for (const p of problems) console.error(`  - ${p}`);
      console.error('\nfix with: node .github/scripts/issues.mjs --sync');
      process.exitCode = 1;
    } else {
      console.log(`issues: ${declared.length} declared issue(s) consistent with GitHub.`);
    }
  }
} else if (mode === '--link') {
  if (!token) {
    console.error('--link needs a token: set GITHUB_TOKEN (pull-requests:write).');
    process.exitCode = 2;
  } else {
    const prNumber = Number(process.argv[3]);
    const explicit = process.argv.slice(4).filter((a) => !a.startsWith('-'));
    const ids = explicit.length ? explicit : idsFromCommits();
    if (!Number.isInteger(prNumber) || !ids.length) {
      console.error('usage: issues.mjs --link <pr-number> [local-id ...]');
      console.error('       ids can also come from an "Issues: a, b" commit trailer.');
      process.exitCode = 2;
    } else {
      const numbers = readNumbers();
      const unknown = ids.filter((id) => !declared.some((d) => d.id === id));
      if (unknown.length) {
        console.error(`unknown local issue id(s): ${unknown.join(', ')}`);
        process.exitCode = 2;
      } else {
        const pr = await api(`/pulls/${prNumber}`);
        const resolved = [];
        for (const id of ids) {
          const n = numbers[id];
          if (!n) {
            console.error(`${id}: not synced yet, run --sync first.`);
            process.exitCode = 2;
          } else {
            const issue = await getIssue(n);
            if (isPullRequest(issue)) {
              console.error(`${id}: #${n} is a pull request, "Closes" needs an issue.`);
              process.exitCode = 2;
            } else {
              resolved.push(n);
            }
          }
        }
        if (process.exitCode) {
          // reported above
        } else {
          const line = `Closes ${resolved.map((n) => `#${n}`).join(', ')}`;
          const prBody = pr.body ?? '';
          const withoutMarker = prBody.replace(new RegExp(`\\n*${MARKER}\\n*`, 'g'), '').trim();
          const body = withoutMarker.startsWith(line)
            ? withoutMarker
            : `${line}\n${MARKER}\n\n${withoutMarker}`.replace(/\n*$/, '\n');
          if (body !== prBody) {
            await api(`/pulls/${prNumber}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ body }),
            });
            console.log(`linked: #${prNumber} -> ${line}`);
          } else {
            console.log(`linked: #${prNumber} already has "${line}".`);
          }
        }
      }
    }
  }
} else {
  console.error('usage: issues.mjs [--list | --sync | --check | --link <pr> [ids...]]');
  process.exitCode = 2;
}