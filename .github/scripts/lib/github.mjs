/**
 * GitHub access and git plumbing shared by the flow scripts.
 *
 * The token comes from `GITHUB_TOKEN` (what Actions injects) or `GH_TOKEN`.
 * Nothing is read from disk and nothing is cached, so the scripts behave the
 * same locally and in CI.
 */
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Derived from this file, not from the cwd: the scripts must behave the same
// when invoked from a subdirectory.
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

export const OWNER = process.env.GITHUB_REPOSITORY_OWNER ?? 'flipova';
export const REPO = process.env.GITHUB_REPOSITORY_NAME ?? 'foundation';
export const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

export const token = () => process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

export async function api(path, init = {}) {
  const t = token();
  const res = await fetch(API + path, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

/**
 * Fail loudly and by name when a script needs a token it was not given, rather
 * than letting a 401 turn into a confusing message further down.
 */
export async function requireToken(what) {
  if (token()) return;
  console.error(`${what} needs a token.`);
  console.error('  local : set GITHUB_TOKEN (or GH_TOKEN) to a fine-grained PAT with');
  console.error('          issues:write and pull-requests:write');
  console.error('  ci    : secrets.GITHUB_TOKEN is injected automatically');
  process.exit(2);
}

export const git = (cmd) => execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
export const gitTry = (cmd) => {
  try {
    return git(cmd).trim();
  } catch {
    return null;
  }
};

export const currentBranch = () => git('git rev-parse --abbrev-ref HEAD').trim();

/** A pull request is a *different* object from an issue but shares its number. */
export const isPullRequest = (o) => Boolean(o?.pull_request);

export async function getIssue(number) {
  return api(`/issues/${number}`);
}

/** The open pull request whose head is the current branch, if any. */
export async function findPullRequest(branch = currentBranch()) {
  const list = await api(`/pulls?state=open&head=${OWNER}:${branch}`);
  return list[0] ?? null;
}

export async function ensurePullRequest({ title, body, base = 'main' }) {
  const existing = await findPullRequest();
  if (existing) return { pr: existing, created: false };
  const branch = currentBranch();
  const pr = await api('/pulls', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, head: branch, base }),
  });
  return { pr, created: true };
}

/** The label set declared in `.github/labels.yml`, so the CLI never invents one. */
export async function labelsThatExist() {
  return (await api('/labels?per_page=100')).map((l) => l.name);
}
