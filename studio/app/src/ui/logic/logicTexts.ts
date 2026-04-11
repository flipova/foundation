/**
 * Logic Panel — Text constants
 * Exported for use in LogicPanel, ActionEditor, and tests.
 */

export const LOGIC_TEXTS = {
  emptyState: 'Sélectionnez un composant sur le canvas pour configurer sa logique.',
  noTriggers: 'Aucun déclencheur configuré. Ajoutez-en un pour rendre ce composant interactif.',
  inRepeatBanner: "Ce composant est dans une liste — les champs de l'élément courant sont disponibles.",
  bindingPlaceholderInRepeat: 'item.champ ou $state.variable…',
  bindingPlaceholderDefault: '$state.x ou lier une valeur…',
  sections: {
    whatHappens: "Définissez ce qui se passe quand l'utilisateur interagit avec ce composant (appui, chargement, etc.)",
    whatItShows: 'Connectez les propriétés de ce composant à des variables ou données pour qu\'elles se mettent à jour automatiquement.',
    whenItShows: 'Affichez ou masquez ce composant selon une condition (ex. uniquement si connecté).',
    listMode: "Répétez ce composant pour chaque élément d'une liste (ex. une carte par utilisateur).",
    pageVariables: "Les variables stockent des données sur cette page : saisie utilisateur, réponses API, état de l'interface.",
    animation: 'Définissez une animation d\'entrée ou de sortie pour ce composant.',
  },
  actionTooltips: {
    navigate:     "Navigate — Naviguer vers un autre écran",
    setState:     "Set State — Modifier la valeur d'une variable de page",
    callApi:      'Call API — Appeler une requête API configurée',
    callCustomFn: 'Custom Function — Exécuter une fonction personnalisée',
    openModal:    'Open Modal — Ouvrir une modale par son nom',
    closeModal:   'Close Modal — Fermer une modale par son nom',
    alert:        'Alert — Afficher une boîte de dialogue native',
    toast:        'Toast — Afficher une notification temporaire',
    consoleLog:   'Log — Afficher un message dans la console',
    haptics:      'Haptics — Déclencher un retour haptique',
    share:        'Share — Ouvrir le menu de partage natif',
    sendSMS:      'Send SMS — Envoyer un SMS',
    biometrics:   "Biometrics — Déclencher l'authentification biométrique",
    getLocation:  'Location — Récupérer la position GPS courante',
    clipboard:    'Clipboard — Copier du texte dans le presse-papiers',
    openURL:      'Open URL — Ouvrir une URL dans le navigateur',
    playSound:    'Play Sound — Jouer un fichier audio',
    custom:       'Custom Code — Exécuter du code JavaScript personnalisé',
  },
} as const;
