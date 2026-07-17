import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import prompts from 'prompts';
import { execSync } from 'child_process';

const REGISTRY_PATH = path.resolve(__dirname, '../foundation/registry/registry.yaml');

type RegistryEntry = Record<string, unknown>;

async function main() {
    console.log('\n✨ Welcome to Flipova Foundation CLI ✨\n');

    const args = process.argv.slice(2);
    let command = args[0];

    // Load existing registry
    let registryData: Record<string, RegistryEntry> = {};
    if (fs.existsSync(REGISTRY_PATH)) {
        registryData = yaml.load(fs.readFileSync(REGISTRY_PATH, 'utf8')) as Record<string, RegistryEntry>;
    }

    if (!command) {
        const { selectedCmd } = await prompts({
            type: 'select',
            name: 'selectedCmd',
            message: 'Que souhaitez-vous faire avec le registre ?',
            choices: [
                { title: '➕ Ajouter un nouvel élément', value: 'add' },
                { title: '🗑️ Supprimer un élément existant', value: 'remove' }
            ]
        });
        command = selectedCmd;
    }

    if (command === 'remove') {
        const choices = Object.keys(registryData).map(key => ({
            title: `${key} (${registryData[key]?.type})`,
            value: key
        }));

        if (choices.length === 0) {
            console.log('Le registre est vide.');
            return;
        }

        const response = await prompts([
            {
                type: 'autocomplete',
                name: 'id',
                message: 'Sélectionnez l\'élément à supprimer :',
                choices
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: (prev) => `Êtes-vous SÛR de vouloir supprimer "${prev}" ? (Cette action est irréversible)`,
                initial: false
            }
        ]);

        if (!response.confirm || !response.id) {
            console.log('Opération annulée.');
            process.exit(0);
        }

        delete registryData[response.id];
        saveAndRegenerate(registryData, `Élément "${response.id}" supprimé avec succès !`);
        return;
    }

    if (command === 'add') {
        console.log('\n--- Ajout d\'un nouvel élément au registre ---');
        
        const response = await prompts([
            {
                type: 'text',
                name: 'id',
                message: 'Identifiant unique (ex: "MyButton", "Card") :',
                validate: (value: string) => value.trim().length > 0 ? true : 'L\'identifiant est requis'
            },
            {
                type: 'select',
                name: 'type',
                message: 'Quel est le type de cet élément ?',
                choices: [
                    { title: '🧩 Component (Boutons, Inputs, etc.)', value: 'component' },
                    { title: '🧱 Layout (Containers, Grilles, etc.)', value: 'layout' },
                    { title: '🪨 Primitive (Box, Text, etc.)', value: 'primitive' },
                    { title: '📦 Block (Composants complexes assemblés)', value: 'block' }
                ],
                initial: 0
            },
            {
                type: 'text',
                name: 'label',
                message: 'Nom lisible (ex: "Mon Super Bouton") :',
                initial: (prev: string) => prev.replace(/([A-Z])/g, ' $1').trim()
            },
            {
                type: 'text',
                name: 'description',
                message: 'Courte description du composant :'
            },
            {
                type: 'autocomplete',
                name: 'category',
                message: 'Catégorie fonctionnelle :',
                choices: [
                    { title: 'display (Affichage)', value: 'display' },
                    { title: 'action (Interaction)', value: 'action' },
                    { title: 'input (Saisie de données)', value: 'input' },
                    { title: 'layout (Mise en page)', value: 'layout' },
                    { title: 'navigation (Navigation)', value: 'navigation' },
                    { title: 'feedback (Retours utilisateurs)', value: 'feedback' },
                    { title: 'typography (Textes)', value: 'typography' }
                ]
            }
        ]);

        if (!response.id) {
            console.log('Opération annulée.');
            process.exit(0);
        }

        const newId = response.id.trim();
        if (registryData[newId]) {
            console.error(`\n❌ Erreur : L'élément "${newId}" existe déjà dans le registre.`);
            process.exit(1);
        }

        const newEntry = {
            type: response.type,
            id: newId,
            label: response.label,
            description: response.description,
            category: response.category,
            tags: [response.category, response.type],
            themeMapping: {},
            slots: [],
            props: []
        };

        // Append to registry
        registryData[newId] = newEntry;
        saveAndRegenerate(registryData, `L'élément "${newId}" a été ajouté au registre avec succès !`);
        
        console.log(`\n💡 Astuce : Allez dans 'foundation/registry/registry.yaml' pour configurer les propriétés, variantes et thèmes de votre nouvel élément.`);
    }
}

function saveAndRegenerate(registryData: Record<string, RegistryEntry>, successMessage: string) {
    const yamlContent = yaml.dump(registryData, {
        noRefs: true,
        sortKeys: false,
        lineWidth: -1
    });

    fs.writeFileSync(REGISTRY_PATH, yamlContent);
    console.log(`\n✅ ${successMessage}`);

    console.log('🔄 Génération des définitions TypeScript en cours...');
    try {
        execSync('npx tsx scripts/generate-registry.ts', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
        console.log('✨ Terminé avec succès !');
    } catch (e) {
        const error = e as Error;
        console.error('❌ Échec lors de la génération TypeScript :', error.message);
        process.exit(1);
    }
}

main().catch(console.error);
