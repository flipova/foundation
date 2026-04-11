# Implementation Tasks

## Tasks

- [x] 1. Dépendances et configuration
  - [x] 1.1 Ajouter `react-native-qrcode-svg`, `react-native-svg`, `readable-stream` et `@craftzdog/react-native-buffer` dans `studio/app/package.json`
  - [x] 1.2 Mettre à jour `studio/app/metro.config.js` pour configurer `resolver.extraNodeModules` avec les polyfills `crypto`, `stream` et `buffer`

- [x] 2. Bouton Snack dans la Topbar
  - [x] 2.1 Ajouter la prop `onOpenSnack: () => void` à l'interface `Props` de `Topbar.tsx`
  - [x] 2.2 Ajouter le bouton icône `smartphone` avec tooltip dans la zone droite de la `Topbar`, positionné entre "Fonctions personnalisées" et "Paramètres"

- [x] 3. Composant SnackModal
  - [x] 3.1 Créer `studio/app/src/ui/modals/SnackModal.tsx` avec les props `visible: boolean` et `onClose: () => void`
  - [x] 3.2 Implémenter le backdrop pressable qui appelle `onClose()` et le panneau overlay 320px ancré en haut à droite
  - [x] 3.3 Intégrer le composant `SnackPanel` existant dans le `SnackModal`

- [x] 4. Intégration dans index.tsx
  - [x] 4.1 Ajouter l'état `showSnack` et le handler `onOpenSnack` dans `StudioScreen`
  - [x] 4.2 Passer `onOpenSnack` à la `Topbar` et rendre `<SnackModal>` conditionnel dans le JSX

- [x] 5. QR Code visuel dans SnackPanel
  - [x] 5.1 Importer `QRCode` depuis `react-native-qrcode-svg` dans `SnackPanel.tsx`
  - [x] 5.2 Remplacer le bloc `qrHint` par le composant `QRCode` avec `value={snackUrl}`, taille 160px, fond `#080c18`, couleur `#d0d8f0` et le texte "Scanner avec Expo Go"

- [x] 6. Tests unitaires SnackPanel
  - [x] 6.1 Créer `studio/app/src/ui/__tests__/SnackPanel.test.tsx` avec les cas : état `idle` (bouton visible), état `loading` (spinner + boutons désactivés), état `online` (QRCode rendu + boutons Push/Close), état `error` (message + Retry)
  - [x] 6.2 Ajouter le test `closeSnack()` : vérifie que status revient à `idle` et URLs à `null`

- [x] 7. Tests unitaires endpoint snack/export
  - [x] 7.1 Créer `studio/server/__tests__/snack-export.test.ts` avec les cas : retourne `files`, `dependencies`, `name` pour un projet valide ; filtre `.yml` et `.gitignore` ; exclut `react`, `react-native`, `expo` des dépendances

- [x] 8. Tests property-based
  - [x] 8.1 Ajouter dans `studio/server/__tests__/snack-export.test.ts` les propriétés fast-check : P8 (tous les fichiers ont `type: 'CODE'`), P9 (aucune dep bundlée), P10 (aucun fichier `.yml`/`.gitignore`)
  - [x] 8.2 Ajouter dans `studio/app/src/ui/__tests__/SnackPanel.test.tsx` la propriété P6 : pour toute `snackUrl` non-nulle, `QRCode` reçoit une valeur non-vide
