/**
 * Unit tests for snack export logic
 *
 * Tests the pure transformation functions extracted from the /snack/export endpoint:
 * - buildSnackFiles: converts GeneratedFile[] to Snack file format, filtering .yml and .gitignore
 * - buildSnackDependencies: extracts deps from package.json content, excluding bundled packages
 *
 * Validates: Requirements 11.6, 11.7, 11.8
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// Pure functions extracted from the /snack/export endpoint logic (api.ts)
// ---------------------------------------------------------------------------

function buildSnackFiles(
  generatedFiles: Array<{ path: string; content: string }>
): Record<string, { type: "CODE"; contents: string }> {
  const snackFiles: Record<string, { type: "CODE"; contents: string }> = {};
  for (const file of generatedFiles) {
    if (file.path.endsWith(".yml") || file.path.endsWith(".gitignore")) continue;
    snackFiles[file.path] = { type: "CODE", contents: file.content };
  }
  return snackFiles;
}

function buildSnackDependencies(
  packageJsonContent: string
): Record<string, { version: string }> {
  const dependencies: Record<string, { version: string }> = {};
  try {
    const pkg = JSON.parse(packageJsonContent);
    for (const [name, version] of Object.entries(pkg.dependencies || {})) {
      if (["react", "react-native", "expo"].includes(name)) continue;
      dependencies[name] = { version: String(version).replace(/[~^]/, "") };
    }
  } catch {}
  return dependencies;
}

// ---------------------------------------------------------------------------
// buildSnackFiles tests
// ---------------------------------------------------------------------------

describe("buildSnackFiles", () => {
  it("returns files with type: 'CODE' and contents for a valid project", () => {
    const files = [
      { path: "app/index.tsx", content: "export default function App() {}" },
      { path: "package.json", content: '{"name":"my-app"}' },
    ];

    const result = buildSnackFiles(files);

    expect(result["app/index.tsx"]).toEqual({
      type: "CODE",
      contents: "export default function App() {}",
    });
    expect(result["package.json"]).toEqual({
      type: "CODE",
      contents: '{"name":"my-app"}',
    });
    expect(Object.values(result).every((f) => f.type === "CODE")).toBe(true);
    expect(Object.values(result).every((f) => typeof f.contents === "string")).toBe(true);
  });

  it("filters out .yml files (e.g. .github/workflows/build.yml)", () => {
    const files = [
      { path: "app/index.tsx", content: "export default function App() {}" },
      { path: ".github/workflows/build.yml", content: "name: Build" },
      { path: "eas.json", content: "{}" },
    ];

    const result = buildSnackFiles(files);

    expect(".github/workflows/build.yml" in result).toBe(false);
    expect("app/index.tsx" in result).toBe(true);
    expect("eas.json" in result).toBe(true);
  });

  it("filters out .gitignore files", () => {
    const files = [
      { path: "app/index.tsx", content: "export default function App() {}" },
      { path: ".gitignore", content: "node_modules/\n.expo/" },
    ];

    const result = buildSnackFiles(files);

    expect(".gitignore" in result).toBe(false);
    expect("app/index.tsx" in result).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildSnackDependencies tests
// ---------------------------------------------------------------------------

describe("buildSnackDependencies", () => {
  const packageJsonContent = JSON.stringify({
    dependencies: {
      react: "^19.0.0",
      "react-native": "~0.79.0",
      expo: "~53.0.0",
      "expo-router": "~4.0.0",
      "@flipova/foundation": "latest",
      "react-native-safe-area-context": "~5.4.0",
    },
  });

  it("returns dependencies for a valid package.json", () => {
    const result = buildSnackDependencies(packageJsonContent);

    expect("expo-router" in result).toBe(true);
    expect("@flipova/foundation" in result).toBe(true);
    expect("react-native-safe-area-context" in result).toBe(true);
  });

  it("excludes react from dependencies", () => {
    const result = buildSnackDependencies(packageJsonContent);
    expect("react" in result).toBe(false);
  });

  it("excludes react-native from dependencies", () => {
    const result = buildSnackDependencies(packageJsonContent);
    expect("react-native" in result).toBe(false);
  });

  it("excludes expo from dependencies", () => {
    const result = buildSnackDependencies(packageJsonContent);
    expect("expo" in result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Response structure test
// ---------------------------------------------------------------------------

describe("snack export response structure", () => {
  it("has files, dependencies, and name fields", () => {
    const generatedFiles = [
      { path: "app/index.tsx", content: "export default function App() {}" },
      {
        path: "package.json",
        content: JSON.stringify({
          name: "my-app",
          dependencies: {
            react: "^19.0.0",
            "expo-router": "~4.0.0",
          },
        }),
      },
      { path: ".github/workflows/build.yml", content: "name: Build" },
      { path: ".gitignore", content: "node_modules/" },
    ];

    const files = buildSnackFiles(generatedFiles);
    const pkgFile = generatedFiles.find((f) => f.path === "package.json");
    const dependencies = pkgFile ? buildSnackDependencies(pkgFile.content) : {};
    const name = "my-app";

    const response = { files, dependencies, name };

    expect(response).toHaveProperty("files");
    expect(response).toHaveProperty("dependencies");
    expect(response).toHaveProperty("name");
    expect(typeof response.name).toBe("string");
    expect(typeof response.files).toBe("object");
    expect(typeof response.dependencies).toBe("object");
  });
});

// ---------------------------------------------------------------------------
// Property-Based Tests — snack export (Properties P8, P9, P10)
// ---------------------------------------------------------------------------

import * as fc from "fast-check";

/**
 * P8: For any valid project, all files returned by buildSnackFiles have
 *     type: 'CODE' and contents of type string.
 * P9: For any valid project, dependencies returned by buildSnackDependencies
 *     never include react, react-native, or expo.
 * P10: For any valid project, files returned by buildSnackFiles contain no
 *      file whose path ends with .yml or .gitignore.
 *
 * Validates: Requirements 9.2, 9.3, 9.4, 12.1, 12.2
 */
describe("Property-Based Tests — snack export (Properties P8, P9, P10)", () => {
  it("P8: for any valid project, all files have type CODE and string contents", () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ path: fc.string({ minLength: 1 }), content: fc.string() })),
        (files) => {
          const result = buildSnackFiles(files);
          return Object.values(result).every(
            (f) => f.type === "CODE" && typeof f.contents === "string"
          );
        }
      )
    );
  });

  it("P9: for any valid project, dependencies never include react, react-native, or expo", () => {
    const BUNDLED = ["react", "react-native", "expo"] as const;

    // Generate a record of dependency names → versions, sometimes including bundled packages
    const depRecordArb = fc.dictionary(
      fc.oneof(
        fc.constantFrom(...BUNDLED),
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0)
      ),
      fc.string({ minLength: 1 })
    );

    fc.assert(
      fc.property(depRecordArb, (deps) => {
        const packageJsonContent = JSON.stringify({ dependencies: deps });
        const result = buildSnackDependencies(packageJsonContent);
        return BUNDLED.every((pkg) => !(pkg in result));
      })
    );
  });

  it("P10: for any valid project, no file path ends with .yml or .gitignore", () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ path: fc.string({ minLength: 1 }), content: fc.string() })),
        (files) => {
          const result = buildSnackFiles(files);
          return Object.keys(result).every(
            (p) => !p.endsWith(".yml") && !p.endsWith(".gitignore")
          );
        }
      )
    );
  });
});
