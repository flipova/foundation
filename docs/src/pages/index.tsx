import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
  Palette,
  Box,
  Layout as LayoutIcon,
  Smartphone,
  Zap,
  ChevronRight,
  Copy,
  Check,
  Code2,
  Shield,
} from 'lucide-react';

export default function Home(): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('npm i @flipova/foundation');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout
      title="Flipova Foundation"
      description="Design system, tokens, and primitive layout components for React Native (iOS, Android & Web)."
    >
      <div className="home-wrapper">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="version-pill">
              <span className="pill-dot"></span>
              <span>Flipova Foundation v1.12.0</span>
            </div>

            <h1 className="hero-title">
              The Premier UI Ecosystem for <br />
              <span className="hero-gradient-text">React Native & Web.</span>
            </h1>

            <p className="hero-subtitle">
              An agnostic, deterministic architecture delivering 46+ reactive components, 
              20+ layout primitives, and a unified token system.
            </p>

            {/* Action Buttons */}
            <div className="hero-actions">
              <Link to="/docs/guides/getting-started" className="btn-primary">
                <span>Explore Documentation</span>
                <ChevronRight className="btn-icon" />
              </Link>

              <button onClick={copyInstallCommand} className="btn-secondary">
                <Code2 className="btn-icon text-blue-400" />
                <span className="font-mono text-xs">npm i @flipova/foundation</span>
                {copied ? <Check className="btn-icon text-emerald-400" /> : <Copy className="btn-icon opacity-60" />}
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid Section - 100% Uniform Cards */}
        <section className="features-section">
          <div className="features-container">
            <div className="section-header">
              <span className="section-eyebrow">Architecture & Capabilities</span>
              <h2 className="section-title">Engineered for Native Speed</h2>
            </div>

            <div className="features-grid">
              {/* Feature 1 */}
              <div className="feature-card">
                <div className="feature-icon-box">
                  <Palette className="w-5 h-5" />
                </div>
                <h3>Tokens & Theme System</h3>
                <p>
                  Adaptable spacing scales, harmonized typography, and dynamic dark/light theme switching via token injection.
                </p>
                <Link to="/docs/tokens/tokens" className="card-link">
                  <span>View Tokens</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 2 */}
              <div className="feature-card">
                <div className="feature-icon-box">
                  <Box className="w-5 h-5" />
                </div>
                <h3>46+ Core Components</h3>
                <p>
                  Production-ready buttons, inputs, modals, loaders, cards, and media controls crafted for maximum fluidity.
                </p>
                <Link to="/docs/ui/components/base/Button/Button" className="card-link">
                  <span>Explore Components</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 3 */}
              <div className="feature-card">
                <div className="feature-icon-box">
                  <LayoutIcon className="w-5 h-5" />
                </div>
                <h3>20+ Primitive Layouts</h3>
                <p>
                  Reactive grid systems, sliding drawers, sticky headers/footers, and scrollable container primitives.
                </p>
                <Link to="/docs/ui/components/layouts/RootLayout/RootLayout" className="card-link">
                  <span>Discover Layouts</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 4 */}
              <div className="feature-card">
                <div className="feature-icon-box">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3>Cross-Platform Native</h3>
                <p>
                  Flawless performance on iOS, Android, and Web powered by robust multi-environment render adapters.
                </p>
                <Link to="/docs/ui/hooks/useBreakpoint" className="card-link">
                  <span>Check Hooks</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 5 */}
              <div className="feature-card">
                <div className="feature-icon-box">
                  <Zap className="w-5 h-5" />
                </div>
                <h3>Zero Extra Dependencies</h3>
                <p>
                  Minimal bundle footprint, strict TypeScript typing, and autonomous CLI executable generation.
                </p>
                <Link to="/docs/tokens/tokens" className="card-link">
                  <span>API Specs</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 6 */}
              <div className="feature-card">
                <div className="feature-icon-box">
                  <Shield className="w-5 h-5" />
                </div>
                <h3>Agnostic Documentation</h3>
                <p>
                  100% deterministically generated documentation straight from `.meta.yaml` definitions and TSDoc comments.
                </p>
                <Link to="/docs/tokens/tokens" className="card-link">
                  <span>Metadata Registry</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
