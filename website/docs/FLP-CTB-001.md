---
id: "FLP-CTB-001"
title: "Contribuer à Foundation"
sidebar_label: "Contribuer à Foundation"
---

<!-- Généré par « corral docs docusaurus » depuis documentation/v1.1/FLP-CTB-001_33_Contribuer_v1.1.md — ne pas modifier ici, modifier le document source. -->

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | Contribuer à Foundation |
| **Version**            | 1.1 |
| **Date de mise à jour** | 12/11/2026 |

## 1. Bienvenue

Les contributions sont bienvenues : correctifs, nouveaux composants ou adaptateurs, documentation, retours d'usage.

## 2. Préparer l'environnement

```bash
git clone https://github.com/flipova/foundation.git
cd foundation
npm install --no-package-lock --ignore-scripts
npm test
```

Prérequis : Node.js 22 ou supérieur et npm.

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

- Branches : une branche de travail par modification ; on fusionne dans main ; une version est un tag (alpha, beta, rc puis stable sur le même commit), voir DOCS.md, sections 7 et 8.
- Messages de commit : un résumé court à l'impératif, détaillé si utile.
- Style de code et vérifications : `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run boundary`.
- Tests : `npm test` doit passer ; un nouveau composant ajoute son type, sa recette et son implémentation flipova, puis régénère `COMPONENTS.md` avec `npm run components:doc`.

## 5. Proposer une modification

1. Ouvrez un ticket ou choisissez-en un existant.
2. Créez une branche de travail.
3. Ouvrez une demande de fusion décrivant le changement.
4. Passez les vérifications automatiques (le contrat `ci/ci.yml`, section 8, sur Node 22) et la relecture.

## 6. Signaler un problème

Indiquez la version, le système, les étapes pour reproduire, le résultat attendu et le résultat obtenu.

Tickets : https://github.com/flipova/foundation/issues

## 7. Licence et conduite

Les contributions sont publiées sous la licence du projet : MIT.

Le code de conduite du dépôt (`CODE_OF_CONDUCT.md`) s'applique à tous les échanges.

## 8. Intégration continue et livraison

Le pipeline `.github/workflows/release.yml` est généré par Corral depuis le contrat `ci/ci.yml` (`corral ci sync` après une modification, `corral ci check` pour vérifier ; référence complète : `ci/CI.md`). Il ne dépend d'aucun dépôt privé, donc n'a pas besoin du jeton `ORG_READ_TOKEN` de l'écosystème (FLP-ECO-001 du dépôt `flipova.backend`).

| **Événement** | **Ce qui s'exécute** |
|---------------|----------------------|
| Pull request vers `main` | intégrité du modèle, puis `npm ci`, format, lint (dont `design:check`, `design:verify`, `design:lint`), typecheck, `design:gen:check`, tests, build et `npm pack --dry-run`, audit, analyse statique, secrets, CodeQL, revue des dépendances. Node 22 |
| Tag `@flipova/foundation@X.Y.Z[-stade.N]` | les mêmes contrôles, puis publication sur npm avec provenance sous le dist-tag `alpha`, `beta`, `rc` ou `latest`, et création de la release GitHub |

Il n'y a aucun secret de publication : la publication utilise la publication de confiance de npm, liée au fichier `release.yml` et à l'environnement GitHub `production`. Le dépôt ne lit aucune variable du vault ; les variables d'environnement qu'il connaît (`FOUNDATION_DESIGN_DIR`, `FOUNDATION_PROJECT_ROOT`, `FLIPOVA_REQUIRE_DIST`, `UPDATE_COMPONENTS_DOC`, `CODEQL_FAIL_ON`) sont des réglages d'outillage sans valeur secrète. Le site de documentation est l'étape `docs` de `ci/ci.yml` : il est construit à chaque pull request et publié sur GitHub Pages par `release.yml` après une livraison stable (il n'y a pas de second workflow).
