<!-- corral:section:start id="cover" type="cover" locked="true" order="0" after="" -->
**GUIDES PRATIQUES**

**Résoudre une tâche précise**

Recettes · Cas d’usage · Pas à pas

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | <!--auto:doc.title-->Guides pratiques<!--/auto--> |
| **Version**            | <!--auto:doc.version-->1.0<!--/auto--> |
| **Date de mise à jour** | <!--auto:doc.date-->05/11/2026<!--/auto--> |

<!-- corral:section:end id="cover" -->

<!-- corral:section:start id="sec-1" type="section" title="Introduction" level="1" order="1" after="cover" -->
# 1. Introduction

Ces guides supposent que l'installation du guide de démarrage est faite (registres adoptés, `gen` exécuté, fournisseur monté).

| **Je veux…** | **Aller à** |
|--------------|-------------|
| Changer de bibliothèque de composants | Choisir un fournisseur |
| Modifier couleurs, échelles ou thèmes | Éditer le thème avec l'interface graphique |
| Savoir quels composants sont natifs | Vérifier la couverture d'un fournisseur |
<!-- corral:section:end id="sec-1" -->

<!-- corral:section:start id="sec-2" type="section" title="Choisir un fournisseur" level="1" order="2" after="sec-1" -->
# 2. Choisir un fournisseur

**Objectif** : faire dessiner vos composants par une autre bibliothèque sans toucher aux écrans.

**Prérequis** : la dépendance facultative du fournisseur visé est installée (par exemple `react-native-paper`).

1. Importez l'adaptateur depuis son sous-chemin : `import { paper } from '@flipova/foundation/providers/paper';`
2. Passez-le au fournisseur : `<FlipovaProvider adapter={paper} theme={designTheme}>`.
3. Pour viser une bibliothèque sans passer par le contrat, importez directement son sous-chemin, par exemple `@flipova/foundation/providers/gluestack/ui`.

**Résultat** : les composants sont ceux de la bibliothèque choisie ; ceux qu'elle n'a pas sont servis par flipova.
<!-- corral:section:end id="sec-2" -->

<!-- corral:section:start id="sec-3" type="section" title="Éditer le thème avec l'interface graphique" level="1" order="3" after="sec-2" -->
# 3. Éditer le thème avec l'interface graphique

**Objectif** : modifier couleurs, échelles et thèmes sans éditer le XML à la main.

**Prérequis** : registres adoptés (`npx flipova-design adopt`).

1. Lancez l'éditeur : `npx flipova-design gui` (option `--port N` pour fixer le port, `--no-open` pour ne pas ouvrir le navigateur).
2. Modifiez dans les onglets Couleurs, Échelles ou Thèmes ; les changements restent dans une copie de travail.
3. Cliquez sur Valider (mêmes contrôles que l'intégration continue, sur une copie temporaire), puis sur Enregistrer.

**Résultat** : les registres XML sont écrits et les fichiers du dossier `theme/` sont régénérés. Annuler abandonne la copie de travail.
<!-- corral:section:end id="sec-3" -->

<!-- corral:section:start id="sec-4" type="section" title="Vérifier la couverture d'un fournisseur" level="1" order="4" after="sec-3" -->
# 4. Vérifier la couverture d'un fournisseur

**Objectif** : savoir quels composants une bibliothèque fournit nativement.

1. Dans le code : `import { coverageOf } from '@flipova/foundation/ui';` puis `coverageOf(paper)`.
2. Sans code : consultez le tableau généré `COMPONENTS.md` du dépôt.

**Résultat** : la liste des composants natifs et de ceux servis par flipova, pour le fournisseur choisi.
<!-- corral:section:end id="sec-4" -->

<!-- corral:section:start id="sec-5" type="section" title="Pour aller plus loin" level="1" order="5" after="sec-4" -->
# 5. Pour aller plus loin

- Concepts et fonctionnement : pourquoi un composant peut venir de flipova.
- Référence : toutes les commandes et tous les sous-chemins.
- Dépannage et FAQ : messages d'erreur courants.
<!-- corral:section:end id="sec-5" -->
