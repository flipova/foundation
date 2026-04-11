/**
 * Naming conventions — single source of truth for all screen/file naming.
 *
 * All generators and UI panels MUST use these helpers to ensure
 * consistency between the project tree, LayersPanel, and generated files.
 *
 * Rule: always derive names from `page.route` (the stored slug) when available,
 * falling back to deriving from `page.name` for backward compatibility.
 */

export interface ScreenNames {
  /** e.g. "home", "user-profile" — used as the Expo Router file name */
  fileName: string;
  /** e.g. "HomeScreen", "UserProfileScreen" — used as the React component name */
  componentName: string;
  /** e.g. "useHomeScreen", "useUserProfileScreen" — hook function name */
  hookName: string;
  /** e.g. "HomeScreen.hook.ts" — hook file name */
  hookFileName: string;
  /** e.g. "HomeScreen.tsx" — screen file name */
  screenFileName: string;
}

/** Convert a page name to a URL-safe route slug. */
export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Convert a route slug to a PascalCase component name. */
export function slugToComponent(slug: string): string {
  return slug.split("-").filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "Screen";
}

/**
 * Derive all screen naming artifacts from a page.
 * Accepts either a full PageDocument-like object or just a name string.
 */
export function deriveScreenNames(pageNameOrRoute: string, route?: string): ScreenNames {
  // Use the stored route slug if provided, otherwise derive from name
  const fileName = route ? route : nameToSlug(pageNameOrRoute);
  const componentName = slugToComponent(fileName);
  const hookName = `use${componentName}`;
  return {
    fileName,
    componentName,
    hookName,
    hookFileName: `${componentName}.hook.ts`,
    screenFileName: `${fileName}.tsx`,
  };
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Normalize a query name/id to a valid camelCase JS identifier.
 * "get users data"  → "getUsersData"
 * "getUsersData"    → "getUsersData"
 * "q_1234_abc"      → "q1234Abc"
 */
export function normalizeQueryName(raw: string): string {
  const parts = raw.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "query";
  return parts
    .map((p, i) => (i === 0 ? p.charAt(0).toLowerCase() + p.slice(1) : capitalize(p)))
    .join("");
}
