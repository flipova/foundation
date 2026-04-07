# Tasks: Studio Right Panel Redesign

## Task List

- [x] 1. Aligner la palette C dans PropertiesPanel.tsx
  - [x] 1.1 Remplacer `C.bg = '#080c18'` par `'#07090f'`
  - [x] 1.2 Remplacer `C.muted = '#6a7494'` par `'#4a5470'`
  - [x] 1.3 Ajouter `C.surface = '#0d1220'` si absent

- [x] 2. Redesign du NodeHeader (PropertiesPanel)
  - [x] 2.1 Appliquer `backgroundColor: C.bg` au header
  - [x] 2.2 Entourer l'icône de kind dans un badge 22×22 `borderRadius: 6` avec fond semi-transparent
  - [x] 2.3 Mettre à jour les styles du nom (`letterSpacing: -0.2`) et du kind badge (uppercase, `letterSpacing: 0.8`)
  - [x] 2.4 Mettre à jour les variant pills (`borderRadius: 5`, padding 7×3, actif = primary)

- [x] 3. Redesign de la TabBar (PropertiesPanel)
  - [x] 3.1 Appliquer `backgroundColor: C.bg`, `paddingHorizontal: 4` au container
  - [x] 3.2 Mettre à jour les styles de tab (`paddingVertical: 9`, `paddingHorizontal: 10`)
  - [x] 3.3 Remplacer `borderBottomWidth: 2` par un indicateur bottom absolu 2 px `borderRadius: 1`
  - [x] 3.4 Mettre à jour les styles de texte (inactif: 11/500/muted, actif: primary/600)

- [x] 4. Redesign des Sections dans PropertiesPanel
  - [x] 4.1 Appliquer `backgroundColor: C.bg` au header de section
  - [x] 4.2 Entourer l'icône de groupe dans un badge 20×20 `borderRadius: 5`
  - [x] 4.3 Mettre à jour le titre (`letterSpacing: -0.1`, `fontWeight: '600'`)
  - [x] 4.4 Appliquer `backgroundColor: C.surface` au body de section

- [x] 5. Redesign du PropEditor
  - [x] 5.1 Entourer chaque prop dans un conteneur `backgroundColor: C.surface`, `borderRadius: 6`, `padding: 8`
  - [x] 5.2 Mettre à jour le label de prop (`fontSize: 10`, `fontWeight: '600'`, `color: C.muted`)
  - [x] 5.3 Mettre à jour le bound indicator (fond `rgba(167,139,250,0.12)`, `borderRadius: 4`)
  - [x] 5.4 Mettre à jour les boutons auto et reset (`borderRadius: 5`, hauteur 22 px)

- [x] 6. Aligner la palette C dans DesignPanel.tsx
  - [x] 6.1 Remplacer `C.bg = '#080c18'` par `'#07090f'`
  - [x] 6.2 Remplacer `C.muted = '#6a7494'` par `'#4a5470'` (si différent)
  - [x] 6.3 Vérifier que `C.s2 = '#131a2e'` correspond à `C.surface2`

- [x] 7. Redesign des Sections dans DesignPanel
  - [x] 7.1 Appliquer `backgroundColor: C.bg` au sHead
  - [x] 7.2 Mettre à jour sIcon à 22×22 `borderRadius: 6`
  - [x] 7.3 Mettre à jour sTitle (`fontWeight: '700'`, `letterSpacing: -0.1`)
  - [x] 7.4 Appliquer `backgroundColor: C.surface` au sBody avec padding mis à jour

- [x] 8. Redesign des Seg buttons dans DesignPanel
  - [x] 8.1 Appliquer `backgroundColor: C.surface2`, `borderRadius: 6`, `borderWidth: 1`, `borderColor: C.border`
  - [x] 8.2 Mettre à jour le padding (`paddingHorizontal: 8`, `paddingVertical: 5`)
  - [x] 8.3 Mettre à jour les styles de texte (10/500/muted, actif: fff/600)

- [x] 9. Redesign des champs numériques (N) dans DesignPanel
  - [x] 9.1 Appliquer `backgroundColor: C.surface2`, `borderRadius: 6`, `borderWidth: 1`, `borderColor: C.border` au nWrap
  - [x] 9.2 Mettre à jour le label (`fontSize: 9`, `fontWeight: '500'`, `marginBottom: 2`)
  - [x] 9.3 Mettre à jour l'input (`fontSize: 11`, `color: C.text`, `fontWeight: '500'`)

- [x] 10. Redesign des Sub labels dans DesignPanel
  - [x] 10.1 Appliquer `fontWeight: '700'`, `letterSpacing: 0.6`, `textTransform: 'uppercase'`
  - [x] 10.2 Mettre à jour les marges (`marginTop: 10`, `marginBottom: 4`)

- [x] 11. Aligner la palette C dans LogicPanel.tsx (via constants.ts)
  - [x] 11.1 Vérifier que `C.bg` dans `constants.ts` correspond à `'#07090f'`
  - [x] 11.2 Vérifier que `C.muted` correspond à `'#4a5470'`

- [x] 12. Redesign des Sections dans LogicPanel
  - [x] 12.1 Appliquer `backgroundColor: C.bg` au sHead
  - [x] 12.2 Mettre à jour sIconBox à 22×22 `borderRadius: 6`
  - [x] 12.3 Mettre à jour sTitle (`fontWeight: '700'`, `letterSpacing: -0.1`)
  - [x] 12.4 Appliquer `backgroundColor: C.surface` au sBody avec padding mis à jour

- [x] 13. Redesign du bouton "Add trigger" dans LogicPanel
  - [x] 13.1 Mettre à jour `borderRadius: 7`, `paddingVertical: 9`
  - [x] 13.2 Mettre à jour le texte (`fontSize: 11`, `fontWeight: '600'`)

- [x] 14. Vérification de non-régression
  - [x] 14.1 Vérifier que getDiagnostics ne retourne aucune erreur sur les 3 fichiers modifiés
  - [x] 14.2 Vérifier visuellement que les sections collapsibles fonctionnent toujours
  - [x] 14.3 Vérifier que la disposition en colonne ne déborde pas à 240 px
