# Plan d'implémentation : Studio UI/UX Improvements

## Vue d'ensemble

Implémentation des améliorations UI/UX du Flipova Studio en TypeScript/React Native (Expo).
Les tâches sont ordonnées par priorité : infrastructure partagée d'abord, puis textes descriptifs panneau par panneau, puis responsivité, puis non-superposition, puis UX générale.

## Tâches

- [x] 1. Créer le composant `Tooltip` partagé et le hook `useWindowSize`
  - Créer `studio/app/src/ui/shared/Tooltip.tsx` : composant affichant une bulle d'aide au survol (délai 500ms), se repositionnant automatiquement si elle dépasse les bords de la fenêtre
  - Créer `studio/app/src/ui/shared/useWindowSize.ts` : hook retournant `{ width, height }` de la fenêtre, mis à jour au redimensionnement
  - Le Tooltip doit accepter les props `text`, `children`, `delay?` et se positionner en évitant les débordements (bord droit et inférieur)
  - _Requirements : 1.1, 1.4, 15.3, 15.4_

  - [x] 1.1 Écrire les tests unitaires du composant Tooltip
    - Tester l'affichage après délai, le repositionnement aux bords, et l'absence de débordement
    - _Requirements : 15.3, 15.4_

- [x] 2. Ajouter les textes descriptifs et tooltips sur la Topbar
  - Modifier `studio/app/src/ui/Topbar.tsx` : entourer chaque bouton (Undo, Redo, Reset, Import, Export, Services, Queries, Fonctions, Paramètres, Thème, Prévisualisation, Code, Générer) avec le composant `Tooltip`
  - Ajouter le label "Appareil de prévisualisation" au-dessus du sélecteur de device
  - Ajouter un Tooltip "Zoom — Ajuster l'échelle du canvas" sur le contrôle de zoom
  - Afficher dans le Tooltip la raison de désactivation quand `canUndo` ou `canRedo` est false (ex. "Aucune action à annuler")
  - _Requirements : 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.1 Écrire les tests unitaires de la Topbar
    - Tester l'affichage des tooltips sur chaque bouton et le label du sélecteur de device
    - _Requirements : 1.2, 1.3_

- [x] 3. Ajouter les textes descriptifs sur le LibraryPanel
  - Modifier `studio/app/src/ui/LibraryPanel.tsx` :
    - Ajouter un texte d'en-tête sous les onglets principaux selon l'onglet actif
    - Mettre à jour le placeholder du champ de recherche en "Rechercher un composant…"
    - Afficher "Aucun composant trouvé pour « [terme] »." quand la recherche est vide
    - Afficher le message template vide en français : "Aucun template personnalisé. Sélectionnez un composant sur le canvas et sauvegardez-le comme template."
    - Entourer chaque item de composant avec `Tooltip` affichant le nom complet et la catégorie
  - _Requirements : 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [x] 3.1 Écrire les tests unitaires du LibraryPanel
    - Tester l'affichage des messages d'état vide, du placeholder et du message de recherche sans résultat
    - _Requirements : 2.3, 2.6_

- [x] 4. Ajouter les textes descriptifs sur le LayersPanel
  - Modifier `studio/app/src/ui/LayersPanel.tsx` :
    - Afficher "Aucun composant sur cet écran. Ajoutez-en depuis la bibliothèque." quand l'onglet LAYERS est vide
    - Afficher "Aucun écran. Créez votre premier écran avec le bouton ci-dessous." quand l'onglet SCREENS est vide
    - Entourer les icônes d'indicateurs (condition, repeat, event, binding) avec `Tooltip` décrivant chaque indicateur
    - Mettre à jour la bannière de déplacement en français : "Sélectionnez une zone de dépôt ou annulez le déplacement."
    - Ajouter `Tooltip` "Déplacer vers le haut" / "Déplacer vers le bas" sur les boutons chevron-up/down
    - Mettre à jour le label slot vide en "vide" (déjà présent, vérifier la cohérence)
    - Ajouter `Tooltip` "Supprimer ce composant" sur le bouton trash de chaque nœud
  - _Requirements : 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 4.1 Écrire les tests unitaires du LayersPanel
    - Tester les messages d'état vide et les tooltips des indicateurs
    - _Requirements : 3.1, 3.2, 3.3_

