import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/getting-started',
        'guides/theming',
        'guides/tokens',
        'guides/components',
        'guides/layouts',
        'guides/web',
        'guides/studio',
      ],
    },
    'contributing',
  ],

  apiSidebar: [
    'api/intro',
  ],
};

export default sidebars;
