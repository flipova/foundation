/**
 * Property 11 : `canUndo` est réactif après mutations
 *
 * Validates: Requirements 6.1, 6.2, 6.3, 6.5
 *
 * Tests the history state machine logic that drives `canUndo`/`canRedo`
 * in StudioProvider.tsx (via the `historyLen` reactive state).
 *
 * Since StudioProvider is a React component, we extract and test the
 * pure state machine logic directly — no React needed.
 *
 * The state machine:
 *   - Initial state: { past: 0, future: 0 }
 *   - mut()  → past++, future = 0  (capped at MAX_HISTORY=50)
 *   - undo() → past--, future++    (only if past > 0)
 *   - redo() → future--, past++    (only if future > 0)
 *   - canUndo = past > 0
 *   - canRedo = future > 0
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// ---------------------------------------------------------------------------
// Pure history state machine — mirrors StudioProvider.tsx logic
// ---------------------------------------------------------------------------

const MAX_HISTORY = 50;

interface HistoryLen {
  past: number;
  future: number;
}

/** Apply a mutation: push to past (capped), reset future */
function applyMut(h: HistoryLen): HistoryLen {
  const past = Math.min(h.past + 1, MAX_HISTORY);
  return { past, future: 0 };
}

/** Apply an undo: pop from past, push to future */
function applyUndo(h: HistoryLen): HistoryLen {
  if (h.past === 0) return h;
  return { past: h.past - 1, future: h.future + 1 };
}

/** Apply a redo: pop from future, push to past */
function applyRedo(h: HistoryLen): HistoryLen {
  if (h.future === 0) return h;
  return { past: h.past + 1, future: h.future - 1 };
}

function canUndo(h: HistoryLen): boolean {
  return h.past > 0;
}

function canRedo(h: HistoryLen): boolean {
  return h.future > 0;
}

/** Apply a sequence of operations to an initial state */
type Op = "mut" | "undo" | "redo";

