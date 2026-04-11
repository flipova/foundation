/**
 * Post-processors for generateProject pipeline.
 */

import * as fs from "fs";
import * as path from "path";
import type { GeneratedFile } from "./project";
import type { ProjectDocument } from "../tree/types";

// ---------------------------------------------------------------------------
// Registry Foundation Post-Processor
// ---------------------------------------------------------------------------

const NPMRC_CONTENT = `@flipova:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}
`;

export function applyRegistryFoundation(files: GeneratedFile[]): GeneratedFile[] {
  let result = [...files];

  if (!result.some(f => f.path === ".npmrc")) {
    result.push({ path: ".npmrc", content: NPMRC_CONTENT });
  }

  const pkgIndex = result.findIndex(f => f.path === "package.json");
  if (pkgIndex !== -1) {
    const pkg = JSON.parse(result[pkgIndex].content);
    if (!pkg.dependencies) pkg.dependencies = {};
    if (!pkg.dependencies["@flipova/foundation"]) {
      pkg.dependencies["@flipova/foundation"] = "latest";
    }
    result[pkgIndex] = { ...result[pkgIndex], content: JSON.stringify(pkg, null, 2) };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Local Foundation Post-Processor
// ---------------------------------------------------------------------------

const LOCAL_FOUNDATION_PACKAGE_JSON = JSON.stringify({
  name: "@flipova/foundation",
  version: "0.0.0-local",
  main: "./index.ts",
  exports: {
    ".": "./index.ts",
    "./tokens": "./tokens/index.ts",
    "./theme": "./theme/index.ts",
    "./config": "./config/index.ts",
    "./layout": "./layout/index.ts",
  },
}, null, 2);

/**
 * Compute relative path prefix from a file's location to flipova_modules/ at root.
 * e.g. "app/_layout.tsx"           → "../flipova_modules"
 *      "app/(tabs)/HomeScreen.tsx"  → "../../flipova_modules"
 *      "flipova.config.ts"          → "./flipova_modules"
 */
function relativeToModules(filePath: string): string {
  const depth = filePath.split("/").length - 1;
  return depth === 0 ? "./flipova_modules" : "../".repeat(depth) + "flipova_modules";
}

function buildImportReplacements(filePath: string): [RegExp, string][] {
  const base = relativeToModules(filePath);
  return [
    [/from ["']@flipova\/foundation\/tokens["']/g,  `from "${base}/flipova/foundation/tokens"`],
    [/from ["']@flipova\/foundation\/theme["']/g,   `from "${base}/flipova/foundation/theme"`],
    [/from ["']@flipova\/foundation\/config["']/g,  `from "${base}/flipova/foundation/config"`],
    [/from ["']@flipova\/foundation\/layout["']/g,  `from "${base}/flipova/foundation/layout"`],
    [/from ["']@flipova\/foundation["']/g,          `from "${base}/flipova/foundation"`],
  ];
}

export function applyLocalFoundation(
  files: GeneratedFile[],
  foundationSourcePath: string
): { files: GeneratedFile[]; warnings: string[] } {
  if (!fs.existsSync(foundationSourcePath)) {
    throw new Error(`Foundation source path not found: ${foundationSourcePath}`);
  }

  const allEntries = fs.readdirSync(foundationSourcePath, { recursive: true }) as string[];
  const foundationFiles: GeneratedFile[] = [];

  for (const entry of allEntries) {
    const absolutePath = path.join(foundationSourcePath, entry);
    if (!fs.statSync(absolutePath).isFile()) continue;

    let content: string;
    try {
      content = fs.readFileSync(absolutePath, "utf-8");
    } catch {
      throw new Error(`Cannot read foundation file: ${absolutePath}`);
    }

    const relativePath = entry.toString().replace(/\\/g, "/");
    foundationFiles.push({
      path: `flipova_modules/flipova/foundation/${relativePath}`,
      content,
    });
  }

  const localPackageJson: GeneratedFile = {
    path: "flipova_modules/flipova/foundation/package.json",
    content: LOCAL_FOUNDATION_PACKAGE_JSON,
  };

  // Replace imports per-file using correct relative depth
  const updatedFiles = files.map(file => {
    if (!file.path.endsWith(".ts") && !file.path.endsWith(".tsx")) return file;
    const replacements = buildImportReplacements(file.path);
    let content = file.content;
    for (const [pattern, replacement] of replacements) {
      content = content.replace(pattern, replacement);
    }
    return content !== file.content ? { ...file, content } : file;
  });

  const pkgIndex = updatedFiles.findIndex(f => f.path === "package.json");
  let result = [...updatedFiles];
  if (pkgIndex !== -1) {
    const pkg = JSON.parse(result[pkgIndex].content);
    if (pkg.dependencies) delete pkg.dependencies["@flipova/foundation"];
    result[pkgIndex] = { ...result[pkgIndex], content: JSON.stringify(pkg, null, 2) };
  }

  result = [...result, localPackageJson, ...foundationFiles];
  return { files: result, warnings: [] };
}

// ---------------------------------------------------------------------------
// Snack Post-Processor
// ---------------------------------------------------------------------------

const SNACK_SDK_VERSION = "53.0.0";

const SNACK_EXCLUDED_DEPS = new Set([
  "expo-secure-store",
  "expo-file-system",
  "expo-local-authentication",
  "expo-contacts",
]);

const SNACK_UNSUPPORTED_NATIVE = new Set([
  "expo-secure-store",
  "expo-file-system",
  "expo-local-authentication",
  "expo-contacts",
]);

const SNACK_COMPATIBLE_VERSIONS: Record<string, string> = {
  "expo": "~53.0.0",
  "react": "^19.0.0",
  "react-native": "~0.79.0",
  "expo-router": "~4.0.0",
  "react-native-safe-area-context": "~5.4.0",
  "react-native-screens": "~4.0.0",
  "react-native-web": "~0.20.0",
  "react-dom": "^19.0.0",
  "@expo/vector-icons": "^14.0.0",
  "@react-native-async-storage/async-storage": "~2.1.0",
  "expo-linear-gradient": "~14.0.0",
};

const SNACK_REQUIRED_DEPS: Record<string, string> = {
  "expo": "~53.0.0",
  "react": "^19.0.0",
  "react-native": "~0.79.0",
  "@react-navigation/native": "^7.0.0",
  "@react-navigation/stack": "^7.0.0",
  "react-native-safe-area-context": "~5.4.0",
  "react-native-screens": "~4.0.0",
  "react-native-gesture-handler": "~2.20.0",
  "expo-linear-gradient": "~14.0.0",
  "expo-haptics": "~14.0.0",
};

export function applySnackMode(
  files: GeneratedFile[],
  project: ProjectDocument
): { files: GeneratedFile[]; warnings: string[] } {
  const warnings: string[] = [];

  // Replace foundation imports per-file — skip files already inside flipova_modules/
  let result = files.map(file => {
    if (file.path.startsWith("flipova_modules/")) return file;
    const replacements = buildImportReplacements(file.path);
    let content = file.content;
    for (const [pattern, replacement] of replacements) {
      content = content.replace(pattern, replacement);
    }
    return content !== file.content ? { ...file, content } : file;
  });

  const pkgIndex = result.findIndex(f => f.path === "package.json");
  let filteredDeps: Record<string, string> = { ...SNACK_REQUIRED_DEPS };
  if (pkgIndex !== -1) {
    const pkg = JSON.parse(result[pkgIndex].content);
    const deps: Record<string, string> = pkg.dependencies ?? {};
    for (const [name, version] of Object.entries(deps)) {
      if (SNACK_EXCLUDED_DEPS.has(name)) continue;
      filteredDeps[name] = SNACK_COMPATIBLE_VERSIONS[name] ?? version;
    }
    const updatedPkg = { ...pkg, dependencies: filteredDeps };
    result = result.map((f, i) =>
      i === pkgIndex ? { ...f, content: JSON.stringify(updatedPkg, null, 2) } : f
    );
  }

  const snackJson = {
    name: project.name,
    description: "Generated by Flipova Studio",
    sdkVersion: SNACK_SDK_VERSION,
    dependencies: filteredDeps,
  };
  result = result.filter(f => f.path !== "snack.json");
  result.push({ path: "snack.json", content: JSON.stringify(snackJson, null, 2) });

  for (const file of result) {
    for (const mod of SNACK_UNSUPPORTED_NATIVE) {
      if (file.content.includes(`"${mod}"`) || file.content.includes(`'${mod}'`)) {
        warnings.push(`Warning: ${mod} is not supported in Snack environment (file: ${file.path})`);
      }
    }
  }

  return { files: result, warnings };
}
