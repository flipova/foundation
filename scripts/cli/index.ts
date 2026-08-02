#!/usr/bin/env node
import prompts from 'prompts';
import { registryCli } from './registry';
import { themeCli } from './theme';
import { buildTokens } from '../generators/tokens';
import { buildDocs } from '../generators/docs';
import * as path from 'path';

const FOUNDATION_DIR = path.resolve(__dirname, '../../foundation');
const TOKENS_YAML = path.resolve(__dirname, '../../foundation/tokens/tokens.yaml');
const TOKENS_OUT = path.resolve(__dirname, '../../foundation/tokens/generated.ts');

async function main() {
    const args = process.argv.slice(2);
    
    // Command line routing
    if (args.length > 0) {
        const [domain, action] = args;
        
        if (domain === 'registry') {
            await registryCli(action);
            return;
        }
        
        if (domain === 'theme' || domain === 'themes') {
            await themeCli(action);
            return;
        }

        if (domain === 'tokens' && action === 'generate') {
            console.log('Generation des tokens TypeScript...');
            buildTokens(TOKENS_YAML, TOKENS_OUT);
            console.log('Tokens generes avec succes !');
            return;
        }

        if (domain === 'docs' || domain === 'documentation') {
            const outDir = path.resolve(process.cwd(), action || 'docs');
            console.log(`Génération de la documentation MDX dans ${outDir}...`);
            const res = buildDocs(FOUNDATION_DIR, outDir);
            console.log(`Documentation MDX générée avec succès (${res.totalFiles} fichiers) !`);
            return;
        }
    }

    // Interactive Menu
    console.log('\nWelcome to Flipova Foundation CLI\n');

    const { target } = await prompts({
        type: 'select',
        name: 'target',
        message: 'Que souhaitez-vous gérer ?',
        choices: [
            { title: 'Themes (Couleurs, Modes clair/sombre)', value: 'theme' },
            { title: 'Registre (Composants, Primitives, Layouts)', value: 'registry' },
            { title: 'Générer les Tokens (depuis tokens.yaml)', value: 'tokens' },
            { title: 'Générer la documentation MDX (miroir agnostique de foundation)', value: 'docs' },
            { title: 'Quitter', value: 'exit' }
        ]
    });

    if (!target || target === 'exit') {
        console.log('À bientôt !');
        process.exit(0);
    }

    if (target === 'theme') {
        await themeCli();
    } else if (target === 'registry') {
        await registryCli();
    } else if (target === 'tokens') {
        console.log('Generation des tokens TypeScript...');
        try {
            buildTokens(TOKENS_YAML, TOKENS_OUT);
            console.log('Termine avec succes !');
        } catch (e) {
            const error = e as Error;
            console.error('Echec de la generation :', error.message);
        }
    } else if (target === 'docs') {
        const { outDir } = await prompts({
            type: 'text',
            name: 'outDir',
            message: 'Dossier de destination pour la documentation MDX :',
            initial: 'docs'
        });
        if (outDir) {
            const targetPath = path.resolve(process.cwd(), outDir);
            console.log(`Génération de la documentation MDX dans ${targetPath}...`);
            try {
                const res = buildDocs(FOUNDATION_DIR, targetPath);
                console.log(`Documentation MDX générée avec succès (${res.totalFiles} fichiers) !`);
            } catch (e) {
                const error = e as Error;
                console.error('Échec de la génération :', error.message);
            }
        }
    }
}

// Only run if called directly
if (require.main === module) {
    main().catch(console.error);
}
