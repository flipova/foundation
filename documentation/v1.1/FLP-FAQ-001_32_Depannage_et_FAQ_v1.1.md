<!-- corral:section:start id="cover" type="cover" locked="true" order="0" after="" -->
**DÉPANNAGE ET FAQ**

**Résoudre un problème, trouver une réponse**

Problèmes courants · Questions fréquentes · Aide

**Informations**

|                        |                                     |
|------------------------|-------------------------------------|
| **Titre du document**  | <!--auto:doc.title-->Dépannage et FAQ<!--/auto--> |
| **Version**            | <!--auto:doc.version-->1.1<!--/auto--> |
| **Date de mise à jour** | <!--auto:doc.date-->12/11/2026<!--/auto--> |

<!-- corral:section:end id="cover" -->

<!-- corral:section:start id="sec-1" type="section" title="Avant de demander de l’aide" level="1" order="1" after="cover" -->
# 1. Avant de demander de l'aide

- Vérifier la version installée : `npm ls @flipova/foundation`.
- Voir les chemins résolus par l'outil : `npx flipova-design where`.
- Chercher dans les problèmes déjà signalés : <!--auto:repo.issues-->https://github.com/flipova/foundation/issues<!--/auto-->
<!-- corral:section:end id="sec-1" -->

<!-- corral:section:start id="sec-2" type="section" title="Problèmes courants" level="1" order="2" after="sec-1" -->
# 2. Problèmes courants

| **Symptôme** | **Cause probable** | **Solution** |
|--------------|--------------------|--------------|
| `gen --check` échoue | Un fichier généré ne correspond plus aux registres. | Lancer `npx flipova-design gen` et valider les fichiers produits. |
| « missing role » au démarrage | Votre thème n'a pas l'un des 27 rôles de couleur obligatoires. | Ajouter le rôle dans l'onglet Thèmes de l'interface graphique ou dans `themes.xml`. |
| Tamagui refuse un nom de jeton | `true` ou `none` sont réservés. | L'adaptateur renomme `none` en `zero` ; utilisez ce nom côté tamagui. |
| Un composant ne ressemble pas à la bibliothèque choisie | Cette bibliothèque ne le fournit pas, il est servi par flipova. | Consulter la couverture avec `coverageOf(adaptateur)` ou `COMPONENTS.md`. |
| Module introuvable (`react-native-paper`…) | La dépendance facultative du fournisseur n'est pas installée. | L'installer avec npm. |
<!-- corral:section:end id="sec-2" -->

<!-- corral:section:start id="sec-3" type="section" title="Questions fréquentes" level="1" order="3" after="sec-2" -->
# 3. Questions fréquentes

**Faut-il installer toutes les bibliothèques ?**

Non. Seul flipova est inclus ; chaque autre bibliothèque est une dépendance facultative, requise uniquement si vous choisissez son fournisseur.

**Puis-je changer de fournisseur plus tard ?**

Oui. Les propriétés des composants sont identiques ; il suffit de changer l'adaptateur passé à `FlipovaProvider`.

**Où est mon thème ?**

Dans le dossier `design/` de votre application (quatre fichiers XML). Le package ne fournit qu'un point de départ neutre.

**Le package fonctionne-t-il sur le web ?**

Le fournisseur flipova cible React Native. Les tests s'exécutent avec react-native-web, mais le rendu sur appareil n'est pas vérifié.
<!-- corral:section:end id="sec-3" -->

<!-- corral:section:start id="sec-4" type="section" title="Obtenir de l’aide" level="1" order="4" after="sec-3" -->
# 4. Obtenir de l'aide

Ouvrez un ticket en joignant : la version du package, votre système, la commande exécutée et sa sortie complète.

Signaler un problème : <!--auto:repo.issues-->https://github.com/flipova/foundation/issues<!--/auto-->
<!-- corral:section:end id="sec-4" -->
