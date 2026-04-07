/**
 * Property 6 : Pas de `require()` dans le code généré
 *
 * Validates: Requirements 2.1, 2.4
 *
 * Two checks:
 * 1. Static analysis — the generator module source itself must not contain `require(`
 * 2. Property-based test — for any valid PageDocument, generatePageCode(page) must not
 *    contain the string `require(`
 */

import { readFileSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generatePageCode } from "../generator";
import type { PageDocument, TreeNode } from "../../tree/types";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Generate a valid node id */
const arbNodeId = fc.stringMatching(/^n_[a-z0-9]{4,8}$/);

/** Generate a minimal valid TreeNode (leaf) */
const arbLeafNode: fc.Arbitrary<TreeNode> = fc.record({
  id: arbNodeId,
  kind: fc.constantFrom("component", "layout", "primitive") as fc.Arbitrary<TreeNode["kind"]>,
  registryId: fc.constantFrom("Box", "Text", "Button", "Image", "View"),
  props: fc.record({ label: fc.string() }, { requiredKeys: [] }),
  children: fc.constant([]),
  variant: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined }),
  styles: fc.option(fc.record({ padding: fc.nat(50) }), { nil: undefined }),
  events: fc.constant(undefined),
  bindings: fc.constant(undefined),
  conditionalRender: fc.constant(undefined),
  repeatBinding: fc.constant(undefined),
  dataContext: fc.constant(undefined),
  animation: fc.constant(undefined),
});

/** Generate a valid PageDocument with a simple root node */
const arbPageDocument: fc.Arbitrary<PageDocument> = fc.record({
  id: fc.uuid(),
  name: fc.stringMatching(/^[A-Z][a-zA-Z]{2,15}Screen$/),
  route: fc.stringMatching(/^[a-z][a-z-]{2,15}$/),
  root: arbLeafNode,
  state: fc.constant([]),
  createdAt: fc.constant(new Date().toISOString()),
  updatedAt: fc.constant(new Date().toISOString()),
});

// ---------------------------------------------------------------------------
// Static analysis — module source must not contain require(
// ---------------------------------------------------------------------------

describe("Property 6 — Pas de require() dans generator.ts (analyse statique)", () => {
  it("le fichier source generator.ts ne contient aucun appel require()", () => {
    const generatorPath = join(__dirname, "..", "generator.ts");
    const source = readFileSync(generatorPath, "utf-8");
    expect(source).not.toContain("require(");
  });
});

// ---------------------------------------------------------------------------
// Property-based test — generatePageCode must never emit require(
// ---------------------------------------------------------------------------

describe("Property 6 — Pas de require() dans le code généré (property-based)", () => {
  /**
   * Validates: Requirements 2.1, 2.4
   *
   * For any valid PageDocument, generatePageCode(page) must not contain `require(`.
   */
  it("generatePageCode(page) ne contient jamais require( pour tout PageDocument valide", () => {
    fc.assert(
      fc.property(arbPageDocument, (page) => {
        const code = generatePageCode(page);
        return !code.includes("require(");
      }),
      { numRuns: 200 }
    );
  });
});
