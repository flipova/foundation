/**
 * Regression tests for resolveForPreview and resolveForCodegen
 *
 * Validates: Requirements 12.2, 12.3, 5.1, 5.2, 7.2, 7.4
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { resolveForCodegen, resolveForPreview } from "../expressions";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Any non-empty string */
const arbNonEmptyString: fc.Arbitrary<string> = fc.string({ minLength: 1, maxLength: 100 });

/** Valid JS identifier: starts with letter/underscore, followed by word chars */
const arbIdentifier: fc.Arbitrary<string> = fc
  .stringMatching(/^[a-zA-Z_][a-zA-Z0-9_]{0,19}$/)
  .filter((s) => s.length > 0);

// ---------------------------------------------------------------------------
// Property 1 : resolveForCodegen est déterministe
// ---------------------------------------------------------------------------

describe("Property 1 — resolveForCodegen est déterministe", () => {
  /**
   * Validates: Requirements 12.3
   *
   * For any string expression, resolveForCodegen(expr) called twice
   * must return the same value.
   */
  it("retourne la même valeur sur deux appels successifs avec le même input", () => {
    fc.assert(
      fc.property(arbNonEmptyString, (expr) => {
        const first = resolveForCodegen(expr);
        const second = resolveForCodegen(expr);
        return first === second;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2 : resolveForPreview retourne toujours une valeur définie
// ---------------------------------------------------------------------------

describe("Property 2 — resolveForPreview retourne toujours une valeur définie", () => {
  /**
   * Validates: Requirements 12.2
   *
   * For any non-empty string expr, resolveForPreview(expr, {}) must never
   * return undefined.
   */
  it("ne retourne jamais undefined pour une expression non-vide", () => {
    fc.assert(
      fc.property(arbNonEmptyString, (expr) => {
        const result = resolveForPreview(expr, {});
        return result !== undefined;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4 : $state.x → x en codegen
// ---------------------------------------------------------------------------

describe("Property 4 — $state.x → x en codegen", () => {
  /**
   * Validates: Requirements 5.1, 7.2
   *
   * For any valid identifier name, resolveForCodegen("$state." + name)
   * must return name (the bare variable name, without prefix).
   */
  it("résout $state.{name} vers {name}", () => {
    fc.assert(
      fc.property(arbIdentifier, (name) => {
        const result = resolveForCodegen(`$state.${name}`);
        return result === name;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5 : $query.x → x en codegen
// ---------------------------------------------------------------------------

describe("Property 5 — $query.x → x en codegen", () => {
  /**
   * Validates: Requirements 5.2, 7.4
   *
   * For any valid identifier name, resolveForCodegen("$query." + name)
   * must return name (the bare variable name, without prefix).
   */
  it("résout $query.{name} vers {name}", () => {
    fc.assert(
      fc.property(arbIdentifier, (name) => {
        const result = resolveForCodegen(`$query.${name}`);
        return result === name;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Concrete examples — sanity checks for all expression prefixes
// ---------------------------------------------------------------------------

describe("resolveForCodegen — exemples concrets", () => {
  it.each([
    ["$state.email", "email"],
    ["$state.user", "user"],
    ["$query.usersData", "usersData"],
    ["$query.postsData", "postsData"],
    ["$global.theme", "globalState.theme"],
    ["$const.API_URL", "CONSTANTS.API_URL"],
    ["$env.NODE_ENV", "process.env.NODE_ENV"],
    ["$theme.primary", "theme.primary"],
    ["$device.width", "Dimensions.get('window').width"],
    ["$date.now", "Date.now()"],
  ])("resolveForCodegen(%s) === %s", (expr, expected) => {
    expect(resolveForCodegen(expr)).toBe(expected);
  });
});

describe("resolveForPreview — exemples concrets", () => {
  it("résout $state.x depuis queryContext", () => {
    expect(resolveForPreview("$state.email", { queryContext: { email: "a@b.com" } })).toBe("a@b.com");
  });

  it("retourne un placeholder si queryContext absent pour $state.x", () => {
    expect(resolveForPreview("$state.email", {})).toBe("[email]");
  });

  it("résout $query.xData depuis queryContext", () => {
    expect(resolveForPreview("$query.usersData", { queryContext: { usersData: [1, 2, 3] } })).toEqual([1, 2, 3]);
  });

  it("retourne un placeholder si queryContext absent pour $query.x", () => {
    expect(resolveForPreview("$query.usersData", {})).toBe("[usersData]");
  });

  it("retourne un placeholder pour $const.KEY", () => {
    expect(resolveForPreview("$const.API_URL", {})).toBe("[API_URL]");
  });

  it("retourne un placeholder pour $env.KEY", () => {
    expect(resolveForPreview("$env.NODE_ENV", {})).toBe("[NODE_ENV]");
  });

  it("retourne l'expression elle-même pour $node sans nodePropsContext", () => {
    // When nodePropsContext is absent, $node.* falls through to the plain literal return
    const result = resolveForPreview("$node.n_123.text", {});
    expect(result).toBe("$node.n_123.text");
  });

  it("résout $node depuis nodePropsContext", () => {
    const result = resolveForPreview("$node.n_123.text", {
      nodePropsContext: { n_123: { text: "Hello" } },
    });
    expect(result).toBe("Hello");
  });

  it("retourne la string elle-même pour un littéral plain", () => {
    expect(resolveForPreview("Hello World", {})).toBe("Hello World");
  });
});
