import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';
import i18n from './i18n.generated.json';

// Projet généré une première fois par « corral docs docusaurus » : ce fichier est à vous.
// Le contenu (docs/), la barre latérale (sidebars.ts) et la charte (src/css/brand.css) sont régénérés à chaque exécution.
const config: Config = {
  title: "foundation — documentation",
  tagline: "Provider-agnostic UI contract and design toolchain: 57 components over flipova, gluestack, reusables, paper and tamagui, themed from the app's own XML registries.",
  favicon: 'img/favicon.png',

  url: 'https://flipova.github.io',
  baseUrl: process.env.BASE_URL || '/foundation/',
  organizationName: 'flipova',
  projectName: 'foundation',
  trailingSlash: false,
  onBrokenLinks: 'warn',

  // Les documents sont du Markdown pur (pas de MDX) : « { » et « < » dans le texte restent du texte.
  markdown: { format: 'md', mermaid: true, hooks: { onBrokenMarkdownLinks: 'warn' } },
  themes: ['@docusaurus/theme-mermaid'],
  // Langues : i18n.generated.json (régénéré par « corral docs docusaurus --lang … »).
  i18n: { defaultLocale: i18n.defaultLocale, locales: i18n.locales.map((l) => l.code), localeConfigs: Object.fromEntries(i18n.locales.map((l) => [l.code, { label: l.label, htmlLang: l.code }])) },

  presets: [
    [
      'classic',
      {
        docs: { routeBasePath: '/', sidebarPath: './sidebars.ts' },
        blog: false,
        theme: { customCss: ['./src/css/brand.css', './src/css/custom.css'] },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "foundation",
      logo: { alt: "foundation", src: 'img/logo.png' },
      items: [
        ...(i18n.locales.length > 1 ? [{ type: 'localeDropdown' as const, position: 'right' as const }] : []),
        { href: 'https://github.com/flipova/foundation', label: 'GitHub', position: 'right' as const },
      ],
    },
    footer: { style: 'dark', copyright: "flipova · foundation · documentation v1.0" },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
    colorMode: { respectPrefersColorScheme: true },
  } satisfies Preset.ThemeConfig,
};

export default config;
