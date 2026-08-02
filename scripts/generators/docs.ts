import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ParsedTSDoc {
  raw: string;
  description: string;
  example: string;
  useCases: string[];
  structure: string[];
  accessibility: string[];
  params: { name: string; type?: string; description: string }[];
  returns: string;
  tags: Record<string, string>;
}

export interface ParsedInterfaceField {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
  description: string;
}

export interface ParsedInterface {
  name: string;
  description: string;
  fields: ParsedInterfaceField[];
}

export interface ParsedFunction {
  name: string;
  signature: string;
  description: string;
  params: { name: string; description: string }[];
  returns: string;
  example: string;
}

// ─── Utility Helpers ─────────────────────────────────────────────────────────

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function safeMDX(text: string = ''): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function safeTableCell(text: string = ''): string {
  if (!text) return '';
  return safeMDX(text).replace(/\|/g, '&#124;').replace(/\n/g, ' ');
}

function yamlStr(value: string): string {
  const safe = (value || '').replace(/\\/g, '\\\\').replace(/"/g, "'").replace(/`/g, "'");
  return `"${safe}"`;
}

// ─── TSDoc & Comment Parsers ──────────────────────────────────────────────────

export function parseTSDocBlock(block: string): ParsedTSDoc {
  const lines = block
    .replace(/^\/\*\*|\*\/$/g, '')
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, '').trimEnd());

  let descriptionLines: string[] = [];
  let exampleLines: string[] = [];
  let useCasesLines: string[] = [];
  let structureLines: string[] = [];
  let accessibilityLines: string[] = [];
  let returnsLines: string[] = [];
  const params: { name: string; type?: string; description: string }[] = [];
  const tags: Record<string, string> = {};

  let currentSection: 'description' | 'example' | 'useCases' | 'structure' | 'accessibility' | 'returns' | 'other' = 'description';

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('@description')) {
      currentSection = 'description';
      const rest = trimmed.replace(/^@description\s*/, '');
      if (rest) descriptionLines.push(rest);
    } else if (trimmed.startsWith('@example')) {
      currentSection = 'example';
      const rest = trimmed.replace(/^@example\s*/, '');
      if (rest) exampleLines.push(rest);
    } else if (trimmed.startsWith('@useCases')) {
      currentSection = 'useCases';
      const rest = trimmed.replace(/^@useCases\s*/, '');
      if (rest) useCasesLines.push(rest);
    } else if (trimmed.startsWith('@structure')) {
      currentSection = 'structure';
      const rest = trimmed.replace(/^@structure\s*/, '');
      if (rest) structureLines.push(rest);
    } else if (trimmed.startsWith('@accessibility')) {
      currentSection = 'accessibility';
      const rest = trimmed.replace(/^@accessibility\s*/, '');
      if (rest) accessibilityLines.push(rest);
    } else if (trimmed.startsWith('@returns') || trimmed.startsWith('@return')) {
      currentSection = 'returns';
      const rest = trimmed.replace(/^@(returns|return)\s*/, '');
      if (rest) returnsLines.push(rest);
    } else if (trimmed.startsWith('@param')) {
      currentSection = 'other';
      const match = trimmed.match(/^@param\s+(?:\{([^}]+)\}\s+)?(\w+)\s*(?:-\s*)?(.*)$/);
      if (match) {
        params.push({
          type: match[1] || '',
          name: match[2],
          description: match[3] || '',
        });
      }
    } else if (trimmed.startsWith('@')) {
      currentSection = 'other';
      const match = trimmed.match(/^@(\w+)\s*(.*)$/);
      if (match) {
        tags[match[1]] = match[2] || 'true';
      }
    } else {
      if (currentSection === 'description') descriptionLines.push(line);
      else if (currentSection === 'example') exampleLines.push(line);
      else if (currentSection === 'useCases') useCasesLines.push(line);
      else if (currentSection === 'structure') structureLines.push(line);
      else if (currentSection === 'accessibility') accessibilityLines.push(line);
      else if (currentSection === 'returns') returnsLines.push(line);
    }
  }

  return {
    raw: block,
    description: descriptionLines.join('\n').trim(),
    example: exampleLines.join('\n').trim(),
    useCases: useCasesLines.filter(Boolean),
    structure: structureLines.filter(Boolean),
    accessibility: accessibilityLines.filter(Boolean),
    params,
    returns: returnsLines.join('\n').trim(),
    tags,
  };
}

