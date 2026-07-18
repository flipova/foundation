/**
 * Unit tests for useStudioItems passthrough behavior
 * Feature: studio-items-slot-ux
 * Validates: Requirements 1.2, 1.3, 1.4
 */

import { describe, it, expect } from "vitest";
import React from "react";
import { useStudioItems } from "../useStudioItems";

// Minimal placeholder factory
const placeholder = (i: number) => React.createElement("View", { key: i });

// ─── Test 1: InsertZone passthrough ──────────────────────────────────────────

describe("useStudioItems — InsertZone passthrough", () => {
  it("returns array unchanged when it contains exactly one InsertZone element", () => {
    // Create a mock component with $insertZone marker on its type
    const MockInsertZone = () => null;
    (MockInsertZone as any).$insertZone = true;

    const mockIZ = React.createElement(MockInsertZone, { key: "iz" });
    const input = [mockIZ];

    const result = useStudioItems(input, 4, placeholder);

    expect(result).toBe(input); // same reference — unchanged
  });
});

// ─── Test 2: Non-empty array passthrough ─────────────────────────────────────

describe("useStudioItems — non-empty array passthrough", () => {
  it("returns array unchanged for non-empty array of regular nodes", () => {
    const View = () => null;
    const Text = () => null;
    const input = [
      React.createElement(View, { key: "v" }),
      React.createElement(Text, { key: "t" }),
    ];

    const result = useStudioItems(input, 4, placeholder);

    expect(result).toBe(input); // same reference — unchanged
  });
});

// ─── Test 3: Placeholder generation for empty array ──────────────────────────

describe("useStudioItems — placeholder generation", () => {
  it("returns placeholder items when array is empty", () => {
    const count = 4;
    const result = useStudioItems([], count, placeholder);

    expect(result).toHaveLength(count);
  });

  it("returns at least 1 placeholder when count is 0", () => {
    const result = useStudioItems([], 0, placeholder);

    expect(result.length).toBe(1);
  });
});

// ─── Test 4: Regular element is not treated as InsertZone ────────────────────

describe("useStudioItems — regular element is not InsertZone", () => {
  it("does not treat a regular element as InsertZone", () => {
    // Element without $insertZone marker — should NOT be treated as IZ
    const RegularComponent = () => null;
    const el = React.createElement(RegularComponent, { key: "r" });

    // When passed as the only item, it's a non-empty array of regular nodes
    // so it should be returned unchanged (passthrough for non-empty)
    const result = useStudioItems([el], 4, placeholder);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(el);

    // When array is empty, placeholders are returned regardless
    const emptyResult = useStudioItems([], 4, placeholder);
    expect(emptyResult).toHaveLength(4);
  });
});
