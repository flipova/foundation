<!-- corral:section:start id="cover" type="cover" locked="true" order="0" after="" -->
**RÉFÉRENCE**

**Commandes, options et configuration**

Référence complète · CLI · API · Configuration

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | <!--auto:doc.title-->Référence<!--/auto--> |
| **Version**            | <!--auto:doc.version-->1.0<!--/auto--> |
| **Date de mise à jour** | <!--auto:doc.date-->05/11/2026<!--/auto--> |

<!-- corral:section:end id="cover" -->

<!-- corral:section:start id="sec-1" type="section" title="Utilisation générale" level="1" order="1" after="cover" -->
# 1. Utilisation générale

```
npx flipova-design <commande> [options]
```

Les arguments entre crochets sont facultatifs. Sans commande reconnue, l'outil liste les commandes disponibles.
<!-- corral:section:end id="sec-1" -->

<!-- corral:section:start id="sec-2" type="section" title="Commandes" level="1" order="2" after="sec-1" -->
# 2. Commandes

| **Commande** | **Rôle** | **Exemple** |
|--------------|----------|-------------|
| `init` (alias `inject`) | Injecte le câblage de l'application, sans jamais écraser (`--force` pour écraser). | `npx flipova-design init` |
| `adopt` | Copie les registres dans l'application, qui devient propriétaire de son design. | `npx flipova-design adopt` |
| `gui` | Éditeur web local des registres. | `npx flipova-design gui --port 4000` |
| `gen` | Compile les registres vers `theme/` ; `--check` échoue en cas de dérive ; `--list` liste les fichiers. | `npx flipova-design gen --check` |
| `check` | Règles de déterminisme et validation XSD ; `--list-rules` liste les règles. | `npx flipova-design check` |
| `verify` | Vérifie que l'index canonique validé correspond aux registres. | `npx flipova-design verify` |
| `canonical` | Calcule l'index canonique. | `npx flipova-design canonical` |
| `lint` | Valide chaque fichier de registre avec le XSD. | `npx flipova-design lint` |
| `pipeline` | Enchaîne gen, check, verify et lint. | `npx flipova-design pipeline` |
| `where` | Affiche les chemins résolus (diagnostic). | `npx flipova-design where` |
<!-- corral:section:end id="sec-2" -->

<!-- corral:section:start id="sec-3" type="section" title="Options" level="1" order="3" after="sec-2" -->
# 3. Options

| **Option** | **Type / valeurs** | **Défaut** | **Description** |
|------------|--------------------|------------|-----------------|
| `--port` | entier (`gui`) | choisi automatiquement | Port de l'éditeur local. |
| `--no-open` | drapeau (`gui`) | désactivé | N'ouvre pas le navigateur. |
| `--check` | drapeau (`gen`) | désactivé | Échoue si les fichiers générés ont dérivé. |
| `--list` | drapeau (`gen`) | désactivé | Liste les fichiers produits. |
| `--list-rules` | drapeau (`check`) | désactivé | Liste les règles de contrôle. |
| `--force` | drapeau (`init`) | désactivé | Écrase les fichiers injectés. |
<!-- corral:section:end id="sec-3" -->

<!-- corral:section:start id="sec-4" type="section" title="Configuration" level="1" order="4" after="sec-3" -->
# 4. Configuration

**Sous-chemins du package**

| **Sous-chemin** | **Contenu** | **Obligatoire** |
|-----------------|-------------|-----------------|
| `@flipova/foundation` | Composants unifiés, `FlipovaProvider`, hooks | Oui |
| `@flipova/foundation/ui` | Composants unifiés, `createUi`, `coverageOf`, `componentsOf` | Non |
| `@flipova/foundation/contract` | Types et recettes | Non |
| `@flipova/foundation/providers` | Cœur des fournisseurs | Non |
| `@flipova/foundation/providers/flipova` | Fournisseur flipova (57 composants) | Non |
| `@flipova/foundation/providers/gluestack` | Adaptateur gluestack | Non |
| `@flipova/foundation/providers/gluestack/ui` | Catalogue gluestack complet | Non |
| `@flipova/foundation/providers/paper` | Adaptateur react-native-paper | Non |
| `@flipova/foundation/providers/tamagui` | Adaptateur tamagui | Non |
| `@flipova/foundation/providers/reusables` | Adaptateur reusables | Non |
| `@flipova/foundation/tokens` | Jetons de design | Non |

**Propriétés de `FlipovaProvider`**

| **Propriété** | **Rôle** | **Défaut** | **Obligatoire** |
|---------------|----------|------------|-----------------|
| `adapter` | Fournisseur de composants à utiliser. | — | Oui |
| `mode` | `light`, `dark` ou `system`. | `light` | Non |
| `variant` | Variante de thème. | thème par défaut | Non |
| `theme` | Thème généré (`designTheme`). | thème neutre du package | Non |

Hooks : `useResolvedTheme`, `useAdapter`, `useProviderName`, `useComponents`.

**Dépendances facultatives** : `react-native-paper`, `@tamagui/core`, `@rn-primitives/switch`, `nativewind`, `lucide-react`, `expo`, `expo-glass-effect`, `react-dom`.
<!-- corral:section:end id="sec-4" -->

<!-- corral:section:start id="sec-5" type="section" title="Codes de sortie et erreurs" level="1" order="5" after="sec-4" -->
# 5. Codes de sortie et erreurs

| **Code / message** | **Signification** | **Que faire** |
|--------------------|-------------------|---------------|
| 0 | Succès. | — |
| non nul | Commande échouée, contrôle en échec ou commande inconnue. | Lire le message : il nomme le fichier ou la règle en cause. |
| `missing role` | Un thème n'a pas l'un des 27 rôles de couleur obligatoires. | Ajouter le rôle dans l'onglet Thèmes de l'interface ou dans `themes.xml`. |
<!-- corral:section:end id="sec-5" -->

<!-- corral:section:start id="sec-6" type="section" title="Exemples" level="1" order="6" after="sec-5" -->
# 6. Exemples

Compiler puis vérifier que rien n'a dérivé :

```bash
npx flipova-design gen
npx flipova-design gen --check
```

Contrôler tout l'outillage d'un coup :

```bash
npx flipova-design pipeline
```

Éditer le thème sans ouvrir de navigateur automatiquement :

```bash
npx flipova-design gui --port 4000 --no-open
```
<!-- corral:section:end id="sec-6" -->
