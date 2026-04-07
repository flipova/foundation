// Feature: studio-items-slot-ux, Property 4: generator emits items prop for all items-mode nodes
// Feature: studio-items-slot-ux, Property 5: generator emits map expression for items-mode nodes with repeatBinding
// Feature: studio-items-slot-ux, Property 6: generator non-regression for non-items-mode nodes
// Feature: studio-items-slot-ux, Property 7: generator round-trip stability for items-mode nodes

/**
 * Property-Based Tests — Properties 4, 5, 6, 7
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.6, 4.7, 4.8
 *
 * Property 4: For any items-mode layout node (regardless of child count or
 * repeatBinding), the generated TSX SHALL contain `items={` using the correct
 * `itemsProp` name from the registry, and SHALL NOT contain JSX children inside
 * the layout tag.
 *
 * Property 5: For any items-mode layout node that has a `repeatBinding` (DATA
 * mode) or a single child with `repeatBinding` (TEMPLATE mode), the generated
 * TSX SHALL contain `.map(` and SHALL NOT contain a static array literal `[<`.
 *
 * Property 6: For any layout node whose `deriveSlotConfig` returns `mode:
 * 'children'` or `mode: 'named'`, the generated TSX SHALL be identical to the
 * output produced before this change (children as JSX children, named slots as
 * JSX props).
 *
 * Property 7: For any items-mode layout node, generating TSX twice from the
 * same input SHALL produce identical output (idempotency / round-trip stability).
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generatePageCode } from "../generator";
import type { PageDocument, TreeNode } from "../../tree/types";

// ---------------------------------------------------------------------------
// Helpers (mirrors generator.items.test.ts)
// ---------------------------------------------------------------------------

function makePage(root: TreeNode): PageDocument {
  return {
    id: "pbt-page",
    name: "PbtScreen",
    route: "pbt",
    root,
    state: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function makeItemsLayout(overrides: Partial<TreeNode> = {}): TreeNode {
  return {
    id: "n_bento01",
    kind: "layout",
    registryId: "BentoLayout",
    props: {},
    children: [],
    ...overrides,
  };
}

function makeChild(id: string, overrides: Partial<TreeNode> = {}): TreeNode {
  return {
    id,
    kind: "component",
    registryId: "Button",
    props: { label: "Item" },
    children: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Known layout IDs
// ---------------------------------------------------------------------------

const ITEMS_MODE_IDS = [
  "BentoLayout",
  "GridLayout",
  "DeckLayout",
  "SwiperLayout",
  "MasonryLayout",
  "ParallaxLayout",
] as const;

const NON_ITEMS_MODE_IDS = [
  "RootLayout",
  "FlexLayout",
  "SplitLayout",
] as const;

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const arbitraryItemsModeId = fc.constantFrom(...ITEMS_MODE_IDS);
const arbitraryNonItemsModeId = fc.constantFrom(...NON_ITEMS_MODE_IDS);

/** Arbitrary child count: 0–8 */
const arbitraryChildCount = fc.integer({ min: 0, max: 8 });

/** Arbitrary non-empty child count: 1–8 */
const arbitraryNonEmptyChildCount = fc.integer({ min: 1, max: 8 });

/** Arbitrary source expression */
const arbitrarySource = fc.constantFrom(
  "$state.products",
  "$state.items",
  "$state.users",
  "$state.cards",
  "$state.slides",
);

/** Arbitrary keyProp */
const arbitraryKeyProp = fc.constantFrom("id", "key", "uuid");

/** Build an items-mode node with N static children */
function makeItemsNodeWithChildren(
  registryId: string,
  childCount: number,
): TreeNode {
  const children = Array.from({ length: childCount }, (_, i) =>
    makeChild(`n_child_${i}`),
  );
  return makeItemsLayout({ registryId, children });
}

/** Build an items-mode node with DATA mode repeatBinding */
function makeItemsNodeDataMode(
  registryId: string,
  source: string,
  keyProp: string,
  childCount: number,
): TreeNode {
  const children = Array.from({ length: childCount }, (_, i) =>
    makeChild(`n_child_${i}`),
  );
  return makeItemsLayout({
    registryId,
    children,
    repeatBinding: { source, keyProp },
  });
}

/** Build an items-mode node with TEMPLATE mode (single child with repeatBinding) */
function makeItemsNodeTemplateMode(
  registryId: string,
  source: string,
  keyProp: string,
): TreeNode {
  const child = makeChild("n_template_child", {
    repeatBinding: { source, keyProp },
  });
  return makeItemsLayout({ registryId, children: [child] });
}

// ---------------------------------------------------------------------------
// Property 4: Generator emits items prop for all items-mode nodes
// Validates: Requirements 4.1, 4.4
// ---------------------------------------------------------------------------