export function extractFileTSDocs(content: string): ParsedTSDoc[] {
  const regex = /\/\*\*([\s\S]*?)\*\//g;
  const docs: ParsedTSDoc[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const parsed = parseTSDocBlock(match[0]);
    if (parsed.description || parsed.example || parsed.params.length > 0 || Object.keys(parsed.tags).length > 0) {
      docs.push(parsed);
    }
  }
  return docs;
}

export function extractInterfaces(content: string): ParsedInterface[] {
  const interfaces: ParsedInterface[] = [];
  const regex = /(?:\/\*\*([\s\S]*?)\*\/\s*)?export\s+(?:interface|type)\s+(\w+)\s*(?:<[^>]+>)?\s*(?:extends\s+[^{]+)?\s*=?\s*\{([\s\S]*?)\}/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const docText = match[1] || '';
    const name = match[2];
    const body = match[3];

    const parsedDoc = docText ? parseTSDocBlock(`/**${docText}*/`) : null;

    const fields: ParsedInterfaceField[] = [];
    const fieldRegex = /(?:\/\*\*([\s\S]*?)\*\/\s*)?(?:(\w+)|\['([^']+)'\])(\?)?:\s*([^;\n]+);?/g;

    let fieldMatch: RegExpExecArray | null;
    while ((fieldMatch = fieldRegex.exec(body)) !== null) {
      const fieldDocRaw = fieldMatch[1] || '';
      const fieldName = fieldMatch[2] || fieldMatch[3];
      const optional = Boolean(fieldMatch[4]);
      const fieldType = fieldMatch[5].trim();

      const fieldDocParsed = fieldDocRaw ? parseTSDocBlock(`/**${fieldDocRaw}*/`) : null;
      let fieldDesc = fieldDocParsed?.description || '';
      let defaultVal = fieldDocParsed?.tags['default'];

      fields.push({
        name: fieldName,
        type: fieldType,
        optional,
        defaultValue: defaultVal,
        description: fieldDesc,
      });
    }

    interfaces.push({
      name,
      description: parsedDoc?.description || '',
      fields,
    });
  }

  return interfaces;
}

