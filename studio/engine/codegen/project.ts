/**
 * Project Generator
 *
 * Generates a full Expo React Native project with tabs navigation,
 * FoundationProvider, and all screens from the document tree.
 */

import type { ProjectDocument, NavigationConfig, DataQuery } from "../tree/types";
import { generatePageCode, generatePageHook } from "./generator";
import { deriveScreenNames, capitalize as cap, normalizeQueryName } from "./naming";
import { applyRegistryFoundation, applyLocalFoundation, applySnackMode } from "./postprocess";

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GeneratorOptions {
  /** Active la compatibilité Snack Expo (SDK 52/53). Défaut : false */
  snackMode?: boolean;
  /**
   * Stratégie de résolution de @flipova/foundation.
   * "registry" → génère .npmrc pointant vers GitHub Packages (défaut)
   * "local"    → copie les sources foundation/ dans _flipova_modules/
   */
  foundationMode?: "registry" | "local";
  /**
   * Chemin absolu vers le dossier foundation/ du monorepo.
   * Obligatoire si foundationMode === "local".
   */
  foundationSourcePath?: string;
}

export interface GenerationResult {
  files: GeneratedFile[];
  warnings: string[];
}

export function generateProject(
  project: ProjectDocument,
  options?: GeneratorOptions
): GenerationResult {
  // 1. Validation des options
  if (options?.foundationMode === "local" && !options.foundationSourcePath) {
    throw new Error("foundationSourcePath is required when foundationMode is 'local'");
  }

  // 2. Génération du core (App Router)
  let files = generateCoreFiles(project);

  // 3. Post-processing
  const warnings: string[] = [];
  const effectiveFoundationMode = options?.foundationMode ?? "registry";

  if (effectiveFoundationMode === "registry") {
    files = applyRegistryFoundation(files);
  } else {
    const result = applyLocalFoundation(files, options!.foundationSourcePath!);
    files = result.files;
    warnings.push(...result.warnings);
  }

  if (options?.snackMode) {
    const result = applySnackMode(files, project);
    files = result.files;
    warnings.push(...result.warnings);
  }

  return { files, warnings };
}