describe("PBT — Property 4: generator emits items prop for all items-mode nodes", () => {
  it("generated TSX contains items={ for any items-mode layout with any child count", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitraryChildCount,
        (registryId, childCount) => {
          const node = makeItemsNodeWithChildren(registryId, childCount);
          const code = generatePageCode(makePage(node));
          expect(code).toContain("items={");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("generated TSX does NOT contain JSX children inside the layout tag for any items-mode layout", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitraryChildCount,
        (registryId, childCount) => {
          const node = makeItemsNodeWithChildren(registryId, childCount);
          const code = generatePageCode(makePage(node));
          // Items-mode layouts must be self-closing — no closing tag like </BentoLayout>
          expect(code).not.toMatch(new RegExp(`</${registryId}>`));
        },
      ),
      { numRuns: 100 },
    );
  });

  it("generated TSX contains items={ even when child count is 0", () => {
    fc.assert(
      fc.property(arbitraryItemsModeId, (registryId) => {
        const node = makeItemsLayout({ registryId, children: [] });
        const code = generatePageCode(makePage(node));
        expect(code).toContain("items={");
      }),
      { numRuns: 100 },
    );
  });

  it("generated TSX contains items={[]} specifically when child count is 0 and no repeatBinding", () => {
    fc.assert(
      fc.property(arbitraryItemsModeId, (registryId) => {
        const node = makeItemsLayout({ registryId, children: [] });
        const code = generatePageCode(makePage(node));
        expect(code).toContain("items={[]}");
      }),
      { numRuns: 100 },
    );
  });

  it("generated TSX contains items={ for any items-mode layout with DATA mode repeatBinding", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitrarySource,
        arbitraryKeyProp,
        arbitraryNonEmptyChildCount,
        (registryId, source, keyProp, childCount) => {
          const node = makeItemsNodeDataMode(registryId, source, keyProp, childCount);
          const code = generatePageCode(makePage(node));
          expect(code).toContain("items={");
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: Generator emits map expression for repeatBinding nodes
// Validates: Requirements 4.2, 4.3
// ---------------------------------------------------------------------------

describe("PBT — Property 5: generator emits map expression for items-mode nodes with repeatBinding", () => {
  it("DATA mode: generated TSX contains .map( for any items-mode layout with repeatBinding and children", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitrarySource,
        arbitraryKeyProp,
        arbitraryNonEmptyChildCount,
        (registryId, source, keyProp, childCount) => {
          const node = makeItemsNodeDataMode(registryId, source, keyProp, childCount);
          const code = generatePageCode(makePage(node));
          expect(code).toContain(".map(");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("DATA mode: generated TSX does NOT contain static array literal [< for any repeatBinding node", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitrarySource,
        arbitraryKeyProp,
        arbitraryNonEmptyChildCount,
        (registryId, source, keyProp, childCount) => {
          const node = makeItemsNodeDataMode(registryId, source, keyProp, childCount);
          const code = generatePageCode(makePage(node));
          expect(code).not.toContain("[<");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("TEMPLATE mode: generated TSX contains .map( for any items-mode layout with single child with repeatBinding", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitrarySource,
        arbitraryKeyProp,
        (registryId, source, keyProp) => {
          const node = makeItemsNodeTemplateMode(registryId, source, keyProp);
          const code = generatePageCode(makePage(node));
          expect(code).toContain(".map(");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("TEMPLATE mode: generated TSX does NOT contain static array literal [< for single child with repeatBinding", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitrarySource,
        arbitraryKeyProp,
        (registryId, source, keyProp) => {
          const node = makeItemsNodeTemplateMode(registryId, source, keyProp);
          const code = generatePageCode(makePage(node));
          expect(code).not.toContain("[<");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("STATIC mode (no repeatBinding): generated TSX does NOT contain .map( for multiple children", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        fc.integer({ min: 2, max: 8 }),
        (registryId, childCount) => {
          const node = makeItemsNodeWithChildren(registryId, childCount);
          const code = generatePageCode(makePage(node));
          expect(code).not.toContain(".map(");
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 6: Generator non-regression for non-items-mode nodes
// Validates: Requirements 4.6, 4.7
// ---------------------------------------------------------------------------

describe("PBT — Property 6: generator non-regression for non-items-mode nodes", () => {
  it("children-mode layout: generated TSX does NOT contain items={ for any child count", () => {
    fc.assert(
      fc.property(
        arbitraryNonItemsModeId,
        arbitraryChildCount,
        (registryId, childCount) => {
          const children = Array.from({ length: childCount }, (_, i) =>
            makeChild(`n_child_${i}`),
          );
          const node: TreeNode = {
            id: "n_non_items",
            kind: "layout",
            registryId,
            props: {},
            children,
          };
          const code = generatePageCode(makePage(node));
          expect(code).not.toContain("items={");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("children-mode layout with children: generated TSX contains children as JSX children inside tags", () => {
    fc.assert(
      fc.property(
        arbitraryNonItemsModeId,
        arbitraryNonEmptyChildCount,
        (registryId, childCount) => {
          const children = Array.from({ length: childCount }, (_, i) =>
            makeChild(`n_child_${i}`),
          );
          const node: TreeNode = {
            id: "n_non_items",
            kind: "layout",
            registryId,
            props: {},
            children,
          };
          const code = generatePageCode(makePage(node));
          // Children-mode: layout has opening and closing tags
          expect(code).toMatch(new RegExp(`<${registryId}`));
          expect(code).toMatch(new RegExp(`</${registryId}>`));
          // Children appear as JSX children (Button component)
          expect(code).toContain("<Button");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("children-mode layout with 0 children: generated TSX emits self-closing tag without items prop", () => {
    fc.assert(
      fc.property(arbitraryNonItemsModeId, (registryId) => {
        const node: TreeNode = {
          id: "n_non_items",
          kind: "layout",
          registryId,
          props: {},
          children: [],
        };
        const code = generatePageCode(makePage(node));
        expect(code).not.toContain("items={");
        // Self-closing tag
        expect(code).toMatch(new RegExp(`<${registryId}[^>]*/>`));
      }),
      { numRuns: 100 },
    );
  });

  it("non-items-mode output is identical across two calls with the same input (deterministic)", () => {
    fc.assert(
      fc.property(
        arbitraryNonItemsModeId,
        arbitraryChildCount,
        (registryId, childCount) => {
          const children = Array.from({ length: childCount }, (_, i) =>
            makeChild(`n_child_${i}`),
          );
          const node: TreeNode = {
            id: "n_non_items",
            kind: "layout",
            registryId,
            props: {},
            children,
          };
          const page = makePage(node);
          const code1 = generatePageCode(page);
          const code2 = generatePageCode(page);
          expect(code1).toBe(code2);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7: Generator round-trip stability for items-mode nodes
// Validates: Requirement 4.8
//
// Since we don't have a TSX parser, we test idempotency: generating twice from
// the same input must produce identical output (no semantic drift).
// ---------------------------------------------------------------------------

describe("PBT — Property 7: generator round-trip stability for items-mode nodes", () => {
  it("generating twice from the same items-mode node produces identical output (empty case)", () => {
    fc.assert(
      fc.property(arbitraryItemsModeId, (registryId) => {
        const node = makeItemsLayout({ registryId, children: [] });
        const page = makePage(node);
        const code1 = generatePageCode(page);
        const code2 = generatePageCode(page);
        expect(code1).toBe(code2);
      }),
      { numRuns: 100 },
    );
  });

  it("generating twice from the same items-mode node produces identical output (static children)", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitraryNonEmptyChildCount,
        (registryId, childCount) => {
          const node = makeItemsNodeWithChildren(registryId, childCount);
          const page = makePage(node);
          const code1 = generatePageCode(page);
          const code2 = generatePageCode(page);
          expect(code1).toBe(code2);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("generating twice from the same items-mode node produces identical output (DATA mode)", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitrarySource,
        arbitraryKeyProp,
        arbitraryNonEmptyChildCount,
        (registryId, source, keyProp, childCount) => {
          const node = makeItemsNodeDataMode(registryId, source, keyProp, childCount);
          const page = makePage(node);
          const code1 = generatePageCode(page);
          const code2 = generatePageCode(page);
          expect(code1).toBe(code2);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("generating twice from the same items-mode node produces identical output (TEMPLATE mode)", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitrarySource,
        arbitraryKeyProp,
        (registryId, source, keyProp) => {
          const node = makeItemsNodeTemplateMode(registryId, source, keyProp);
          const page = makePage(node);
          const code1 = generatePageCode(page);
          const code2 = generatePageCode(page);
          expect(code1).toBe(code2);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("output is stable across all items-mode IDs and child counts", () => {
    fc.assert(
      fc.property(
        arbitraryItemsModeId,
        arbitraryChildCount,
        (registryId, childCount) => {
          const node = makeItemsNodeWithChildren(registryId, childCount);
          const page = makePage(node);
          // Three generations must all be identical
          const codes = [
            generatePageCode(page),
            generatePageCode(page),
            generatePageCode(page),
          ];
          expect(codes[0]).toBe(codes[1]);
          expect(codes[1]).toBe(codes[2]);
        },
      ),
      { numRuns: 100 },
    );
  });
});
