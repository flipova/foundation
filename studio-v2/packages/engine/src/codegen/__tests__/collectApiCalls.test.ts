/**
 * Property 7 : Toutes les queries `$state.alias` sont importées dans le hook généré
 *
 * **Validates: Requirements 5.3, 5.4, 5.5**
 *
 * For any PageDocument and any list of DataQuery, if a query has an `alias`
 * and a binding `$state.alias` exists in the tree, then
 * `generatePageHook(page, queries)` must contain the import for
 * `use{capitalize(normalizeQueryName(query.name))}`.
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { generatePageHook } from "../generator";
import { capitalize, normalizeQueryName } from "../naming";
import type { PageDocument, TreeNode, DataQuery } from "../../tree/types";

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Valid camelCase identifier for alias / query name */
const arbIdentifier = fc.stringMatching(/^[a-z][a-zA-Z0-9]{1,12}$/);

/** Valid node id */
const arbNodeId = fc.stringMatching(/^n_[a-z0-9]{4,8}$/);

/** Generate a DataQuery with a given alias and name */
function makeQuery(name: string, alias: string): DataQuery {
  return {
    id: `q_${alias}`,
    name,
    serviceId: "svc1",
    method: "GET",
    path: `/api/${alias}`,
    alias,
    autoFetch: false,
  };
}

/** Generate a leaf TreeNode that has a binding referencing $state.{alias} */
function makeNodeWithStateBinding(id: string, alias: string): TreeNode {
  return {
    id,
    kind: "component",
    registryId: "Text",
    props: {},
    children: [],
    bindings: {
      text: `$state.${alias}`,
    },
  };
}

/** Generate a leaf TreeNode that uses $state.{alias} as a repeatBinding source */
function makeNodeWithRepeatBinding(id: string, alias: string): TreeNode {
  return {
    id,
    kind: "layout",
    registryId: "Box",
    props: {},
    children: [
      {
        id: `${id}_child`,
        kind: "component",
        registryId: "Text",
        props: {},
        children: [],
      },
    ],
    repeatBinding: {
      source: `$state.${alias}`,
      keyProp: "id",
    },
  };
}

