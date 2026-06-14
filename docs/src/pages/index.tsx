import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const FEATURES = [
  {
    icon: '🎨',
    title: 'Design Tokens',
    description: 'Comprehensive spacing, color, typography, shadow, and motion tokens shared across web and native.',
  },
  {
    icon: '🌗',
    title: '9 Built-in Themes',
    description: 'Light, dark, neon, autumn, spring, summer, winter, halloween, christmas — plus full custom theme support.',
  },
  {
    icon: '📐',
    title: 'Layout Primitives',
    description: 'Box, Stack, Inline, Center, Scroll, Divider — composable layout primitives for every pattern.',
  },
  {
    icon: '🧩',
    title: 'UI Components',
    description: 'Button, TextInput, Avatar, Badge, Accordion, Tabs and more — all theme-aware out of the box.',
  },
  {
    icon: '🌐',
    title: 'Web Entry Point',
    description: 'Import from @flipova/foundation/web for zero React Native deps — pure DOM, works with Vite and Next.js.',
  },
  {
    icon: '🏗️',
    title: 'Flipova Studio',
    description: 'Visual drag-and-drop builder that generates production-ready React Native code via npx flipova-studio.',
  },
  {
    icon: '🔒',
    title: 'Fully Typed',
    description: 'Complete TypeScript definitions for every token, component, layout, and config option.',
  },
  {
    icon: '⚡',
    title: 'Tree-shakeable',
    description: 'Import only what you need. tsup + esbuild produce lean CJS and ESM bundles with full source maps.',
  },
  {
    icon: '🔄',
    title: 'Cross-platform',
    description: 'Same API on iOS, Android, and Web. Write once, run anywhere with React Native Web.',
  },
];

const MODULES = [
  { path: '@flipova/foundation', title: 'Main', desc: 'Full library — React Native primitives, components, layouts' },
  { path: '@flipova/foundation/web', title: 'Web', desc: 'DOM-only entry — no react-native dep, for Vite / Next.js apps' },
  { path: '@flipova/foundation/tokens', title: 'Tokens', desc: 'Static design tokens — spacing, colors, radii, typography' },
  { path: '@flipova/foundation/theme', title: 'Theme', desc: 'ThemeProvider, useTheme, useColorScheme, built-in themes' },
  { path: '@flipova/foundation/config', title: 'Config', desc: 'defineConfig, FoundationProvider, token overrides' },
  { path: '@flipova/foundation/layout', title: 'Layout', desc: 'Registry, hooks, utils and RN layout UI components' },
];

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroBg} />
      <div className="container">
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>v1.10 · Now with Web Entry Point</span>
          <Heading as="h1" className={styles.heroTitle}>
            Build beautiful apps
            <br />
            <span className={styles.gradientText}>faster & consistently</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}.<br />
            One design system for React Native <em>and</em> React Web.
          </p>
          <div className={styles.heroButtons}>
            <Link className="button button--primary button--lg" to="/docs/guides/getting-started">
              Get Started →
            </Link>
            <Link className="button button--secondary button--lg" href="https://github.com/flipova/foundation" target="_blank">
              GitHub
            </Link>
          </div>
          <div className={styles.heroInstall}>
            <span>Install:</span>
            <code className={styles.heroInstallCode}>npm install @flipova/foundation</code>
          </div>
        </div>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <p className={styles.sectionLabel}>Why Foundation</p>
        <Heading as="h2" className={styles.sectionTitle}>Everything you need, nothing you don't</Heading>
        <p className={styles.sectionSubtitle}>
          A battle-tested design system that scales from a startup's first screen to a production app.
        </p>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.feature}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDescription}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section className={styles.modules}>
      <div className="container">
        <p className={styles.sectionLabel}>Modular Imports</p>
        <Heading as="h2" className={styles.sectionTitle}>Import only what you need</Heading>
        <p className={styles.sectionSubtitle}>
          Each entry point is independently tree-shakeable. Pick the sub-module that fits your target platform.
        </p>
        <div className={styles.modulesGrid}>
          {MODULES.map((m) => (
            <div key={m.path} className={styles.moduleCard}>
              <code className={styles.moduleImport}>{m.path}</code>
              <p className={styles.moduleTitle}>{m.title}</p>
              <p className={styles.moduleDesc}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <Heading as="h2" className={styles.ctaTitle}>Ready to build?</Heading>
        <p className={styles.ctaSubtitle}>
          Read the docs, install the package, and ship your first screen in minutes.
        </p>
        <div className={styles.ctaButtons}>
          <Link className="button button--white button--lg" to="/docs/guides/getting-started">
            Read the docs
          </Link>
          <Link className="button button--outline button--white button--lg" to="/docs/contributing">
            Contribute
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Hero />
      <main>
        <Features />
        <Modules />
        <CTA />
      </main>
    </Layout>
  );
}
