/**
 * Property 3 : Les littéraux ne sont pas résolus comme bare fields
 *
 * Validates: Requirements 9.1, 9.2
 *
 * Two checks:
 * 1. (negative) For any literal in LITERAL_VALUES, resolveForPreview returns the literal
 *    itself even when itemContext contains a matching key with a different value.
 * 2. (positive) For a non-literal bare field expression, resolveForPreview DOES resolve
 *    from itemContext when a matching key exists.
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { resolveForPreview } from "../expressions";

// ---------------------------------------------------------------------------
// Constants — must mirror LITERAL_VALUES in expressions.ts
// ---------------------------------------------------------------------------

const LITERAL_VALUES = [
  "true",
  "false",
  "null",
  "undefined",
  "0",
  "1",
  "none",
  "auto",
] as const;

type Literal = (typeof LITERAL_VALUES)[number];

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Pick any literal from the set */
const arbLiteral: fc.Arbitrary<Literal> = fc.constantFrom(...LITERAL_VALUES);

/**
 * Generate a bare field name that is NOT a literal and NOT an expression prefix.
 * Constrained to simple identifiers: [a-z][a-zA-Z0-9_]{1,15}
 * This ensures it looks like a real field name (e.g. "username", "price").
 */
const arbNonLiteralField: fc.Arbitrary<string> = fc
  .stringMatching(/^[a-z][a-zA-Z0-9_]{1,15}$/)
  .filter((s) => !(LITERAL_VALUES as readonly string[]).includes(s));

// ---------------------------------------------------------------------------
// Property 3.1 — Literals are never resolved from itemContext
// ---------------------------------------------------------------------------

describe("Property 3 — Les littéraux ne sont pas résolus comme bare fields", () => {
  /**
   * Validates: Requirements 9.1, 9.2
   *
   * For any literal in LITERAL_VALUES, resolveForPreview(literal, { itemContext: { [literal]: "WRONG" } })
   * must return the literal itself, not the value from itemContext.
   */
  it("retourne le littéral lui-même même si itemContext contient une clé correspondante", () => {
    fc.assert(
      fc.property(arbLiteral, (literal) => {
        const result = resolveForPreview(literal, {
          itemContext: { [literal]: "WRONG" },
        });
        return result === literal;
      }),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3.2 — Non-literal bare fields ARE resolved from itemContext
// ---------------------------------------------------------------------------

describe("Property 3 — Les bare fields non-littéraux sont résolus depuis itemContext", () => {
  /**
   * Validates: Requirement 9.3
   *
   * For a non-literal bare field expression, resolveForPreview DOES resolve
   * from itemContext when a matching key exists.
   */
  it("résout un bare field non-littéral depuis itemContext", () => {
    fc.assert(
      fc.property(
        arbNonLiteralField,
        fc.string({ minLength: 1, maxLength: 30 }),
        (field, value) => {
          const result = resolveForPreview(field, {
            itemContext: { [field]: value },
          });
          return result === value;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Concrete examples — quick sanity checks
// ---------------------------------------------------------------------------

describe("resolveForPreview — exemples concrets pour les littéraux", () => {
  it.each(LITERAL_VALUES)(
    'resolveForPreview("%s", { itemContext: { "%s": "WRONG" } }) === "%s"',
    (literal) => {
      expect(
        resolveForPreview(literal, { itemContext: { [literal]: "WRONG" } })
      ).toBe(literal);
    }
  );

  it("résout un champ normal depuis itemContext", () => {
    expect(
      resolveForPreview("username", { itemContext: { username: "Alice" } })
    ).toBe("Alice");
  });

  it("résout un champ imbriqué depuis itemContext", () => {
    expect(
      resolveForPreview("user.name", {
        itemContext: { user: { name: "Bob" } },
      })
    ).toBe("Bob");
  });
});
