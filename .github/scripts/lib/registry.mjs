/**
 * The local issue registry: one YAML file per issue under `.github/issues/`.
 *
 * The files are the source of truth; `.numbers.json` maps a stable local id to
 * the GitHub issue number. Ids are never reused, because a reused id would
 * silently re-point an old branch at a new issue.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { ROOT, api, getIssue, isPullRequest } from './github.mjs';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

export const DIR = join(ROOT, '.github', 'issues');
export const NUMBERS_FILE = join(DIR, '.numbers.json');

export function readRegistry() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    .sort()
    .map((f) => {
      const doc = yaml.load(readFileSync(join(DIR, f), 'utf8'));
      if (!doc?.id || !doc?.title) throw new Error(`.github/issues/${f}: missing "id" or "title"`);
      return { ...doc, file: f, labels: Array.isArray(doc.labels) ? doc.labels : [] };
    });
}

export function readNumbers() {
  if (!existsSync(NUMBERS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(NUMBERS_FILE, 'utf8'));
  } catch {
    return {};
  }
}

export const writeNumbers = (n) => writeFileSync(NUMBERS_FILE, `${JSON.stringify(n, null, 2)}\n`, 'utf8');

/**
 * A stable, readable id: `Registry-driven theming pipeline` ->
 * `registry-driven-theming`.
 *
 * Capped at a word boundary rather than mid-word: an id like
 * `one-cli-for-the-contribution-cycle-and-exactly-one-chan` is worse to read
 * and worse to type than a slightly shorter, whole-word one.
 */
export function slugify(text) {
  const base = String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base.length <= 40) return base;
  return base.slice(0, 40).replace(/-[^-]*$/, '') || base.slice(0, 40);
}

export function uniqueSlug(base, taken) {
  let slug = base || 'issue';
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

/**
 * Write an issue file with LF endings and no BOM.
 *
 * This matters more than it looks: a changeset written through PowerShell once
 * ended up with its whole frontmatter on one line, and changesets rejected it
 * with a parse error that named the file only vaguely.
 */
export function writeIssue({ id, title, labels = [], body = '' }, note) {
  const header = note ? `# ${note.replace(/\n/g, '\n# ')}\n` : '';
  const front =
    yaml
      .dump({ id, title, labels, body: body.replace(/\s+$/, '') }, { lineWidth: 100, quotingType: '"', noRefs: true })
      .trimEnd() + '\n';
  writeFileSync(join(DIR, `${id}.yml`), `${header}${front}`, 'utf8');
  return `${id}.yml`;
}

/**
 * Validate the declared issues against GitHub and, when `apply` is set, repair
 * them. Returns the problems found so the caller decides how loudly to fail.
 */
export async function reconcile(issues, { apply = false } = {}) {
  const numbers = readNumbers();
  const problems = [];
  const repaired = [];

  for (const issue of issues) {
    const known = numbers[issue.id];
    if (!known) {
      if (!apply) {
        problems.push(`${issue.id}: not synced yet (no GitHub number) - run \`flow issue sync\``);
        continue;
      }
      const created = await api('/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: issue.title, body: issue.body ?? '', labels: issue.labels }),
      });
      numbers[issue.id] = created.number;
      repaired.push(`created #${created.number} ${issue.id}`);
      continue;
    }

    const remote = await getIssue(known);
    if (isPullRequest(remote)) {
      problems.push(`${issue.id}: #${known} is a pull request, not an issue - only an issue can be closed`);
      continue;
    }

    const drift = [];
    if (remote.title !== issue.title) drift.push(`title ${JSON.stringify(remote.title)} -> ${JSON.stringify(issue.title)}`);
    const have = remote.labels.map((l) => l.name);
    const absent = issue.labels.filter((l) => !have.includes(l));
    if (absent.length) drift.push(`labels missing on GitHub: ${absent.join(', ')}`);

    if (!drift.length) continue;
    if (apply) {
      await api(`/issues/${known}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: issue.title, labels: [...new Set([...issue.labels, ...have])] }),
      });
      repaired.push(`updated #${known} ${issue.id} (${drift.join('; ')})`);
    } else {
      problems.push(`${issue.id}: #${known} drifted -> ${drift.join('; ')}`);
    }
  }

  if (apply) writeNumbers(numbers);
  return { problems, repaired, numbers };
}
