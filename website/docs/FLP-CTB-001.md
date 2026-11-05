---
id: "FLP-CTB-001"
title: "Contribuer à Foundation"
sidebar_label: "Contribuer à Foundation"
---

<!-- Généré par « corral docs docusaurus » depuis documentation/v1.0/FLP-CTB-001_33_Contribuer_v1.0.md — ne pas modifier ici, modifier le document source. -->

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | Contribuer à Foundation |
| **Version**            | 1.0 |
| **Date de mise à jour** | 05/11/2026 |

## 1. Bienvenue

Les contributions sont bienvenues : correctifs, nouveaux composants ou adaptateurs, documentation, retours d'usage.

## 2. Préparer l'environnement

```bash
git clone https://github.com/flipova/foundation.git
cd foundation
npm install --no-package-lock --ignore-scripts
npm test
```

Prérequis : Node.js 20 ou supérieur et npm.

## 3. Organisation du code

| **Dossier** | **Contenu** |
|-------------|-------------|
| `components/theme/` | Thème généré à partir des registres. |
| `components/contract/` | Types et recettes (fonctions pures). |
| `components/providers/` | Cœur des fournisseurs, `rn-base/`, flipova, gluestack, reusables, paper, tamagui. |
| `components/ui/` | Composants unifiés. |
| `design/` | Registres XML, schéma et outillage (`tools/`). |
| `scripts/` | Contrôle des frontières entre couches et gardes de cohérence. |

## 4. Conventions

- Branches : une branche de travail par modification ; les canaux dev, alpha, beta et rc ne reçoivent que le canal précédent.
- Messages de commit : un résumé court à l'impératif, détaillé si utile.
- Style de code et vérifications : `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run boundary`.
- Tests : `npm test` doit passer ; un nouveau composant ajoute son type, sa recette et son implémentation flipova, puis régénère `COMPONENTS.md` avec `npm run components:doc`.

## 5. Proposer une modification

1. Ouvrez un ticket ou choisissez-en un existant.
2. Créez une branche de travail.
3. Ouvrez une demande de fusion décrivant le changement.
4. Passez les vérifications automatiques (qualité sur Node 20 et 22, sécurité) et la relecture.

## 6. Signaler un problème

Indiquez la version, le système, les étapes pour reproduire, le résultat attendu et le résultat obtenu.

Tickets : https://github.com/flipova/foundation/issues

## 7. Licence et conduite

Les contributions sont publiées sous la licence du projet : MIT.

Le code de conduite du dépôt (`CODE_OF_CONDUCT.md`) s'applique à tous les échanges.
