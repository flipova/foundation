# Requirements Document

## Introduction

Cette fonctionnalité intègre Expo Snack dans Flipova Studio, permettant à l'utilisateur d'envoyer son projet en cours vers Expo Snack et de le tester en temps réel sur un appareil physique via un QR code scannable. L'intégration couvre : l'exposition du `SnackPanel` via un bouton dans la `Topbar`, la création d'un `SnackModal` wrapper, l'ajout d'un vrai QR code visuel, la résolution de la compatibilité `snack-sdk` côté web, et la couverture par des tests.

## Glossary

- **Studio**: L'application Flipova Studio (web app Expo)
- **Topbar**: La barre d'outils horizontale en haut du Studio
- **SnackPanel**: Le composant autonome gérant la connexion Expo Snack (déjà existant)
- **SnackModal**: Le nouveau composant modal flottant qui encapsule le `SnackPanel`
- **Snack**: Une instance de projet hébergée sur Expo Snack Cloud
- **snack-sdk**: La bibliothèque JavaScript officielle pour créer et gérer des Snacks
- **Expo_Go**: L'application mobile permettant de scanner un QR code et tester un Snack
- **QRCode**: Le composant visuel rendant un QR code scannable
- **Server**: Le serveur Express du Studio (`studio/server`)
- **SnackExportEndpoint**: L'endpoint `POST /api/snack/export` du serveur
- **SnackStatus**: L'union de types `'idle' | 'loading' | 'online' | 'error'`
- **snackUrl**: L'URL `exp://...` utilisée par Expo Go pour ouvrir le Snack
- **webUrl**: L'URL `https://snack.expo.dev/...` pour ouvrir le Snack dans un navigateur

---

## Requirements

### Requirement 1: Bouton Snack dans la Topbar

**User Story:** En tant qu'utilisateur du Studio, je veux un bouton dédié dans la barre d'outils pour ouvrir le panneau Expo Snack, afin de pouvoir accéder rapidement à la fonctionnalité de test sur appareil réel.

#### Acceptance Criteria

1. THE `Topbar` SHALL accepter une prop `onOpenSnack: () => void` dans son interface
2. WHEN l'utilisateur clique sur le bouton Snack dans la `Topbar`, THE `Topbar` SHALL appeler `onOpenSnack()`
3. THE `Topbar` SHALL afficher le bouton Snack avec l'icône `smartphone` et un tooltip "Expo Snack — Tester sur un appareil réel"
4. THE `Topbar` SHALL positionner le bouton Snack entre le bouton "Fonctions personnalisées" et le bouton "Paramètres"

---

### Requirement 2: SnackModal — Wrapper flottant

**User Story:** En tant qu'utilisateur du Studio, je veux que le panneau Expo Snack s'affiche dans une modal flottante, afin de pouvoir l'utiliser sans quitter le canvas principal.

#### Acceptance Criteria

1. THE `SnackModal` SHALL accepter les props `visible: boolean` et `onClose: () => void`
2. WHEN `visible` est `true`, THE `SnackModal` SHALL afficher le `SnackPanel` dans un conteneur overlay positionné en haut à droite
3. WHEN l'utilisateur clique sur le backdrop de la modal, THE `SnackModal` SHALL appeler `onClose()`
4. WHEN l'utilisateur appuie sur la touche Escape, THE `SnackModal` SHALL appeler `onClose()`
5. THE `SnackModal` SHALL avoir une largeur fixe de 320px et une hauteur maximale de 90% de la fenêtre
6. WHEN `visible` est `false`, THE `SnackModal` SHALL ne pas rendre le `SnackPanel`

---

### Requirement 3: Intégration dans index.tsx

**User Story:** En tant qu'utilisateur du Studio, je veux que le bouton Snack de la Topbar ouvre et ferme la SnackModal, afin d'avoir un flux d'interaction cohérent avec les autres modals du Studio.

#### Acceptance Criteria

1. THE `StudioScreen` SHALL maintenir un état `showSnack: boolean` initialisé à `false`
2. WHEN `onOpenSnack` est appelé depuis la `Topbar`, THE `StudioScreen` SHALL passer `showSnack` à `true`
3. WHEN `onClose` est appelé depuis la `SnackModal`, THE `StudioScreen` SHALL passer `showSnack` à `false`
4. THE `StudioScreen` SHALL rendre la `SnackModal` avec `visible={showSnack}` et `onClose={() => setShowSnack(false)}`

---

### Requirement 4: QR Code visuel dans SnackPanel

