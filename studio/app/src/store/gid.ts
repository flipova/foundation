/**
 * gid — Generate a unique node identifier with sufficient entropy.
 *
 * Uses crypto.randomUUID() when available (all modern environments),
 * with a high-entropy fallback combining Date.now() and Math.random().
 */
export function gid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return 'n_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  }
  // Fallback: increase entropy
  return 'n_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 11);
}
