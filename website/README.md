# Site de documentation

Site [Docusaurus](https://docusaurus.io) de foundation, publié sur GitHub Pages : https://flipova.github.io/foundation/

Il est **généré** à partir des documents publics de `documentation/` :

```bash
corral docs docusaurus --repo foundation          # régénère docs/, sidebars.ts, la charte et les images
corral docs docusaurus --repo foundation --check  # exit 1 si le site n'est plus à jour (pour la CI)
```

Ne modifiez pas `docs/`, `sidebars.ts`, `src/css/brand.css` ni `static/` : ils sont réécrits. `docusaurus.config.ts`,
`package.json`, `src/css/custom.css` et le workflow vous appartiennent. Aperçu local : `npm install && npm start`.
