---
id: "FLP-CPT-001"
title: "Concepts et fonctionnement"
sidebar_label: "Concepts et fonctionnement"
---

<!-- Généré par « corral docs docusaurus » depuis documentation/v1.1/FLP-CPT-001_30_Concepts_et_Fonctionnement_v1.1.md — ne pas modifier ici, modifier le document source. -->

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | Concepts et fonctionnement |
| **Version**            | 1.1 |
| **Date de mise à jour** | 12/11/2026 |

## 1. Vue d'ensemble

```
registres XML (design/)  --gen-->  theme/design-theme.ts
                                         |
                              <FlipovaProvider adapter theme>
                                         |
   <Button/>  ->  ui (unifié)  ->  adaptateur choisi  ->  recette (valeurs de style exactes)
                          \-> sinon : composant flipova
```

Le contrat décrit les propriétés de 57 composants et fournit une recette par composant visuel : un thème en entrée, des valeurs de style exactes en sortie. Les fournisseurs appliquent ces valeurs avec leur bibliothèque.

## 2. Concepts clés

| **Concept** | **Définition** |
|-------------|----------------|
| Contrat | Les propriétés communes des 57 composants, identiques pour tous les fournisseurs. |
| Recette | Fonction pure : thème résolu en entrée, valeurs de style exactes (couleurs, rayons, espacements, tailles) en sortie. |
| Fournisseur | Adaptateur qui applique les recettes avec une bibliothèque : flipova, gluestack, reusables, paper, tamagui. |
| `ui` unifié | Les composants importés depuis le package : ils rendent celui du fournisseur monté. |
| Registres | Quatre fichiers XML de votre application (jetons, thèmes, manifeste, schéma) qui décrivent votre design. |
| Rôles obligatoires | Les 27 rôles de couleur que tout thème doit définir. |

## 3. Fonctionnement

1. `flipova-design gen` valide vos registres et compile `theme/design-theme.ts`.
2. `FlipovaProvider` reçoit un adaptateur, ce thème, et un mode (`light`, `dark` ou `system`).
3. Quand vous écrivez `<Button>`, le composant unifié regarde l'adaptateur monté. S'il fournit nativement ce composant, il l'utilise ; sinon, il rend celui de flipova.
4. Le composant calcule ses valeurs de style avec la recette du contrat et le thème résolu.

Sans fournisseur monté, les composants flipova sont utilisés.

## 4. Choix de conception

- **Les recettes sont l'unique source du design.** Un fournisseur n'invente aucune valeur : changer de bibliothèque ne change donc pas les couleurs, rayons ni espacements.
- **Le design appartient à l'application.** Le package ne livre qu'un point de départ neutre ; un rôle de couleur manquant est une erreur explicite.
- **Chaque bibliothèque n'est chargée que depuis son sous-chemin.** Importer le package racine ne tire aucune dépendance facultative.

## 5. Limites connues

- La parité entre fournisseurs est vérifiée sur les valeurs résolues, pas sur les pixels, et rien n'est rendu sur appareil dans les tests.
- Les animations ne sont pas vérifiées par les tests.
- `Icon` est un glyphe texte (pas de SVG) ; `Calendar` et `DateTimePicker` manipulent des dates `YYYY-MM-DD`.
- Quatre modules gluestack (bottomsheet, date-time-picker, image-viewer, slider) sont servis par flipova.

## 6. Glossaire

| **Terme** | **Signification** |
|-----------|-------------------|
| Adaptateur | Objet exporté par un sous-chemin de fournisseur (`paper`, `tamagui`…), passé à `FlipovaProvider`. |
| Repli | Service d'un composant par flipova lorsque la bibliothèque choisie ne l'a pas. |
| Natif | Composant fourni par la bibliothèque elle-même ou par React Native, et non par le repli. |
| Couverture | Liste des composants natifs d'un fournisseur (`coverageOf`). |