export function extractFunctions(content: string): ParsedFunction[] {
  const functions: ParsedFunction[] = [];
  const regex = /(?:\/\*\*([\s\S]*?)\*\/\s*)?export\s+(?:function|const)\s+(\w+)\s*=?\s*(\([^{;]*\)(?:\s*:\s*[^={;]+)?)/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    const docText = match[1] || '';
    const name = match[2];
    const signature = `${name}${match[3].trim()}`;
    const parsedDoc = docText ? parseTSDocBlock(`/**${docText}*/`) : null;

    functions.push({
      name,
      signature,
      description: parsedDoc?.description || '',
      params: parsedDoc?.params || [],
      returns: parsedDoc?.returns || '',
      example: parsedDoc?.example || '',
    });
  }

  return functions;
}

// ─── MDX Document Generators ──────────────────────────────────────────────────

function generateComponentMDX(metaPath: string, componentDirPath: string, relativePath: string): string {
  const rawMeta = fs.readFileSync(metaPath, 'utf8');
  const meta: any = yaml.load(rawMeta) || {};

  const id = meta.id || path.basename(componentDirPath);
  const label = meta.label || id;
  const description = meta.description || '';
  const category = meta.category || 'general';
  const type = meta.type || 'component';

  // Read associated TS/TSX files in component directory
  let tsxDoc: ParsedTSDoc | null = null;
  let logicDoc: ParsedTSDoc | null = null;
  let interfaces: ParsedInterface[] = [];
  let functions: ParsedFunction[] = [];

  const files = fs.readdirSync(componentDirPath);
  for (const file of files) {
    const fullPath = path.join(componentDirPath, file);
    if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const docs = extractFileTSDocs(content);
      if (docs.length > 0) tsxDoc = docs[0];
    } else if (file.endsWith('.logic.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const docs = extractFileTSDocs(content);
      if (docs.length > 0) logicDoc = docs[0];
      interfaces.push(...extractInterfaces(content));
      functions.push(...extractFunctions(content));
    } else if (file.endsWith('.style.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      functions.push(...extractFunctions(content));
    }
  }

  const mergedDesc = description || tsxDoc?.description || logicDoc?.description || '';
  const useCases = tsxDoc?.useCases || logicDoc?.useCases || [];
  const structure = tsxDoc?.structure || logicDoc?.structure || [];
  const accessibility = tsxDoc?.accessibility || logicDoc?.accessibility || [];
  const exampleCode = meta.example || tsxDoc?.example || logicDoc?.example || '';

  // Process Props (merge meta.props and logic interfaces)
  let propsList: any[] = [];
  if (Array.isArray(meta.props)) {
    propsList = meta.props;
  } else if (typeof meta.props === 'object' && meta.props !== null) {
    propsList = Object.entries(meta.props).map(([name, p]: [string, any]) => ({
      name,
      ...(typeof p === 'object' ? p : { type: String(p) })
    }));
  }

  let propsTable = '';
  if (propsList.length > 0) {
    const rows = propsList.map((p: any) => {
      const propName = p.name || p.key || 'unnamed';
      const req = p.required ? ' *(required)*' : '';

      const rawType = Array.isArray(p.type) ? p.type.join(' | ') : (p.type || 'any');
      const typeDisplay = `\`${safeTableCell(rawType)}\``;

      const defaultVal = p.default !== undefined
        ? `\`${safeTableCell(typeof p.default === 'object' ? JSON.stringify(p.default) : String(p.default))}\``
        : '–';

      const group = p.group ? `\`${safeTableCell(p.group)}\`` : '–';
      const desc = safeTableCell(p.description || p.label || '–');

      return `| \`${propName}\`${req} | ${typeDisplay} | ${defaultVal} | ${group} | ${desc} |`;
    });

    propsTable = `## Props & Options\n\n| Prop | Type | Default | Group | Description |\n|------|------|---------|-------|-------------|\n${rows.join('\n')}\n`;
  }

  // Process Variants
  let variantsTable = '';
  if (Array.isArray(meta.variants) && meta.variants.length > 0) {
    const rows = meta.variants.map((v: any) => {
      const overrides = v.overrides && Object.keys(v.overrides).length > 0 ? `\`${safeTableCell(JSON.stringify(v.overrides))}\`` : '–';
      return `| \`${v.name}\` | ${safeTableCell(v.label || v.name)} | ${overrides} |`;
    });
    variantsTable = `## Variants\n\n| Variant | Label | Style Overrides |\n|---------|-------|-----------------|\n${rows.join('\n')}\n`;
  }

  // Process Sizes
  let sizesSection = '';
  if (Array.isArray(meta.sizes) && meta.sizes.length > 0) {
    let mapContent = '';
    if (meta.sizeMap && typeof meta.sizeMap === 'object' && Object.keys(meta.sizeMap).length > 0) {
      mapContent = `\n\n\`\`\`json\n${JSON.stringify(meta.sizeMap, null, 2)}\n\`\`\``;
    }
    sizesSection = `## Sizes\n\nSupported sizes: ${meta.sizes.map((s: string) => `\`${s}\``).join(' · ')}${mapContent}\n`;
  }

  // Process Theme Mapping
  let themeMappingSection = '';
  if (meta.themeMapping && typeof meta.themeMapping === 'object' && Object.keys(meta.themeMapping).length > 0) {
    const rows = Object.entries(meta.themeMapping).map(([key, token]) => `| \`${key}\` | \`theme.${token}\` |`);
    themeMappingSection = `## Theme Token Mapping\n\n| Component Property | Theme Token |\n|--------------------|-------------|\n${rows.join('\n')}\n`;
  }

  // Process Color Map
  let colorMapSection = '';
  if (meta.colorMap && typeof meta.colorMap === 'object' && Object.keys(meta.colorMap).length > 0) {
    colorMapSection = `## Color Schemes\n\n\`\`\`json\n${JSON.stringify(meta.colorMap, null, 2)}\n\`\`\`\n`;
  }

  // Process Slots
  let slotsSection = '';
  if (Array.isArray(meta.slots) && meta.slots.length > 0) {
    const rows = meta.slots.map((s: any) => `| \`${s.name}\` | ${s.required ? 'Yes' : 'No'} | \`${safeTableCell(s.kind || 'node')}\` | ${safeTableCell(s.label || s.description || '–')} |`);
    slotsSection = `## Slots\n\n| Slot Name | Required | Kind | Description |\n|-----------|----------|------|-------------|\n${rows.join('\n')}\n`;
  }

  // Process Architecture / Dependencies
  let architectureSection = '';
  const deps = meta.architecture?.dependencies || meta.dependencies;
  if (Array.isArray(deps) && deps.length > 0) {
    architectureSection = `## Dependencies\n\n${deps.map((d: string) => `- \`${d}\``).join('\n')}\n`;
  }

  // Process Extracted Interfaces & Functions
  let tsSignaturesSection = '';
  if (interfaces.length > 0 || functions.length > 0) {
    const items: string[] = [];
    for (const iface of interfaces) {
      if (iface.fields.length > 0) {
        items.push(`### Interface: \`${iface.name}\``);
        if (iface.description) items.push(`${safeMDX(iface.description)}\n`);
        const rows = iface.fields.map(f => `| \`${f.name}\`${f.optional ? ' *(optional)*' : ''} | \`${safeTableCell(f.type)}\` | ${f.defaultValue ? `\`${safeTableCell(f.defaultValue)}\`` : '–'} | ${safeTableCell(f.description) || '–'} |`);
        items.push(`| Field | Type | Default | Description |\n|-------|------|---------|-------------|\n${rows.join('\n')}`);
      }
    }
    for (const fn of functions) {
      items.push(`### Function: \`${fn.name}\``);
      if (fn.description) items.push(`${fn.description}\n`);
      items.push(`\`\`\`ts\n${fn.signature}\n\`\`\``);
    }
    if (items.length > 0) {
      tsSignaturesSection = `## TypeScript Logic & Hook Specifications\n\n${items.join('\n\n')}\n`;
    }
  }

  // Tags Section
  const tagsList = Array.isArray(meta.tags) ? meta.tags.map((t: string) => `\`${t}\``).join(' · ') : '';

  const cleanBullet = (str: string) => str.replace(/^-\s*/, '').trim();
  const formattedUseCases = useCases.map(cleanBullet).filter(Boolean);
  const formattedStructure = structure.map(cleanBullet).filter(Boolean);
  const formattedAccessibility = accessibility.map(cleanBullet).filter(Boolean);

  const slugPath = '/' + relativePath.replace(/\.(meta\.yaml|yaml|yml|tsx?|ts)$/, '').replace(/\\/g, '/');

  return `---
title: ${yamlStr(label)}
description: ${yamlStr(mergedDesc)}
type: ${yamlStr(type)}
category: ${yamlStr(category)}
slug: ${yamlStr(slugPath)}
---

# ${label}

> **Type:** \`${type}\`  |  **Category:** \`${category}\`${tagsList ? `  |  **Tags:** ${tagsList}` : ''}

${mergedDesc}

${formattedUseCases.length > 0 ? `## Use Cases\n\n${formattedUseCases.map(u => `- ${u}`).join('\n')}\n` : ''}
${formattedStructure.length > 0 ? `## Structure\n\n${formattedStructure.map(s => `- ${s}`).join('\n')}\n` : ''}
${formattedAccessibility.length > 0 ? `## Accessibility\n\n${formattedAccessibility.map(a => `- ${a}`).join('\n')}\n` : ''}

