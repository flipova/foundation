# Document de Requirements

## Introduction

Cette feature couvre les améliorations UI/UX du Flipova Studio, un builder visuel React Native no-code/low-code. Les améliorations portent sur quatre axes principaux : l'ajout de textes descriptifs contextuels sur chaque panneau, champ et fonctionnalité ; la responsivité complète de l'interface sur toutes les tailles d'écran ; la prévention de toute superposition de textes, champs et zones ; et l'amélioration générale de l'expérience utilisateur.

Le studio est composé des panneaux suivants : **Topbar** (barre d'outils supérieure), **LibraryPanel** (bibliothèque de composants), **LayersPanel** (arbre des composants et écrans), **DesignPanel** (propriétés visuelles), **LogicPanel** (actions, états, animations, bindings), **CodePanel** (code généré), et **DeviceCanvas** (canvas de prévisualisation).

## Glossaire

- **Studio** : L'application Flipova Studio dans son ensemble.
- **Topbar** : La barre d'outils horizontale en haut du Studio (44px de hauteur).
- **LibraryPanel** : Le panneau gauche listant les composants disponibles à glisser-déposer.
- **LayersPanel** : Le panneau inférieur gauche affichant l'arbre des composants de la page active et la liste des écrans.
- **DesignPanel** : Le panneau droit affichant les propriétés visuelles (styles) du composant sélectionné.
- **LogicPanel** : Le panneau droit affichant la logique (événements, bindings, conditions, répétitions, variables, animations) du composant sélectionné.
- **CodePanel** : Le panneau pleine largeur affichant l'explorateur de fichiers et le code généré.
- **DeviceCanvas** : Le panneau central affichant la prévisualisation du projet dans un cadre de device simulé.
- **Tooltip** : Bulle d'aide contextuelle apparaissant au survol ou au focus d'un élément interactif.
- **Placeholder** : Texte indicatif affiché dans un champ vide pour guider l'utilisateur.
- **Section** : Bloc repliable regroupant des champs liés dans un panneau (ex. "Layout", "Spacing", "What happens").
- **Breakpoint** : Seuil de largeur d'écran déclenchant un changement de mise en page (ex. 768px, 1024px, 1280px).
- **Overflow** : Débordement visuel d'un élément hors de son conteneur.
- **Truncation** : Troncature d'un texte trop long avec ellipse (`…`).

---

## Requirements

### Requirement 1 : Textes descriptifs sur la Topbar

**User Story :** En tant qu'utilisateur du Studio, je veux comprendre le rôle de chaque bouton de la barre d'outils, afin de pouvoir utiliser les fonctionnalités sans avoir à deviner leur effet.

#### Acceptance Criteria

1. WHEN l'utilisateur survole un bouton de la Topbar pendant 500ms, THE Studio SHALL afficher un Tooltip contenant le nom et une description courte de l'action associée (ex. "Générer — Exporte le code React Native du projet").
2. THE Topbar SHALL afficher un Tooltip pour chacun des boutons suivants : Undo, Redo, Reset, Import, Export, Services, Queries, Fonctions personnalisées, Paramètres, Thème, Prévisualisation, Code, Générer.
3. WHEN le sélecteur de device est affiché, THE Topbar SHALL afficher un label "Appareil de prévisualisation" au-dessus de la liste déroulante.
4. WHEN le contrôle de zoom est affiché, THE Topbar SHALL afficher un Tooltip "Zoom — Ajuster l'échelle du canvas" au survol.
5. IF un bouton de la Topbar est désactivé (ex. Undo sans historique), THEN THE Topbar SHALL afficher dans le Tooltip la raison de la désactivation (ex. "Aucune action à annuler").

---

### Requirement 2 : Textes descriptifs sur le LibraryPanel

**User Story :** En tant qu'utilisateur du Studio, je veux comprendre les catégories et les composants disponibles dans la bibliothèque, afin de choisir le bon composant à ajouter à mon écran.

#### Acceptance Criteria

1. THE LibraryPanel SHALL afficher un texte d'en-tête descriptif sous les onglets principaux ("library" / "custom") expliquant le rôle de l'onglet actif.
2. WHEN l'onglet "library" est actif, THE LibraryPanel SHALL afficher la description : "Glissez ou cliquez un composant pour l'ajouter à l'écran sélectionné."
3. WHEN l'onglet "custom" est actif et qu'aucun template n'existe, THE LibraryPanel SHALL afficher le message : "Aucun template personnalisé. Sélectionnez un composant sur le canvas et sauvegardez-le comme template."
4. WHEN l'utilisateur survole un composant de la liste, THE LibraryPanel SHALL afficher un Tooltip contenant le nom complet et la catégorie du composant.
5. THE LibraryPanel SHALL afficher un Placeholder "Rechercher un composant…" dans le champ de recherche.
6. WHEN la recherche ne retourne aucun résultat, THE LibraryPanel SHALL afficher le message : "Aucun composant trouvé pour « [terme] »."

---

### Requirement 3 : Textes descriptifs sur le LayersPanel

**User Story :** En tant qu'utilisateur du Studio, je veux comprendre la structure de l'arbre des composants et les actions disponibles sur chaque nœud, afin de gérer efficacement la hiérarchie de mon écran.

#### Acceptance Criteria

1. WHEN l'onglet "LAYERS" est actif et que la page ne contient aucun composant, THE LayersPanel SHALL afficher le message : "Aucun composant sur cet écran. Ajoutez-en depuis la bibliothèque."
2. WHEN l'onglet "SCREENS" est actif et qu'aucun écran n'existe, THE LayersPanel SHALL afficher le message : "Aucun écran. Créez votre premier écran avec le bouton ci-dessous."
3. WHEN l'utilisateur survole l'icône d'indicateur d'un nœud (condition, répétition, événement, binding), THE LayersPanel SHALL afficher un Tooltip décrivant l'indicateur (ex. "Condition de visibilité active", "Répétition de liste active").
4. WHEN le mode déplacement (movingId) est actif, THE LayersPanel SHALL afficher la bannière : "Sélectionnez une zone de dépôt ou annulez le déplacement."
5. THE LayersPanel SHALL afficher un Tooltip "Déplacer vers le haut" sur le bouton chevron-up et "Déplacer vers le bas" sur le bouton chevron-down de chaque nœud sélectionné.
6. WHEN un slot nommé est vide, THE LayersPanel SHALL afficher le label "vide" à côté du nom du slot.
7. THE LayersPanel SHALL afficher un Tooltip "Supprimer ce composant" sur le bouton de suppression de chaque nœud.

---

### Requirement 4 : Textes descriptifs sur le DesignPanel

**User Story :** En tant qu'utilisateur du Studio, je veux comprendre le rôle de chaque section et champ de propriétés visuelles, afin de styliser mes composants sans ambiguïté.

#### Acceptance Criteria

1. THE DesignPanel SHALL afficher une description courte sous le titre de chaque Section (Layout, Item, Dimensions, Spacing, Position, Appearance, Border, Typography, Effects) lorsque la section est ouverte.
2. WHEN aucun composant n'est sélectionné, THE DesignPanel SHALL afficher le message : "Sélectionnez un composant sur le canvas pour modifier ses propriétés visuelles."
3. THE DesignPanel SHALL afficher un Tooltip sur chaque champ numérique (N) contenant le nom complet de la propriété CSS/RN correspondante (ex. "flexGrow — Facteur d'expansion du composant dans son conteneur").
4. THE DesignPanel SHALL afficher un Tooltip sur chaque bouton de segmentation (Seg) décrivant l'effet de l'option (ex. "row — Disposition horizontale des enfants").
5. WHEN la section "Spacing" est ouverte, THE DesignPanel SHALL afficher les labels "MARGE" et "PADDING" dans la boîte de visualisation SpacingBox.
6. WHEN la position est "absolute", THE DesignPanel SHALL afficher la description : "Position absolue — Le composant est positionné par rapport à son parent le plus proche."

---

### Requirement 5 : Textes descriptifs sur le LogicPanel

**User Story :** En tant qu'utilisateur du Studio, je veux comprendre chaque section de logique et les actions disponibles, afin de configurer les interactions de mes composants sans expertise en code.

#### Acceptance Criteria

1. THE LogicPanel SHALL afficher une description d'une phrase sous le titre de chaque Section (What happens, What it shows, When it shows, List mode, Page variables, Animation) lorsque la section est ouverte.
2. WHEN aucun composant n'est sélectionné, THE LogicPanel SHALL afficher le message : "Sélectionnez un composant sur le canvas pour configurer sa logique."
3. WHEN la section "What happens" ne contient aucun trigger, THE LogicPanel SHALL afficher le message : "Aucun déclencheur configuré. Ajoutez-en un pour rendre ce composant interactif."
4. WHEN la section "What it shows" affiche un champ de binding, THE LogicPanel SHALL afficher un Placeholder contextuel selon le contexte (ex. "item.champ ou $state.variable…" dans un contexte de liste).
5. WHEN la section "Page variables" est ouverte, THE LogicPanel SHALL afficher la description : "Les variables stockent des données sur cette page : saisie utilisateur, réponses API, état de l'interface."
6. THE LogicPanel SHALL afficher un Tooltip sur chaque type d'action disponible dans l'éditeur d'actions (ex. "setState — Modifier la valeur d'une variable de page").
7. WHEN le composant est dans un contexte de liste (inRepeat), THE LogicPanel SHALL afficher la bannière : "Ce composant est dans une liste — les champs de l'élément courant sont disponibles."

---

### Requirement 6 : Textes descriptifs sur le CodePanel

**User Story :** En tant qu'utilisateur du Studio, je veux comprendre l'explorateur de fichiers et les actions disponibles dans le panneau de code, afin de naviguer et modifier le code généré en toute confiance.

#### Acceptance Criteria

1. WHEN aucun fichier n'est sélectionné dans l'explorateur, THE CodePanel SHALL afficher le message : "Sélectionnez un fichier dans l'explorateur pour visualiser son code généré."
2. WHEN le chargement des fichiers est en cours, THE CodePanel SHALL afficher le message : "Génération des fichiers du projet en cours…"
3. THE CodePanel SHALL afficher un Tooltip "Copier le contenu" sur le bouton de copie et "Modifier ce fichier" sur le bouton d'édition.
4. WHEN le mode édition est actif, THE CodePanel SHALL afficher la bannière : "Mode édition — Les modifications seront synchronisées avec le projet."
5. THE CodePanel SHALL afficher un Tooltip "Rafraîchir les fichiers générés" sur le bouton de rechargement.

---

### Requirement 7 : Textes descriptifs sur le DeviceCanvas

**User Story :** En tant qu'utilisateur du Studio, je veux comprendre les contrôles de navigation entre écrans et les options de prévisualisation, afin de naviguer efficacement dans mon projet.

#### Acceptance Criteria

1. WHEN aucun contenu n'est présent sur l'écran actif, THE DeviceCanvas SHALL afficher le message : "Aucun contenu — Ajoutez des composants depuis la bibliothèque."
2. THE DeviceCanvas SHALL afficher un Tooltip sur chaque onglet de page dans la barre de navigation supérieure contenant le nom complet de l'écran.
3. WHEN le mode prévisualisation est actif, THE DeviceCanvas SHALL afficher un badge "PREVIEW" visible sur le canvas indiquant que les interactions sont actives.

---

### Requirement 8 : Responsivité de la Topbar

**User Story :** En tant qu'utilisateur du Studio sur différentes tailles d'écran, je veux que la barre d'outils reste utilisable et lisible, afin de ne pas perdre l'accès aux fonctionnalités essentielles.

#### Acceptance Criteria

1. WHILE la largeur de la fenêtre est inférieure à 1024px, THE Topbar SHALL regrouper les boutons secondaires (Import, Export, Reset) dans un menu déroulant "Plus d'options".
2. WHILE la largeur de la fenêtre est inférieure à 768px, THE Topbar SHALL masquer le label texte "Flipova Studio" et conserver uniquement l'icône logo.
3. THE Topbar SHALL maintenir une hauteur fixe de 44px quelle que soit la largeur de la fenêtre.
4. IF les boutons de la Topbar dépassent la largeur disponible, THEN THE Topbar SHALL activer le défilement horizontal sur la zone des boutons sans provoquer d'Overflow visible.
5. THE Topbar SHALL afficher le sélecteur de device et le contrôle de zoom sur une seule ligne sans troncature du texte quelle que soit la taille d'écran supportée.

---

### Requirement 9 : Responsivité du LibraryPanel

**User Story :** En tant qu'utilisateur du Studio sur différentes tailles d'écran, je veux que le panneau de bibliothèque s'adapte à la largeur disponible, afin de toujours voir les composants correctement.

#### Acceptance Criteria

1. THE LibraryPanel SHALL adapter sa largeur entre 180px (minimum) et 280px (maximum) en fonction de l'espace disponible.
2. WHILE la largeur du LibraryPanel est inférieure à 200px, THE LibraryPanel SHALL masquer le sous-titre des composants et conserver uniquement le label principal.
3. THE LibraryPanel SHALL tronquer les labels de composants trop longs avec une ellipse (`…`) sans provoquer d'Overflow horizontal.
4. THE LibraryPanel SHALL afficher les onglets de sous-catégories (Layouts, Components, Blocks, Primitives) sur une ligne avec défilement horizontal si nécessaire, sans retour à la ligne.

---

### Requirement 10 : Responsivité du LayersPanel

**User Story :** En tant qu'utilisateur du Studio sur différentes tailles d'écran, je veux que l'arbre des composants reste lisible et utilisable, afin de gérer la hiérarchie de mon écran sans difficulté.

#### Acceptance Criteria

1. THE LayersPanel SHALL adapter sa hauteur entre 160px (minimum) et 320px (maximum) via un handle de redimensionnement vertical.
2. THE LayersPanel SHALL tronquer les noms de nœuds trop longs avec une ellipse (`…`) sans provoquer d'Overflow horizontal.
3. WHILE la hauteur du LayersPanel est inférieure à 200px, THE LayersPanel SHALL masquer les badges d'indicateurs secondaires (binding, repeat) et conserver uniquement les indicateurs principaux (condition, événement).
4. THE LayersPanel SHALL afficher les boutons d'action d'un nœud sélectionné sur une seule ligne sans débordement, en réduisant les espacements si nécessaire.

---

### Requirement 11 : Responsivité du DesignPanel

**User Story :** En tant qu'utilisateur du Studio sur différentes tailles d'écran, je veux que les champs de propriétés visuelles s'adaptent à la largeur du panneau, afin de saisir les valeurs sans superposition ni débordement.

#### Acceptance Criteria

1. THE DesignPanel SHALL adapter sa largeur entre 220px (minimum) et 360px (maximum).
2. WHILE la largeur du DesignPanel est inférieure à 260px, THE DesignPanel SHALL afficher les champs numériques (NRow) sur deux colonnes au lieu de quatre.
3. THE DesignPanel SHALL adapter les boutons de segmentation (Seg) avec flexWrap pour qu'ils passent à la ligne suivante sans Overflow horizontal.
4. THE DesignPanel SHALL adapter la SpacingBox pour qu'elle reste entièrement visible et utilisable quelle que soit la largeur du panneau entre 220px et 360px.
5. IF un label de champ est trop long pour la largeur disponible, THEN THE DesignPanel SHALL tronquer le label avec une ellipse (`…`) sans masquer la valeur du champ.

---

### Requirement 12 : Responsivité du LogicPanel

**User Story :** En tant qu'utilisateur du Studio sur différentes tailles d'écran, je veux que les sections de logique s'adaptent à la largeur du panneau, afin de configurer les interactions sans superposition de contenu.

#### Acceptance Criteria

1. THE LogicPanel SHALL adapter sa largeur entre 220px (minimum) et 360px (maximum).
2. THE LogicPanel SHALL afficher les boutons du sélecteur d'événements (pickerGrid) avec flexWrap pour éviter tout Overflow horizontal.
3. WHILE la largeur du LogicPanel est inférieure à 260px, THE LogicPanel SHALL afficher les champs de binding en pleine largeur sur une seule colonne.
4. THE LogicPanel SHALL tronquer les noms de variables et de champs trop longs avec une ellipse (`…`) sans masquer les contrôles d'action associés.

---

### Requirement 13 : Responsivité du CodePanel

**User Story :** En tant qu'utilisateur du Studio sur différentes tailles d'écran, je veux que l'explorateur de fichiers et la visionneuse de code s'adaptent à l'espace disponible, afin de lire et modifier le code généré confortablement.

#### Acceptance Criteria

1. WHILE la largeur totale du CodePanel est inférieure à 600px, THE CodePanel SHALL réduire la largeur de l'explorateur de fichiers à 140px.
2. THE CodePanel SHALL afficher le chemin du fichier sélectionné tronqué avec une ellipse (`…`) si la largeur de la barre d'onglets est insuffisante.
3. THE CodePanel SHALL maintenir les numéros de ligne alignés avec les lignes de code correspondantes quelle que soit la taille de la police ou la largeur du panneau.
4. WHILE le mode édition est actif, THE CodePanel SHALL adapter la hauteur de la zone de texte pour occuper tout l'espace vertical disponible.

---

### Requirement 14 : Responsivité du DeviceCanvas

**User Story :** En tant qu'utilisateur du Studio sur différentes tailles d'écran, je veux que le canvas de prévisualisation s'adapte à l'espace central disponible, afin de toujours voir le device simulé correctement.

#### Acceptance Criteria

1. THE DeviceCanvas SHALL calculer automatiquement un zoom initial de sorte que le device simulé soit entièrement visible dans l'espace central disponible au chargement.
2. WHILE la hauteur de la zone centrale est inférieure à la hauteur du device simulé au zoom courant, THE DeviceCanvas SHALL activer le défilement vertical sur le viewport.
3. THE DeviceCanvas SHALL afficher la barre de navigation des pages (pageTabs) sur une ligne avec défilement horizontal si le nombre de pages dépasse la largeur disponible, sans retour à la ligne.
4. IF la largeur de l'espace central est inférieure à 320px, THEN THE DeviceCanvas SHALL réduire automatiquement le zoom pour que le device simulé reste entièrement visible.

---

### Requirement 15 : Non-superposition des éléments

**User Story :** En tant qu'utilisateur du Studio, je veux qu'aucun texte, champ ou zone ne se superpose à un autre élément quelle que soit la taille de l'écran ou des panneaux, afin de toujours pouvoir lire et interagir avec tous les éléments de l'interface.

#### Acceptance Criteria

1. THE Studio SHALL garantir qu'aucun composant d'interface ne chevauche un autre composant d'interface à aucun Breakpoint (320px, 768px, 1024px, 1280px, 1920px de largeur).
2. WHEN un panneau est redimensionné, THE Studio SHALL recalculer la disposition de tous les panneaux adjacents pour éviter tout chevauchement.
3. THE Studio SHALL garantir que les Tooltips s'affichent toujours dans les limites de la fenêtre du navigateur sans débordement.
4. IF un Tooltip risque de dépasser le bord droit ou inférieur de la fenêtre, THEN THE Studio SHALL repositionner le Tooltip vers la gauche ou vers le haut selon le cas.
5. THE Studio SHALL garantir que les modales et menus déroulants s'affichent toujours au-dessus de tous les autres éléments de l'interface sans chevauchement partiel.
6. WHEN les panneaux latéraux (LibraryPanel, DesignPanel/LogicPanel) sont affichés simultanément avec le DeviceCanvas, THE Studio SHALL garantir qu'aucun panneau ne recouvre le DeviceCanvas.

---

### Requirement 16 : Amélioration générale de l'expérience utilisateur

**User Story :** En tant qu'utilisateur du Studio, je veux une interface cohérente, réactive et guidante, afin de créer des applications React Native efficacement sans frustration.

#### Acceptance Criteria

1. THE Studio SHALL afficher un état de chargement visuel (spinner ou skeleton) pour chaque opération asynchrone dépassant 300ms (génération de code, chargement du projet, sauvegarde).
2. WHEN une opération réussit (génération, sauvegarde, copie), THE Studio SHALL afficher un retour visuel positif (badge vert ou message de confirmation) pendant 2000ms.
3. IF une opération échoue, THEN THE Studio SHALL afficher un message d'erreur descriptif indiquant la cause et une action corrective possible.
4. THE Studio SHALL maintenir un contraste de couleur d'au moins 4.5:1 entre le texte et son arrière-plan pour tous les textes de taille inférieure à 18px dans l'interface.
5. WHEN l'utilisateur effectue une action irréversible (suppression d'un composant, reset du projet), THE Studio SHALL afficher une confirmation explicite avant d'exécuter l'action.
6. THE Studio SHALL conserver l'état de repliement/déploiement de chaque Section de panneau entre les sélections de composants successives.
7. WHEN l'utilisateur redimensionne un panneau, THE Studio SHALL afficher un indicateur visuel de la largeur/hauteur courante du panneau en temps réel.
