import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import prompts from 'prompts';
import { buildThemes } from '../generators/themes';

const THEMES_PATH = path.resolve(__dirname, '../../foundation/theme/themes.yaml');
const THEMES_OUT = path.resolve(__dirname, '../../foundation/theme/generated.ts');

export async function themeCli(command?: string) {
    let themesData: Record<string, any> = {};
    if (fs.existsSync(THEMES_PATH)) {
        themesData = yaml.load(fs.readFileSync(THEMES_PATH, 'utf8')) as Record<string, any>;
    }

    if (!command) {
        const { selectedCmd } = await prompts({
            type: 'select',
            name: 'selectedCmd',
            message: 'Que souhaitez-vous faire avec les thèmes ?',
            choices: [
                { title: 'Ajouter un nouveau theme', value: 'add' },
                { title: 'Supprimer un theme existant', value: 'remove' }
            ]
        });
        command = selectedCmd;
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
            return;
        }

        delete themesData[response.id];
        saveAndRegenerate(themesData, `Theme "${response.id}" supprime avec succes !`);
        return;
    }

    if (command === 'add') {
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
            return;
        }

        const newId = response.id.toLowerCase();
        if (themesData[newId]) {
            console.error(`Error: Theme "${newId}" already exists.`);
            return;
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
        buildThemes(THEMES_PATH, THEMES_OUT);
        console.log('Done!');
    } catch (e) {
        const error = e as Error;
        console.error('Failed to regenerate TypeScript files:', error.message);
    }
}
