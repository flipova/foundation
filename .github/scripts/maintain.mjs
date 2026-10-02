#!/usr/bin/env node
/**
 * `maintain` - the inventory of what has piled up, and the repairs that are
 * safe to make on it.
 *
 * `flow` moves the cycle forward and never looks back: it declares the issue,
 * cuts the branch, commits, pushes, opens the pull request, and finally deletes
 * the branches whose work reached `main`. Everything the cycle leaves *around*
 * itself - the records - is nobody's job. That is this command's job.
 *
 *   maintain list             every section, read-only (the default)
 *   maintain state            the local records: scratch state, numbers, strays
 *   maintain issues           the registry against the GitHub tracker
 *   maintain prs              open, abandoned and merged-with-branch-left PRs
 *   maintain branches         the local and remote refs
 *   maintain fix              apply the repairs `list` found
 *
 *   --yes                    do not ask before repairing
 *   --json                   print the inventory as JSON instead of prose
 *
 * Two boundaries, both deliberate:
 *
 *   - **Records, not refs.** `maintain` never deletes a branch. Which branches
 *     may go is `flow clean`'s policy - it keeps `main` and
 *     `changeset-release/main` - and re-deriving that policy here is how two
 *     commands end up disagreeing about what is safe to delete. The `branches`
 *     section reports and points; `flow clean` acts.
 *   - **Repair only what needs no judgement.** A `fix` row is unambiguous: a
 *     scratch file describing a branch that no longer exists, a commit message
 *     git has already read. Anything a human has to decide about is a `note`
 *     row and stays put, because an inventory that quietly closes an issue
 *     somebody is still working on is worse than no inventory at all.
 *
 * Without a token the GitHub sections are skipped and say so. A housekeeping
 * command that refuses to start is one nobody runs; a half inventory that names
 * its own gaps is still useful. `fix` exits non-zero when it found something it
 * could not repair, so a script can tell "clean" from "clean except for the
 * part that needed a token".
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { OWNER, REPO, ROOT, api, currentBranch, git, gitTry, token } from './lib/github.mjs';
import * as prompt from './lib/prompt.mjs';
import { archivedIds, readNumbers, readRegistry } from './lib/registry.mjs';
import { CHANGESET_DIR, legacyChangesets } from './lib/release.mjs';

const { confirm, info, warn, bad, good } = prompt;

/**
 * flow owns these paths but does not export them, and they are the two files
 * this command has to read to know whether a record outlived what it describes.
 */
const STATE = join(ROOT, '.github', 'flow', '.state.json');
const COMMIT_MSG = join(ROOT, '.git', 'FLOW_COMMIT_MSG');

/**
 * `--yes` and `--json` are the whole flag surface. Parsing them here rather
 * than sharing flow's parser keeps this file readable on its own: the two
 * commands solve different problems and share the libraries below, not each
 * other's command lines.
 */
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const args = argv.filter((a) => !a.startsWith('--'));
const has = (f) => flags.has(`--${f}`);

/**
 * Every page of a list endpoint.
 *
 * The repository is already past 70 pull requests. The day either list crosses
 * 100, the first page silently stops being the whole truth - and an inventory
 * that is quietly incomplete is worse than no inventory at all.
 */
const listAll = async (path) => {
  const out = [];
  for (let page = 1; ; page += 1) {
    const batch = await api(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    out.push(...batch);
    if (batch.length < 100) return out;
  }
};

/**
 * Compare two records by what they say rather than by how they are punctuated.
 *
 * The same normalisation flow uses when it turns a title into a local id, so a
 * duplicate is recognised by the standard that named the file in the first
 * place - and a body differing only in line endings or case is the same body.
 */
const normalize = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/\r\n?/g, '\n')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * One row of the inventory.
 *
 * `level` says what may be done about it:
 *   'ok'    nothing is wrong - the line exists so a clean run is visible
 *   'fix'   an accumulation `maintain fix` repairs on its own; `fix` says how
 *   'note'  an accumulation a human has to judge, so it is never auto-repaired
 */
const row = (level, message, fix = null) => ({ level, message, fix });

/** The repair attached to a `fix` row. `remote` ones are skipped without a token. */
const repair = (what, run, { remote = false } = {}) => ({ what, run, remote });

/**
 * Refs that are supposed to stay: `flow clean` protects `main` and
 * `changeset-release/main`.
 *
 * Restated here so that no row can ever name one of them as removable - the
 * first test run flagged `origin/main` itself as a branch waiting to be
 * deleted. If this set drifts from flow's, this command under-reports: it stops
 * flagging a ref flow has started keeping. It never over-reports, which is the
 * failure that would matter, because no row here acts on its own advice but
 * somebody still has to be able to act on it.
 */