**User Story:** En tant qu'utilisateur du Studio, je veux voir un vrai QR code scannable dans le panneau Snack, afin de pouvoir ouvrir mon projet sur Expo Go sans copier-coller l'URL manuellement.

#### Acceptance Criteria

1. WHEN `status === 'online'` et `snackUrl !== null`, THE `SnackPanel` SHALL afficher un composant `QRCode` avec `value={snackUrl}`
2. THE `QRCode` SHALL avoir une taille de 160px, un fond `#080c18` et une couleur `#d0d8f0`
3. THE `SnackPanel` SHALL afficher le texte "Scanner avec Expo Go" sous le QR code
4. WHEN `snackUrl` est `null`, THE `SnackPanel` SHALL ne pas rendre le composant `QRCode`

---

### Requirement 5: Flux openInSnack()

**User Story:** En tant qu'utilisateur du Studio, je veux pouvoir envoyer mon projet vers Expo Snack en un clic, afin de le tester immédiatement sur un appareil réel.

#### Acceptance Criteria

1. WHEN l'utilisateur clique "Open in Snack" depuis l'état `idle`, THE `SnackPanel` SHALL passer `status` à `'loading'` et désactiver le bouton
2. WHEN `status === 'loading'`, THE `SnackPanel` SHALL appeler `POST /api/snack/export` pour récupérer `files`, `dependencies` et `name`
3. WHEN la réponse du serveur est reçue avec succès, THE `SnackPanel` SHALL créer une instance `Snack` via `snack-sdk` avec les fichiers et dépendances reçus
4. WHEN le Snack est mis en ligne via `snack.setOnline(true)`, THE `SnackPanel` SHALL écouter les changements d'état via `snack.addStateListener`
5. WHEN `state.url` est disponible, THE `SnackPanel` SHALL mettre à jour `snackUrl` avec cette valeur
6. WHEN `snack.saveAsync()` retourne un `id`, THE `SnackPanel` SHALL construire `webUrl` sous la forme `https://snack.expo.dev/{id}`
7. WHEN le Snack est en ligne avec succès, THE `SnackPanel` SHALL passer `status` à `'online'` et mettre à jour `lastUpdated`
8. IF `POST /api/snack/export` retourne une erreur HTTP, THEN THE `SnackPanel` SHALL passer `status` à `'error'` et afficher le message d'erreur
9. IF `snack-sdk` lève une exception, THEN THE `SnackPanel` SHALL passer `status` à `'error'` et afficher le message d'erreur

---

### Requirement 6: Flux pushUpdate()

**User Story:** En tant qu'utilisateur du Studio, je veux pouvoir pousser les modifications de mon projet vers le Snack actif, afin que l'appareil connecté reçoive les changements en temps réel.

#### Acceptance Criteria

1. WHILE `status === 'online'`, THE `SnackPanel` SHALL afficher le bouton "Push update"
2. WHEN l'utilisateur clique "Push update", THE `SnackPanel` SHALL appeler `POST /api/snack/export` et mettre à jour les fichiers via `snack.updateFiles()`
3. WHEN la mise à jour réussit, THE `SnackPanel` SHALL mettre à jour `lastUpdated` et maintenir `status === 'online'`
4. IF `POST /api/snack/export` retourne une erreur pendant `pushUpdate`, THEN THE `SnackPanel` SHALL passer `status` à `'error'` sans détruire l'instance `snackRef.current`
5. WHILE `status === 'loading'`, THE `SnackPanel` SHALL désactiver les boutons "Push update" et "Open in Snack"

---

### Requirement 7: Flux closeSnack()

**User Story:** En tant qu'utilisateur du Studio, je veux pouvoir fermer la session Snack active, afin de libérer la connexion WebSocket et remettre le panneau à son état initial.

#### Acceptance Criteria

1. WHEN l'utilisateur clique "Close" depuis l'état `online`, THE `SnackPanel` SHALL appeler `snack.setOnline(false)` sur l'instance courante
2. WHEN `closeSnack()` est exécuté, THE `SnackPanel` SHALL remettre `status` à `'idle'`, `snackUrl` à `null`, `webUrl` à `null` et `connectedClients` à `0`
3. WHEN le composant `SnackPanel` est démonté, THE `SnackPanel` SHALL appeler `snack.setOnline(false)` si une instance est active

---

### Requirement 8: Gestion des erreurs et récupération

**User Story:** En tant qu'utilisateur du Studio, je veux que les erreurs soient clairement affichées avec une option de réessai, afin de pouvoir récupérer d'un échec sans recharger la page.

