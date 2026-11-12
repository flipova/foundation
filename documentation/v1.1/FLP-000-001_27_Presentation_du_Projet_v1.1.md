<!-- corral:section:start id="cover" type="cover" locked="true" order="0" after="" -->
**PRÉSENTATION DU PROJET**

**Page d’accueil du projet**

Outil · Bibliothèque · Documentation publique

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | <!--auto:doc.title-->Foundation — Présentation<!--/auto--> |
| **Version**            | <!--auto:doc.version-->1.1<!--/auto--> |
| **Date de mise à jour** | <!--auto:doc.date-->12/11/2026<!--/auto--> |

<!-- corral:section:end id="cover" -->

<!-- corral:section:start id="sec-1" type="section" title="En bref" level="1" order="1" after="cover" -->
# 1. En bref

<!--auto:product.description-->Provider-agnostic UI contract and design toolchain: 57 components over flipova, gluestack, reusables, paper and tamagui, themed from the app's own XML registries.<!--/auto-->

Foundation est la couche de base d'une application React Native : un contrat unique de 57 composants, cinq fournisseurs (flipova, gluestack, reusables, paper, tamagui) et l'outillage qui transforme les registres de design XML de votre application en fichiers de thème. Vous écrivez `<Button>` une seule fois ; la bibliothèque qui le dessine se choisit en une ligne.

Le package ne contient ni mise en page, ni écrans, ni logique de compte : seulement les briques et leur thème. Le design appartient à votre application, jamais au package.
<!-- corral:section:end id="sec-1" -->

<!-- corral:section:start id="sec-2" type="section" title="Fonctionnalités" level="1" order="2" after="sec-1" -->
# 2. Fonctionnalités

| **Fonctionnalité** | **Ce que ça apporte** |
|--------------------|-----------------------|
| Contrat de 57 composants | Les mêmes propriétés quelle que soit la bibliothèque : changer de fournisseur ne demande aucune réécriture. |
| Cinq fournisseurs | flipova (les 57), gluestack, reusables, paper et tamagui, chacun chargé uniquement depuis son propre sous-chemin. |
| Repli automatique sur flipova | Un composant absent d'une bibliothèque est servi par flipova : il n'y a jamais de trou. |
| Thèmes issus de vos registres XML | Couleurs, échelles et thèmes clair/sombre sont à vous, validés et compilés en TypeScript. |
| Éditeur graphique local (`flipova-design gui`) | Modifier les couleurs, échelles et thèmes dans le navigateur, sans quitter votre machine. |
| Vérifications intégrées | `gen --check`, `check`, `verify`, `lint` et `pipeline` détectent toute dérive entre registres et fichiers générés. |
<!-- corral:section:end id="sec-2" -->

<!-- corral:section:start id="sec-3" type="section" title="Installation rapide" level="1" order="3" after="sec-2" -->
# 3. Installation rapide

```bash
npm install @flipova/foundation react react-native
npx flipova-design adopt && npx flipova-design gen
```
<!-- corral:section:end id="sec-3" -->

<!-- corral:section:start id="sec-4" type="section" title="Exemple" level="1" order="4" after="sec-3" -->
# 4. Exemple

```tsx
import { FlipovaProvider, Button, Card, Heading, Text, VStack } from '@flipova/foundation';
import { paper } from '@flipova/foundation/providers/paper';
import { designTheme } from './theme/design-theme';

export default function App() {
  return (
    <FlipovaProvider adapter={paper} theme={designTheme} mode="system">
      <Card>
        <VStack space="4">
          <Heading level={2}>Bienvenue</Heading>
          <Text>Mêmes propriétés avec n'importe quel fournisseur.</Text>
          <Button onPress={() => {}}>Enregistrer</Button>
        </VStack>
      </Card>
    </FlipovaProvider>
  );
}
```

Le bouton est dessiné par react-native-paper, avec les couleurs de votre thème. Remplacez `paper` par un autre adaptateur : le code des écrans ne change pas.
<!-- corral:section:end id="sec-4" -->

<!-- corral:section:start id="sec-5" type="section" title="Compatibilité" level="1" order="5" after="sec-4" -->
# 5. Compatibilité

| **Environnement** | **Versions prises en charge** |
|-------------------|-------------------------------|
| Node.js (outillage, tests) | 22 ou supérieur |
| React | 18 ou supérieur |
| React Native | 0.72 ou supérieur |
| Bibliothèques facultatives | react-native-paper 5.15+, @tamagui/core 3+, @rn-primitives/switch 1+, nativewind 4.1.23+, lucide-react 0.400+ |

Le fournisseur flipova n'a besoin que de `react` et `react-native`. Chaque autre bibliothèque n'est requise que si vous choisissez son fournisseur.
<!-- corral:section:end id="sec-5" -->

<!-- corral:section:start id="sec-6" type="section" title="Pour aller plus loin" level="1" order="6" after="sec-5" -->
# 6. Pour aller plus loin

- Code source : <!--auto:repo.url-->https://github.com/flipova/foundation<!--/auto-->
- Signaler un problème : <!--auto:repo.issues-->https://github.com/flipova/foundation/issues<!--/auto-->
- Commencer : le guide de démarrage (installation, configuration, premier écran).
- Tout retrouver : la référence (commandes, sous-chemins, propriétés du fournisseur).
<!-- corral:section:end id="sec-6" -->

<!-- corral:section:start id="sec-7" type="section" title="Licence et contact" level="1" order="7" after="sec-6" -->
# 7. Licence et contact

Licence : MIT.

Pour une question ou une anomalie, ouvrez un ticket sur le dépôt (lien ci-dessus) ; la page « Dépannage et FAQ » indique les informations à joindre.
<!-- corral:section:end id="sec-7" -->