const KEEP_REFS = new Set(['main', 'changeset-release/main']);
/** Works on both `main` and `origin/main`. */
const keptRef = (ref) => KEEP_REFS.has(String(ref).replace(/^origin\//, ''));

const MARK = { ok: '\x1b[32m+\x1b[0m', fix: '\x1b[33m!\x1b[0m', note: '\x1b[2m-\x1b[0m' };

const report = (heading, rows) => {
  info('');
  info(`\x1b[1m${heading}\x1b[0m`);
  if (!rows.length) {
    info(`    ${MARK.ok} nothing to report`);
    return;
  }
  for (const r of rows) {
    const suffix = r.fix ? `  \x1b[2m-> ${r.fix.what}\x1b[0m` : '';
    info(`    ${MARK[r.level]} ${r.message}${suffix}`);
  }
};

// --- state: the records this clone holds -----------------------------------

const sectionState = () => {
  const heading = 'state - the records this clone holds';
  const rows = [];
  const registry = readRegistry();
  const ids = new Set(registry.map((i) => i.id));
  const numbers = readNumbers();

  // The per-branch scratch file. It is gitignored, so it describes this clone
  // only - but it is also what `flow commit` and `flow pr` read to decide which
  // issues a branch is about, which is why an entry that outlives its branch is
  // worth naming instead of quietly ignoring.
  if (existsSync(STATE)) {
    let state = null;
    try {
      state = JSON.parse(readFileSync(STATE, 'utf8'));
    } catch {
      state = null;
    }
    if (!state || typeof state !== 'object') {
      rows.push(
        row(
          'fix',
          '.github/flow/.state.json is not readable JSON',
          repair('delete the unreadable scratch file (flow rebuilds it)', async () => {
            rmSync(STATE);
          })
        )
      );
    } else if (state.branch && gitTry(`git rev-parse --verify --quiet refs/heads/${state.branch}`) === null) {
      // Stale only when the branch it describes is *gone*. While that branch
      // still exists the file is not rubbish: switching away and back would
      // find it again, so deleting it during a visit to `main` would silently
      // forget an issue somebody had already declared.
      rows.push(
        row(
          'fix',
          `.github/flow/.state.json still describes deleted branch "${state.branch}"`,
          repair('delete it (the branch it belongs to no longer exists)', async () => {
            rmSync(STATE);
          })
        )
      );
    } else {
      const unknown = (state.issues ?? []).filter((id) => !ids.has(id));
      if (unknown.length) {
        rows.push(
          row(
            'fix',
            `the state of ${state.branch} links issue id(s) with no file: ${unknown.join(', ')}`,
            repair('forget those ids (flow filters them out anyway, so nothing changes but the bytes)', async () => {
              const fresh = JSON.parse(readFileSync(STATE, 'utf8'));
              fresh.issues = (fresh.issues ?? []).filter((id) => ids.has(id));
              writeFileSync(STATE, `${JSON.stringify(fresh, null, 2)}\n`, 'utf8');
            })
          )
        );
      }
    }
  }

  // A number whose file is gone. Reported, never repaired: `.numbers.json` is
  // what stops an id being handed out twice, and the id *is* free again now the
  // file is missing - so dropping the mapping would leave nothing recording
  // that this id used to own that number. The fix that matters is restoring the
  // file from history, which is a judgement call and not a byte to delete.
  //
  // An archived file is not a missing file: `flow issue archive` moves closed
  // issues to `.github/issues/archive/` on purpose, and those ids must keep
  // their mapping - it is the only thing that stops the id being handed out a
  // second time for a different ticket.
  const archived = new Set(archivedIds());
  for (const [id, n] of Object.entries(numbers)) {
    if (ids.has(id)) continue;
    if (archived.has(id)) continue;
    rows.push(
      row(
        'note',
        `.numbers.json maps ${id} -> #${n}, but .github/issues/${id}.yml does not exist - restore it from history, or drop the mapping by hand`
      )
    );
  }
  if (archived.size) {
    rows.push(
      row(
        'ok',
        `${archived.size} archived issue file(s) under .github/issues/archive/ - closed work, kept out of the queue`
      )
    );
  }

  // Declared but never on GitHub. `flow issue check` fails CI on this too; it
  // is repeated here so the inventory stands on its own.
  const unsynced = registry.filter((i) => !numbers[i.id]).map((i) => i.id);
  if (unsynced.length) {
    rows.push(
      row(
        'note',
        `${unsynced.length} declared issue(s) never reached GitHub: ${unsynced.join(', ')} - \`flow issue sync\``
      )
    );
  }

  // Left behind by every `flow commit`, which writes it and never removes it.
  if (existsSync(COMMIT_MSG)) {
    rows.push(
      row(
        'fix',
        '.git/FLOW_COMMIT_MSG still holds the message of the last `flow commit`',
        repair('delete it (git has already read it)', async () => {
          rmSync(COMMIT_MSG);
        })
      )
    );
  }

  // A second changeset. The repository allows exactly one, generated from the
  // declaration - so anything else is either an older tool's leftovers or a
  // hand-written file CI will trip over. Folding them is a release decision
  // (`flow release consolidate` picks the highest bump and rewrites the
  // declaration), so it is named here, not done here.
  //
  // `legacyChangesets()` is release's own notion of "a changeset that is not
  // the generated one": it already excludes README.md, config and release.md,
  // which is what stops this line from accusing the directory's documentation.
  const stray = existsSync(CHANGESET_DIR) ? legacyChangesets() : [];
  if (stray.length) {
    rows.push(
      row(
        'note',
        `${stray.length} changeset file(s) the declaration does not account for: ${stray.join(
          ', '
        )} - \`flow release consolidate\` folds them into it`
      )
    );
  }

  return { heading, rows };
};

/** Close an issue as a duplicate, saying which record is the canonical one. */
const closeDuplicate = async (number, canonical, id) => {
  await api(`/issues/${number}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      body: [
        '<!-- foundation:maintain -->',
        `Duplicate of #${canonical}.`,
        '',
        `The title and the body are the ones declared in \`.github/issues/${id}.yml\`, which is where #${canonical} is recorded, so \`Closes #${canonical}\` is the line the automation reads.`,
        '',
        'Reopen this one if it is in fact separate work.',
        '',
        '<sub>Closed by `maintain fix`. Do not edit this comment.</sub>',
      ].join('\n'),
    }),
  });
  await api(`/issues/${number}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: 'closed', state_reason: 'duplicate' }),
  });
};

const sectionIssues = async () => {
  const heading = 'issues - the registry against the tracker';
  const rows = [];
  if (!token()) {
    rows.push(row('note', 'no GITHUB_TOKEN/GH_TOKEN, so the tracker side was not read'));
    return { heading, rows };
  }

  const registry = readRegistry();
  const numbers = readNumbers();
  // One request for both sides: the issues endpoint returns pull requests too,
  // which is what makes it possible to notice a declared number that GitHub has
  // since turned into something that cannot be closed.
  const everything = await listAll('/issues?state=all');
  const trackerIssues = everything.filter((i) => !i.pull_request);
  const byNumber = new Map(everything.map((i) => [i.number, i]));
  const declared = new Set(Object.values(numbers));

  let closed = 0;
  for (const issue of registry) {
    const n = numbers[issue.id];
    if (!n) continue; // already reported by `state`
    const remote = byNumber.get(n);
    if (!remote) {
      rows.push(row('note', `${issue.id}: GitHub has no #${n} any more, but the file still declares it`));
      continue;
    }
    if (remote.pull_request) {
      rows.push(row('note', `${issue.id}: #${n} is a pull request, so \`Closes #${n}\` closes nothing`));
      continue;
    }
    if (remote.state === 'closed') closed += 1;
  }

  const unregistered = trackerIssues.filter((i) => !declared.has(i.number));
  const openUnregistered = unregistered.filter((i) => i.state === 'open');
  rows.push(
    row(
      'ok',
      `${registry.length} declared, ${Object.keys(numbers).length} of them on GitHub, ${closed} closed there; ${
        unregistered.length
      } tracker issue(s) declared nowhere locally`
    )
  );

  // The case that matters: something GitHub still holds open that no local file
  // declares. Two shapes, and only one of them is safe to repair.
  for (const open of openUnregistered) {
    const twin = registry.find((i) => numbers[i.id] && normalize(i.title) === normalize(open.title));
    if (!twin) {
      rows.push(
        row(
          'note',
          `#${open.number} "${open.title}" is open on GitHub but nothing declares it - adopt it with \`flow issue link ${open.number}\``
        )
      );
      continue;
    }
    const twinNumber = numbers[twin.id];
    if (normalize(twin.body ?? '') !== normalize(open.body ?? '')) {
      rows.push(
        row(
          'note',
          `#${open.number} "${open.title}" shares its title with #${twinNumber} but not its body - decide which one is the work`
        )
      );
      continue;
    }
    rows.push(
      row(
        'fix',
        `#${open.number} is an exact duplicate of #${twinNumber} (${twin.id}): same title, same body`,
        repair(
          `close #${open.number} as a duplicate of #${twinNumber}`,
          async () => {
            await closeDuplicate(open.number, twinNumber, twin.id);
          },
          { remote: true }
        )
      )
    );
  }

  return { heading, rows };
};

