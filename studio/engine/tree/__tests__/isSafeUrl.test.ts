/**
 * Property 9 : `isSafeUrl` bloque les protocoles non autorisés
 *
 * Validates: Requirements 3.2, 3.3
 *
 * Three checks:
 * 1. Safe protocols (https:, http:, mailto:, tel:) → isSafeUrl returns true
 * 2. Unsafe protocols (javascript:, data:, ftp:, file:, etc.) → isSafeUrl returns false
 * 3. Malformed URLs (not parseable by new URL()) → isSafeUrl returns false
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { isSafeUrl } from "../expressions";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const SAFE_PROTOCOLS = ["https", "http", "mailto", "tel"] as const;
const UNSAFE_PROTOCOLS = [
  "javascript",
  "data",
  "ftp",
  "file",
  "blob",
  "vbscript",
  "ws",
  "wss",
  "ssh",
  "sftp",
] as const;

/** Generate a valid URL with a safe protocol */
const arbSafeUrl: fc.Arbitrary<string> = fc.oneof(
  // https / http URLs
  fc.record({
    protocol: fc.constantFrom("https", "http"),
    host: fc.stringMatching(/^[a-z]{3,10}\.[a-z]{2,4}$/),
    path: fc.stringMatching(/^\/[a-z]{0,10}$/),
  }).map(({ protocol, host, path }) => `${protocol}://${host}${path}`),
  // mailto URLs
  fc
    .stringMatching(/^[a-z]{2,8}@[a-z]{2,8}\.[a-z]{2,4}$/)
    .map((addr) => `mailto:${addr}`),
  // tel URLs
  fc
    .stringMatching(/^\+?[0-9]{6,12}$/)
    .map((num) => `tel:${num}`)
);

/** Generate a URL with an unsafe protocol */
const arbUnsafeUrl: fc.Arbitrary<string> = fc.oneof(
  // javascript: XSS vector
  fc
    .string({ minLength: 0, maxLength: 30 })
    .map((payload) => `javascript:${payload}`),
  // data: URI
  fc
    .string({ minLength: 0, maxLength: 20 })
    .map((content) => `data:text/html,${content}`),
  // Other unsafe protocols with a valid-looking rest
  fc
    .constantFrom(...UNSAFE_PROTOCOLS.filter((p) => p !== "javascript" && p !== "data"))
    .map((proto) => `${proto}://example.com/path`)
);

/** Generate a string that is NOT a valid URL (new URL() will throw) */
const arbMalformedUrl: fc.Arbitrary<string> = fc.oneof(
  fc.constant(""),
  fc.constant("not-a-url"),
  fc.constant("//missing-protocol"),
  fc.constant(":::bad:::"),
  fc.stringMatching(/^[a-z]{1,5}$/) // bare words without protocol
);

// ---------------------------------------------------------------------------
// Property 9.1 — Safe protocols → true
// ---------------------------------------------------------------------------

describe("Property 9 — isSafeUrl : protocoles autorisés → true", () => {
  /**
   * Validates: Requirements 3.2
   *
   * For any URL with protocol https:, http:, mailto: or tel:,
   * isSafeUrl must return true.
   */
  it("retourne true pour tout URL avec un protocole autorisé (https, http, mailto, tel)", () => {
    fc.assert(
      fc.property(arbSafeUrl, (url) => {
        return isSafeUrl(url) === true;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9.2 — Unsafe protocols → false
// ---------------------------------------------------------------------------

describe("Property 9 — isSafeUrl : protocoles non autorisés → false", () => {
  /**
   * Validates: Requirements 3.3
   *
   * For any URL whose protocol is NOT in {https:, http:, mailto:, tel:},
   * isSafeUrl must return false.
   */
  it("retourne false pour tout URL avec un protocole non autorisé", () => {
    fc.assert(
      fc.property(arbUnsafeUrl, (url) => {
        return isSafeUrl(url) === false;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9.3 — Malformed URLs → false
// ---------------------------------------------------------------------------

describe("Property 9 — isSafeUrl : URLs malformées → false", () => {
  /**
   * Validates: Requirements 3.3
   *
   * For any string that cannot be parsed by new URL(),
   * isSafeUrl must return false without throwing.
   */
  it("retourne false pour tout URL malformée sans lever d'exception", () => {
    fc.assert(
      fc.property(arbMalformedUrl, (url) => {
        return isSafeUrl(url) === false;
      }),
      { numRuns: 300 }
    );
  });
});

// ---------------------------------------------------------------------------
// Concrete examples — quick sanity checks
// ---------------------------------------------------------------------------

describe("isSafeUrl — exemples concrets", () => {
  it.each([
    ["https://example.com", true],
    ["http://example.com/path", true],
    ["mailto:user@example.com", true],
    ["tel:+33612345678", true],
    ["javascript:alert(1)", false],
    ["data:text/html,<script>alert(1)</script>", false],
    ["ftp://files.example.com", false],
    ["file:///etc/passwd", false],
    ["blob:https://example.com/uuid", false],
    ["", false],
    ["not-a-url", false],
  ])("isSafeUrl(%s) === %s", (url, expected) => {
    expect(isSafeUrl(url)).toBe(expected);
  });
});
