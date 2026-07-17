import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import prompts from 'prompts';
import { execSync } from 'child_process';

const THEMES_PATH = path.resolve(__dirname, '../foundation/theme/themes.yaml');

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    let themesData: Record<string, any> = {};
    if (fs.existsSync(THEMES_PATH)) {
        themesData = yaml.load(fs.readFileSync(THEMES_PATH, 'utf8')) as Record<string, any>;
    }

    if (command === 'remove') {
        console.log('--- Theme Removal ---');
        const choices = Object.keys(themesData).map(key => ({
            title: key,
            value: key
        }));

        if (choices.length === 0) {
            console.log('No themes to remove.');
            return;
        }

        const response = await prompts([
            {
                type: 'autocomplete',
                name: 'id',
                message: 'Select the theme to remove:',
                choices
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: (prev: string) => `Are you sure you want to remove theme "${prev}"?`,
                initial: false
            }
        ]);

        if (!response.confirm || !response.id) {
            console.log('Operation cancelled.');
            process.exit(0);
        }

        delete themesData[response.id];
        saveAndRegenerate(themesData, `Removed theme "${response.id}" from themes.yaml`);
        return;
    }

    if (command === 'add' || !command) {
        console.log('--- Theme Addition ---');
        
        const response = await prompts([
            {
                type: 'text',
                name: 'id',
                message: 'Theme name (lowercase, e.g. "ocean", "dracula"):',
                validate: (value: string) => value.length > 0 ? true : 'Name is required'
            },
            {
                type: 'select',
                name: 'base',
                message: 'Base theme to copy colors from?',
                choices: Object.keys(themesData).map(key => ({ title: key, value: key })),
                initial: 0
            }
        ]);

        if (!response.id || !response.base) {
            console.log('Operation cancelled.');
            process.exit(0);
        }

        const newId = response.id.toLowerCase();
        if (themesData[newId]) {
            console.error(`Error: Theme "${newId}" already exists.`);
            process.exit(1);
        }

        // Clone base theme
        themesData[newId] = JSON.parse(JSON.stringify(themesData[response.base]));
        saveAndRegenerate(themesData, `Added theme "${newId}" to themes.yaml`);
    }
}

function saveAndRegenerate(themesData: Record<string, any>, successMessage: string) {
    const yamlContent = yaml.dump(themesData, {
        noRefs: true,
        sortKeys: false,
        lineWidth: -1
    });

    fs.writeFileSync(THEMES_PATH, yamlContent);
    console.log(`\nSuccess! ${successMessage}`);

    console.log('Regenerating TypeScript definitions...');
    try {
        execSync('npx tsx scripts/generate-themes.ts', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
        console.log('Done!');
    } catch (e) {
        const error = e as Error;
        console.error('Failed to regenerate TypeScript files:', error.message);
        process.exit(1);
    }
}

main().catch(console.error);
