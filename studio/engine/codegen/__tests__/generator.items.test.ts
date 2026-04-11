/**
 * Unit tests for generator.ts — items-mode layout code generation
 *
 * Covers all 4 modes:
 *   - Empty:    0 children, no repeatBinding → items={[]}
 *   - Static:   N children, no repeatBinding → items={[<C1 />, ...]}
 *   - Template: 1 child with repeatBinding   → items={source.map(...)}
 *   - Data:     layout has repeatBinding     → items={source.map(...)}
 *
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 */

import { describe, it, expect } from "vitest";
import { generatePageCode } from "../generator";
import type { PageDocument, TreeNode } from "../../tree/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePage(root: TreeNode): PageDocument {
  return {
    id: "test-page",
    name: "TestScreen",
    route: "test",
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
// Task 4.1 — Empty case: items={[]}
// ---------------------------------------------------------------------------

describe("Task 4.1 — Empty items-mode layout emits items={[]}", () => {
  it("emits items={[]} for BentoLayout with 0 children and no repeatBinding", () => {
    const root = makeItemsLayout({ children: [] });
    const code = generatePageCode(makePage(root));
    expect(code).toContain("items={[]}");
    // Must NOT emit a bare self-closing tag without items prop
    expect(code).not.toMatch(/<BentoLayout\s*\/>/);
  });

  it("emits items={[]} for GridLayout with 0 children", () => {
    const root: TreeNode = {
      id: "n_grid01",
      kind: "layout",
      registryId: "GridLayout",
      props: {},
      children: [],
    };
    const code = generatePageCode(makePage(root));
    expect(code).toContain("items={[]}");
  });

  it("does NOT emit items={[]} for a non-items-mode layout with 0 children", () => {
    const root: TreeNode = {
      id: "n_root01",
      kind: "layout",
      registryId: "RootLayout",
      props: {},
      children: [],
    };
    const code = generatePageCode(makePage(root));
    // RootLayout is children-mode, should emit self-closing without items prop
    expect(code).not.toContain("items={[]}");
    expect(code).toMatch(/<RootLayout[^>]*\/>/);
  });
});

// ---------------------------------------------------------------------------
// Task 4.2 — DATA mode: layout has repeatBinding → items={source.map(...)}
// ---------------------------------------------------------------------------

describe("Task 4.2 — DATA mode: layout repeatBinding emits items={source.map(...)}", () => {
  it("emits items={...map(...)} when BentoLayout has repeatBinding and a child", () => {
    const child = makeChild("n_child01");
    const root = makeItemsLayout({
      children: [child],
      repeatBinding: { source: "$state.products", keyProp: "id" },
    });
    const code = generatePageCode(makePage(root));
    expect(code).toContain("items={");
    expect(code).toContain(".map(");
    // Must NOT emit a static array literal
    expect(code).not.toContain("items={[");
  });

  it("uses the derived loop variable from source", () => {
    const child = makeChild("n_child01");
    const root = makeItemsLayout({
      children: [child],
      repeatBinding: { source: "$state.products", keyProp: "id" },
    });
    const code = generatePageCode(makePage(root));
    // "$state.products" → deriveItemVar → "product"
    expect(code).toContain("product");
    expect(code).toContain("key={product.id}");
  });

  it("emits items={[]} when layout has repeatBinding but no children", () => {
    const root = makeItemsLayout({
      children: [],
      repeatBinding: { source: "$state.products", keyProp: "id" },
    });
    const code = generatePageCode(makePage(root));
    expect(code).toContain("items={[]}");
  });

  it("uses custom itemVar when provided", () => {
    const child = makeChild("n_child01");
    const root = makeItemsLayout({
      children: [child],
      repeatBinding: { source: "$state.users", keyProp: "id", itemVar: "u" },
    });
    const code = generatePageCode(makePage(root));
    expect(code).toContain("u");
    expect(code).toContain("key={u.id}");
  });
});

// ---------------------------------------------------------------------------
// Task 4.3 — TEMPLATE mode: single child with repeatBinding → items={source.map(...)}
// ---------------------------------------------------------------------------

describe("Task 4.3 — TEMPLATE mode: child repeatBinding emits items={source.map(...)}", () => {
  it("emits items={...map(...)} when single child has repeatBinding", () => {
    const child = makeChild("n_child01", {
      repeatBinding: { source: "$state.items", keyProp: "id" },
    });
    const root = makeItemsLayout({ children: [child] });
    const code = generatePageCode(makePage(root));
    expect(code).toContain("items={");
    expect(code).toContain(".map(");
    // Must NOT emit a static array literal
    expect(code).not.toContain("items={[");
  });

  it("uses the child's repeatBinding source for the map", () => {
    const child = makeChild("n_child01", {
      registryId: "ProductCard",
      repeatBinding: { source: "$state.products", keyProp: "id" },
    });
    const root = makeItemsLayout({ children: [child] });
    const code = generatePageCode(makePage(root));
    // "$state.products" → deriveItemVar → "product"
    expect(code).toContain("product");
    expect(code).toContain("key={product.id}");
  });

  it("falls back to STATIC mode when multiple children (no repeatBinding on any)", () => {
    const children = [makeChild("n_c1"), makeChild("n_c2")];
    const root = makeItemsLayout({ children });
    const code = generatePageCode(makePage(root));
    // Static mode: items={[...]}
    expect(code).toContain("items={[");
    expect(code).not.toContain(".map(");
  });
});

// ---------------------------------------------------------------------------
// STATIC mode — N children, no repeatBinding → items={[<C1 />, <C2 />, ...]}
// ---------------------------------------------------------------------------

describe("STATIC mode — N children emits items={[...]}", () => {
  it("emits items={[...]} for 2 static children", () => {
    const children = [makeChild("n_c1"), makeChild("n_c2")];
    const root = makeItemsLayout({ children });
    const code = generatePageCode(makePage(root));
    expect(code).toContain("items={[");
    expect(code).not.toContain(".map(");
  });

  it("emits items={[...]} for 1 static child without repeatBinding", () => {
    const child = makeChild("n_c1"); // no repeatBinding
    const root = makeItemsLayout({ children: [child] });
    const code = generatePageCode(makePage(root));
    expect(code).toContain("items={[");
    expect(code).not.toContain(".map(");
  });
});

// ---------------------------------------------------------------------------
// Non-regression — children-mode and named-mode layouts unchanged
// ---------------------------------------------------------------------------

describe("Non-regression — non-items-mode layouts unaffected", () => {
  it("children-mode layout emits JSX children, not items prop", () => {
    const child = makeChild("n_c1");
    const root: TreeNode = {
      id: "n_root01",
      kind: "layout",
      registryId: "RootLayout",
      props: {},
      children: [child],
    };
    const code = generatePageCode(makePage(root));
    expect(code).not.toContain("items={");
    // Children should appear inside the tag
    expect(code).toContain("<Button");
  });
});
