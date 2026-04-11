/**
 * Property 10 : `openURL` en preview ne déclenche pas `window.open` si URL non sécurisée
 *
 * Validates: Requirements 3.4, 3.5
 *
 * Tests the executeAction 'openURL' case logic from NodeRenderer.tsx:
 *   - For any URL where isSafeUrl(url) === false → window.open must NOT be called
 *   - For any URL where isSafeUrl(url) === true  → window.open SHOULD be called
 *   - When a blocked URL is attempted → console.warn must be emitted
 *
 * Since executeAction is not exported, we test the logic directly by
 * replicating the openURL case using the same isSafeUrl guard.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { isSafeUrl } from "../../../../engine/tree/expressions";

// ---------------------------------------------------------------------------
// Simulate the openURL case from executeAction (NodeRenderer.tsx)
// ---------------------------------------------------------------------------

/**
 * Mirrors the 'openURL' case in executeAction() from NodeRenderer.tsx:
 *
 *   case 'openURL': {
 *     const url = String(resolveActionValue(action.payload.url) || '');
 *     if (isSafeUrl(url) && typeof window !== 'undefined') window.open(url, '_blank');
 *     else console.warn('[Preview] openURL bloqué — URL non sécurisée:', url);
 *     break;
 *   }
 */
function executeOpenURL(url: string): void {
  if (isSafeUrl(url) && typeof window !== "undefined") {
    window.open(url, "_blank");
  } else {
    console.warn("[Preview] openURL bloqué — URL non sécurisée:", url);
  }
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Generate a valid URL with a safe protocol */
const arbSafeUrl: fc.Arbitrary<string> = fc.oneof(
  fc
    .record({
      protocol: fc.constantFrom("https", "http"),
      host: fc.stringMatching(/^[a-z]{3,10}\.[a-z]{2,4}$/),
      path: fc.stringMatching(/^\/[a-z]{0,10}$/),
    })
    .map(({ protocol, host, path }) => `${protocol}://${host}${path}`),
  fc
    .stringMatching(/^[a-z]{2,8}@[a-z]{2,8}\.[a-z]{2,4}$/)
    .map((addr) => `mailto:${addr}`),
  fc
    .stringMatching(/^\+?[0-9]{6,12}$/)
    .map((num) => `tel:${num}`)
);

/** Generate a URL with an unsafe protocol */
const arbUnsafeUrl: fc.Arbitrary<string> = fc.oneof(
  fc
    .string({ minLength: 0, maxLength: 30 })
    .map((payload) => `javascript:${payload}`),
  fc
    .string({ minLength: 0, maxLength: 20 })
    .map((content) => `data:text/html,${content}`),
  fc
    .constantFrom("ftp", "file", "blob", "vbscript", "ws", "wss", "ssh", "sftp")
    .map((proto) => `${proto}://example.com/path`)
);

/** Generate a string that is NOT a valid URL */
const arbMalformedUrl: fc.Arbitrary<string> = fc.oneof(
  fc.constant(""),
  fc.constant("not-a-url"),
  fc.constant("//missing-protocol"),
  fc.constant(":::bad:::"),
  fc.stringMatching(/^[a-z]{1,5}$/)
);

/** Any URL that isSafeUrl rejects */
const arbBlockedUrl: fc.Arbitrary<string> = fc.oneof(
  arbUnsafeUrl,
  arbMalformedUrl
);

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

let windowOpenSpy: ReturnType<typeof vi.spyOn>;
let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  // Ensure window is defined (vitest node env may not have it)
  // Always reset window.open to a fresh mock to avoid cross-test contamination
  (globalThis as any).window = { open: vi.fn() };
  windowOpenSpy = vi.spyOn(window, "open").mockImplementation(() => null);
  consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Property 10.1 — Unsafe / malformed URLs → window.open NOT called
// ---------------------------------------------------------------------------

describe("Property 10 — openURL preview : URL non sécurisée → window.open non appelé", () => {
  /**
   * Validates: Requirements 3.4, 3.5
   *
   * For any URL where isSafeUrl(url) === false,
   * executing the openURL action must NOT call window.open.
   */
  it("ne déclenche pas window.open pour toute URL non sécurisée", () => {
    fc.assert(
      fc.property(arbBlockedUrl, (url) => {
        windowOpenSpy.mockClear();
        // Precondition: confirm isSafeUrl rejects this URL
        expect(isSafeUrl(url)).toBe(false);

        executeOpenURL(url);

        expect(windowOpenSpy).not.toHaveBeenCalled();
        return true;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 10.2 — Unsafe / malformed URLs → console.warn emitted
// ---------------------------------------------------------------------------

describe("Property 10 — openURL preview : URL non sécurisée → console.warn émis", () => {
  /**
   * Validates: Requirements 3.5
   *
   * For any URL where isSafeUrl(url) === false,
   * a console.warn must be emitted identifying the blocked URL.
   */
  it("émet un console.warn pour toute URL non sécurisée", () => {
    fc.assert(
      fc.property(arbBlockedUrl, (url) => {
        consoleWarnSpy.mockClear();

        executeOpenURL(url);

        expect(consoleWarnSpy).toHaveBeenCalledOnce();
        // The warning must contain the blocked URL
        const [msg, blockedUrl] = consoleWarnSpy.mock.calls[0];
        expect(typeof msg).toBe("string");
        expect(blockedUrl).toBe(url);
        return true;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 10.3 — Safe URLs → window.open IS called
// ---------------------------------------------------------------------------

describe("Property 10 — openURL preview : URL sécurisée → window.open appelé", () => {
  /**
   * Validates: Requirements 3.4
   *
   * For any URL where isSafeUrl(url) === true,
   * executing the openURL action SHOULD call window.open.
   */
  it("déclenche window.open pour toute URL sécurisée", () => {
    fc.assert(
      fc.property(arbSafeUrl, (url) => {
        windowOpenSpy.mockClear();
        // Precondition: confirm isSafeUrl accepts this URL
        expect(isSafeUrl(url)).toBe(true);

        executeOpenURL(url);

        expect(windowOpenSpy).toHaveBeenCalledOnce();
        expect(windowOpenSpy).toHaveBeenCalledWith(url, "_blank");
        return true;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Concrete examples — quick sanity checks
// ---------------------------------------------------------------------------

describe("openURL preview — exemples concrets", () => {
  it("bloque javascript: et émet un warning", () => {
    executeOpenURL("javascript:alert(1)");
    expect(windowOpenSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledOnce();
  });

  it("bloque data: URI et émet un warning", () => {
    executeOpenURL("data:text/html,<script>alert(1)</script>");
    expect(windowOpenSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledOnce();
  });

  it("bloque une URL vide et émet un warning", () => {
    executeOpenURL("");
    expect(windowOpenSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledOnce();
  });

  it("autorise https: et appelle window.open", () => {
    executeOpenURL("https://example.com");
    expect(windowOpenSpy).toHaveBeenCalledWith("https://example.com", "_blank");
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("autorise mailto: et appelle window.open", () => {
    executeOpenURL("mailto:user@example.com");
    expect(windowOpenSpy).toHaveBeenCalledWith("mailto:user@example.com", "_blank");
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("autorise tel: et appelle window.open", () => {
    executeOpenURL("tel:+33612345678");
    expect(windowOpenSpy).toHaveBeenCalledWith("tel:+33612345678", "_blank");
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