/** Build a minimal PageDocument with a given root node */
function makePage(root: TreeNode): PageDocument {
  return {
    id: "page-test",
    name: "TestScreen",
    route: "test-screen",
    root,
    state: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Property 7.1 — binding $state.alias → hook imports use{QueryName}
// ---------------------------------------------------------------------------

describe("Property 7 — $state.alias binding → import du hook de query", () => {
  /**
   * **Validates: Requirements 5.3, 5.4, 5.5**
   *
   * For any valid alias and query name, if a node has a binding `$state.alias`
   * and a DataQuery with that alias exists, then generatePageHook must contain
   * the import for `use{capitalize(normalizeQueryName(query.name))}`.
   */
  it("generatePageHook importe use{QueryName} quand un binding $state.alias est présent", () => {
    fc.assert(
      fc.property(
        arbNodeId,
        arbIdentifier,
        arbIdentifier,
        (nodeId, alias, queryName) => {
          const query = makeQuery(queryName, alias);
          const node = makeNodeWithStateBinding(nodeId, alias);
          const page = makePage(node);

          const hook = generatePageHook(page, [query]);
          const expectedImport = `use${capitalize(normalizeQueryName(queryName))}`;

          return hook.includes(expectedImport);
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7.2 — repeatBinding $state.alias → hook imports use{QueryName}
// ---------------------------------------------------------------------------

describe("Property 7 — $state.alias repeatBinding → import du hook de query", () => {
  /**
   * **Validates: Requirements 5.3, 5.4, 5.5**
   *
   * For any valid alias and query name, if a node has a repeatBinding with
   * source `$state.alias` and a DataQuery with that alias exists, then
   * generatePageHook must contain the import for
   * `use{capitalize(normalizeQueryName(query.name))}`.
   */
  it("generatePageHook importe use{QueryName} quand un repeatBinding $state.alias est présent", () => {
    fc.assert(
      fc.property(
        arbNodeId,
        arbIdentifier,
        arbIdentifier,
        (nodeId, alias, queryName) => {
          const query = makeQuery(queryName, alias);
          const node = makeNodeWithRepeatBinding(nodeId, alias);
          const page = makePage(node);

          const hook = generatePageHook(page, [query]);
          const expectedImport = `use${capitalize(normalizeQueryName(queryName))}`;

          return hook.includes(expectedImport);
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7.3 — no alias match → no spurious import
// ---------------------------------------------------------------------------

describe("Property 7 — pas d'alias correspondant → pas d'import parasite", () => {
  /**
   * **Validates: Requirements 5.3**
   *
   * If no DataQuery has an alias matching the $state.x binding,
   * the hook must NOT import a hook for that binding.
   */
  it("generatePageHook n'importe pas de hook quand l'alias ne correspond à aucune query", () => {
    fc.assert(
      fc.property(
        arbNodeId,
        arbIdentifier,
        arbIdentifier,
        fc.array(arbIdentifier, { minLength: 1, maxLength: 3 }),
        (nodeId, bindingAlias, queryName, otherAliases) => {
          // Ensure none of the query aliases match the binding alias
          const safeAliases = otherAliases.map((a) =>
            a === bindingAlias ? `${a}X` : a
          );
          const queries: DataQuery[] = safeAliases.map((a) => makeQuery(queryName, a));
          const node = makeNodeWithStateBinding(nodeId, bindingAlias);
          const page = makePage(node);

          const hook = generatePageHook(page, queries);
          // The hook should not import a controller for the unmatched alias
          const unexpectedImport = `use${capitalize(normalizeQueryName(bindingAlias))}`;

          // Only fail if the import appears AND it's not from a matching query
          const hasMatchingQuery = queries.some((q) => q.alias === bindingAlias);
          if (hasMatchingQuery) return true; // skip — there is a match
          return !hook.includes(unexpectedImport);
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Concrete examples — sanity checks
// ---------------------------------------------------------------------------

describe("Property 7 — exemples concrets", () => {
  it("binding $state.users avec query alias=users → importe useGetUsers", () => {
    const query: DataQuery = {
      id: "q_getUsers",
      name: "getUsers",
      serviceId: "svc1",
      method: "GET",
      path: "/api/users",
      alias: "users",
      autoFetch: true,
    };
    const page: PageDocument = {
      id: "p1",
      name: "HomeScreen",
      route: "home",
      root: {
        id: "n_text01",
        kind: "component",
        registryId: "Text",
        props: {},
        children: [],
        bindings: { text: "$state.users" },
      },
      state: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const hook = generatePageHook(page, [query]);
    expect(hook).toContain("useGetUsers");
  });

  it("repeatBinding $state.posts avec query alias=posts → importe useGetPosts", () => {
    const query: DataQuery = {
      id: "q_getPosts",
      name: "getPosts",
      serviceId: "svc1",
      method: "GET",
      path: "/api/posts",
      alias: "posts",
      autoFetch: true,
    };
    const page: PageDocument = {
      id: "p2",
      name: "PostsScreen",
      route: "posts",
      root: {
        id: "n_list01",
        kind: "layout",
        registryId: "Box",
        props: {},
        children: [
          {
            id: "n_item01",
            kind: "component",
            registryId: "Text",
            props: {},
            children: [],
          },
        ],
        repeatBinding: { source: "$state.posts", keyProp: "id" },
      },
      state: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const hook = generatePageHook(page, [query]);
    expect(hook).toContain("useGetPosts");
  });

  it("binding $state.userData avec query alias=userData → importe useGetUserData", () => {
    const query: DataQuery = {
      id: "q_getUserData",
      name: "getUserData",
      serviceId: "svc1",
      method: "GET",
      path: "/api/user",
      alias: "userData",
      autoFetch: false,
    };
    const page: PageDocument = {
      id: "p3",
      name: "ProfileScreen",
      route: "profile",
      root: {
        id: "n_text02",
        kind: "component",
        registryId: "Text",
        props: {},
        children: [],
        bindings: { text: "$state.userData" },
      },
      state: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const hook = generatePageHook(page, [query]);
    expect(hook).toContain("useGetUserData");
  });

  it("aucune query → pas d'import de hook de query", () => {
    const page: PageDocument = {
      id: "p4",
      name: "EmptyScreen",
      route: "empty",
      root: {
        id: "n_text03",
        kind: "component",
        registryId: "Text",
        props: {},
        children: [],
        bindings: { text: "$state.someValue" },
      },
      state: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const hook = generatePageHook(page, []);
    // No query imports should be present
    expect(hook).not.toContain(".controller");
  });
});
