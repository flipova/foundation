import * as fs from 'fs';
import * as yaml from 'js-yaml';

export function buildThemes(inputFile: string, outputFile: string) {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`File not found: ${inputFile}`);
  }
  
  const themesData = yaml.load(fs.readFileSync(inputFile, 'utf8')) as Record<string, any>;
  
  const fileHeader = `// ==============================================================================
// AUTOMATICALLY GENERATED FILE - DO NOT MODIFY MANUALLY
// Edit foundation/theme/themes.yaml and run \`npm run theme:generate\`
// ==============================================================================
`;
  
  let output = `${fileHeader}
import { colors } from "../tokens";
import { createTheme } from "./createTheme";
import type { ColorScheme } from "./types";

export const themes = {
`;

  // Helper to resolve string path to colors object
  const colorMapper = (val: any): string => {
    if (typeof val === 'string') {
      const parts = val.split('.');
      if (parts.length > 1) {
        return `colors.${parts[0]}['${parts[1]}']`;
      }
      return `colors.${val}`;
    }
    if (Array.isArray(val)) {
      return `[${val.map(v => colorMapper(v)).join(', ')}]`;
    }
    if (typeof val === 'object' && val !== null) {
      return `{
${Object.entries(val).map(([k, v]) => `        ${k}: ${colorMapper(v)},`).join('\n')}
      }`;
    }
    return JSON.stringify(val);
  };

  for (const [themeName, themeConfig] of Object.entries(themesData)) {
    output += `  ${themeName}: createTheme({\n`;
    
    for (const [key, value] of Object.entries(themeConfig)) {
      if (key === 'gradients' && typeof value === 'object' && value !== null) {
        output += `    gradients: {\n`;
        for (const [gradKey, gradValue] of Object.entries(value)) {
          output += `      ${gradKey}: ${colorMapper(gradValue)},\n`;
        }
        output += `    },\n`;
      } else {
        output += `    ${key}: ${colorMapper(value)},\n`;
      }
    }
    
    output += `  }),\n`;
  }

  output += `} as const;\n\n`;
  output += `export type ThemeName = keyof typeof themes;\n`;

  fs.writeFileSync(outputFile, output);
  
  return themesData;
}
