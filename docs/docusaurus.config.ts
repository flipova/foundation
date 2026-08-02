import { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';
import pkg from '../package.json';

const config: Config = {
  title: `Flipova Foundation v${pkg.version}`,
  tagline: 'Design tokens, theming system, and layout primitives for React Native (iOS, Android, Web)',
  favicon: 'img/favicon.svg',

  url: 'https://flipova.github.io',
  baseUrl: '/',

  organizationName: 'flipova',
  projectName: 'foundation',

  onBrokenLinks: 'warn',

  markdown: {
    format: 'md',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  trailingSlash: false,

  plugins: [
    function customWebpackPlugin() {
      return {
        name: 'custom-webpack-plugin',
        configureWebpack() {
          return {
            resolve: {
              alias: {
                'react-native$': false,
              },
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: `Flipova Foundation v${pkg.version}`,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'API Docs & Guides',
        },
        {
          href: 'https://github.com/flipova/foundation',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'API Documentation',
              to: '/docs/',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/flipova/foundation',
            },
            {
              label: 'npm Registry',
              href: 'https://www.npmjs.com/package/@flipova/foundation',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Flipova Foundation v${pkg.version}. Deterministically generated documentation.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['json', 'bash', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
