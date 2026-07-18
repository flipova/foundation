import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const FEATURES = [
  {
    icon: 'System',
    title: 'Design Tokens',
    description: 'Comprehensive spacing, color, typography, shadow, and motion tokens shared across web and native.',
  },
  {
    icon: 'Themes',
    title: '9 Built-in Themes',
    description: 'Light, dark, neon, autumn, spring, summer, winter, halloween, christmas — plus full custom theme support.',
  },
  {
    icon: 'Layout',
    title: 'Layout Primitives',
    description: 'Box, Stack, Inline, Center, Scroll, Divider — composable layout primitives for every pattern.',
  },
  {
    icon: 'UI',
    title: 'Interactive UI',
    description: 'Button, TextInput, Avatar, Badge, Accordion, Tabs and more — all theme-aware and interactive out of the box.',
  },
  {
    icon: 'Web',
    title: 'Web First, Native Ready',
    description: 'Import from @flipova/foundation/web for zero React Native deps — pure DOM, works with Vite and Next.js.',
  },
];

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroBg} />
      <div className="container">
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>v1.11 · The Multi-Platform Framework</span>
          <Heading as="h1" className={styles.heroTitle}>
            Build beautiful apps
            <br />
            <span className={styles.gradientText}>faster & consistently</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}.<br />
            One single robust design system for React Native, Expo, Web, and Desktop.
          </p>
          <div className={styles.heroButtons}>
            <Link className="button button--primary button--lg" to="/docs/guides/getting-started">
              Get Started →
            </Link>
            <Link className="button button--secondary button--lg" href="https://github.com/flipova/foundation" target="_blank">
              GitHub
            </Link>
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
        <Heading as="h2" className={styles.sectionTitle}>Everything you need, beautifully crafted</Heading>
        <p className={styles.sectionSubtitle}>
          A battle-tested design system that scales from a startup's first screen to a multi-platform production app.
        </p>
        <div className="row">
          {FEATURES.map((f, idx) => (
            <div key={idx} className="col col--4 margin-bottom--lg">
              <div className={styles.glassCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDescription}>{f.description}</p>
              </div>
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
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Heading as="h2" className={styles.ctaTitle}>Ready to build?</Heading>
        <p className={styles.ctaSubtitle}>
          Read the docs, install the package, and ship your first multi-platform app today.
        </p>
        <div className={styles.heroButtons}>
          <Link className="button button--secondary button--lg" to="/docs/guides/getting-started">
            Read the Documentation
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
        <CTA />
      </main>
    </Layout>
  );
}
