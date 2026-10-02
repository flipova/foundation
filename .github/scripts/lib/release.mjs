/**
 * One changeset, declared once.
 *
 * `.github/flow/release.yml` is the canonical declaration (bump + summary) and
 * survives `changeset version`, which deletes what it consumes. `.changeset/`
 * then holds exactly one file, `release.md`, generated from it - the only thing
 * the changesets CLI reads. CI checks the two agree.
 *
 * The alternative, one changeset file per change, produces a release whose
 * changelog is a pile of overlapping entries, with the version decision spread
 * over a dozen files nobody ever reviews as a whole.
 */
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import { ROOT } from './github.mjs';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

export const PACKAGE = '@flipova/foundation';
export const DECLARATION = join(ROOT, '.github', 'flow', 'release.yml');
export const CHANGESET_DIR = join(ROOT, '.changeset');
export const CHANGESET = join(CHANGESET_DIR, 'release.md');

export const BUMPS = ['patch', 'minor', 'major'];
/** Display order for the prompt: the usual choices first, "no release" last. */
export const ALL_KINDS = [...BUMPS, 'none'];
/** Ranking order, which is not the display order - `none` outranks nothing. */
const RANK = ['none', ...BUMPS];

/** `none` < `patch` < `minor` < `major` - the highest one wins when merging. */
export const rank = (b) => RANK.indexOf(b ?? 'none');
export const highest = (list) => list.reduce((a, b) => (rank(b) > rank(a) ? b : a), 'none');

/**
 * Line endings are part of the content here, not a display detail.
 *
 * `flow release check` compares a generated file with what the declaration
 * renders to, byte for byte. A Windows checkout that hands us CRLF would make
 * every generated file drift from its source - and only on Windows, which is
 * the worst possible way for it to fail. Normalising on read keeps the output
 * identical on every platform; `.gitattributes` stops CRLF entering at all.
 */
const normalize = (s) => String(s ?? '').replace(/\r\n?/g, '\n');

export function readDeclaration() {
  if (!existsSync(DECLARATION)) return { bump: 'none', summary: '' };
  const doc = yaml.load(readFileSync(DECLARATION, 'utf8')) ?? {};
  return { bump: doc.bump ?? 'none', summary: normalize(doc.summary) };
}

export function writeDeclaration({ bump, summary }) {
  const header = [
    '# The single changeset for this cycle.',
    '#',
    '# `flow release` writes this file and generates `.changeset/release.md` from',
    '# it. `flow release check` (run by CI) reports any drift between the two, so',
    '# the declaration and what changesets actually reads cannot disagree.',
    '#',
    '# bump: major | minor | patch | none   (none = nothing to release)',
  ].join('\n');
  const front = yaml.dump({ bump, summary: summary.replace(/\s+$/, '') }, {
    lineWidth: 100,
    quotingType: '"',
    noRefs: true,
  });
  writeFileSync(DECLARATION, `${header}\n${front}`, 'utf8');
}

/**
 * Render the changeset file: LF endings, no BOM, frontmatter on its own lines.
 * The changesets parser is strict about exactly that, and its error message
 * does not say which line was wrong.
 */
export function renderChangeset({ bump, summary }) {
  if (!BUMPS.includes(bump)) return null;
  return `---\n'${PACKAGE}': ${bump}\n---\n\n${summary.replace(/\s+$/, '')}\n`;
}

export function writeChangeset(text) {
  for (const f of legacyChangesets()) rmSync(join(CHANGESET_DIR, f));
  if (text === null) {
    if (existsSync(CHANGESET)) rmSync(CHANGESET);
    return null;
  }
  writeFileSync(CHANGESET, text, 'utf8');
  return text;
}

/** Every changeset file except the generated one, the config and the README. */
export function legacyChangesets() {
  return readdirSync(CHANGESET_DIR).filter(
    (f) => f.endsWith('.md') && f !== 'release.md' && f !== 'README.md',
  );
}

const parseFrontmatter = (text) => {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text.replace(/^\uFEFF/, ''));
  if (!m) return null;
  try {
    return yaml.load(m[1]);
  } catch {
    return null;
  }
};

/**
 * Read every changeset currently in `.changeset/`, and report the ones that do
 * not parse. Reporting matters: a single unparseable file is exactly what used
 * to stop a release, with an error that named neither the file nor the line.
 */
export function readChangesets() {
  const found = [];
  const broken = [];
  for (const f of legacyChangesets()) {
    const text = normalize(readFileSync(join(CHANGESET_DIR, f), 'utf8'));
    const fm = parseFrontmatter(text);
    if (!fm || typeof fm !== 'object' || !Object.keys(fm).length) {
      broken.push({ file: f, why: 'missing or invalid frontmatter between --- lines' });
      continue;
    }
    const bumps = Object.values(fm).map(String);
    if (bumps.some((b) => !ALL_KINDS.includes(b))) {
      broken.push({ file: f, why: `unknown bump in ${JSON.stringify(fm)}` });
      continue;
    }
    found.push({
      file: f,
      bump: highest(bumps),
      summary: text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '').replace(/\s+$/, ''),
    });
  }
  return { found, broken };
}

/**
 * Fold every existing changeset into the single declaration: the migration off
 * the one-file-per-change model. Keeps the highest bump, joins the bodies,
 * deletes the originals.
 */
export function consolidate() {
  const { found, broken } = readChangesets();
  if (broken.length) return { ok: false, broken, merged: 0, bump: 'none', summary: '' };
  return {
    ok: true,
    broken,
    merged: found.length,
    bump: highest(found.map((f) => f.bump)),
    summary: found
      .map((f) => f.summary.trim())
      .filter(Boolean)
      .join('\n\n'),
  };
}

/** Compare the declaration with the generated file. CI runs this. */
export function checkDrift() {
  const problems = [];
  const declaration = readDeclaration();
  const expected = renderChangeset(declaration);

  if (!ALL_KINDS.includes(declaration.bump)) {
    problems.push(`.github/flow/release.yml: bump must be one of ${ALL_KINDS.join(', ')} (found ${JSON.stringify(declaration.bump)})`);
  }
  if (declaration.bump !== 'none' && !declaration.summary.trim()) {
    problems.push('.github/flow/release.yml: the bump is set but the summary is empty');
  }

  const actual = existsSync(CHANGESET) ? readFileSync(CHANGESET, 'utf8') : null;
  if (expected === null) {
    if (actual !== null) problems.push('.changeset/release.md: must not exist when the bump is "none"');
  } else if (actual === null) {
    problems.push('.changeset/release.md: missing - run `flow release sync`');
  } else if (actual.replace(/\r\n/g, '\n') !== expected) {
    problems.push('.changeset/release.md: out of date with .github/flow/release.yml - run `flow release sync`');
  }

  const extra = legacyChangesets();
  if (extra.length) {
    problems.push(
      `.changeset/: ${extra.length} stray changeset file(s) (${extra.join(', ')}) - there must be exactly one, run \`flow release consolidate\``,
    );
  }
  return problems;
}
