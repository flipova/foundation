// Isolates the docs site from any PostCSS (tailwind…) configuration of the repository root: without it Docusaurus
// climbs to the parent folder, loads that configuration and fails ("Cannot find module 'tailwindcss'").
module.exports = { plugins: [] };