${exampleCode ? `## Usage Example\n\n\`\`\`tsx\n${exampleCode.trim()}\n\`\`\`\n` : ''}

${propsTable}
${variantsTable}
${sizesSection}
${themeMappingSection}
${colorMapSection}
${slotsSection}
${architectureSection}
${tsSignaturesSection}
`;
}

function generateYamlMDX(yamlPath: string, relativePath: string): string {
  const filename = path.basename(yamlPath);
  const title = filename.replace(/\.yaml$/, '');
  const content = fs.readFileSync(yamlPath, 'utf8');
  const parsed = yaml.load(content) as Record<string, any>;

  let body = '';
  if (parsed && typeof parsed === 'object') {
    const keys = Object.keys(parsed);
    const sections: string[] = [];

    for (const key of keys) {
      const val = parsed[key];
      sections.push(`## Section: \`${key}\``);
      if (typeof val === 'object' && val !== null) {
        sections.push(`\`\`\`yaml\n${yaml.dump({ [key]: val })}\n\`\`\``);
      } else {
        sections.push(`- **Value:** \`${val}\``);
      }
    }
    body = sections.join('\n\n');
  } else {
    body = `\`\`\`yaml\n${content}\n\`\`\``;
  }

  const slugPath = '/' + relativePath.replace(/\.(yaml|yml)$/, '').replace(/\\/g, '/');

  return `---
title: ${yamlStr(title)}
description: ${yamlStr(`Configuration definition for ${title}`)}
source: ${yamlStr(relativePath)}
slug: ${yamlStr(slugPath)}
---

# ${title.toUpperCase()} Configuration

${body}
`;
}

