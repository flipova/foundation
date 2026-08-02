#!/usr/bin/env node
/**
 * Verifies that all component definitions (.meta.yaml) in foundation/ui/components are valid YAML,
 * have required fields (id or name, type), and contain no duplicate component IDs.
 *
 * Usage: npx tsx scripts/validate-defs.ts
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const ROOT = path.join(__dirname, '..');
const UI_DIR = path.join(ROOT, 'foundation/ui/components');

function findMetaFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findMetaFiles(fullPath, fileList);
    } else if (file.endsWith('.meta.yaml')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function main() {
  console.log('🔍 Flipova — Validation Component Defs (.meta.yaml)\n');

  const metaFiles = findMetaFiles(UI_DIR);
  console.log(`Found ${metaFiles.length} .meta.yaml file(s)...\n`);

  const ids = new Set<string>();
  const duplicates: string[] = [];
  const invalidFiles: { file: string; reason: string }[] = [];

  for (const filePath of metaFiles) {
    const relativePath = path.relative(ROOT, filePath);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = yaml.parse(content) as Record<string, unknown>;

      if (!parsed || typeof parsed !== 'object') {
        invalidFiles.push({ file: relativePath, reason: 'File content is not a valid YAML object' });
        continue;
      }

      const id = (parsed.id || parsed.name) as string | undefined;
      const type = parsed.type as string | undefined;

      if (!id) {
        invalidFiles.push({ file: relativePath, reason: 'Missing "id" or "name" field' });
      } else if (!type) {
        invalidFiles.push({ file: relativePath, reason: 'Missing "type" field' });
      } else {
        if (ids.has(id)) {
          duplicates.push(id);
        } else {
          ids.add(id);
        }
      }
    } catch (err: any) {
      invalidFiles.push({ file: relativePath, reason: `YAML parse error: ${err.message}` });
    }
  }

  if (invalidFiles.length === 0 && duplicates.length === 0) {
    console.log(`✅ All ${metaFiles.length} meta definitions are valid and unique! (${ids.size} unique IDs)`);
    return;
  }

  if (invalidFiles.length > 0) {
    console.log(`❌ INVALID META FILES (${invalidFiles.length}):`);
    invalidFiles.forEach(({ file, reason }) => console.log(`   - ${file}: ${reason}`));
    console.log();
  }

  if (duplicates.length > 0) {
    console.log(`⚠️ DUPLICATE COMPONENT IDs (${duplicates.length}):`);
    duplicates.forEach(id => console.log(`   - ${id}`));
    console.log();
  }

  process.exit(1);
}

main();

