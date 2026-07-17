import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const THEMES_YAML = path.resolve(__dirname, '../foundation/theme/themes.yaml');
const THEMES_OUTPUT = path.resolve(__dirname, '../foundation/theme/generated.ts');

function main() {
    console.log('Generating themes...');
    
    if (!fs.existsSync(THEMES_YAML)) {
        console.error(`File not found: ${THEMES_YAML}`);
        process.exit(1);
    }
    
    const themesData = yaml.load(fs.readFileSync(THEMES_YAML, 'utf8')) as Record<string, any>;
    
    let output = `// ==============================================================================
// FICHIER GENERÉ AUTOMATIQUEMENT - NE PAS MODIFIER MANUELLEMENT
// Modifiez foundation/theme/themes.yaml et relancez \`npm run theme:generate\`
// ==============================================================================

import { colors } from "../tokens";
import { createTheme } from "./createTheme";
import type { ColorScheme } from "./types";

export const themes = {
`;

    // Helper to resolve string path to colors object
    const colorMapper = (val: any): string => {
        if (typeof val === 'string') {
            // e.g. "warning.500" -> "colors.warning['500']"
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

    fs.writeFileSync(THEMES_OUTPUT, output);
    console.log(`Successfully generated theme/generated.ts with ${Object.keys(themesData).length} themes.`);
}

main();