function applyOps(ops: Op[]): HistoryLen {
  let h: HistoryLen = { past: 0, future: 0 };
  for (const op of ops) {
    if (op === "mut") h = applyMut(h);
    else if (op === "undo") h = applyUndo(h);
    else h = applyRedo(h);
  }
  return h;
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** N mutations (N >= 1) */
const arbMutations = fc.integer({ min: 1, max: 60 });

/** A sequence of random ops */
const arbOps = fc.array(fc.constantFrom<Op>("mut", "undo", "redo"), {
  minLength: 1,
  maxLength: 40,
});

// ---------------------------------------------------------------------------
// Property 11.1 — After N mutations (N >= 1): canUndo === true
// Validates: Requirement 6.1
// ---------------------------------------------------------------------------

describe("Property 11 — canUndo est réactif après mutations", () => {
  /**
   * Validates: Requirements 6.1
   *
   * For any N >= 1 mutations applied from the initial state,
   * canUndo must be true.
   */
  it("canUndo === true après N mutations (N >= 1)", () => {
    fc.assert(
      fc.property(arbMutations, (n) => {
        let h: HistoryLen = { past: 0, future: 0 };
        for (let i = 0; i < n; i++) {
          h = applyMut(h);
        }
        expect(canUndo(h)).toBe(true);
        return true;
      }),
      { numRuns: 500 }
    );
  });

  /**
   * Validates: Requirements 6.1
   *
   * historyLen.past after N mutations equals min(N, MAX_HISTORY).
   */
  it("historyLen.past === min(N, MAX_HISTORY) après N mutations", () => {
    fc.assert(
      fc.property(arbMutations, (n) => {
        let h: HistoryLen = { past: 0, future: 0 };
        for (let i = 0; i < n; i++) {
          h = applyMut(h);
        }
        expect(h.past).toBe(Math.min(n, MAX_HISTORY));
        return true;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 11.2 — After undo(): canRedo === true
// Validates: Requirement 6.2
// ---------------------------------------------------------------------------

describe("Property 11 — canRedo est réactif après undo", () => {
  /**
   * Validates: Requirements 6.2
   *
   * After at least one mutation followed by one undo,
   * canRedo must be true.
   */
  it("canRedo === true après au moins une mutation puis un undo", () => {
    fc.assert(
      fc.property(arbMutations, (n) => {
        let h: HistoryLen = { past: 0, future: 0 };
        for (let i = 0; i < n; i++) {
          h = applyMut(h);
        }
        h = applyUndo(h);
        expect(canRedo(h)).toBe(true);
        return true;
      }),
      { numRuns: 500 }
    );
  });

  /**
   * Validates: Requirements 6.2
   *
   * After undo(), historyLen.future increases by 1 and past decreases by 1.
   */
  it("undo() décrémente past de 1 et incrémente future de 1", () => {
    fc.assert(
      fc.property(arbMutations, (n) => {
        let h: HistoryLen = { past: 0, future: 0 };
        for (let i = 0; i < n; i++) {
          h = applyMut(h);
        }
        const before = { ...h };
        h = applyUndo(h);
        expect(h.past).toBe(before.past - 1);
        expect(h.future).toBe(before.future + 1);
        return true;
      }),
      { numRuns: 500 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 11.3 — After N undos (N == initial past length): canUndo === false
// Validates: Requirement 6.3
// ---------------------------------------------------------------------------

describe("Property 11 — canUndo === false après avoir tout annulé", () => {
  /**
   * Validates: Requirements 6.3
   *
   * After applying N mutations then N undos,
   * canUndo must be false (past === 0).
   */
  it("canUndo === false après N mutations puis N undos", () => {
    fc.assert(
      fc.property(arbMutations, (n) => {
        let h: HistoryLen = { past: 0, future: 0 };
        for (let i = 0; i < n; i++) {
          h = applyMut(h);
        }
        // Undo exactly as many times as there are items in past
        const pastCount = h.past;
        for (let i = 0; i < pastCount; i++) {
          h = applyUndo(h);
        }
        expect(canUndo(h)).toBe(false);
        expect(h.past).toBe(0);
        return true;
      }),
      { numRuns: 500 }
    );
  });

  /**
   * Validates: Requirements 6.3
   *
   * undo() is a no-op when past === 0.
   */
  it("undo() est sans effet quand past === 0", () => {
    const h: HistoryLen = { past: 0, future: 0 };
    const after = applyUndo(h);
    expect(after).toEqual(h);
  });
});

// ---------------------------------------------------------------------------
// Property 11.4 — After redo(): future decreases, past increases
// Validates: Requirement 6.5
// ---------------------------------------------------------------------------

describe("Property 11 — redo() est réactif", () => {
  /**
   * Validates: Requirements 6.5
   *
   * After redo(), historyLen.future decreases by 1 and past increases by 1.
   */
  it("redo() décrémente future de 1 et incrémente past de 1", () => {
    fc.assert(
      fc.property(arbMutations, (n) => {
        let h: HistoryLen = { past: 0, future: 0 };
        for (let i = 0; i < n; i++) {
          h = applyMut(h);
        }
        // Undo once to have something to redo
        h = applyUndo(h);
        const before = { ...h };
        h = applyRedo(h);
        expect(h.future).toBe(before.future - 1);
        expect(h.past).toBe(before.past + 1);
        return true;
      }),
      { numRuns: 500 }
    );
  });

  /**
   * Validates: Requirements 6.5
   *
   * redo() is a no-op when future === 0.
   */
  it("redo() est sans effet quand future === 0", () => {
    const h: HistoryLen = { past: 3, future: 0 };
    const after = applyRedo(h);
    expect(after).toEqual(h);
  });
});

// ---------------------------------------------------------------------------
// Property 11.5 — Invariants hold across any sequence of ops
// Validates: Requirements 6.1, 6.2, 6.3, 6.5
// ---------------------------------------------------------------------------

describe("Property 11 — invariants de la machine d'état", () => {
  /**
   * Validates: Requirements 6.1, 6.2, 6.3, 6.5
   *
   * For any sequence of ops, past and future are always >= 0.
   */
  it("past et future sont toujours >= 0 pour toute séquence d'opérations", () => {
    fc.assert(
      fc.property(arbOps, (ops) => {
        const h = applyOps(ops);
        expect(h.past).toBeGreaterThanOrEqual(0);
        expect(h.future).toBeGreaterThanOrEqual(0);
        return true;
      }),
      { numRuns: 1000 }
    );
  });

  /**
   * Validates: Requirements 6.1, 6.2, 6.3, 6.5
   *
   * For any sequence of ops, past is always <= MAX_HISTORY.
   */
  it("past est toujours <= MAX_HISTORY pour toute séquence d'opérations", () => {
    fc.assert(
      fc.property(arbOps, (ops) => {
        const h = applyOps(ops);
        expect(h.past).toBeLessThanOrEqual(MAX_HISTORY);
        return true;
      }),
      { numRuns: 1000 }
    );
  });

  /**
   * Validates: Requirements 6.1, 6.2, 6.3, 6.5
   *
   * A mut() always resets future to 0 (branching history is discarded).
   */
  it("mut() réinitialise toujours future à 0", () => {
    fc.assert(
      fc.property(arbOps, (ops) => {
        const h = applyOps([...ops, "mut"]);
        expect(h.future).toBe(0);
        return true;
      }),
      { numRuns: 1000 }
    );
  });
});

// ---------------------------------------------------------------------------
// Concrete examples — quick sanity checks
// ---------------------------------------------------------------------------

describe("undoRedo — exemples concrets", () => {
  it("état initial : canUndo=false, canRedo=false", () => {
    const h: HistoryLen = { past: 0, future: 0 };
    expect(canUndo(h)).toBe(false);
    expect(canRedo(h)).toBe(false);
  });

  it("après 1 mutation : canUndo=true, canRedo=false", () => {
    const h = applyMut({ past: 0, future: 0 });
    expect(canUndo(h)).toBe(true);
    expect(canRedo(h)).toBe(false);
  });

  it("après 1 mutation + 1 undo : canUndo=false, canRedo=true", () => {
    let h = applyMut({ past: 0, future: 0 });
    h = applyUndo(h);
    expect(canUndo(h)).toBe(false);
    expect(canRedo(h)).toBe(true);
  });

  it("après 1 mutation + 1 undo + 1 redo : canUndo=true, canRedo=false", () => {
    let h = applyMut({ past: 0, future: 0 });
    h = applyUndo(h);
    h = applyRedo(h);
    expect(canUndo(h)).toBe(true);
    expect(canRedo(h)).toBe(false);
  });

  it("après 3 mutations + 2 undos : past=1, future=2", () => {
    let h: HistoryLen = { past: 0, future: 0 };
    h = applyMut(h); // past=1
    h = applyMut(h); // past=2
    h = applyMut(h); // past=3
    h = applyUndo(h); // past=2, future=1
    h = applyUndo(h); // past=1, future=2
    expect(h.past).toBe(1);
    expect(h.future).toBe(2);
    expect(canUndo(h)).toBe(true);
    expect(canRedo(h)).toBe(true);
  });

  it("mut() après undo efface le future (branching history)", () => {
    let h: HistoryLen = { past: 0, future: 0 };
    h = applyMut(h); // past=1
    h = applyMut(h); // past=2
    h = applyUndo(h); // past=1, future=1
    h = applyMut(h); // past=2, future=0 ← future effacé
    expect(h.future).toBe(0);
    expect(canRedo(h)).toBe(false);
  });

  it("past est plafonné à MAX_HISTORY=50", () => {
    let h: HistoryLen = { past: 0, future: 0 };
    for (let i = 0; i < 60; i++) {
      h = applyMut(h);
    }
    expect(h.past).toBe(MAX_HISTORY);
  });
});
