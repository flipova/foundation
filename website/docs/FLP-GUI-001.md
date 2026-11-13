---
id: "FLP-GUI-001"
title: "Guides pratiques"
sidebar_label: "Guides pratiques"
---

<!-- Généré par « corral docs docusaurus » depuis documentation/v1.1/FLP-GUI-001_29_Guides_Pratiques_v1.1.md — ne pas modifier ici, modifier le document source. -->

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | Guides pratiques |
| **Version**            | 1.1 |
| **Date de mise à jour** | 12/11/2026 |

## 1. Introduction

Ces guides supposent que l'installation du guide de démarrage est faite (registres adoptés, `gen` exécuté, fournisseur monté).

| **Je veux…** | **Aller à** |
|--------------|-------------|
| Changer de bibliothèque de composants | Choisir un fournisseur |
| Modifier couleurs, échelles ou thèmes | Éditer le thème avec l'interface graphique |
| Savoir quels composants sont natifs | Vérifier la couverture d'un fournisseur |

## 2. Choisir un fournisseur

**Objectif** : faire dessiner vos composants par une autre bibliothèque sans toucher aux écrans.

**Prérequis** : la dépendance facultative du fournisseur visé est installée (par exemple `react-native-paper`).

1. Importez l'adaptateur depuis son sous-chemin : `import { paper } from '@flipova/foundation/providers/paper';`
2. Passez-le au fournisseur : `<FlipovaProvider adapter={paper} theme={designTheme}>`.
3. Pour viser une bibliothèque sans passer par le contrat, importez directement son sous-chemin, par exemple `@flipova/foundation/providers/gluestack/ui`.

**Résultat** : les composants sont ceux de la bibliothèque choisie ; ceux qu'elle n'a pas sont servis par flipova.

## 3. Éditer le thème avec l'interface graphique

**Objectif** : modifier couleurs, échelles et thèmes sans éditer le XML à la main.

**Prérequis** : registres adoptés (`npx flipova-design adopt`).

1. Lancez l'éditeur : `npx flipova-design gui` (option `--port N` pour fixer le port, `--no-open` pour ne pas ouvrir le navigateur).
2. Modifiez dans les onglets Couleurs, Échelles ou Thèmes ; les changements restent dans une copie de travail.
3. Cliquez sur Valider (mêmes contrôles que l'intégration continue, sur une copie temporaire), puis sur Enregistrer.

**Résultat** : les registres XML sont écrits et les fichiers du dossier `theme/` sont régénérés. Annuler abandonne la copie de travail.

## 4. Vérifier la couverture d'un fournisseur

**Objectif** : savoir quels composants une bibliothèque fournit nativement.

1. Dans le code : `import { coverageOf } from '@flipova/foundation/ui';` puis `coverageOf(paper)`.
2. Sans code : consultez le tableau généré `COMPONENTS.md` du dépôt.

**Résultat** : la liste des composants natifs et de ceux servis par flipova, pour le fournisseur choisi.

## 5. Pour aller plus loin

- Concepts et fonctionnement : pourquoi un composant peut venir de flipova.
- Référence : toutes les commandes et tous les sous-chemins.
- Dépannage et FAQ : messages d'erreur courants.