- [x] 5. Ajouter les textes descriptifs sur le DesignPanel
  - Modifier `studio/app/src/ui/DesignPanel.tsx` :
    - Ajouter une description courte sous le titre de chaque `Section` ouverte (Layout, Item, Dimensions, Spacing, Position, Appearance, Border, Typography, Effects)
    - Mettre à jour le message d'état vide en français : "Sélectionnez un composant sur le canvas pour modifier ses propriétés visuelles."
    - Entourer chaque champ `N` avec `Tooltip` affichant le nom complet de la propriété RN (ex. "flexGrow — Facteur d'expansion du composant dans son conteneur")
    - Entourer chaque bouton `Seg` avec `Tooltip` décrivant l'effet de l'option
    - Afficher la description "Position absolue — Le composant est positionné par rapport à son parent le plus proche." quand `position === 'absolute'`
  - _Requirements : 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 5.1 Écrire les tests unitaires du DesignPanel
    - Tester l'affichage des descriptions de section et le message d'état vide
    - _Requirements : 4.1, 4.2_

- [x] 6. Ajouter les textes descriptifs sur le LogicPanel
  - Modifier `studio/app/src/ui/logic/LogicPanel.tsx` :
    - Vérifier et mettre à jour les descriptions de section existantes en français (What happens, What it shows, When it shows, List mode, Page variables, Animation)
    - Mettre à jour le message d'état vide en français : "Sélectionnez un composant sur le canvas pour configurer sa logique."
    - Afficher "Aucun déclencheur configuré. Ajoutez-en un pour rendre ce composant interactif." quand aucun trigger n'existe
    - Mettre à jour le placeholder de binding selon le contexte (`inRepeat`) : "item.champ ou $state.variable…"
    - Mettre à jour la description de la section Page variables en français
    - Ajouter `Tooltip` sur chaque type d'action dans l'éditeur d'actions (setState, navigate, etc.)
    - Mettre à jour la bannière `inRepeat` en français : "Ce composant est dans une liste — les champs de l'élément courant sont disponibles."
  - _Requirements : 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [x] 6.1 Écrire les tests unitaires du LogicPanel
    - Tester les messages d'état vide, la bannière inRepeat et les descriptions de section
    - _Requirements : 5.2, 5.3, 5.7_

- [x] 7. Ajouter les textes descriptifs sur le CodePanel
  - Modifier `studio/app/src/ui/CodePanel.tsx` :
    - Mettre à jour le message d'état vide en français : "Sélectionnez un fichier dans l'explorateur pour visualiser son code généré."
    - Mettre à jour le message de chargement en français : "Génération des fichiers du projet en cours…"
    - Entourer le bouton de copie avec `Tooltip` "Copier le contenu" et le bouton d'édition avec "Modifier ce fichier"
    - Afficher la bannière mode édition en français : "Mode édition — Les modifications seront synchronisées avec le projet."
    - Entourer le bouton de rechargement avec `Tooltip` "Rafraîchir les fichiers générés"
  - _Requirements : 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 7.1 Écrire les tests unitaires du CodePanel
    - Tester les messages d'état vide, de chargement et la bannière mode édition
    - _Requirements : 6.1, 6.2, 6.4_

- [x] 8. Ajouter les textes descriptifs sur le DeviceCanvas
  - Modifier `studio/app/src/ui/DeviceCanvas.tsx` :
    - Remplacer le texte "No content" par "Aucun contenu — Ajoutez des composants depuis la bibliothèque."
    - Entourer chaque onglet de page dans `pageTabs` avec `Tooltip` affichant le nom complet de l'écran
    - Afficher un badge "PREVIEW" visible sur le canvas quand `previewMode` est actif
  - _Requirements : 7.1, 7.2, 7.3_

  - [x] 8.1 Écrire les tests unitaires du DeviceCanvas
    - Tester le message d'état vide et l'affichage du badge PREVIEW
    - _Requirements : 7.1, 7.3_

- [x] 9. Checkpoint — Vérifier que tous les tests passent
  - S'assurer que tous les tests passent, poser des questions à l'utilisateur si nécessaire.