function generateTSFileMDX(tsPath: string, relativePath: string): string {
  const filename = path.basename(tsPath);
  const title = filename.replace(/\.(ts|tsx)$/, '');
  const content = fs.readFileSync(tsPath, 'utf8');

  const fileDocs = extractFileTSDocs(content);
  const interfaces = extractInterfaces(content);
  const functions = extractFunctions(content);

  const mainDesc = fileDocs.length > 0 ? fileDocs[0].description : '';
  const exampleCode = fileDocs.find(d => d.example)?.example || '';

  let bodyParts: string[] = [];

  if (mainDesc) {
    bodyParts.push(`${mainDesc}\n`);
  }

  if (exampleCode) {
    bodyParts.push(`## Example\n\n\`\`\`tsx\n${exampleCode}\n\`\`\`\n`);
  }

  if (interfaces.length > 0) {
    bodyParts.push(`## Interfaces & Types\n`);
    for (const iface of interfaces) {
      bodyParts.push(`### \`${iface.name}\``);
      if (iface.description) bodyParts.push(`${safeMDX(iface.description)}\n`);
      if (iface.fields.length > 0) {
        const rows = iface.fields.map(f => `| \`${f.name}\`${f.optional ? ' *(optional)*' : ''} | \`${safeMDX(f.type)}\` | ${f.defaultValue ? `\`${safeMDX(f.defaultValue)}\`` : '–'} | ${safeMDX(f.description) || '–'} |`);
        bodyParts.push(`| Field | Type | Default | Description |\n|-------|------|---------|-------------|\n${rows.join('\n')}\n`);
      }
    }
  }

  if (functions.length > 0) {
    bodyParts.push(`## Exported Functions & Hooks\n`);
    for (const fn of functions) {
      bodyParts.push(`### \`${fn.name}\``);
      if (fn.description) bodyParts.push(`${fn.description}\n`);
      bodyParts.push(`\`\`\`ts\n${fn.signature}\n\`\`\`\n`);
      if (fn.params.length > 0) {
        bodyParts.push(`**Parameters:**\n${fn.params.map(p => `- \`${p.name}\`: ${p.description}`).join('\n')}\n`);
      }
      if (fn.returns) {
        bodyParts.push(`**Returns:** ${fn.returns}\n`);
      }
    }
  }

  if (bodyParts.length === 0) {
    bodyParts.push(`Source file exports:\n\n\`\`\`ts\n${content.trim()}\n\`\`\``);
  }

  const normRel = relativePath.replace(/\\/g, '/');
  const isRootIndex = normRel === 'index.ts' || normRel === 'index.tsx';
  let pageTitle = title;
  let sidebarLabel = title;

  if (isRootIndex) {
    pageTitle = "Overview & Introduction";
    sidebarLabel = "Overview & Intro";
  } else if (filename === 'index.ts' || filename === 'index.tsx') {
    const parentFolder = path.basename(path.dirname(normRel));
    const parentCap = parentFolder.charAt(0).toUpperCase() + parentFolder.slice(1);
    pageTitle = `${parentCap} - Overview`;
    sidebarLabel = `${parentCap} (Overview)`;
  }

  const slugPath = isRootIndex ? '/' : '/' + normRel.replace(/\.(ts|tsx)$/, '');

  return `---
title: ${yamlStr(pageTitle)}
sidebar_label: ${yamlStr(sidebarLabel)}
description: ${yamlStr(mainDesc || pageTitle)}
source: ${yamlStr(relativePath)}
slug: ${yamlStr(slugPath)}
---

# ${pageTitle}

${bodyParts.join('\n')}
`;
}

// ─── Main Generator Function ──────────────────────────────────────────────────

export function buildDocs(foundationDir: string, outDir: string): { totalFiles: number; files: string[] } {
  const generatedFiles: string[] = [];

  function traverse(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    // Check if this directory is a Component/Layout folder (contains a .meta.yaml file)
    const metaFile = entries.find(e => e.isFile() && e.name.endsWith('.meta.yaml'));
    if (metaFile) {
      const relativeDirPath = path.relative(foundationDir, currentDir);
      const targetSubDir = path.join(outDir, relativeDirPath);
      ensureDir(targetSubDir);

      const componentName = metaFile.name.replace(/\.meta\.yaml$/, '');
      const mdPath = path.join(targetSubDir, `${componentName}.md`);
      const metaFullPath = path.join(currentDir, metaFile.name);
      const relativeMetaPath = path.join(relativeDirPath, metaFile.name);

      const mdContent = generateComponentMDX(metaFullPath, currentDir, relativeMetaPath);
      fs.writeFileSync(mdPath, mdContent, 'utf8');
      generatedFiles.push(mdPath);
      return;
    }

    // Otherwise, process entries individually
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(foundationDir, fullPath);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        const targetSubDir = path.join(outDir, path.dirname(relativePath));
        ensureDir(targetSubDir);

        if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
          const mdName = entry.name.replace(/\.yaml$|\.yml$/, '.md');
          const mdPath = path.join(targetSubDir, mdName);
          const mdContent = generateYamlMDX(fullPath, relativePath);
          fs.writeFileSync(mdPath, mdContent, 'utf8');
          generatedFiles.push(mdPath);
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          // Skip internal component logic/style files if they are in component folders (handled above)
          if (entry.name.endsWith('.logic.ts') || entry.name.endsWith('.style.ts')) {
            continue;
          }
          const mdName = entry.name.replace(/\.tsx?$|\.ts$/, '.md');
          const mdPath = path.join(targetSubDir, mdName);
          const mdContent = generateTSFileMDX(fullPath, relativePath);
          fs.writeFileSync(mdPath, mdContent, 'utf8');
          generatedFiles.push(mdPath);
        }
      }
    }
  }

  traverse(foundationDir);

  return {
    totalFiles: generatedFiles.length,
    files: generatedFiles,
  };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '../../');
  const foundationDir = path.join(root, 'foundation');
  const outDir = path.join(root, 'docs', 'docs');
  console.log(`Generating MDX docs from ${foundationDir} into ${outDir}...`);
  const result = buildDocs(foundationDir, outDir);
  console.log(`Generated ${result.totalFiles} MDX documentation files successfully.`);
}
