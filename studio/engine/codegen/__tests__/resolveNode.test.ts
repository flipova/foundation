/**
 * Property 15 : `resolveNode` après `setState` retourne la nouvelle valeur
 *
 * **Validates: Requirements 4.2**
 *
 * Tests the reactive behaviour of `$node.id.prop` bindings in generated code:
 *
 * 1. For any `$node.id.prop` expression where `prop` is in `stateKeys`,
 *    `generatePageHook` emits the state variable name (not a static snapshot).
 * 2. For any `$node.id.prop` expression where `prop` is NOT in `stateKeys`,
 *    `generatePageHook` emits a comment `/* $node non résolu: ... *\/`.
 * 3. For any `PageDocument` with `$node.*` bindings,
 *    `generatePageHook` does NOT contain `nodePropsContext` (the static snapshot).
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generatePageHook } from "../generator";
import type { PageDocument, TreeNode, PageState } from "../../tree/types";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Valid camelCase identifier (state variable name / prop name) */
const arbIdentifier = fc.stringMatching(/^[a-z][a-zA-Z0-9]{1,12}$/);

/** Valid node id */
const arbNodeId = fc.stringMatching(/^n_[a-z0-9]{4,8}$/);

/** Build a minimal PageDocument with a $node.{nodeId}.{prop} binding */
function makePageWithNodeBinding(
  nodeId: string,
  prop: string,
  stateVars: PageState[]
): PageDocument {
  const root: TreeNode = {
    id: nodeId,
    kind: "component",
    registryId: "Text",
    props: {},
    children: [],
    bindings: {
      text: `$node.${nodeId}.${prop}`,
    },
  };
  return {
    id: "page-test",
    name: "TestScreen",
    route: "test-screen",
    root,
    state: stateVars,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Build a PageState entry for a given name */
function makeStateVar(name: string): PageState {
  return {
    name,
    type: "string",
    default: "",
    scope: "page",
  };
}

// ---------------------------------------------------------------------------
// Property 15.1 — $node.id.prop where prop ∈ stateKeys → emits state var name
// ---------------------------------------------------------------------------

describe("Property 15 — $node.id.prop résolu vers la variable d'état", () => {
  /**
   * **Validates: Requirements 4.2**
   *
   * For any `$node.id.prop` expression where `prop` is a known state variable,
   * `generatePageHook` must reference the state variable directly (not a snapshot).
   * This ensures the binding is reactive: after `setState(prop, newVal)`,
   * the component re-renders with `newVal`.
   */
  it("generatePageHook émet le nom de la variable d'état quand prop ∈ stateKeys", () => {
    fc.assert(
      fc.property(arbNodeId, arbIdentifier, (nodeId, prop) => {
        const stateVars = [makeStateVar(prop)];
        const page = makePageWithNodeBinding(nodeId, prop, stateVars);

        const hook = generatePageHook(page, []);

        // The hook must declare the state variable
        const hasStateDecl = hook.includes(`const [${prop},`);
        // The hook must NOT contain a static nodePropsContext snapshot
        const hasNoSnapshot = !hook.includes("nodePropsContext");

        return hasStateDecl && hasNoSnapshot;
      }),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 15.2 — $node.id.prop where prop ∉ stateKeys → emits comment placeholder
// ---------------------------------------------------------------------------

describe("Property 15 — $node.id.prop non résolu → commentaire placeholder", () => {
  /**
   * **Validates: Requirements 4.2, 4.4**
   *
   * For any `$node.id.prop` expression where `prop` is NOT a known state variable,
   * `generatePageHook` must emit a comment placeholder rather than a stale snapshot.
   */
  it("generatePageHook émet un commentaire quand prop ∉ stateKeys", () => {
    fc.assert(
      fc.property(
        arbNodeId,
        arbIdentifier,
        arbIdentifier,
        (nodeId, prop, otherProp) => {
          // Ensure the state var name differs from the binding prop
          const stateProp = prop === otherProp ? `${otherProp}X` : otherProp;
          const stateVars = [makeStateVar(stateProp)];
          const page = makePageWithNodeBinding(nodeId, prop, stateVars);

          const hook = generatePageHook(page, []);

          // The hook must NOT contain a static nodePropsContext snapshot
          const hasNoSnapshot = !hook.includes("nodePropsContext");

          return hasNoSnapshot;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 15.3 — no nodePropsContext for any page with $node.* bindings
// ---------------------------------------------------------------------------

describe("Property 15 — generatePageHook ne contient jamais nodePropsContext", () => {
  /**
   * **Validates: Requirements 4.1, 4.2**
   *
   * For any PageDocument with `$node.*` bindings,
   * `generatePageHook` must NOT contain `nodePropsContext` (the static snapshot).
   * This is the core fix: the generated hook must be reactive, not snapshot-based.
   */
  it("generatePageHook ne contient jamais nodePropsContext pour tout PageDocument avec $node.*", () => {
    fc.assert(
      fc.property(
        arbNodeId,
        arbIdentifier,
        fc.array(arbIdentifier, { minLength: 0, maxLength: 5 }),
        (nodeId, prop, extraStateNames) => {
          const stateVars = extraStateNames.map(makeStateVar);
          const page = makePageWithNodeBinding(nodeId, prop, stateVars);

          const hook = generatePageHook(page, []);

          return !hook.includes("nodePropsContext");
        }
      ),
      { numRuns: 300 }
    );
  });
});

// ---------------------------------------------------------------------------
// Concrete examples — sanity checks
// ---------------------------------------------------------------------------

describe("Property 15 — exemples concrets", () => {
  it("$node.n_abc.email avec state email → hook déclare useState pour email", () => {
    const page: PageDocument = {
      id: "p1",
      name: "LoginScreen",
      route: "login",
      root: {
        id: "n_abc",
        kind: "component",
        registryId: "Text",
        props: {},
        children: [],
        bindings: { text: "$node.n_abc.email" },
      },
      state: [{ name: "email", type: "string", default: "", scope: "page" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const hook = generatePageHook(page, []);

    // Must declare the reactive state variable
    expect(hook).toContain("const [email,");
    // Must NOT contain a static snapshot
    expect(hook).not.toContain("nodePropsContext");
  });

  it("$node.n_xyz.count sans state correspondant → pas de nodePropsContext", () => {
    const page: PageDocument = {
      id: "p2",
      name: "CounterScreen",
      route: "counter",
      root: {
        id: "n_xyz",
        kind: "component",
        registryId: "Text",
        props: {},
        children: [],
        bindings: { text: "$node.n_xyz.count" },
      },
      state: [{ name: "otherVar", type: "number", default: 0, scope: "page" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const hook = generatePageHook(page, []);

    expect(hook).not.toContain("nodePropsContext");
  });

  it("page sans $node.* → pas de nodePropsContext non plus", () => {
    const page: PageDocument = {
      id: "p3",
      name: "SimpleScreen",
      route: "simple",
      root: {
        id: "n_root",
        kind: "component",
        registryId: "Text",
        props: { text: "Hello" },
        children: [],
      },
      state: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const hook = generatePageHook(page, []);

    expect(hook).not.toContain("nodePropsContext");
  });

  it("setState sur prop lié via $node.* → la variable d'état est dans le hook", () => {
    // Simulates: a button sets `username`, and a Text binds $node.n_btn.username
    const page: PageDocument = {
      id: "p4",
      name: "ProfileScreen",
      route: "profile",
      root: {
        id: "n_root",
        kind: "layout",
        registryId: "Box",
        props: {},
        children: [
          {
            id: "n_text",
            kind: "component",
            registryId: "Text",
            props: {},
            children: [],
            bindings: { text: "$node.n_text.username" },
          },
          {
            id: "n_btn",
            kind: "component",
            registryId: "Button",
            props: {},
            children: [],
            events: {
              onPress: [
                { type: "setState", payload: { key: "username", value: "Alice" } },
              ],
            },
          },
        ],
      },
      state: [{ name: "username", type: "string", default: "", scope: "page" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const hook = generatePageHook(page, []);

    // The state variable must be declared reactively
    expect(hook).toContain("const [username,");
    // No static snapshot
    expect(hook).not.toContain("nodePropsContext");
    // The setter must be present (enables reactivity after setState)
    expect(hook).toContain("setUsername");
  });
});
