/**
 * Project Generator
 *
 * Generates a full React Native project structure from a ProjectDocument.
 * Outputs: screens, navigation, theme config, service configs.
 */

import type { ProjectDocument, NavigationConfig } from "../tree/types";
import { generatePageCode } from "./generator";

export interface GeneratedFile {
  path: string;
  content: string;
}

export function generateProject(project: ProjectDocument): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  for (const page of project.pages) {
    const fileName = page.name.replace(/[^a-zA-Z0-9]/g, "") + "Screen";
    files.push({
      path: `screens/${fileName}.tsx`,
      content: generatePageCode(page),
    });
  }

  files.push({
    path: "navigation/index.tsx",
    content: generateNavigation(project.navigation, project.pages),
  });

  files.push({
    path: "theme/index.ts",
    content: generateThemeConfig(project.theme),
  });

  for (const service of project.services) {
    files.push({
      path: `services/${service.id}.ts`,
      content: generateServiceConfig(service),
    });
  }

  files.push({
    path: "App.tsx",
    content: generateAppEntry(project),
  });

  return files;
}

function generateNavigation(nav: NavigationConfig, pages: ProjectDocument["pages"]): string {
  const screenImports = pages.map((p) => {
    const name = p.name.replace(/[^a-zA-Z0-9]/g, "") + "Screen";
    return `import ${name} from "../screens/${name}";`;
  }).join("\n");

  const screens = nav.screens.map((s) => {
    const component = s.name.replace(/[^a-zA-Z0-9]/g, "") + "Screen";
    return `      <Stack.Screen name="${s.name}" component={${component}} />`;
  }).join("\n");

  return `import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
${screenImports}

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator>
${screens}
    </Stack.Navigator>
  );
}
`;
}

function generateThemeConfig(themeName: string): string {
  return `import { ThemeProvider } from "@flipova/foundation";

export const defaultTheme = "${themeName}";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="${themeName}">
      {children}
    </ThemeProvider>
  );
}
`;
}

function generateServiceConfig(service: ProjectDocument["services"][0]): string {
  const configStr = JSON.stringify(service.config, null, 2);
  return `// Service: ${service.name} (${service.type})

export const ${service.id}Config = ${configStr};
`;
}

function generateAppEntry(project: ProjectDocument): string {
  return `import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AppThemeProvider } from "./theme";
import Navigation from "./navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
`;
}
