/**
 * The local issue registry: one YAML file per issue under `.github/issues/`.
 *
 * The files are the source of truth; `.numbers.json` maps a stable local id to
 * the GitHub issue number. Ids are never reused, because a reused id would
 * silently re-point an old branch at a new issue.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { ROOT, api, getIssue, isPullRequest } from './github.mjs';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

export const DIR = join(ROOT, '.github', 'issues');
export const NUMBERS_FILE = join(DIR, '.numbers.json');

/**
 * Where closed issues go.
 *
 * `.github/issues/` is a work queue, not a museum. A closed ticket has nothing
 * left to sync, and every historic file left in the queue cost one API call per
 * `flow issue check` and made the directory grow without limit - sixteen files,
 * all closed, none of them describing work in flight.
 *
 * The file is moved, not deleted: it is the only place the declared body of a
 * shipped change is reviewable, and `flow issue archive` is its way back.
 * `.numbers.json` keeps the id -> number mapping either way, which is what stops
 * the id being handed out twice.
 */
export const ARCHIVE = join(DIR, 'archive');

const isYaml = (f) => f.endsWith('.yml') || f.endsWith('.yaml');

export function readRegistry() {
  return (
    readdirSync(DIR)
      // `statSync` rather than trusting the extension: the archive is a directory
      // inside the registry, and a reader that loaded it would compare closed
      // tickets against GitHub forever.
      .filter((f) => isYaml(f) && statSync(join(DIR, f)).isFile())
      .sort()
      .map((f) => {
        const doc = yaml.load(readFileSync(join(DIR, f), 'utf8'));
        if (!doc?.id || !doc?.title) throw new Error(`.github/issues/${f}: missing "id" or "title"`);
        return { ...doc, file: f, labels: Array.isArray(doc.labels) ? doc.labels : [] };
      })
  );
}

/**
 * Ids that were declared once and are now archived.
 *
 * They are part of what an id may not collide with: `.numbers.json` still maps
 * them, so handing the same id to a new issue would make `flow issue sync`
 * retitle the old ticket instead of creating the new one.
 */
export function archivedIds() {
  if (!existsSync(ARCHIVE)) return [];
  return readdirSync(ARCHIVE)
    .filter(isYaml)
    .map((f) => f.replace(/\.ya?ml$/, ''));
}

/** Move a declared issue's file into the archive, creating the directory. */
export function archiveFile(file) {
  mkdirSync(ARCHIVE, { recursive: true });
  renameSync(join(DIR, file), join(ARCHIVE, file));
  return `.github/issues/archive/${file}`;
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
 * Write an issue file with LF endings, no BOM, and the body as a literal block.
 *
 * Both details matter. A changeset written through PowerShell once ended up with
 * its whole frontmatter on one line, and changesets rejected it with a parse
 * error that named neither the file nor the line. And a YAML dumper asked to
 * emit a Markdown body will happily choose a *folded* scalar (`>-`), which turns
 * every blank line in the body into a doubled one - so the file is assembled by
 * hand instead.
 */
export function writeIssue({ id, title, labels = [], body = '' }, note) {
  const header = note ? `# ${note.replace(/\n/g, '\n# ')}\n` : '';
  const indent = (s) => s.replace(/\s+$/, '').replace(/^/gm, '  ');
  const labelLines = labels.length ? labels.map((l) => `  - ${l}`).join('\n') : '  []';
  const text = `${header}id: ${id}\ntitle: ${JSON.stringify(title)}\nlabels:\n${labelLines}\nbody: |\n${indent(
    body
  )}\n`;
  writeFileSync(join(DIR, `${id}.yml`), text, 'utf8');
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
    if (remote.title !== issue.title)
      drift.push(`title ${JSON.stringify(remote.title)} -> ${JSON.stringify(issue.title)}`);
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
