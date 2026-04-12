import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            Build Beautiful React Native Apps
            <span className={styles.gradientText}> Faster</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}
          </p>
          <div className={styles.heroButtons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/guides/getting-started">
              Get Started
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="https://github.com/flipova/foundation"
              target="_blank">
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description}: {title: string; description: string}) {
  return (
    <div className={styles.feature}>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresGrid}>
          <Feature
            title="Visual Builder"
            description="Drag-and-drop interface to build your UI visually. Generate clean React Native code instantly."
          />
          <Feature
            title="Design Tokens"
            description="Comprehensive design system with tokens for colors, spacing, typography, and more."
          />
          <Feature
            title="23 Layouts"
            description="Pre-built layout components for common UI patterns. Responsive and theme-ready."
          />
          <Feature
            title="9 Themes"
            description="Built-in themes including light, dark, neon, and seasonal themes. Easy customization."
          />
          <Feature
            title="TypeScript"
            description="Full TypeScript support with type-safe components and auto-completion."
          />
          <Feature
            title="Cross-Platform"
            description="Works seamlessly on iOS, Android, and Web with React Native."
          />
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <Features />
      </main>
    </Layout>
  );
}
