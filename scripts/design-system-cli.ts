import prompts from 'prompts';
import { execSync } from 'child_process';
import * as path from 'path';

async function main() {
    console.log('\n=============================================');
    console.log('✨ FLIPOVA DESIGN SYSTEM DASHBOARD ✨');
    console.log('=============================================\n');

    let exit = false;

    while (!exit) {
        const { action } = await prompts({
            type: 'select',
            name: 'action',
            message: 'Que souhaitez-vous explorer ou modifier ?',
            choices: [
                { title: '🎨 Gérer les Tokens (Couleurs, Typographie...)', value: 'tokens' },
                { title: '🎭 Gérer les Thèmes (Clair, Sombre, Custom...)', value: 'themes' },
                { title: '🧩 Gérer le Registre (Composants UI)', value: 'registry' },
                { title: '❌ Quitter', value: 'exit' }
            ]
        });

        if (action === 'exit' || !action) {
            console.log('👋 À bientôt !');
            exit = true;
            break;
        }

        if (action === 'tokens') {
            await handleTokens();
        } else if (action === 'themes') {
            await handleThemes();
        } else if (action === 'registry') {
            await handleRegistry();
        }
    }
}

async function handleTokens() {
    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: '--- 🎨 GESTION DES TOKENS ---',
        choices: [
            { title: '👀 Explorer les tokens existants (Ouvre tokens.yaml)', value: 'explore' },
            { title: '🔄 Re-générer les types TypeScript (tokens/generated.ts)', value: 'generate' },
            { title: '🔙 Retour au menu principal', value: 'back' }
        ]
    });

    if (action === 'explore') {
        console.log('\nℹ️ Pour modifier les tokens, éditez directement le fichier `foundation/tokens/tokens.yaml` et relancez la génération.');
        try {
            // Tentative d'ouvrir le fichier dans l'éditeur par défaut
            execSync('code foundation/tokens/tokens.yaml || notepad foundation/tokens/tokens.yaml', { stdio: 'ignore' });
        } catch (e) {
            console.log('Fichier situé à : foundation/tokens/tokens.yaml');
        }
    } else if (action === 'generate') {
        runScript('npm run tokens:generate');
    }
}

async function handleThemes() {
    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: '--- 🎭 GESTION DES THÈMES ---',
        choices: [
            { title: '➕ Ajouter un nouveau thème', value: 'add' },
            { title: '🗑️ Supprimer un thème existant', value: 'remove' },
            { title: '🔄 Re-générer les thèmes TypeScript', value: 'generate' },
            { title: '🔙 Retour au menu principal', value: 'back' }
        ]
    });

    if (action === 'add') {
        runScript('npm run theme:add');
    } else if (action === 'remove') {
        runScript('npm run theme:remove');
    } else if (action === 'generate') {
        runScript('npm run theme:generate');
    }
}

async function handleRegistry() {
    const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: '--- 🧩 GESTION DU REGISTRE UI ---',
        choices: [
            { title: '➕ Ajouter un nouveau composant/élément', value: 'add' },
            { title: '🗑️ Supprimer un élément existant', value: 'remove' },
            { title: '🔄 Re-générer les définitions TypeScript', value: 'generate' },
            { title: '🔙 Retour au menu principal', value: 'back' }
        ]
    });

    if (action === 'add') {
        runScript('npm run registry:add');
    } else if (action === 'remove') {
        runScript('npm run registry:remove');
    } else if (action === 'generate') {
        runScript('npm run registry:generate');
    }
}

function runScript(command: string) {
    try {
        console.log(`\n⚙️  Exécution de : ${command}`);
        execSync(command, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
        console.log(`✅ Terminé avec succès !\n`);
    } catch (e) {
        console.error(`\n❌ Échec de la commande : ${command}\n`);
    }
}

main().catch(console.error);
