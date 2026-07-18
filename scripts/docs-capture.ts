/**
 * Flipova Foundation – Docs Sync Script
 * ======================================
 * Generates MDX documentation pages from the Foundation registry
 * (components, layouts, blocks, tokens, hooks) and auto-generates
 * the Docusaurus sidebar config.
 *
 * Usage:
 *   npm run docs:sync           # build:foundation first, then sync
 *   npm run docs:sync -- --skip-screenshots
 * Requirements:
 *   - `npm run build:foundation` must have been run first (produces dist/)
 */

import fs from 'fs';
import path from 'path';

// ─── Configuration ──────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..');
const DIST_REGISTRY = path.join(ROOT, 'dist/registry/index.js');
const DOCS_ROOT = path.join(ROOT, 'docs/docs');

const OUT = {
  components: path.join(DOCS_ROOT, 'components'),
  layouts:    path.join(DOCS_ROOT, 'layouts'),
  blocks:     path.join(DOCS_ROOT, 'blocks'),
  tokens:     path.join(DOCS_ROOT, 'tokens'),
  hooks:      path.join(DOCS_ROOT, 'hooks'),
  staticImg:  path.join(ROOT, 'docs/static/img/studio'),
  sidebar:    path.join(ROOT, 'docs/sidebars-generated.json'),
};

