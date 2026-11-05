<!-- corral:section:start id="cover" type="cover" locked="true" order="0" after="" -->
**GUIDE DE DÉMARRAGE**

**Installer et faire un premier essai**

Installation · Configuration · Premier usage

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | <!--auto:doc.title-->Démarrer avec Foundation<!--/auto--> |
| **Version**            | <!--auto:doc.version-->1.0<!--/auto--> |
| **Date de mise à jour** | <!--auto:doc.date-->05/11/2026<!--/auto--> |

<!-- corral:section:end id="cover" -->

<!-- corral:section:start id="sec-1" type="section" title="Avant de commencer" level="1" order="1" after="cover" -->
# 1. Avant de commencer

- Node.js 20 ou supérieur et npm.
- Une application React Native (Expo ou non) avec React 18+ et React Native 0.72+.
- Un dépôt git propre est recommandé : `adopt` et `gen` créent des fichiers dans votre projet.

Durée estimée : 10 minutes.
<!-- corral:section:end id="sec-1" -->

<!-- corral:section:start id="sec-2" type="section" title="Installation" level="1" order="2" after="sec-1" -->
# 2. Installation

```bash
npm install @flipova/foundation react react-native
```

Pour utiliser une bibliothèque autre que flipova, installez aussi sa dépendance facultative :

```bash
npm install react-native-paper     # fournisseur paper
npm install @tamagui/core          # fournisseur tamagui
npm install @rn-primitives/switch  # fournisseur reusables (selon les composants)
```
<!-- corral:section:end id="sec-2" -->

<!-- corral:section:start id="sec-3" type="section" title="Configuration minimale" level="1" order="3" after="sec-2" -->
# 3. Configuration minimale

Votre design vit dans quatre fichiers XML du dossier `design/` : `tokens.xml`, `themes.xml`, `manifest.xml` et `schema.xsd`. Copiez-les depuis le point de départ neutre fourni, puis compilez-les :

```bash
npx flipova-design adopt   # copie les registres dans ./design et écrit theme/provider.tsx
npx flipova-design gen     # produit theme/design-theme.ts, config.ts et tokens.js
```

Un thème doit définir les 27 rôles de couleur obligatoires ; un rôle manquant est refusé avec son nom.
<!-- corral:section:end id="sec-3" -->

<!-- corral:section:start id="sec-4" type="section" title="Premier usage pas à pas" level="1" order="4" after="sec-3" -->
# 4. Premier usage pas à pas

1. Montez le fournisseur une seule fois à la racine de l'application :

   ```tsx
   import { AppThemeProvider } from './theme/provider';

   export default function App() {
     return <AppThemeProvider mode="system">{/* votre application */}</AppThemeProvider>;
   }
   ```

2. Importez les composants depuis le package :

   ```tsx
   import { Button, Card, Heading, Text, VStack } from '@flipova/foundation';
   ```

3. Affichez un premier écran :

   ```tsx
   <Card>
     <VStack space="4">
       <Heading level={2}>Bienvenue</Heading>
       <Button onPress={() => {}}>Enregistrer</Button>
     </VStack>
   </Card>
   ```
<!-- corral:section:end id="sec-4" -->

<!-- corral:section:start id="sec-5" type="section" title="Vérifier que tout fonctionne" level="1" order="5" after="sec-4" -->
# 5. Vérifier que tout fonctionne

- Le composant s'affiche avec les couleurs de votre thème (clair ou sombre selon `mode`).
- `npx flipova-design pipeline` se termine sans erreur : il enchaîne `gen`, `check`, `verify` et `lint`.
- `npx flipova-design gui` ouvre l'éditeur local ; l'onglet Aperçu montre les composants avec votre thème.
<!-- corral:section:end id="sec-5" -->

<!-- corral:section:start id="sec-6" type="section" title="Étapes suivantes" level="1" order="6" after="sec-5" -->
# 6. Étapes suivantes

- Guides pratiques : changer de fournisseur, modifier le thème, vérifier la couverture.
- Concepts et fonctionnement : contrat, recettes, fournisseurs et repli.
- Référence : commandes `flipova-design`, sous-chemins du package, propriétés de `FlipovaProvider`.
<!-- corral:section:end id="sec-6" -->
