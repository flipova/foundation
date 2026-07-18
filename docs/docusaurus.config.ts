import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import * as fs from 'fs';
import * as path from 'path';

// This runs in Node.js – don't use client-side code here.

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'));
const config: Config = {
  title: 'Flipova Foundation',
  tagline: 'Design tokens, theming & UI primitives for React Native, Expo, Web & Desktop.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://flipova.github.io',
  baseUrl: '/foundation/',

  organizationName: 'flipova',
  projectName: 'foundation',

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/flipova/foundation/tree/main/docs/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false, // No blog section
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    () => ({
      name: 'resolve-react-native-web',
      configureWebpack() {
        const nativeOnlyPackages = [
          'react-native-maps',
          'lottie-react-native',
          'react-native-gesture-handler',
          'react-native-reanimated',
          'react-native-safe-area-context',
          'react-native-screens',
          'react-native-webview',
          'expo-camera',
          'expo-blur',
          'expo-video',
          'expo-linear-gradient',
          'expo-haptics',
          'expo-navigation-bar',
          'expo-status-bar',
          '@react-native-picker/picker',
          'react-native-date-picker',
          '@react-native-community/datetimepicker',
          'expo-image',
          'expo-asset',
          'expo-modules-core',
          'expo-file-system',
          'expo-font',
          'expo-constants',
          'expo-keep-awake',
          'react-native-vector-icons',
          '@expo/vector-icons',
          'react-native',
          'expo',
        ];

        return {
          resolve: {
            alias: {
              'react-native$': 'react-native-web',
              // Use a catch-all alias array for native modules
              ...nativeOnlyPackages.reduce((acc, pkg) => {
                if (pkg !== 'react-native') {
                  acc[`${pkg}$`] = require.resolve('./src/stubs/dummy.js');
                }
                return acc;
              }, {})
            },
            fallback: {
              'expo-modules-core': require.resolve('./src/stubs/dummy.js'),
              'expo-modules-core/build/PermissionsInterface': require.resolve('./src/stubs/dummy.js'),
            }
          },
          module: {
            rules: [
              {
                enforce: 'pre',
                test: /.*/,
                include: (filepath) => {
                  const normalizedPath = filepath.replace(/\\/g, '/');
                  if (!normalizedPath.includes('/node_modules/')) return false;
                  if (!/\.[jt]sx?$/.test(normalizedPath) && !normalizedPath.endsWith('.mjs') && !normalizedPath.endsWith('.cjs')) return false;
                  
                  if (normalizedPath.includes('/node_modules/expo') || normalizedPath.includes('/node_modules/@expo/')) return true;
                  return nativeOnlyPackages.some(pkg => 
                    normalizedPath.includes(`/${pkg}/`) || 
                    normalizedPath.endsWith(`/${pkg}`)
                  );
                },
                use: require.resolve('./src/stubs/null-loader.js'),
              },
            ],
          },
        };
      },
    }),
  ],

  themeConfig: {
    image: 'img/logo.svg',

    colorMode: {
      respectPrefersColorScheme: true,
      defaultMode: 'dark',
    },

    metadata: [
      { name: 'theme-color', content: '#000091' },
      { name: 'keywords', content: 'react-native, design-system, expo, ui, tokens, theming, flipova' },
    ],

    // Algolia DocSearch (optional – fill in your own keys)
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'flipova_foundation',
    // },

    navbar: {
      title: 'Foundation',
      logo: {
        alt: 'Flipova Foundation',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
      },
      hideOnScroll: true,
      items: [
        // ── Left ──────────────────────────────────────────────────────────
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API',
        },
        // Dropdown shortcuts for quick access to auto-generated sections
        {
          type: 'dropdown',
          label: 'Components',
          position: 'left',
          items: [
            { label: 'Overview',  to: '/docs/guides/components' },
            { label: 'All Components', to: '/docs/api/intro' },
          ],
        },
        {
          type: 'dropdown',
          label: 'Layouts',
          position: 'left',
          items: [
            { label: 'Overview', to: '/docs/guides/layouts' },
            { label: 'All Layouts', to: '/docs/api/intro' },
          ],
        },

        // ── Right ─────────────────────────────────────────────────────────
        {
          label: `v${pkg.version}`,
          position: 'right',
          href: 'https://github.com/flipova/foundation/releases',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/flipova/foundation',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://www.npmjs.com/package/@flipova/foundation',
          position: 'right',
          className: 'header-npm-link',
          'aria-label': 'npm package',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/docs/guides/getting-started' },
            { label: 'Theming', to: '/docs/guides/theming' },
            { label: 'Design Tokens', to: '/docs/guides/tokens' },
            { label: 'Web', to: '/docs/guides/web' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'API Overview', to: '/docs/api/intro' },
            { label: 'Components', to: '/docs/api/intro' },
            { label: 'Layouts', to: '/docs/api/intro' },
            { label: 'Tokens', to: '/docs/api/intro' },
            { label: 'Hooks', to: '/docs/api/intro' },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/flipova/foundation',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@flipova/foundation',
            },
            {
              label: 'Contributing',
              to: '/docs/contributing',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Flipova · MIT License · Built with Docusaurus`,
    },

    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'json', 'diff'],
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