- [x] 10. Implémenter la responsivité de la Topbar
  - Modifier `studio/app/src/ui/Topbar.tsx` :
    - Utiliser `useWindowSize` pour détecter la largeur de la fenêtre
    - En dessous de 1024px : regrouper Import, Export, Reset dans un menu déroulant "Plus d'options"
    - En dessous de 768px : masquer le label texte "Flipova Studio" (conserver uniquement l'icône)
    - Maintenir la hauteur fixe de 44px
    - Activer le défilement horizontal sur la zone des boutons si débordement
    - Garantir que le sélecteur de device et le zoom restent sur une seule ligne
  - _Requirements : 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 10.1 Écrire les tests de responsivité de la Topbar
    - Tester le regroupement des boutons à 1024px et le masquage du label à 768px
    - _Requirements : 8.1, 8.2_

- [x] 11. Implémenter la responsivité du LibraryPanel
  - Modifier `studio/app/src/ui/LibraryPanel.tsx` :
    - Utiliser `usePanelWidth` (déjà existant dans `shared/`) pour adapter la largeur entre 180px et 280px
    - En dessous de 200px : masquer le sous-titre (`itemSub`) des composants
    - Ajouter `numberOfLines={1}` avec ellipse sur les labels (déjà partiellement présent, vérifier la cohérence)
    - Vérifier que les onglets de sous-catégories défilent horizontalement sans retour à la ligne
  - _Requirements : 9.1, 9.2, 9.3, 9.4_

  - [x] 11.1 Écrire les tests de responsivité du LibraryPanel
    - Tester le masquage du sous-titre en dessous de 200px et la troncature des labels
    - _Requirements : 9.2, 9.3_

- [x] 12. Implémenter la responsivité du LayersPanel
  - Modifier `studio/app/src/ui/LayersPanel.tsx` :
    - Intégrer `ResizeHandle` (déjà existant dans `shared/`) pour permettre le redimensionnement vertical entre 160px et 320px
    - Ajouter `numberOfLines={1}` avec ellipse sur les noms de nœuds
    - En dessous de 200px de hauteur : masquer les badges binding et repeat, conserver condition et événement
    - Garantir que les boutons d'action d'un nœud sélectionné restent sur une seule ligne (réduire les espacements si nécessaire)
  - _Requirements : 10.1, 10.2, 10.3, 10.4_

  - [x] 12.1 Écrire les tests de responsivité du LayersPanel
    - Tester le redimensionnement et le masquage des badges secondaires
    - _Requirements : 10.1, 10.3_

- [x] 13. Implémenter la responsivité du DesignPanel
  - Modifier `studio/app/src/ui/DesignPanel.tsx` :
    - Utiliser `usePanelWidth` pour adapter la largeur entre 220px et 360px
    - En dessous de 260px : afficher les champs `NRow` sur deux colonnes au lieu de quatre
    - Vérifier que `flexWrap` est actif sur les boutons `Seg` (déjà présent, valider le comportement)
    - Vérifier que la `SpacingBox` reste utilisable entre 220px et 360px
    - Tronquer les labels de champs trop longs avec ellipse sans masquer la valeur
  - _Requirements : 11.1, 11.2, 11.3, 11.4, 11.5_

  - [x] 13.1 Écrire les tests de responsivité du DesignPanel
    - Tester le passage à deux colonnes en dessous de 260px et la troncature des labels
    - _Requirements : 11.2, 11.5_

- [x] 14. Implémenter la responsivité du LogicPanel
  - Modifier `studio/app/src/ui/logic/LogicPanel.tsx` :
    - Utiliser `usePanelWidth` pour adapter la largeur entre 220px et 360px
    - Vérifier que `pickerGrid` utilise `flexWrap` pour éviter tout débordement horizontal
    - En dessous de 260px : afficher les champs de binding en pleine largeur sur une seule colonne
    - Tronquer les noms de variables et de champs avec ellipse sans masquer les contrôles d'action
  - _Requirements : 12.1, 12.2, 12.3, 12.4_

  - [x] 14.1 Écrire les tests de responsivité du LogicPanel
    - Tester le passage en colonne unique en dessous de 260px et la troncature des noms
    - _Requirements : 12.3, 12.4_

- [x] 15. Implémenter la responsivité du CodePanel
  - Modifier `studio/app/src/ui/CodePanel.tsx` :
    - En dessous de 600px de largeur totale : réduire la largeur de l'explorateur à 140px
    - Tronquer le chemin du fichier sélectionné avec ellipse dans la barre d'onglets
    - Vérifier l'alignement des numéros de ligne quelle que soit la taille de police
    - En mode édition : adapter la hauteur de la zone de texte pour occuper tout l'espace vertical disponible
  - _Requirements : 13.1, 13.2, 13.3, 13.4_

  - [x] 15.1 Écrire les tests de responsivité du CodePanel
    - Tester la réduction de l'explorateur à 140px et la troncature du chemin de fichier
    - _Requirements : 13.1, 13.2_

- [x] 16. Implémenter la responsivité du DeviceCanvas
  - Modifier `studio/app/src/ui/DeviceCanvas.tsx` :
    - Calculer automatiquement le zoom initial pour que le device soit entièrement visible dans l'espace central
    - Activer le défilement vertical sur le viewport quand la hauteur centrale est insuffisante (déjà partiellement présent via `ScrollView`, vérifier)
    - Vérifier que `pageTabs` défile horizontalement sans retour à la ligne
    - En dessous de 320px de largeur centrale : réduire automatiquement le zoom
  - _Requirements : 14.1, 14.2, 14.3, 14.4_

  - [x] 16.1 Écrire les tests de responsivité du DeviceCanvas
    - Tester le calcul du zoom initial et la réduction automatique en dessous de 320px
    - _Requirements : 14.1, 14.4_

- [x] 17. Checkpoint — Vérifier que tous les tests passent
  - S'assurer que tous les tests passent, poser des questions à l'utilisateur si nécessaire.

- [x] 18. Implémenter la non-superposition des éléments (Requirement 15)
  - Vérifier et corriger les z-index dans `studio/app/app/index.tsx` (layout principal) pour garantir qu'aucun panneau ne chevauche un autre
  - Implémenter la logique de recalcul de disposition lors du redimensionnement d'un panneau (utiliser `useWindowSize` et les largeurs/hauteurs des panneaux)
  - Vérifier que les modales et menus déroulants ont un z-index supérieur à tous les autres éléments
  - Garantir que les panneaux latéraux ne recouvrent jamais le DeviceCanvas (contrainte de largeur minimale du canvas)
  - _Requirements : 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [x] 18.1 Écrire les tests de non-superposition
    - Tester aux breakpoints 768px, 1024px, 1280px que les panneaux ne se chevauchent pas
    - _Requirements : 15.1, 15.6_

- [x] 19. Implémenter les améliorations UX générales (Requirement 16)
  - [x] 19.1 Créer le composant `Toast` partagé dans `studio/app/src/ui/shared/Toast.tsx`
    - Afficher un retour visuel positif (badge vert) pendant 2000ms après une opération réussie
    - Afficher un message d'erreur descriptif avec cause et action corrective en cas d'échec
    - _Requirements : 16.2, 16.3_

  - [x] 19.2 Ajouter les états de chargement visuels
    - Modifier `Topbar.tsx` : afficher un spinner sur le bouton Générer pendant la génération
    - Modifier `CodePanel.tsx` : afficher un skeleton ou spinner pendant le chargement des fichiers (> 300ms)
    - _Requirements : 16.1_

  - [x] 19.3 Ajouter les confirmations pour les actions irréversibles
    - Modifier `Topbar.tsx` : afficher une confirmation avant `resetProject`
    - Modifier `LayersPanel.tsx` : afficher une confirmation avant `removeNode`
    - _Requirements : 16.5_

  - [x] 19.4 Persister l'état de repliement des sections entre les sélections
    - Modifier `DesignPanel.tsx` et `LogicPanel.tsx` : stocker l'état ouvert/fermé de chaque section dans un `useRef` ou `localStorage` pour le conserver entre les sélections de composants
    - _Requirements : 16.6_

  - [x] 19.5 Afficher l'indicateur de taille lors du redimensionnement d'un panneau
    - Modifier `ResizeHandle.tsx` : afficher un badge avec la largeur/hauteur courante du panneau pendant le drag
    - _Requirements : 16.7_

  - [x] 19.6 Écrire les tests unitaires des améliorations UX
    - Tester l'affichage du Toast, les confirmations et la persistance de l'état des sections
    - _Requirements : 16.2, 16.3, 16.5, 16.6_

- [x] 20. Checkpoint final — Vérifier que tous les tests passent
  - S'assurer que tous les tests passent, poser des questions à l'utilisateur si nécessaire.

## Notes

- Les tâches marquées `*` sont optionnelles et peuvent être ignorées pour un MVP rapide
- Chaque tâche référence les requirements correspondants pour la traçabilité
- Le composant `Tooltip` (tâche 1) est un prérequis pour toutes les tâches 2 à 8
- `useWindowSize` (tâche 1) est un prérequis pour les tâches 10 à 18
- Les fichiers `ResizeHandle.tsx` et `usePanelWidth.ts` existent déjà dans `shared/` et doivent être réutilisés
