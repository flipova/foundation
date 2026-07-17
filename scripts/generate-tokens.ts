import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const TOKENS_YAML = path.resolve(__dirname, '../foundation/tokens/tokens.yaml');
const TOKENS_OUTPUT = path.resolve(__dirname, '../foundation/tokens/generated.ts');

function main() {
    console.log('Generating tokens...');
    
    if (!fs.existsSync(TOKENS_YAML)) {
        console.error(`File not found: ${TOKENS_YAML}`);
        process.exit(1);
    }
    
    const tokensData = yaml.load(fs.readFileSync(TOKENS_YAML, 'utf8')) as Record<string, any>;
    
    let output = `// ==============================================================================
// FICHIER GENERÉ AUTOMATIQUEMENT - NE PAS MODIFIER MANUELLEMENT
// Modifiez foundation/tokens/tokens.yaml et relancez \`npm run ds\`
// ==============================================================================

`;

    // Write constants
    for (const [key, value] of Object.entries(tokensData)) {
        output += `export const ${key} = ${JSON.stringify(value, null, 2)} as const;\n\n`;
    }

    // Write types for flat/nested tokens
    output += `// --- Types générés automatiquement ---\n\n`;
    output += `export type ColorToken = keyof typeof colors;\n`;
    output += `export type SpacingToken = keyof typeof spacing;\n`;
    output += `export type RadiusToken = keyof typeof radii;\n`;
    output += `export type ShadowToken = keyof typeof shadows;\n`;
    output += `export type Breakpoint = keyof typeof breakpoints;\n`;
    output += `export type OpacityToken = keyof typeof opacity;\n`;
    output += `export type ZIndexToken = keyof typeof zIndex;\n\n`;

    output += `export type FontSizeToken = keyof typeof typography.fontSizes;\n`;
    output += `export type FontWeightToken = keyof typeof typography.fontWeights;\n`;
    output += `export type LineHeightToken = keyof typeof typography.lineHeights;\n`;
    output += `export type LetterSpacingToken = keyof typeof typography.letterSpacings;\n\n`;

    output += `export type DurationToken = keyof typeof motion.durations;\n`;
    output += `export type EasingToken = keyof typeof motion.easings;\n`;

    fs.writeFileSync(TOKENS_OUTPUT, output);
    console.log(`Successfully generated tokens/generated.ts.`);
}

main();