/** Normalise a group name to a safe folder slug. */
function groupFolder(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Canonical route for a page — always derived from page.name so that
 * a canvas rename is immediately reflected in generated paths even if
 * page.route hasn't been persisted yet.
 */
function canonicalRoute(page: ProjectDocument["pages"][0]): string {
  return page.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function resolveScreenPath(page: ProjectDocument["pages"][0], project: ProjectDocument): string {
  // Use first group that contains this page (a page should only be in one group)
  const group = (project.screenGroups || []).find(g => (g.screenIds || []).includes(page.id));
  // Always derive names from page.name (canonical) so renames are reflected immediately
  const names = deriveScreenNames(page.name, canonicalRoute(page));
  if (group) {
    return `src/screens/${groupFolder(group.name)}/${names.componentName}.tsx`;
  }
  return `src/screens/${names.componentName}.tsx`;
}

function generateCoreFiles(project: ProjectDocument): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  files.push({ path: "app.json", content: generateAppJson(project) });
  files.push({ path: "package.json", content: generatePackageJson(project) });
  files.push({ path: "tsconfig.json", content: generateTsConfig() });
  files.push({ path: "flipova.config.ts", content: generateFoundationConfig(project) });

  // Collect all screens — always use canonical route derived from page.name
  // Deduplicate by page ID to prevent double-generation when data is inconsistent
  const seenPageIds = new Set<string>();
  const allScreens: { page: ProjectDocument["pages"][0]; names: ReturnType<typeof deriveScreenNames> }[] = [];
  for (const page of project.pages) {
    if (seenPageIds.has(page.id)) continue;
    seenPageIds.add(page.id);
    const names = deriveScreenNames(page.name, canonicalRoute(page));
    allScreens.push({ page, names });
    const screenPath = resolveScreenPath(page, project);
    const screenDir = screenPath.substring(0, screenPath.lastIndexOf('/'));
    files.push({ path: screenPath, content: generatePageCode(page, project.queries) });
    files.push({ path: `${screenDir}/${names.hookFileName}`, content: generatePageHook(page, project.queries, screenDir) });
  }

  // Generate App.tsx with React Navigation
  files.push({ path: "App.tsx", content: generateAppEntry(project, allScreens) });

  // Services
  for (const service of project.services) {
    files.push({ path: `services/${service.id}.ts`, content: generateServiceConfig(service) });
  }

  // Controllers
  if (project.queries?.length) {
    for (const query of project.queries) {
      const qName = normalizeQueryName(query.name);
      files.push({ path: `controllers/${qName}.controller.ts`, content: generateQueryController(query, project) });
    }
  }

  const auth = (project as any).auth;
  if (auth?.enabled) {
    files.push({ path: "src/providers/AuthProvider.tsx", content: generateAuthProvider(auth, project) });
    files.push({ path: "hooks/useAuth.ts", content: generateUseAuth(auth) });
  }

  files.push({ path: "eas.json", content: generateEasConfig() });
  files.push({ path: ".github/workflows/build.yml", content: generateGithubWorkflow(project) });

  for (const { page, names } of allScreens) {
    files.push({ path: `__tests__/${names.componentName}.test.tsx`, content: generatePageTest(page) });
  }

  files.push({ path: "hooks/useStorage.ts", content: generateStorageHook() });
  files.push({ path: "babel.config.js", content: `module.exports = function (api) {\n  api.cache(true);\n  return { presets: ["babel-preset-expo"] };\n};\n` });
  files.push({ path: ".gitignore", content: `node_modules/\n.expo/\ndist/\n.env\n*.log\n` });
  files.push({ path: "README.md", content: `# ${project.name}\n\nGenerated by Flipova Studio.\n\n## Run\n\n\`\`\`bash\nnpm install\nnpx expo start\n\`\`\`\n` });

  const constants = (project as any).constants as any[] || [];
  if (constants.length > 0) {
    files.push({ path: "constants.ts", content: generateConstants(constants) });
  }

  const envVars = (project as any).envVars as any[] || [];
  if (envVars.length > 0) {
    files.push({ path: ".env", content: envVars.map((e: any) => `${e.key}=${e.value}`).join("\n") + "\n" });
  }

  const globalState = (project as any).globalState as any[] || [];
  if (globalState.length > 0) {
    files.push({ path: "src/providers/GlobalStateProvider.tsx", content: generateGlobalStateProvider(globalState) });
  }

  return files;
}

function generateAppJson(project: ProjectDocument): string {
  const caps = (project as any).capabilities || [];
  const capPluginMap: Record<string, string> = {
    camera: "expo-camera", location: "expo-location", notifications: "expo-notifications",
    contacts: "expo-contacts", biometrics: "expo-local-authentication", haptics: "expo-haptics",
    imagePicker: "expo-image-picker", fileSystem: "expo-file-system", secureStore: "expo-secure-store",
    clipboard: "expo-clipboard",
  };
  const plugins: string[] = [];
  for (const cap of caps) {
    if (cap.enabled && capPluginMap[cap.id]) plugins.push(capPluginMap[cap.id]);
  }
  const slug = project.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return JSON.stringify({
    expo: {
      name: project.name,
      slug,
      version: project.version,
      orientation: "portrait",
      userInterfaceStyle: "light",
      assetBundlePatterns: ["**/*"],
      ios: { supportsTablet: true },
      android: { adaptiveIcon: { backgroundColor: "#ffffff" } },
      web: { bundler: "metro" },
      ...(plugins.length > 0 ? { plugins } : {}),
    },
  }, null, 2);
}

function generatePackageJson(project: ProjectDocument): string {
  const deps: Record<string, string> = {
    "@flipova/foundation": "latest",
    "expo": "~53.0.0",
    "expo-constants": "~17.0.0",
    "expo-linear-gradient": "~14.0.0",
    "react": "^19.0.0",
    "react-native": "~0.79.0",
    "react-native-safe-area-context": "~5.4.0",
    "react-native-screens": "~4.0.0",
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/stack": "^7.0.0",
    "react-native-gesture-handler": "~2.20.0",
  };
  // Add deps based on group types used
  const groupTypes = new Set((project.screenGroups || []).map((g: any) => g.type as string));
  if (groupTypes.has('tabs')) {
    deps["@react-navigation/bottom-tabs"] = "^7.0.0";
  }
  if (groupTypes.has('drawer')) {
    deps["@react-navigation/drawer"] = "^7.0.0";
    deps["react-native-reanimated"] = "~3.16.0";
  }
  return JSON.stringify({
    name: project.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    version: project.version,
    main: "App.tsx",
    repository: "https://github.com/flipova/foundation",
    scripts: {
      start: "expo start",
      android: "expo start --android",
      ios: "expo start --ios",
      web: "expo start --web",
    },
    dependencies: deps,
  }, null, 2);
}

function generateTsConfig(): string {
  return JSON.stringify({
    extends: "expo/tsconfig.base",
    compilerOptions: { strict: true },
  }, null, 2);
}

function generateFoundationConfig(project: ProjectDocument): string {
  const overrides = (project as any).themeOverrides;
  const hasOverrides = overrides && Object.keys(overrides).some(k => Object.keys(overrides[k] || {}).length > 0);

  if (hasOverrides) {
    const themeBlocks = Object.entries(overrides).filter(([, v]: any) => v && Object.keys(v).length > 0).map(([scheme, colors]: any) => {
      const entries = Object.entries(colors).map(([k, v]) => `      ${k}: "${v}",`).join("\n");
      return `    ${scheme}: {\n${entries}\n    },`;
    }).join("\n");

    return `import { defineConfig } from "@flipova/foundation";

export default defineConfig({
  defaultTheme: "${project.theme}",
  themes: {
${themeBlocks}
  },
});
`;
  }

  return `import { defineConfig } from "@flipova/foundation";

export default defineConfig({
  defaultTheme: "${project.theme}",
});
`;
}

function generateAppEntry(
  project: ProjectDocument,
  screens: { page: ProjectDocument["pages"][0]; names: ReturnType<typeof deriveScreenNames> }[]
): string {
  // Ensure every page is in a group — migrate ungrouped pages into the first group at codegen time
  const rawGroups: Array<{ id: string; name: string; type: string; screenIds: string[] }> =
    (project.screenGroups || []);

  const groupedPageIds = new Set(rawGroups.flatMap(g => g.screenIds));
  const ungroupedPageIds = screens.map(s => s.page.id).filter(id => !groupedPageIds.has(id));

  // Build effective groups: if there are ungrouped pages, add them to the first group (or create one)
  let groups = rawGroups;
  if (ungroupedPageIds.length > 0) {
    if (groups.length === 0) {
      groups = [{ id: 'grp_default', name: 'tabs', type: 'tabs', screenIds: ungroupedPageIds }];
    } else {
      groups = [
        { ...groups[0], screenIds: [...groups[0].screenIds, ...ungroupedPageIds] },
        ...groups.slice(1),
      ];
    }
  }

  // Map pageId → screen entry for quick lookup
  const screenByPageId = new Map(screens.map(s => [s.page.id, s]));

  // Map pageId → navScreen config (icon, label, etc.)
  const navScreenByPageId = new Map(
    (project.navigation.screens || []).map((s: any) => [s.pageId, s])
  );

  // Collect all imports — deduplicate by component name
  const importSet = new Set<string>();
  const importLines: string[] = [];
  screens.forEach(({ page, names }) => {
    if (importSet.has(names.componentName)) return;
    importSet.add(names.componentName);
    const screenPath = resolveScreenPath(page, project);
    importLines.push(`import ${names.componentName} from './${screenPath.replace(/\.tsx$/, '')}';`);
  });

  // Track which navigator packages are needed
  let needsStack = true; // root stack always needed
  let needsTabs = false;
  let needsDrawer = false;

  // Generate a sub-navigator function for each group
  const subNavigatorFunctions: string[] = [];
  const rootStackScreens: string[] = [];

  for (const group of groups) {
    const groupScreens = group.screenIds
      .map(id => screenByPageId.get(id))
      .filter(Boolean) as typeof screens;
    if (groupScreens.length === 0) continue;

    const folder = groupFolder(group.name);
    // Safe JS identifier for the navigator function name
    const navFnName = group.name.replace(/[^a-zA-Z0-9]/g, '_') + 'Navigator';
    const firstRoute = canonicalRoute(groupScreens[0].page);

    if (group.type === 'tabs') {
      needsTabs = true;
      const tabBarConfig = project.tabBarConfig;
      const tabBarOpts: string[] = [];
      if (tabBarConfig?.backgroundColor) tabBarOpts.push(`tabBarStyle: { backgroundColor: "${tabBarConfig.backgroundColor}" }`);
      if (tabBarConfig?.activeTintColor) tabBarOpts.push(`tabBarActiveTintColor: "${tabBarConfig.activeTintColor}"`);
      if (tabBarConfig?.inactiveTintColor) tabBarOpts.push(`tabBarInactiveTintColor: "${tabBarConfig.inactiveTintColor}"`);
      if (tabBarConfig?.showLabels === false) tabBarOpts.push(`tabBarShowLabel: false`);
      const screenOptsAttr = tabBarOpts.length > 0 ? ` screenOptions={{ ${tabBarOpts.join(', ')} }}` : '';

      const tabScreenDecls = groupScreens.map(({ page, names }) => {
        const sc = navScreenByPageId.get(page.id);
        // Display label: use NavigationScreen.name only if explicitly customized (differs from page.name)
        const label = (sc?.name && sc.name !== page.name) ? sc.name : page.name;
        const icon = sc?.icon ?? 'home';
        return `    <_Tab_${navFnName}.Screen name="${canonicalRoute(page)}" component={${names.componentName}} options={{ title: "${label}", tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={"${icon}" as any} size={size} color={color} /> }} />`;
      }).join('\n');

      subNavigatorFunctions.push(
        `const _Tab_${navFnName} = createBottomTabNavigator();\nfunction ${navFnName}() {\n  return (\n    <_Tab_${navFnName}.Navigator initialRouteName="${firstRoute}"${screenOptsAttr}>\n${tabScreenDecls}\n    </_Tab_${navFnName}.Navigator>\n  );\n}`
      );

    } else if (group.type === 'drawer') {
      needsDrawer = true;
      const drawerConfig = project.drawerConfig;
      const drawerOpts: string[] = [];
      if (drawerConfig?.backgroundColor) drawerOpts.push(`drawerStyle: { backgroundColor: "${drawerConfig.backgroundColor}" }`);
      if (drawerConfig?.activeTintColor) drawerOpts.push(`drawerActiveTintColor: "${drawerConfig.activeTintColor}"`);
      if (drawerConfig?.inactiveTintColor) drawerOpts.push(`drawerInactiveTintColor: "${drawerConfig.inactiveTintColor}"`);
      if (drawerConfig?.drawerPosition) drawerOpts.push(`drawerPosition: "${drawerConfig.drawerPosition}"`);
      const screenOptsAttr = drawerOpts.length > 0 ? ` screenOptions={{ ${drawerOpts.join(', ')} }}` : '';

      const drawerScreenDecls = groupScreens.map(({ page, names }) => {
        const sc = navScreenByPageId.get(page.id);
        const label = (sc?.name && sc.name !== page.name) ? sc.name : page.name;
        const icon = sc?.icon;
        const iconOpt = icon ? `, drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={"${icon}" as any} size={size} color={color} />` : '';
        return `    <_Drawer_${navFnName}.Screen name="${canonicalRoute(page)}" component={${names.componentName}} options={{ title: "${label}"${iconOpt} }} />`;
      }).join('\n');

      subNavigatorFunctions.push(
        `const _Drawer_${navFnName} = createDrawerNavigator();\nfunction ${navFnName}() {\n  return (\n    <_Drawer_${navFnName}.Navigator initialRouteName="${firstRoute}"${screenOptsAttr}>\n${drawerScreenDecls}\n    </_Drawer_${navFnName}.Navigator>\n  );\n}`
      );

    } else {
      // stack / auth / protected / custom → nested stack
      const stackScreenDecls = groupScreens.map(({ page, names }) => {
        const sc = navScreenByPageId.get(page.id);
        const title = (sc?.name && sc.name !== page.name) ? sc.name : page.name;
        return `    <_Stack_${navFnName}.Screen name="${canonicalRoute(page)}" options={{ title: "${title}", headerShown: false }}>\n      {(props: any) => <SafeScreen><${names.componentName} {...props} /></SafeScreen>}\n    </_Stack_${navFnName}.Screen>`;
      }).join('\n');

      subNavigatorFunctions.push(
        `const _Stack_${navFnName} = createStackNavigator();\nfunction ${navFnName}() {\n  return (\n    <_Stack_${navFnName}.Navigator initialRouteName="${firstRoute}" screenOptions={{ headerShown: false }}>\n${stackScreenDecls}\n    </_Stack_${navFnName}.Navigator>\n  );\n}`
      );
    }

    rootStackScreens.push(
      `          <RootStack.Screen name="${folder}" component={${navFnName}} options={{ headerShown: false }} />`
    );
  }

  const rootInitialRoute = groups[0] ? groupFolder(groups[0].name) : 'home';

  const navigatorImports: string[] = [`import { createStackNavigator } from '@react-navigation/stack';`];
  if (needsTabs) navigatorImports.push(`import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';\nimport { Ionicons } from '@expo/vector-icons';`);
  if (needsDrawer) navigatorImports.push(`import { createDrawerNavigator } from '@react-navigation/drawer';\nimport { Ionicons } from '@expo/vector-icons';`);

  const gestureHandlerImport = needsDrawer ? `import 'react-native-gesture-handler';\n` : '';

  const gsImport = (project as any).globalState?.length ? `\nimport { GlobalStateProvider } from './src/providers/GlobalStateProvider';` : '';
  const gsOpen = (project as any).globalState?.length ? '\n          <GlobalStateProvider>' : '';
  const gsClose = (project as any).globalState?.length ? '\n          </GlobalStateProvider>' : '';

  return `${gestureHandlerImport}import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
${navigatorImports.join('\n')}
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FoundationProvider } from '@flipova/foundation';
import config from './flipova.config';${gsImport}
${importLines.join('\n')}

const RootStack = createStackNavigator();

const SafeScreen = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
);

${subNavigatorFunctions.join('\n\n')}

export default function App() {
  return (
    <SafeAreaProvider>
      <FoundationProvider config={config}>${gsOpen}
        <NavigationContainer>
          <RootStack.Navigator initialRouteName="${rootInitialRoute}" screenOptions={{ headerShown: false }}>
${rootStackScreens.join('\n')}
          </RootStack.Navigator>
        </NavigationContainer>${gsClose}
      </FoundationProvider>
    </SafeAreaProvider>
  );
}
`;
}

function generateRootLayout(project: ProjectDocument): string {
  const auth = (project as any).auth;
  const hasAuth = auth?.enabled;
  const sb = (project as any).statusBar;
  const hasStatusBar = sb && (sb.style !== 'auto' || sb.hidden || sb.backgroundColor);
  const sbImport = hasStatusBar ? `\nimport { StatusBar } from "expo-status-bar";` : "";
  const sbTag = hasStatusBar ? `\n        <StatusBar style="${sb.style || 'auto'}"${sb.hidden ? ' hidden' : ''}${sb.translucent ? ' translucent' : ''}${sb.backgroundColor ? ` backgroundColor="${sb.backgroundColor}"` : ''} />` : "";
  const gsImport = (project as any).globalState?.length ? `\nimport { GlobalStateProvider } from "./providers/GlobalStateProvider";` : "";
  const gsOpen = (project as any).globalState?.length ? "\n          <GlobalStateProvider>" : "";
  const gsClose = (project as any).globalState?.length ? "\n          </GlobalStateProvider>" : "";

  const inner = `${gsOpen}\n            <Stack screenOptions={{ headerShown: false }} />${sbTag}${gsClose}`;

  if (hasAuth) {
    return `import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FoundationProvider } from "@flipova/foundation";
import { AuthProvider } from "./providers/AuthProvider";${sbImport}${gsImport}
import config from "../flipova.config";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FoundationProvider config={config}>
        <AuthProvider>${inner}
        </AuthProvider>
      </FoundationProvider>
    </SafeAreaProvider>
  );
}
`;
  }

  return `import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FoundationProvider } from "@flipova/foundation";${sbImport}${gsImport}
import config from "../flipova.config";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FoundationProvider config={config}>${inner}
      </FoundationProvider>
    </SafeAreaProvider>
  );
}
`;
}

function generateGroupTabsLayout(pages: ProjectDocument["pages"], project: ProjectDocument): string {
  const tabBarConfig = (project as any).tabBarConfig;
  const tabs = pages.map(pg => {
    const names = deriveScreenNames(pg.name, (pg as any).route);
    const sc = (project.navigation.screens || []).find((s: any) => s.pageId === pg.id);
    const label = sc?.name ?? pg.name;
    const icon = sc?.icon ?? 'ellipse';
    const opts: string[] = [
      `title: "${label}"`,
      `tabBarIcon: ({ color, size }) => <Ionicons name={"${icon}" as any} size={size} color={color} />`,
    ];
    return `        <Tabs.Screen name="${names.fileName}" options={{ ${opts.join(", ")} }} />`;
  }).join("\n");

  const tabBarOpts: string[] = [];
  if (tabBarConfig?.backgroundColor) tabBarOpts.push(`tabBarStyle: { backgroundColor: "${tabBarConfig.backgroundColor}" }`);
  if (tabBarConfig?.activeTintColor) tabBarOpts.push(`tabBarActiveTintColor: "${tabBarConfig.activeTintColor}"`);
  if (tabBarConfig?.inactiveTintColor) tabBarOpts.push(`tabBarInactiveTintColor: "${tabBarConfig.inactiveTintColor}"`);
  if (tabBarConfig?.showLabels === false) tabBarOpts.push(`tabBarShowLabel: false`);
  const screenOpts = tabBarOpts.length > 0 ? `\n      screenOptions={{ ${tabBarOpts.join(", ")} }}` : "";

  return `import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs${screenOpts}>
${tabs}
    </Tabs>
  );
}
`;
}

function generateTabsLayout(project: ProjectDocument): string {
  const screens = project.navigation.screens || [];
  const tabBarConfig = (project as any).tabBarConfig;
  const tabs = screens.map(sc => {
    const pg = project.pages.find(p => p.id === sc.pageId);
    const name = pg ? deriveScreenNames(pg.name, (pg as any).route).fileName : sc.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const icon = sc.icon ?? 'ellipse';
    const opts: string[] = [
      `title: "${sc.name}"`,
      `tabBarIcon: ({ color, size }) => <Ionicons name={"${icon}" as any} size={size} color={color} />`,
    ];
    const trans = (sc as any).transition;
    if (trans && trans !== "default") {
      if (trans === "fade") opts.push(`animation: "fade"`);
      else if (trans === "none") opts.push(`animation: "none"`);
      else if (trans === "modal") opts.push(`presentation: "modal"`);
    }
    return `        <Tabs.Screen name="${name}" options={{ ${opts.join(", ")} }} />`;
  }).join("\n");

  const tabBarOpts: string[] = [];
  if (tabBarConfig?.backgroundColor) tabBarOpts.push(`tabBarStyle: { backgroundColor: "${tabBarConfig.backgroundColor}" }`);
  if (tabBarConfig?.activeTintColor) tabBarOpts.push(`tabBarActiveTintColor: "${tabBarConfig.activeTintColor}"`);
  if (tabBarConfig?.inactiveTintColor) tabBarOpts.push(`tabBarInactiveTintColor: "${tabBarConfig.inactiveTintColor}"`);
  if (tabBarConfig?.showLabels === false) tabBarOpts.push(`tabBarShowLabel: false`);
  const screenOpts = tabBarOpts.length > 0 ? `\n      screenOptions={{ ${tabBarOpts.join(", ")} }}` : "";

  return `import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs${screenOpts}>
${tabs}
    </Tabs>
  );
}
`;
}

function generateDrawerLayout(project: ProjectDocument): string {
  const screens = project.navigation.screens || [];
  const items = screens.map(sc => {
    const pg = project.pages.find(p => p.id === sc.pageId);
    const name = pg ? deriveScreenNames(pg.name, (pg as any).route).fileName : sc.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const iconProp = sc.icon ? `, drawerIcon: ({ color, size }) => <Ionicons name={"${sc.icon}" as any} size={size} color={color} />` : "";
    return `        <Drawer.Screen name="${name}" options={{ title: "${sc.name}"${iconProp} }} />`;
  }).join("\n");

  return `import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function DrawerLayout() {
  return (
    <Drawer>
${items}
    </Drawer>
  );
}
`;
}

function generateServiceConfig(service: ProjectDocument["services"][0]): string {
  const cfg = service.config as Record<string, any>;
  const baseUrl = cfg.baseUrl || "";
  const apiKey = cfg.apiKey || "";
  const headers = cfg.headers ? JSON.stringify(cfg.headers, null, 2) : "{}";

  if (service.type === "supabase") {
    return `import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = ${JSON.stringify(baseUrl)};
const SUPABASE_KEY = ${JSON.stringify(apiKey)};

export const ${service.id} = createClient(SUPABASE_URL, SUPABASE_KEY);
`;
  }

  if (service.type === "firebase") {
    return `import { initializeApp } from "firebase/app";

const firebaseConfig = ${JSON.stringify(cfg, null, 2)};

export const ${service.id} = initializeApp(firebaseConfig);
`;
  }

  return `const BASE_URL = ${JSON.stringify(baseUrl)};
const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  ${apiKey ? `"Authorization": "Bearer " + ${JSON.stringify(apiKey)},` : ""}
  ...${headers},
};

async function request<T = any>(method: string, path: string, body?: any): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: DEFAULT_HEADERS,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error(\`\${method} \${path} failed: \${res.status}\`);
  return res.json();
}

export const ${service.id} = {
  get: <T = any>(path: string, body?: any) => request<T>("GET", path, body),
  post: <T = any>(path: string, body?: any) => request<T>("POST", path, body),
  put: <T = any>(path: string, body?: any) => request<T>("PUT", path, body),
  patch: <T = any>(path: string, body?: any) => request<T>("PATCH", path, body),
  del: <T = any>(path: string, body?: any) => request<T>("DELETE", path, body),
};
`;
}

function generateQueryController(query: DataQuery, project: ProjectDocument): string {
  const svc = project.services.find(s => s.id === query.serviceId);
  const svcName = svc?.id || query.serviceId;
  const qName = normalizeQueryName(query.name);
  const hookName = `use${cap(qName)}`;
  const transform = query.transform ? `.then((d: any) => d.${query.transform})` : "";

  return `/**
 * Controller: ${qName}
 * Service: ${svcName} — ${query.method} ${query.path}
 *
 * Auto-generated by Flipova Studio. Do not edit manually.
 */
import { useState, useEffect, useCallback } from "react";
import { ${svcName} } from "../services/${svcName}";

export interface ${cap(qName)}State<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Call with optional body override for POST/PUT/PATCH queries */
  refetch: (body?: Record<string, any>) => Promise<T | null>;
}

export function ${hookName}<T = any>(): ${cap(qName)}State<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(${query.autoFetch !== false});
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (body?: Record<string, any>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await ${svcName}.${query.method === "GET" ? "get" : query.method === "DELETE" ? "del" : query.method.toLowerCase()}<T>(${JSON.stringify(query.path)}, body)${transform};
      setData(result);
      return result;
    } catch (e: any) {
      setError(e.message || "Request failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  ${query.autoFetch !== false ? "useEffect(() => { refetch(); }, [refetch]);" : ""}

  return { data, loading, error, refetch };
}
`;
}

function generateAuthProvider(auth: any, project: ProjectDocument): string {
  if (auth.provider === "supabase") {
    return `import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { ${auth.serviceId || "supabase"} } from "../../services/${auth.serviceId || "supabase"}";

interface AuthCtx { user: any; session: any; loading: boolean; signIn: (email: string, password: string) => Promise<void>; signUp: (email: string, password: string) => Promise<void>; signOut: () => Promise<void>; }
const Ctx = createContext<AuthCtx | null>(null);
export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error("useAuth outside AuthProvider"); return c; };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    ${auth.serviceId || "supabase"}.auth.getSession().then(({ data }) => { setSession(data.session); setUser(data.session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = ${auth.serviceId || "supabase"}.auth.onAuthStateChange((_event, session) => { setSession(session); setUser(session?.user ?? null); });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "(auth)";
    if (!user && !inAuth) router.replace("/${auth.loginScreen || "login"}");
    else if (user && inAuth) router.replace("/${auth.redirectAfterLogin || ""}");
  }, [user, segments, loading]);

  const signIn = async (email: string, password: string) => { await ${auth.serviceId || "supabase"}.auth.signInWithPassword({ email, password }); };
  const signUp = async (email: string, password: string) => { await ${auth.serviceId || "supabase"}.auth.signUp({ email, password }); };
  const signOut = async () => { await ${auth.serviceId || "supabase"}.auth.signOut(); };

  return <Ctx.Provider value={{ user, session, loading, signIn, signUp, signOut }}>{children}</Ctx.Provider>;
};
`;
  }

  return `import React, { createContext, useContext, useState } from "react";
import { useRouter, useSegments } from "expo-router";

interface AuthCtx { user: any; loading: boolean; signIn: (email: string, password: string) => Promise<void>; signOut: () => Promise<void>; }
const Ctx = createContext<AuthCtx | null>(null);
export const useAuth = () => { const c = useContext(Ctx); if (!c) throw new Error("useAuth outside AuthProvider"); return c; };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => { /* TODO: implement */ setUser({ email }); };
  const signOut = async () => { setUser(null); };

  return <Ctx.Provider value={{ user, loading, signIn, signOut }}>{children}</Ctx.Provider>;
};
`;
}

function generateUseAuth(auth: any): string {
  return `export { useAuth } from "../app/providers/AuthProvider";
`;
}

function generateEasConfig(): string {
  return JSON.stringify({
    cli: { version: ">= 12.0.0" },
    build: {
      development: { developmentClient: true, distribution: "internal" },
      preview: { distribution: "internal" },
      production: {},
    },
    submit: {
      production: {},
    },
  }, null, 2);
}

function generateGithubWorkflow(project: ProjectDocument): string {
  return `name: Build & Deploy
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx expo export --platform web
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: \${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --non-interactive --no-wait
        if: github.ref == 'refs/heads/main'
`;
}

function generatePageTest(page: ProjectDocument["pages"][0]): string {
  const { componentName } = deriveScreenNames(page.name, (page as any).route);

  return `import React from "react";
import { render } from "@testing-library/react-native";
import ${componentName} from "../src/screens/${componentName}";

describe("${componentName}", () => {
  it("renders without crashing", () => {
    const { toJSON } = render(<${componentName} />);
    expect(toJSON()).toBeTruthy();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<${componentName} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
`;
}

function generateStorageHook(): string {
  return `import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useStorage<T = string>(key: string, defaultValue: T): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(key).then(stored => {
      if (stored !== null) {
        try { setValue(JSON.parse(stored)); } catch { setValue(stored as unknown as T); }
      }
      setLoading(false);
    });
  }, [key]);

  const set = useCallback(async (newValue: T) => {
    setValue(newValue);
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
  }, [key]);

  return [value, set, loading];
}

export function useSecureStorage<T = string>(key: string, defaultValue: T): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("expo-secure-store").then(SecureStore => {
      SecureStore.getItemAsync(key).then(stored => {
        if (stored !== null) {
          try { setValue(JSON.parse(stored)); } catch { setValue(stored as unknown as T); }
        }
        setLoading(false);
      });
    });
  }, [key]);

  const set = useCallback(async (newValue: T) => {
    setValue(newValue);
    const SecureStore = await import("expo-secure-store");
    await SecureStore.setItemAsync(key, JSON.stringify(newValue));
  }, [key]);

  return [value, set, loading];
}
`;
}

function generateAuthGroupLayout(): string {
  return `import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
`;
}

function generateProtectedGroupLayout(group: any): string {
  const redirect = group.redirectTo || "login";
  return `import React from "react";
import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect href="/${redirect}" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
`;
}

function generateConstants(constants: any[]): string {
  const lines = constants.map((c: any) => `export const ${c.key} = ${JSON.stringify(c.value)};`);
  return lines.join("\n") + "\n";
}

function generateGlobalStateProvider(state: any[]): string {
  const stateLines = state.map((s: any) => {
    const def = s.default !== undefined ? JSON.stringify(s.default) : s.type === 'string' ? '""' : s.type === 'number' ? '0' : s.type === 'boolean' ? 'false' : s.type === 'array' ? '[]' : '{}';
    return `  const [${s.name}, set${cap(s.name)}] = useState(${def});`;
  });
  const ctxFields = state.map((s: any) => `${s.name}, set${cap(s.name)}`).join(', ');

  return `import React, { createContext, useContext, useState } from "react";

interface GlobalState {
${state.map((s: any) => `  ${s.name}: ${s.type === 'array' ? 'any[]' : s.type === 'object' ? 'Record<string, any>' : s.type};`).join('\n')}
${state.map((s: any) => `  set${cap(s.name)}: (v: any) => void;`).join('\n')}
}

const Ctx = createContext<GlobalState | null>(null);
export const useGlobalState = () => { const c = useContext(Ctx); if (!c) throw new Error("useGlobalState outside provider"); return c; };

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
${stateLines.join('\n')}
  return <Ctx.Provider value={{ ${ctxFields} }}>{children}</Ctx.Provider>;
};
`;
}