const sectionPrs = async () => {
  const heading = 'prs - open, abandoned and left behind';
  const rows = [];
  if (!token()) {
    rows.push(row('note', 'no GITHUB_TOKEN/GH_TOKEN, so pull requests were not read'));
    return { heading, rows };
  }

  const prs = await listAll('/pulls?state=all');
  // Full ref names rather than the short form: `refs/remotes/origin/HEAD` has
  // no reliable short name, and an inventory that misnames a ref is one whose
  // advice cannot be followed.
  const remoteBranches = git('git for-each-ref --format=%(refname) refs/remotes/origin')
    .split('\n')
    .map((s) => s.trim().replace(/^refs\/remotes\//, ''))
    .filter(Boolean);

  const open = prs.filter((p) => p.state === 'open');
  if (open.length) {
    for (const p of open) {
      rows.push(row('ok', `#${p.number} open${p.draft ? ', draft' : ''} - ${p.title} (${p.head.ref})`));
    }
  } else {
    rows.push(row('ok', 'no open pull request'));
  }

  // Closed without merging: worth a line only while its branch survives. A
  // closed pull request whose branch is gone is history, not accumulation. A
  // kept ref is excluded outright rather than counted as "gone" - it has not
  // gone, it is being held on purpose, and saying otherwise would be a row
  // that contradicts the one directly below it.
  const abandoned = prs.filter((p) => p.state === 'closed' && !p.merged_at && !keptRef(p.head.ref));
  const abandonedLeft = abandoned.filter((p) => remoteBranches.includes(`origin/${p.head.ref}`));
  for (const p of abandonedLeft) {
    rows.push(
      row('note', `#${p.number} was closed without merging and origin/${p.head.ref} still exists - ${p.title}`)
    );
  }
  const abandonedGone = abandoned.length - abandonedLeft.length;
  if (abandonedGone) {
    rows.push(row('ok', `${abandonedGone} pull request(s) closed without merging, their branches gone`));
  }

  // Merged, but the branch it came from is still on the remote. Kept refs are
  // filtered out here too - see `KEEP_REFS`.
  const merged = new Map();
  for (const p of prs.filter((x) => x.merged_at)) {
    if (keptRef(p.head.ref) || merged.has(p.head.ref) || !remoteBranches.includes(`origin/${p.head.ref}`)) continue;
    merged.set(p.head.ref, p.number);
  }
  if (merged.size) {
    rows.push(
      row(
        'note',
        `${merged.size} merged branch(es) still on the remote: ${[...merged.entries()]
          .map(([ref, n]) => `origin/${ref} (#${n})`)
          .join(', ')} - \`flow clean\` removes them`
      )
    );
  }
  if (
    remoteBranches.includes('origin/changeset-release/main') &&
    prs.some((p) => p.merged_at && p.head.ref === 'changeset-release/main')
  ) {
    rows.push(row('ok', 'origin/changeset-release/main is merged but still there - `flow clean` keeps it on purpose'));
  }

  return { heading, rows };
};

// --- branches --------------------------------------------------------------
const sectionBranches = () => {
  const heading = 'branches - the refs (repairs belong to `flow clean`)';
  const rows = [];
  const here = currentBranch();
  const locals = git('git for-each-ref --format=%(refname:short) refs/heads')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const remotes = git('git for-each-ref --format=%(refname) refs/remotes/origin')
    .split('\n')
    .map((s) => s.trim().replace(/^refs\/remotes\//, ''))
    .filter(Boolean);

  rows.push(row('ok', `local  ${locals.join(', ') || '(none)'}`));
  rows.push(row('ok', `remote ${remotes.join(', ') || '(none)'}`));

  const candidates = [
    ...locals.filter((b) => b !== here && !keptRef(b)).map((b) => ({ label: b, ref: b })),
    ...remotes
      .filter((r) => r !== 'origin/HEAD' && r !== `origin/${here}` && !keptRef(r))
      .map((r) => ({ label: r, ref: r })),
  ];
  // The same containment test `flow clean` performs - only to say *how many*
  // are finished, never which ones may go.
  const merged = candidates.filter((c) => gitTry(`git merge-base --is-ancestor ${c.ref} main`) !== null);
  if (merged.length) {
    rows.push(
      row(
        'note',
        `${merged.length} ref(s) whose work is already on main: ${merged
          .map((c) => c.label)
          .join(', ')} - \`flow clean\` deletes them`
      )
    );
  }

  return { heading, rows };
};

const SECTIONS = {
  state: sectionState,
  issues: sectionIssues,
  prs: sectionPrs,
  branches: sectionBranches,
};

const collect = async (only) => {
  const out = [];
  for (const name of only ? [only] : Object.keys(SECTIONS)) out.push(await SECTIONS[name]());
  return out;
};

// --- commands --------------------------------------------------------------
/**
 * `--json` for both `list` and a single section: the shape is the same so a
 * script can read one section without knowing it had to ask differently.
 */
const printJson = (sections) => {
  process.stdout.write(
    `${JSON.stringify(
      sections.map((s) => ({
        section: s.heading,
        findings: s.rows.map((r) => ({ level: r.level, message: r.message, fix: r.fix?.what ?? null })),
      })),
      null,
      2
    )}\n`
  );
};

const cmdList = async () => {
  const sections = await collect();
  if (has('json')) {
    printJson(sections);
    return;
  }
  info(`${OWNER}/${REPO} - what has accumulated`);
  for (const s of sections) report(s.heading, s.rows);

  const fixable = sections.flatMap((s) => s.rows.filter((r) => r.level === 'fix'));
  const decided = sections.flatMap((s) => s.rows.filter((r) => r.level === 'note'));
  info('');
  info(
    fixable.length ? `  ${fixable.length} repair(s), ${decided.length} needing a decision.` : '  nothing to repair.'
  );
  if (fixable.length) info('  repair with: node .github/scripts/maintain.mjs fix');
};

const cmdSection = async (name) => {
  const [section] = await collect(name);
  if (has('json')) {
    printJson([section]);
    return;
  }
  info(`${OWNER}/${REPO} - what has accumulated`);
  report(section.heading, section.rows);
};

const cmdFix = async () => {
  const sections = await collect();
  const actionable = sections.flatMap((s) => s.rows.filter((r) => r.level === 'fix'));
  if (!actionable.length) {
    good('nothing to repair');
    return;
  }

  info(`${actionable.length} repair(s):`);
  for (const r of actionable) info(`  - ${r.fix.what}  \x1b[2m(${r.message})\x1b[0m`);

  // Local repairs run whatever happens; the ones that write to GitHub are
  // skipped rather than blocking, so a token-less run still tidies the clone
  // and reports exactly what is left over.
  const needsToken = new Set(actionable.filter((r) => r.fix.remote));
  const skipped = needsToken.size && !token() ? [...needsToken] : [];
  const runnable = actionable.filter((r) => !skipped.includes(r));

  if (!has('yes')) {
    if (!(await confirm('Apply them?', { default: false }))) {
      warn('declined - nothing was changed');
      process.exitCode = 2;
      return;
    }
  }

  let failed = 0;
  for (const r of runnable) {
    try {
      await r.fix.run();
      good(r.fix.what);
    } catch (e) {
      bad(`${r.fix.what}: ${String(e.message ?? e).split('\n')[0]}`);
      failed += 1;
    }
  }
  for (const r of skipped) warn(`skipped, needs GITHUB_TOKEN: ${r.fix.what}`);
  if (skipped.length) info('set GITHUB_TOKEN and run `maintain fix` again for the rest');
  if (failed || skipped.length) process.exitCode = 1;
};

const USAGE = `maintain - what has piled up, and the repairs that are safe

  maintain list             every section, read-only (the default)
  maintain state            the local records: scratch state, numbers, strays
  maintain issues           the registry against the GitHub tracker
  maintain prs              open, abandoned and merged-with-branch-left PRs
  maintain branches         the local and remote refs (repair: flow clean)
  maintain fix              apply the repairs list found

  --yes                    do not ask before repairing
  --json                   print the inventory as JSON
`;

const main = async () => {
  const [command = 'list'] = args;
  switch (command) {
    case 'list':
    case 'all':
      return cmdList();
    case 'state':
    case 'issues':
    case 'prs':
    case 'branches':
      return cmdSection(command);
    case 'fix':
      return cmdFix();
    case 'help':
      process.stdout.write(USAGE);
      return;
    default:
      break;
  }
  bad(`unknown command: ${command}`);
  process.stdout.write(USAGE);
  process.exitCode = 2;
};

// The readline interface in prompt keeps stdin referenced: once an
// interactive `confirm` has created it, the process would otherwise sit there
// after `main` returns and never exit. `flow` closes it the same way at the end
// of its wizard.
main()
  .catch((e) => {
    bad(e.message);
    process.exitCode = 1;
  })
  .finally(() => prompt.close());
