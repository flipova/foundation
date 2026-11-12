<!-- corral:section:start id="cover" type="cover" locked="true" order="0" after="" -->
**CONTRIBUER**

**Participer au projet**

Environnement · Conventions · Propositions

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | <!--auto:doc.title-->Contribuer à Foundation<!--/auto--> |
| **Version**            | <!--auto:doc.version-->1.1<!--/auto--> |
| **Date de mise à jour** | <!--auto:doc.date-->12/11/2026<!--/auto--> |

<!-- corral:section:end id="cover" -->

<!-- corral:section:start id="sec-1" type="section" title="Bienvenue" level="1" order="1" after="cover" -->
# 1. Bienvenue

Les contributions sont bienvenues : correctifs, nouveaux composants ou adaptateurs, documentation, retours d'usage.
<!-- corral:section:end id="sec-1" -->

<!-- corral:section:start id="sec-2" type="section" title="Préparer l’environnement" level="1" order="2" after="sec-1" -->
# 2. Préparer l'environnement

```bash
git clone https://github.com/flipova/foundation.git
cd foundation
npm install --no-package-lock --ignore-scripts
npm test
```

Prérequis : Node.js 22 ou supérieur et npm.
<!-- corral:section:end id="sec-2" -->

<!-- corral:section:start id="sec-3" type="section" title="Organisation du code" level="1" order="3" after="sec-2" -->
# 3. Organisation du code

| **Dossier** | **Contenu** |
|-------------|-------------|
| `components/theme/` | Thème généré à partir des registres. |
| `components/contract/` | Types et recettes (fonctions pures). |
| `components/providers/` | Cœur des fournisseurs, `rn-base/`, flipova, gluestack, reusables, paper, tamagui. |
| `components/ui/` | Composants unifiés. |
| `design/` | Registres XML, schéma et outillage (`tools/`). |
| `scripts/` | Contrôle des frontières entre couches et gardes de cohérence. |
<!-- corral:section:end id="sec-3" -->

<!-- corral:section:start id="sec-4" type="section" title="Conventions" level="1" order="4" after="sec-3" -->
# 4. Conventions

- Branches : une branche de travail par modification ; on fusionne dans main ; une version est un tag (alpha, beta, rc puis stable sur le même commit), voir DOCS.md, sections 7 et 8.
- Messages de commit : un résumé court à l'impératif, détaillé si utile.
- Style de code et vérifications : `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm run boundary`.
- Tests : `npm test` doit passer ; un nouveau composant ajoute son type, sa recette et son implémentation flipova, puis régénère `COMPONENTS.md` avec `npm run components:doc`.
<!-- corral:section:end id="sec-4" -->

<!-- corral:section:start id="sec-5" type="section" title="Proposer une modification" level="1" order="5" after="sec-4" -->
# 5. Proposer une modification

1. Ouvrez un ticket ou choisissez-en un existant.
2. Créez une branche de travail.
3. Ouvrez une demande de fusion décrivant le changement.
4. Passez les vérifications automatiques (le contrat `ci/ci.yml`, section 8, sur Node 22) et la relecture.
<!-- corral:section:end id="sec-5" -->

<!-- corral:section:start id="sec-6" type="section" title="Signaler un problème" level="1" order="6" after="sec-5" -->
# 6. Signaler un problème

Indiquez la version, le système, les étapes pour reproduire, le résultat attendu et le résultat obtenu.

Tickets : <!--auto:repo.issues-->https://github.com/flipova/foundation/issues<!--/auto-->
<!-- corral:section:end id="sec-6" -->

<!-- corral:section:start id="sec-7" type="section" title="Licence et conduite" level="1" order="7" after="sec-6" -->
# 7. Licence et conduite

Les contributions sont publiées sous la licence du projet : MIT.

Le code de conduite du dépôt (`CODE_OF_CONDUCT.md`) s'applique à tous les échanges.
<!-- corral:section:end id="sec-7" -->

<!-- corral:section:start id="sec-8" type="section" title="Intégration continue et livraison" level="1" order="8" after="sec-7" -->
# 8. Intégration continue et livraison

Le pipeline `.github/workflows/release.yml` est généré par Corral depuis le contrat `ci/ci.yml` (`corral ci sync` après une modification, `corral ci check` pour vérifier ; référence complète : `ci/CI.md`). Il ne dépend d'aucun dépôt privé, donc n'a pas besoin du jeton `ORG_READ_TOKEN` de l'écosystème (FLP-ECO-001 du dépôt `flipova.backend`).

| **Événement** | **Ce qui s'exécute** |
|---------------|----------------------|
| Pull request vers `main` | intégrité du modèle, puis `npm ci`, format, lint (dont `design:check`, `design:verify`, `design:lint`), typecheck, `design:gen:check`, tests, build et `npm pack --dry-run`, audit, analyse statique, secrets, CodeQL, revue des dépendances. Node 22 |
| Tag `@flipova/foundation@X.Y.Z[-stade.N]` | les mêmes contrôles, puis publication sur npm avec provenance sous le dist-tag `alpha`, `beta`, `rc` ou `latest`, et création de la release GitHub |

Il n'y a aucun secret de publication : la publication utilise la publication de confiance de npm, liée au fichier `release.yml` et à l'environnement GitHub `production`. Le dépôt ne lit aucune variable du vault ; les variables d'environnement qu'il connaît (`FOUNDATION_DESIGN_DIR`, `FOUNDATION_PROJECT_ROOT`, `FLIPOVA_REQUIRE_DIST`, `UPDATE_COMPONENTS_DOC`, `CODEQL_FAIL_ON`) sont des réglages d'outillage sans valeur secrète. Le site de documentation est publié par le workflow séparé `docs.yml` (GitHub Pages) quand `documentation/**` ou `website/**` changent.
<!-- corral:section:end id="sec-8" -->
