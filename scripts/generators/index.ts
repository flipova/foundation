import * as path from 'path';
import { buildRegistry } from './registry';
import { buildThemes } from './themes';
import { buildTokens } from './tokens';
import { buildDocs } from './docs';

const ROOT = path.resolve(__dirname, '../../');
const FOUNDATION_DIR = path.join(ROOT, 'foundation');
const UI_DIR = path.join(ROOT, 'foundation/ui/components');
const REGISTRY_OUT = path.join(ROOT, 'foundation/registry/generated.ts');

const THEMES_YAML = path.join(ROOT, 'foundation/theme/themes.yaml');
const THEMES_OUT = path.join(ROOT, 'foundation/theme/generated.ts');

const TOKENS_YAML = path.join(ROOT, 'foundation/tokens/tokens.yaml');
const TOKENS_OUT = path.join(ROOT, 'foundation/tokens/generated.ts');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'all';

  try {
    if (command === 'registry' || command === 'all') {
      console.log('Generating registry...');
      buildRegistry(UI_DIR, REGISTRY_OUT);
      console.log('Successfully generated registry');
    }

    if (command === 'themes' || command === 'theme' || command === 'all') {
      console.log('Generating themes...');
      const themes = buildThemes(THEMES_YAML, THEMES_OUT);
      console.log(`Successfully generated themes (${Object.keys(themes).length} themes)`);
    }

    if (command === 'tokens' || command === 'all') {
      console.log('Generating tokens...');
      buildTokens(TOKENS_YAML, TOKENS_OUT);
      console.log('Successfully generated tokens');
    }

    if (command === 'docs' || command === 'documentation') {
      const targetDir = args[1] ? path.resolve(process.cwd(), args[1]) : path.join(ROOT, 'docs/docs');
      console.log(`Generating MDX documentation into ${targetDir}...`);
      const res = buildDocs(FOUNDATION_DIR, targetDir);
      console.log(`Successfully generated ${res.totalFiles} MDX documentation files mirroring foundation structure!`);
    }
  } catch (error) {
    console.error('Error during generation:', error);
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  main();
}