const skipScreenshots = process.argv.includes('--skip-screenshots');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ensureDir(dir: string, clean = false) {
  if (clean && fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function slug(id: string) {
  return id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Wraps a string in double-quoted YAML scalar, escaping internal double quotes and backticks. */
function yamlStr(value: string): string {
  // Backticks, colons, and quotes are problematic in YAML front matter.
  // The safest approach: replace backticks with single-quotes and wrap in "…"
  const safe = value.replace(/\\/g, '\\\\').replace(/"/g, "'").replace(/`/g, "'");
  return `"${safe}"`;
}

// ─── TSDoc Extractor ───────────────────────────────────────────────────────────

function extractTSDoc(id: string, type: 'component' | 'layout' | 'block' | 'hook'): { componentDoc: string; propsDoc: string } {
  let dir = '';
  if (type === 'component') dir = 'foundation/ui/components';
  else if (type === 'layout') dir = 'foundation/ui/layouts';
  else if (type === 'block') dir = 'foundation/ui/blocks';
  else if (type === 'hook') dir = 'foundation/ui/hooks';
  
  if (!dir) return { componentDoc: '', propsDoc: '' };

  let filePath = path.join(ROOT, dir, `${id}.tsx`);
  if (!fs.existsSync(filePath)) filePath = path.join(ROOT, dir, `${id}Comp.tsx`);
  if (!fs.existsSync(filePath)) filePath = path.join(ROOT, dir, `${id}.ts`);
  
  if (!fs.existsSync(filePath)) return { componentDoc: '', propsDoc: '' };

  const content = fs.readFileSync(filePath, 'utf-8');
  
  const compRegex = new RegExp(`\\/\\*\\*((?:(?!\\*\\/)[\\s\\S])*)\\*\\/\\s*(?:const\\s+${id}Component|const\\s+${id}Comp|const\\s+${id}|function\\s+${id})\\s*[:=]`, 'm');
  const compMatch = content.match(compRegex);
  
  const propsRegex = new RegExp(`\\/\\*\\*((?:(?!\\*\\/)[\\s\\S])*)\\*\\/\\s*(?:export\\s+)?(?:interface|type)\\s+${id}Props`, 'm');
  const propsMatch = content.match(propsRegex);

  const cleanDoc = (raw: string) => {
    if (!raw) return '';
    return raw
      .split('\n')
      .map(line => line.replace(/^\s*\*\s?/, '').trimEnd())
      .join('\n')
      .trim();
  };

  return {
    componentDoc: cleanDoc(compMatch?.[1] || ''),
    propsDoc: cleanDoc(propsMatch?.[1] || ''),
  };
}

// ─── MDX Generators ──────────────────────────────────────────────────────────

function propsTable(meta: any, tsDocParams: string = ''): string {
  if (typeof meta.props !== 'function') return '';
  try {
    // The registry stores enumMap as { EnumName: string[] } — pass it directly.
    const enums = meta.enumMap ?? {};
    const constants = meta.constants ?? {};
    const propsList: any[] = meta.props(enums, constants);
    if (!propsList || propsList.length === 0) return '';

    const rows = propsList.map((p: any) => {
      // Resolve default value
      const defaultVal = p.default !== undefined
        ? String(p.default)
        : (p.themeDefault ? `theme.${p.themeDefault}` : '–');

      // Resolve type display — for enum types, show enum name or options
      let typeDisplay = `\`${p.type}\``;
      if (p.type === 'enum') {
        // options is usually: optionsFrom(enums.SomeName) → array of { label, value } or strings
        const opts = p.options as any[] | undefined;
        if (opts && opts.length > 0) {
          const vals = opts
            .map((o) => (typeof o === 'object' ? o.value ?? o.label : o))
            .filter(Boolean)
            .map((v: string) => `\`${v}\``)
            .join(' \\| ');
          typeDisplay = vals;
        }
      }

      return `| \`${p.name}\` | ${typeDisplay} | \`${defaultVal}\` | ${p.label} |`;
    });

    let extraDoc = '';
    if (tsDocParams) {
       extraDoc = `\n### Documentation des Propriétés\n\n${tsDocParams}\n`;
    }

    return `
## Props
${extraDoc}
| Prop | Type | Default | Description |
|------|------|---------|-------------|
${rows.join('\n')}
`;
  } catch (err: any) {
    // Don't crash — just skip the table
    return `\n<!-- Props table generation failed: ${err?.message} -->\n`;
  }
}

function variantsSection(meta: any): string {
  if (!meta.variants || meta.variants.length === 0) return '';
  return `
## Variants

| Variant | Label |
|---------|-------|
${meta.variants.map((v: any) => `| \`${v.name}\` | ${v.label} |`).join('\n')}
`;
}

function slotsSection(meta: any): string {
  if (!meta.slots || meta.slots.length === 0) return '';
  return `
## Slots

| Slot | Required | Kind |
|------|----------|------|
${meta.slots.map((s: any) => `| \`${s.name}\` | ${s.required ? 'Oui' : 'Non'} | \`${s.kind}\` |`).join('\n')}
`;
}

function tagsSection(meta: any): string {
  if (!meta.tags || meta.tags.length === 0) return '';
  return `\n**Tags:** ${meta.tags.map((t: string) => `\`${t}\``).join(' · ')}\n`;
}

function architectureSection(meta: any): string {
  const deps = meta.architecture?.dependencies;
  if (!deps || deps.length === 0) return '';
  return `
## Dependencies

> [!NOTE]
> This element requires the following peer dependencies to be installed:

${deps.map((d: string) => `- \`${d}\``).join('\n')}
`;
}

function importSection(id: string, type: 'component' | 'layout' | 'block'): string {
  const importMap: Record<string, string> = {
    component: `@flipova/foundation`,
    layout: `@flipova/foundation`,
    block: `@flipova/foundation`,
  };
  return `\`\`\`tsx
import { ${id} } from '${importMap[type]}';
\`\`\``;
}

// ─── Component MDX ───────────────────────────────────────────────────────────

function generateComponentMDX(meta: any): string {
  const { id, label, description, category = '' } = meta;
  const { componentDoc, propsDoc } = extractTSDoc(id, 'component');
  
  // Provide safe dummy props for common components to prevent crashes
  let demoProps = '';
  if (id === 'Button') demoProps = ' children="Click Me" ';
  if (id === 'Text') demoProps = ' children="Hello World" ';
  if (id === 'Avatar') demoProps = ' fallback="AB" ';
  if (id === 'Accordion') demoProps = ' title="Section 1" children={<Text>Content</Text>} ';
  const extraImports = id === 'Accordion' ? ', Text' : '';

  return `---
id: ${slug(id)}
title: ${label}
sidebar_label: ${label}
description: ${yamlStr(description)}
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import Playground from '@site/src/components/Playground';

# ${label}

> **Category:** \`${category}\`
${tagsSection(meta)}

${description}

${componentDoc ? `> **TSDoc:**\n> ${componentDoc.split('\n').join('\n> ')}\n` : ''}

## Live Preview
<BrowserOnly fallback={<div>Loading playground...</div>}>
  {() => {
    const Foundation = require('@flipova/foundation');
    const Comp = Foundation.${id} || (Foundation.default && Foundation.default.${id});
    if (!Comp) return <div style={{ color: 'var(--ifm-color-emphasis-500)', fontStyle: 'italic', padding: 20 }}>Interactive preview not available for this element.</div>;
    
    const { FoundationProvider, getComponentMeta } = Foundation;
    const meta = getComponentMeta ? getComponentMeta('${id}') : null;
    
    return (
      <FoundationProvider>
        <Playground component={Comp} meta={meta} componentName="${id}" />
      </FoundationProvider>
    );
  }}
</BrowserOnly>

## Import

${importSection(id, 'component')}

${propsTable(meta, propsDoc)}
${variantsSection(meta)}
${architectureSection(meta)}
`;
}

// ─── Layout MDX ──────────────────────────────────────────────────────────────

function generateLayoutMDX(meta: any): string {
  const { id, label, description, category = '' } = meta;
  const { componentDoc, propsDoc } = extractTSDoc(id, 'layout');
  const badges = [
    meta.responsive && '`Responsive`',
    meta.animated && '`Animated`',
  ].filter(Boolean).join(' · ');

  return `---
id: ${slug(id)}
title: ${label}
sidebar_label: ${label}
description: ${yamlStr(description)}
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import Playground from '@site/src/components/Playground';

# ${label}

> **Category:** \`${category}\`${badges ? `  |  ${badges}` : ''}
${tagsSection(meta)}

${description}

${componentDoc ? `> **TSDoc:**\n> ${componentDoc.split('\n').join('\n> ')}\n` : ''}

## Live Preview
<BrowserOnly fallback={<div>Loading playground...</div>}>
  {() => {
    const Foundation = require('@flipova/foundation');
    const Comp = Foundation.${id} || (Foundation.default && Foundation.default.${id});
    if (!Comp) return <div style={{ color: 'var(--ifm-color-emphasis-500)', fontStyle: 'italic', padding: 20 }}>Interactive preview not available for this element.</div>;
    
    const { FoundationProvider, getLayoutMeta } = Foundation;
    const meta = getLayoutMeta ? getLayoutMeta('${id}') : null;
    
    return (
      <FoundationProvider>
        <Playground component={Comp} meta={meta} componentName="${id}" />
      </FoundationProvider>
    );
  }}
</BrowserOnly>

## Import

${importSection(id, 'layout')}

${slotsSection(meta)}
${propsTable(meta, propsDoc)}
${architectureSection(meta)}
`;
}

// ─── Block MDX ───────────────────────────────────────────────────────────────

function generateBlockMDX(meta: any): string {
  const { id, label, description, category = '' } = meta;
  const { componentDoc, propsDoc } = extractTSDoc(id, 'block');
  return `---
id: ${slug(id)}
title: ${label}
sidebar_label: ${label}
description: ${yamlStr(description)}
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import Playground from '@site/src/components/Playground';

# ${label}

> **Category:** \`${category}\`
${tagsSection(meta)}

${description}

${componentDoc ? `> **TSDoc:**\n> ${componentDoc.split('\n').join('\n> ')}\n` : ''}

## Live Preview
<BrowserOnly fallback={<div>Loading playground...</div>}>
  {() => {
    const Foundation = require('@flipova/foundation');
    const Comp = Foundation.${id} || (Foundation.default && Foundation.default.${id});
    if (!Comp) return <div style={{ color: 'var(--ifm-color-emphasis-500)', fontStyle: 'italic', padding: 20 }}>Interactive preview not available for this element.</div>;
    
    const { FoundationProvider, getBlockMeta } = Foundation;
    const meta = getBlockMeta ? getBlockMeta('${id}') : null;
    
    return (
      <FoundationProvider>
        <Playground component={Comp} meta={meta} componentName="${id}" />
      </FoundationProvider>
    );
  }}
</BrowserOnly>

## Import

${importSection(id, 'block')}

${propsTable(meta, propsDoc)}
${variantsSection(meta)}
`;
}

// ─── Tokens MDX ──────────────────────────────────────────────────────────────

const TOKEN_FILES: Record<string, { title: string; description: string }> = {
  colors:     { title: 'Colors',      description: 'Semantic color palette used across all built-in themes.' },
  spacing:    { title: 'Spacing',     description: 'Consistent spacing scale from `xs` to `3xl`.' },
  typography: { title: 'Typography',  description: 'Font families, sizes, weights, and line heights.' },
  radii:      { title: 'Radii',       description: 'Border radius tokens from `none` to `full`.' },
  shadows:    { title: 'Shadows',     description: 'Box shadow definitions for elevation levels.' },
  motion:     { title: 'Motion',      description: 'Animation duration and easing tokens.' },
  breakpoints:{ title: 'Breakpoints', description: 'Responsive breakpoints for adaptive layouts.' },
  opacity:    { title: 'Opacity',     description: 'Opacity scale tokens.' },
  'z-index':  { title: 'Z-Index',     description: 'Z-index stack order tokens.' },
};

function generateTokensMDX(tokenKey: string, tokenValues: Record<string, any>, meta: { title: string; description: string }): string {
  const rows = Object.entries(tokenValues)
    .map(([key, value]) => `| \`${key}\` | \`${JSON.stringify(value)}\` |`)
    .join('\n');

  return `---
id: tokens-${tokenKey}
title: ${meta.title}
sidebar_label: ${meta.title}
description: ${yamlStr(meta.description)}
---

# ${meta.title} Tokens

${meta.description}

## Import

\`\`\`tsx
import { ${tokenKey} } from '@flipova/foundation/tokens';
\`\`\`

## Values

| Token | Value |
|-------|-------|
${rows}
`;
}

// ─── Hooks MDX ───────────────────────────────────────────────────────────────

const HOOKS: Array<{ id: string; title: string; description: string; signature: string; example: string }> = [
  {
    id: 'useTheme',
    title: 'useTheme',
    description: 'Returns the current active theme object (colors, radii, spacing, typography, shadows).',
    signature: 'function useTheme(): Theme',
    example: `const theme = useTheme();
const bg = theme.colors.background;`,
  },
  {
    id: 'useColorScheme',
    title: 'useColorScheme',
    description: 'Returns the current color scheme (`light` or `dark`) and a setter to override it.',
    signature: `function useColorScheme(): {
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
}`,
    example: `const { colorScheme, setColorScheme } = useColorScheme();`,
  },
  {
    id: 'useBreakpoint',
    title: 'useBreakpoint',
    description: 'Returns the current responsive breakpoint (`xs`, `sm`, `md`, `lg`, `xl`).',
    signature: 'function useBreakpoint(): Breakpoint',
    example: `const bp = useBreakpoint();
if (bp === 'lg') { /* desktop layout */ }`,
  },
  {
    id: 'useAdaptiveValue',
    title: 'useAdaptiveValue',
    description: 'Picks a value from a breakpoint map based on the current screen width.',
    signature: 'function useAdaptiveValue<T>(values: Partial<Record<Breakpoint, T>>): T',
    example: `const columns = useAdaptiveValue({ xs: 1, sm: 2, lg: 3 });`,
  },
  {
    id: 'useResponsiveValue',
    title: 'useResponsiveValue',
    description: 'Returns a responsive value given an array (index = breakpoint tier).',
    signature: 'function useResponsiveValue<T>(values: T[]): T',
    example: `const fontSize = useResponsiveValue([14, 16, 18]);`,
  },
  {
    id: 'usePlatformInfo',
    title: 'usePlatformInfo',
    description: 'Returns runtime platform information: `isWeb`, `isNative`, `isIOS`, `isAndroid`.',
    signature: 'function usePlatformInfo(): PlatformInfo',
    example: `const { isWeb } = usePlatformInfo();`,
  },
  {
    id: 'useSafeArea',
    title: 'useSafeArea',
    description: 'Returns safe area insets (top, bottom, left, right) from the device.',
    signature: 'function useSafeArea(): EdgeInsets',
    example: `const { top } = useSafeArea();`,
  },
];

function generateHookMDX(hook: typeof HOOKS[number]): string {
  const { id, title, description, signature, example } = hook;
  const { componentDoc, propsDoc } = extractTSDoc(id, 'hook');
  return `---
id: hook-${slug(id)}
title: ${title}
sidebar_label: ${title}
description: ${yamlStr(description)}
---

# ${title}

${description}

${componentDoc ? `> **TSDoc:**\n> ${componentDoc.split('\n').join('\n> ')}\n` : ''}

## Import

\`\`\`tsx
import { ${id} } from '@flipova/foundation';
\`\`\`

## Signature

\`\`\`ts
${signature}
\`\`\`

## Example

\`\`\`tsx
${example}
\`\`\`
`;
}

// ─── Load Registry ────────────────────────────────────────────────────────────

function loadRegistry(): any {
  if (!fs.existsSync(DIST_REGISTRY)) {
    console.error(`\nErreur : Cannot find: ${DIST_REGISTRY}`);
    console.error(`   Run \`npm run build:foundation\` first.\n`);
    process.exit(1);
  }
  // Clear require cache to always get fresh data
  delete require.cache[require.resolve(DIST_REGISTRY)];
  return require(DIST_REGISTRY);
}

function loadTokens(): Record<string, any> {
  const tokensPath = path.join(ROOT, 'dist/tokens/index.js');
  if (!fs.existsSync(tokensPath)) return {};
  delete require.cache[require.resolve(tokensPath)];
  return require(tokensPath);
}

// ─── Sidebar Builder ─────────────────────────────────────────────────────────

type SidebarItem =
  | { type: 'doc'; id: string; label: string }
  | { type: 'category'; label: string; collapsed: boolean; items: SidebarItem[] };

function buildSidebar(sections: {
  components: any[];
  layouts: any[];
  blocks: any[];
  tokenKeys: string[];
}): Record<string, any> {
  const groupBy = (items: any[], key: string): Record<string, any[]> =>
    items.reduce((acc, item) => {
      const k = item[key] || 'other';
      (acc[k] = acc[k] || []).push(item);
      return acc;
    }, {} as Record<string, any[]>);

  const toDocItem = (meta: any, prefix: string): SidebarItem => ({
    type: 'doc',
    id: `${prefix}/${slug(meta.id)}`,
    label: meta.label,
  });

  const componentsByCategory = groupBy(sections.components, 'category');
  const layoutsByCategory = groupBy(sections.layouts, 'category');
  const blocksByCategory = groupBy(sections.blocks, 'category');

  const componentItems: SidebarItem[] = Object.entries(componentsByCategory).map(([cat, items]) => ({
    type: 'category',
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    collapsed: false,
    items: (items as any[]).map((m) => toDocItem(m, 'components')),
  }));

  const layoutItems: SidebarItem[] = Object.entries(layoutsByCategory).map(([cat, items]) => ({
    type: 'category',
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    collapsed: false,
    items: (items as any[]).map((m) => toDocItem(m, 'layouts')),
  }));

  const blockItems: SidebarItem[] = Object.entries(blocksByCategory).map(([cat, items]) => ({
    type: 'category',
    label: cat.charAt(0).toUpperCase() + cat.slice(1),
    collapsed: true,
    items: (items as any[]).map((m) => toDocItem(m, 'blocks')),
  }));

  const tokenItems: SidebarItem[] = sections.tokenKeys.map((k) => ({
    type: 'doc',
    id: `tokens/tokens-${k}`,
    label: TOKEN_FILES[k]?.title ?? k,
  }));

  const hookItems: SidebarItem[] = HOOKS.map((h) => ({
    type: 'doc',
    id: `hooks/hook-${slug(h.id)}`,
    label: h.title,
  }));

  return {
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
        ],
      },
      'contributing',
    ],
    apiSidebar: [
      'api/intro',
      ...(componentItems.length > 0 ? [{
        type: 'category',
        label: 'Components',
        collapsed: false,
        items: componentItems,
      }] : []),
      ...(layoutItems.length > 0 ? [{
        type: 'category',
        label: 'Layouts',
        collapsed: false,
        items: layoutItems,
      }] : []),
      ...(blockItems.length > 0 ? [{
        type: 'category',
        label: 'Blocks',
        collapsed: true,
        items: blockItems,
      }] : []),
      ...(tokenItems.length > 0 ? [{
        type: 'category',
        label: 'Tokens',
        collapsed: false,
        items: tokenItems,
      }] : []),
      ...(hookItems.length > 0 ? [{
        type: 'category',
        label: 'Hooks',
        collapsed: false,
        items: hookItems,
      }] : []),
    ],
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\nFlipova Foundation - Docs Sync\n');

  // Ensure output directories are clean
  Object.values(OUT).forEach((d) => {
    if (!d.endsWith('.json')) ensureDir(d, true);
  });

  // Load registry from dist
  const registry = loadRegistry();
  const tokens = loadTokens();

  const components: any[] = Array.from(registry.componentRegistry ?? []);
  const layouts: any[] = Array.from(registry.layoutRegistry ?? []);
  const blocks: any[] = Array.from(registry.blockRegistry ?? []);

  console.log(`Found: ${components.length} components, ${layouts.length} layouts, ${blocks.length} blocks\n`);

  // ── Components ──
  console.log('Generating component pages...');
  for (const meta of components) {
    const content = generateComponentMDX(meta);
    fs.writeFileSync(path.join(OUT.components, `${slug(meta.id)}.mdx`), content, 'utf-8');
    process.stdout.write(`   → ${meta.id}\n`);
  }

  // ── Layouts ──
  console.log('\nGenerating layout pages...');
  for (const meta of layouts) {
    const content = generateLayoutMDX(meta);
    fs.writeFileSync(path.join(OUT.layouts, `${slug(meta.id)}.mdx`), content, 'utf-8');
    process.stdout.write(`   → ${meta.id}\n`);
  }

  // ── Blocks ──
  console.log('\nGenerating block pages...');
  for (const meta of blocks) {
    const content = generateBlockMDX(meta);
    fs.writeFileSync(path.join(OUT.blocks, `${slug(meta.id)}.mdx`), content, 'utf-8');
    process.stdout.write(`   → ${meta.id}\n`);
  }

  // ── Tokens ──
  console.log('\nGenerating token pages...');
  const generatedTokenKeys: string[] = [];
  for (const [key, meta] of Object.entries(TOKEN_FILES)) {
    const exported = tokens[key];
    if (!exported || typeof exported !== 'object') continue;
    const content = generateTokensMDX(key, exported, meta);
    fs.writeFileSync(path.join(OUT.tokens, `tokens-${key}.mdx`), content, 'utf-8');
    generatedTokenKeys.push(key);
    process.stdout.write(`   → ${key}\n`);
  }

  // ── Hooks ──
  console.log('\nGenerating hook pages...');
  for (const hook of HOOKS) {
    const content = generateHookMDX(hook);
    fs.writeFileSync(path.join(OUT.hooks, `hook-${slug(hook.id)}.mdx`), content, 'utf-8');
    process.stdout.write(`   → ${hook.id}\n`);
  }

  // ── Sidebar JSON ──
  console.log('\nWriting sidebar config...');
  const sidebar = buildSidebar({
    components,
    layouts,
    blocks,
    tokenKeys: generatedTokenKeys,
  });
  fs.writeFileSync(OUT.sidebar, JSON.stringify(sidebar, null, 2), 'utf-8');
  console.log(`   Done: ${OUT.sidebar}`);

  console.log('\nDone! Run `cd docs && npm start` to preview.\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
