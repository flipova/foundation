import prompts from 'prompts';
import { registryCli } from './registry';
import { themeCli } from './theme';
import { buildTokens } from '../generators/tokens';
import * as path from 'path';

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
            console.log('🔄 Génération des tokens TypeScript...');
            buildTokens(TOKENS_YAML, TOKENS_OUT);
            console.log('✨ Tokens générés avec succès !');
            return;
        }
    }

    // Interactive Menu
    console.log('\n✨ Welcome to Flipova Foundation CLI ✨\n');

    const { target } = await prompts({
        type: 'select',
        name: 'target',
        message: 'Que souhaitez-vous gérer ?',
        choices: [
            { title: '🎨 Thèmes (Couleurs, Modes clair/sombre)', value: 'theme' },
            { title: '📚 Registre (Composants, Primitives, Layouts)', value: 'registry' },
            { title: '🔄 Générer les Tokens (depuis tokens.yaml)', value: 'tokens' },
            { title: '❌ Quitter', value: 'exit' }
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
        console.log('🔄 Génération des tokens TypeScript...');
        try {
            buildTokens(TOKENS_YAML, TOKENS_OUT);
            console.log('✨ Terminé avec succès !');
        } catch (e) {
            const error = e as Error;
            console.error('❌ Échec de la génération :', error.message);
        }
    }
}

// Only run if called directly
if (require.main === module) {
    main().catch(console.error);
}
