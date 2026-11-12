<!-- corral:section:start id="cover" type="cover" locked="true" order="0" after="" -->
**NOTES DE VERSION**

**Ce qui change**

Nouveautés · Corrections · Migration

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | <!--auto:doc.title-->Notes de version<!--/auto--> |
| **Version**            | <!--auto:doc.version-->1.1<!--/auto--> |
| **Date de mise à jour** | <!--auto:doc.date-->12/11/2026<!--/auto--> |

<!-- corral:section:end id="cover" -->

<!-- corral:section:start id="sec-1" type="section" title="Résumé" level="1" order="1" after="cover" -->
# 1. Résumé

Version : <!--auto:product.version-->2.4.4<!--/auto-->

La version 3.0.0 (en préparation) introduit une nouvelle architecture : un contrat unique de 57 composants, cinq fournisseurs et des thèmes qui appartiennent à l'application. Elle comporte des changements incompatibles avec la série 2.x.
<!-- corral:section:end id="sec-1" -->

<!-- corral:section:start id="sec-2" type="section" title="Nouveautés" level="1" order="2" after="sec-1" -->
# 2. Nouveautés

- Contrat de 57 composants (`@flipova/foundation/contract`) : propriétés et recettes.
- Composants unifiés (racine et `/ui`) : ils rendent le composant du fournisseur choisi dans `FlipovaProvider`, avec repli sur flipova.
- Cinq fournisseurs : flipova (57), gluestack, reusables, paper, tamagui, chacun dépendance facultative chargée depuis son sous-chemin.
- `providers/rn-base` : les 14 composants qui sont React Native lui-même, servis par tous les adaptateurs.
- `COMPONENTS.md` : tableau de couverture généré et contrôlé par un test.
- `flipova-design gui` : éditeur local des registres XML.
- `flipova-design adopt` : copie des registres dans l'application.
- `npm run boundary` : contrôle des couches et des dépendances facultatives.
<!-- corral:section:end id="sec-2" -->

<!-- corral:section:start id="sec-3" type="section" title="Corrections" level="1" order="3" after="sec-2" -->
# 3. Corrections

- Le fournisseur reçoit désormais le thème par la propriété `theme` ; la documentation indiquait à tort `registry`.
- Les dépendances `react-native` (obligatoire), `nativewind` et `lucide-react` (facultatives) sont déclarées correctement comme dépendances homologues.
<!-- corral:section:end id="sec-3" -->

<!-- corral:section:start id="sec-4" type="section" title="Changements incompatibles et migration" level="1" order="4" after="sec-3" -->
# 4. Changements incompatibles et migration

| **Changement** | **Qui est concerné** | **Comment migrer** |
|----------------|----------------------|--------------------|
| Les thèmes ne sont plus livrés ; seul un point de départ neutre l'est. | Tous les utilisateurs de la série 2.x. | `npx flipova-design adopt` puis `npx flipova-design gen`. |
| Le catalogue gluestack est déplacé vers `providers/gluestack/ui`. | Imports directs de composants gluestack. | Utiliser les composants unifiés ou le sous-chemin `@flipova/foundation/providers/gluestack/ui`. |
| `components/ui` devient la couche unifiée. | Imports internes de l'ancien dossier. | Importer depuis la racine ou depuis `/ui`. |
| Les outils Python et `design/documentation.xml` sont supprimés. | Scripts qui les appelaient. | Utiliser la CLI Node `flipova-design`. |
<!-- corral:section:end id="sec-4" -->

<!-- corral:section:start id="sec-5" type="section" title="Dépréciations" level="1" order="5" after="sec-4" -->
# 5. Dépréciations

| **Élément déprécié** | **Remplacé par** | **Retrait prévu** |
|----------------------|------------------|-------------------|
| Aucun | — | — |
<!-- corral:section:end id="sec-5" -->

<!-- corral:section:start id="sec-6" type="section" title="Compatibilité" level="1" order="6" after="sec-5" -->
# 6. Compatibilité

Node.js 22 ou supérieur pour l'outillage ; React 18+ et React Native 0.72+. Les bibliothèques de fournisseurs sont facultatives.
<!-- corral:section:end id="sec-6" -->

<!-- corral:section:start id="sec-7" type="section" title="Mettre à jour" level="1" order="7" after="sec-6" -->
# 7. Mettre à jour

```bash
npm install @flipova/foundation@latest
npx flipova-design adopt
npx flipova-design gen
```

Points d'attention : enveloppez l'application dans `<FlipovaProvider adapter={…} theme={designTheme}>` (`adopt` écrit `theme/provider.tsx`), remplacez les imports gluestack par les composants unifiés, et installez la dépendance facultative du fournisseur choisi.
<!-- corral:section:end id="sec-7" -->
