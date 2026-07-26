import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const FEATURES = [
  {
    emoji: '🎨',
    title: 'Design Tokens',
    description: 'Spacing, color, typography, shadow, and motion tokens — consistent across every platform.',
  },
  {
    emoji: '🌗',
    title: '9 Built-in Themes',
    description: 'Light, dark, neon, autumn, spring, summer, winter, halloween, christmas — plus full custom theme support.',
  },
  {
    emoji: '📐',
    title: 'Layout Primitives',
    description: 'Stack, Inline, Grid, Scroll, Center — composable building blocks for any layout pattern.',
  },
  {
    emoji: '🧩',
    title: '40+ UI Components',
    description: 'Button, TextInput, Avatar, Badge, Accordion, Tabs and more — all theme-aware out of the box.',
  },
  {
    emoji: '🌐',
    title: 'Web & Native',
    description: 'React Native + react-native-web. One codebase, platform detection built in, no dual files.',
  },
  {
    emoji: '⚡',
    title: 'Developer Experience',
    description: 'Full TypeScript, auto-generated docs, live Playground, and Expo Router ready.',
  },
];

const STATS = [
  { value: '40+', label: 'Components' },
  { value: '20+', label: 'Layouts' },
  { value: '9', label: 'Themes' },
  { value: '100%', label: 'TypeScript' },
];

const CODE_EXAMPLE = `import { Button, Stack, Text } from '@flipova/foundation';

export default function App() {
  return (
    <Stack gap="md" align="center">
      <Text variant="heading" size="xl">
        Hello Foundation
      </Text>
      <Button variant="solid" size="md">
        Get Started
      </Button>
    </Stack>
  );
}`;

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroNoise} />
      <div className={styles.heroGrid} />
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            v1.12 · Open Source · MIT License
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            The design system for{' '}
            <span className={styles.heroAccent}>React Native</span>{' '}
            &amp; Web
          </Heading>
          <p className={styles.heroSubtitle}>
            Design tokens, theming &amp; UI primitives that scale from prototype to production.
            One codebase for iOS, Android &amp; Web.
          </p>
          <div className={styles.heroCTA}>
            <Link className={styles.btnPrimary} to="/docs/guides/getting-started">
              Get Started
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link className={styles.btnSecondary} href="https://github.com/flipova/foundation" target="_blank">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </Link>
            <Link className={styles.btnGhost} href="https://www.npmjs.com/package/@flipova/foundation" target="_blank">
              npm install
            </Link>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code preview */}
        <div className={styles.heroCode}>
          <div className={styles.heroCodeHeader}>
            <span className={styles.dot} style={{ background: '#ff5f57' }} />
            <span className={styles.dot} style={{ background: '#ffbd2e' }} />
            <span className={styles.dot} style={{ background: '#28ca42' }} />
            <span className={styles.heroCodeTitle}>App.tsx</span>
          </div>
          <pre className={styles.heroCodeBody}>
            <code>{CODE_EXAMPLE}</code>
          </pre>
        </div>
      </div>
    </header>
  );
}

function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Why Foundation</p>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything you need to build
          </Heading>
          <p className={styles.sectionSubtitle}>
            A battle-tested design system that scales from a startup's first screen
            to a multi-platform production app.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <span className={styles.featureEmoji}>{f.emoji}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Install() {
  return (
    <section className={styles.install}>
      <div className="container">
        <div className={styles.installInner}>
          <div className={styles.installLeft}>
            <p className={styles.sectionEyebrow}>Quick Start</p>
            <Heading as="h2" className={styles.installTitle}>
              Ready in seconds
            </Heading>
            <p className={styles.installDesc}>
              Install the package, wrap your app with the Foundation provider,
              and start building immediately.
            </p>
            <Link className={styles.btnPrimary} to="/docs/guides/getting-started">
              Read the docs
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className={styles.installRight}>
            <div className={styles.installBlock}>
              <span className={styles.installBlockLabel}>Install</span>
              <pre className={styles.installCode}><code>npm install @flipova/foundation</code></pre>
            </div>
            <div className={styles.installBlock}>
              <span className={styles.installBlockLabel}>Wrap your app</span>
              <pre className={styles.installCode}><code>{`import { FoundationProvider } from '@flipova/foundation';

<FoundationProvider theme="light">
  <App />
</FoundationProvider>`}</code></pre>
            </div>
            <div className={styles.installBlock}>
              <span className={styles.installBlockLabel}>Import and use</span>
              <pre className={styles.installCode}><code>{`import { Button } from '@flipova/foundation';

<Button variant="solid">Hello 👋</Button>`}</code></pre>
            </div>
          </div>
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
        <Install />
      </main>
    </Layout>
  );
}