#### Acceptance Criteria

1. WHEN `status === 'error'`, THE `SnackPanel` SHALL afficher le message d'erreur et un bouton "Retry"
2. WHEN l'utilisateur clique "Retry", THE `SnackPanel` SHALL relancer `openInSnack()`
3. IF `snack-sdk` est incompatible avec l'environnement web, THEN THE `SnackPanel` SHALL utiliser l'API REST Expo (`https://exp.host/--/api/v2/snack/save`) comme fallback
4. IF `snack.getStateAsync()` ne résout pas dans les 15 secondes, THEN THE `SnackPanel` SHALL passer `status` à `'error'` avec le message "Snack connection timed out"

---

### Requirement 9: Endpoint /api/snack/export

**User Story:** En tant que développeur, je veux que l'endpoint `/api/snack/export` retourne les fichiers du projet dans un format compatible avec `snack-sdk`, afin que le `SnackPanel` puisse créer un Snack valide.

#### Acceptance Criteria

1. WHEN `POST /api/snack/export` est appelé, THE `SnackExportEndpoint` SHALL retourner un objet `{ files, dependencies, name }`
2. THE `SnackExportEndpoint` SHALL formater chaque fichier comme `{ type: 'CODE', contents: string }`
3. THE `SnackExportEndpoint` SHALL exclure les fichiers `.yml` et `.gitignore` de la réponse
4. THE `SnackExportEndpoint` SHALL exclure `react`, `react-native` et `expo` des dépendances retournées
5. THE `SnackExportEndpoint` SHALL retourner le nom du projet dans le champ `name`

---

### Requirement 10: Compatibilité snack-sdk côté web (polyfills)

**User Story:** En tant que développeur, je veux que `snack-sdk` fonctionne dans l'environnement web d'Expo Studio, afin que la création de Snacks soit possible sans erreur de compatibilité Node.js.

#### Acceptance Criteria

1. THE `metro.config.js` du Studio SHALL configurer `resolver.extraNodeModules` pour résoudre `crypto`, `stream` et `buffer` via des polyfills compatibles React Native
2. THE `studio/app/package.json` SHALL inclure `react-native-qrcode-svg`, `react-native-svg`, `readable-stream` et `@craftzdog/react-native-buffer` dans ses dépendances
3. IF `snack-sdk` reste incompatible malgré les polyfills, THEN THE `SnackPanel` SHALL basculer automatiquement vers le fallback API REST sans intervention de l'utilisateur

---

### Requirement 11: Tests unitaires

**User Story:** En tant que développeur, je veux que les comportements clés du `SnackPanel` et de l'endpoint soient couverts par des tests unitaires, afin de garantir la fiabilité de l'intégration.

#### Acceptance Criteria

1. THE test suite SHALL vérifier que `SnackPanel` en état `idle` affiche le bouton "Open in Snack"
2. THE test suite SHALL vérifier que `SnackPanel` en état `loading` affiche un indicateur de chargement et désactive les boutons d'action
3. THE test suite SHALL vérifier que `SnackPanel` en état `online` affiche le composant `QRCode` et les boutons "Push update" et "Close"
4. THE test suite SHALL vérifier que `SnackPanel` en état `error` affiche le message d'erreur et le bouton "Retry"
5. THE test suite SHALL vérifier que `closeSnack()` remet l'état à `idle` et les URLs à `null`
6. THE test suite SHALL vérifier que `SnackExportEndpoint` retourne `files`, `dependencies` et `name` pour un projet valide
7. THE test suite SHALL vérifier que `SnackExportEndpoint` filtre les fichiers `.yml` et `.gitignore`
8. THE test suite SHALL vérifier que `SnackExportEndpoint` exclut `react`, `react-native` et `expo` des dépendances

---

### Requirement 12: Tests property-based

**User Story:** En tant que développeur, je veux que les propriétés universelles du système soient vérifiées par des tests property-based, afin de détecter des cas limites non couverts par les tests unitaires.

#### Acceptance Criteria

1. THE property test suite SHALL vérifier que pour tout projet valide, `buildSnackDependencies` n'inclut jamais `react`, `react-native` ou `expo`
2. THE property test suite SHALL vérifier que pour tout projet valide, tous les fichiers retournés par `buildSnackFiles` ont `type: 'CODE'` et `contents` de type `string`
3. THE property test suite SHALL vérifier que pour toute `snackUrl` non-nulle, le composant `QRCode` reçoit une valeur non-vide et rend une image
