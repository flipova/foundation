// Feature: studio-items-slot-ux, Property 1: useStudioItems passthrough for non-empty arrays

/**
 * Property-Based Tests for useStudioItems — Property 1
 * Validates: Requirements 1.2, 1.4
 *
 * Property 1: For any non-empty array of React nodes (including arrays containing
 * an InsertZone element), `useStudioItems` SHALL return the input array unchanged
 * without substituting placeholder items.
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import React from "react";
import { useStudioItems } from "../useStudioItems";

// Minimal placeholder factory used as the third argument
const placeholder = (i: number) => React.createElement("View", { key: `ph-${i}` });

// Arbitrary for a single React node (a simple View element with a unique key)
const arbitraryReactNode = fc.integer({ min: 0, max: 999_999 }).map((n) =>
  React.createElement("View", { key: `node-${n}` }),
);

// Arbitrary for a non-empty array of React nodes
const arbitraryNonEmptyNodeArray = fc.array(arbitraryReactNode, { minLength: 1 });

// Arbitrary for a count value (previewItemCount)
const arbitraryCount = fc.integer({ min: 0, max: 20 });

// ─── Property 1a: Non-empty arrays are returned unchanged ────────────────────

describe("PBT — Property 1a: useStudioItems returns non-empty arrays unchanged", () => {
  it("returns the exact same array reference for any non-empty array of React nodes", () => {
    fc.assert(
      fc.property(arbitraryNonEmptyNodeArray, arbitraryCount, (arr, count) => {
        const result = useStudioItems(arr, count, placeholder);
        // Same reference — no substitution occurred
        expect(result).toBe(arr);
      }),
      { numRuns: 100 },
    );
  });

  it("result has the same length as the input for any non-empty array", () => {
    fc.assert(
      fc.property(arbitraryNonEmptyNodeArray, arbitraryCount, (arr, count) => {
        const result = useStudioItems(arr, count, placeholder);
        expect(result).toHaveLength(arr.length);
      }),
      { numRuns: 100 },
    );
  });

  it("result elements are identical (by reference) to input elements", () => {
    fc.assert(
      fc.property(arbitraryNonEmptyNodeArray, arbitraryCount, (arr, count) => {
        const result = useStudioItems(arr, count, placeholder);
        for (let i = 0; i < arr.length; i++) {
          expect(result[i]).toBe(arr[i]);
        }
      }),
      { numRuns: 100 },
    );
  });
});

// ─── Property 1b: Arrays containing exactly one InsertZone element ───────────

describe("PBT — Property 1b: useStudioItems returns arrays with InsertZone unchanged", () => {
  // Factory for an InsertZone-marked element
  const makeInsertZone = (key: string) => {
    const IZ = () => null;
    (IZ as any).$insertZone = true;
    return React.createElement(IZ, { key });
  };

  it("returns array unchanged when it contains exactly one InsertZone element", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 999_999 }),
        arbitraryCount,
        (n, count) => {
          const iz = makeInsertZone(`iz-${n}`);
          const arr = [iz];
          const result = useStudioItems(arr, count, placeholder);
          expect(result).toBe(arr);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("returns array unchanged when InsertZone is among other nodes", () => {
    fc.assert(
      fc.property(
        // At least one regular node plus an InsertZone
        fc.array(arbitraryReactNode, { minLength: 1 }),
        arbitraryCount,
        fc.integer({ min: 0, max: 999_999 }),
        (regularNodes, count, n) => {
          const iz = makeInsertZone(`iz-mixed-${n}`);
          const arr = [...regularNodes, iz];
          const result = useStudioItems(arr, count, placeholder);
          expect(result).toBe(arr);
        },
      ),
      { numRuns: 100 },
    );
  });
});
