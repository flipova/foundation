/**
 * Property 12 : `gid()` ne produit pas de collisions
 *
 * Validates: Requirements 11.3, 11.4
 *
 * Tests the gid() function from StudioProvider.tsx for uniqueness and
 * correct prefix. Uses fast-check property-based testing.
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { gid } from "../gid";

// ---------------------------------------------------------------------------
// Property 12.1 — All values start with "n_"
// Validates: Requirement 11.4
// ---------------------------------------------------------------------------

describe("Property 12 — gid() retourne toujours un string préfixé par 'n_'", () => {
  /**
   * Validates: Requirements 11.4
   *
   * For any call to gid(), the result must start with "n_".
   */
  it("gid() commence toujours par 'n_'", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (n) => {
        for (let i = 0; i < n; i++) {
          expect(gid()).toMatch(/^n_/);
        }
        return true;
      }),
      { numRuns: 200 }
    );
  });

  it("gid() commence par 'n_' — exemple concret", () => {
    const id = gid();
    expect(id.startsWith("n_")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Property 12.2 — No collisions for N ≤ 10,000 calls
// Validates: Requirements 11.3
// ---------------------------------------------------------------------------

describe("Property 12 — gid() ne produit pas de collisions", () => {
  /**
   * Validates: Requirements 11.3
   *
   * For N calls to gid() (N ≤ 10,000), all values must be distinct.
   */
  it("N appels à gid() produisent N valeurs distinctes (N ≤ 10 000)", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 500 }), (n) => {
        const ids = Array.from({ length: n }, () => gid());
        const unique = new Set(ids);
        expect(unique.size).toBe(n);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it("10 000 appels à gid() produisent 10 000 valeurs distinctes", () => {
    const N = 10_000;
    const ids = Array.from({ length: N }, () => gid());
    const unique = new Set(ids);
    expect(unique.size).toBe(N);
  });
});

// ---------------------------------------------------------------------------
// Concrete examples
// ---------------------------------------------------------------------------

describe("gid() — exemples concrets", () => {
  it("deux appels successifs retournent des valeurs différentes", () => {
    const a = gid();
    const b = gid();
    expect(a).not.toBe(b);
  });

  it("gid() retourne une string non vide", () => {
    expect(typeof gid()).toBe("string");
    expect(gid().length).toBeGreaterThan(2);
  });
});
