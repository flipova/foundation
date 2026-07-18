#!/usr/bin/env node
/**
 *
 * Verifies that each entry in registry.yaml has a corresponding definition file in registry/defs/.
 * Also reports orphan defs (present in defs/ but absent from the registry).
 *
 * Usage: npx tsx scripts/validate-defs.ts
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const ROOT = path.join(__dirname, '..');
const DEFS_DIR = path.join(ROOT, 'foundation/registry/defs');
const REGISTRY_PATH = path.join(ROOT, 'foundation/registry/registry.yaml');

function main() {
  console.log('🔍 Flipova — Validation Defs vs Registry\n');

  const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const registry = yaml.parse(registryContent) as Record<string, unknown>;
  const registryIds = Object.keys(registry);

  const defFiles = fs.readdirSync(DEFS_DIR)
    .filter(f => f.endsWith('.yaml'))
    .map(f => f.replace('.yaml', ''));

  const missingDefs = registryIds.filter(id => !defFiles.includes(id));
  const orphanDefs = defFiles.filter(id => !registryIds.includes(id));

  if (missingDefs.length === 0 && orphanDefs.length === 0) {
    console.log(`✅ Everything is synced! ${registryIds.length} components, ${defFiles.length} defs.`);
    return;
  }

  if (missingDefs.length > 0) {
    console.log(`❌ MISSING DEFS (${missingDefs.length}) — present in registry but without def :`);
    missingDefs.forEach(id => console.log(`   - ${id}.yaml`));
    console.log();
  }

  if (orphanDefs.length > 0) {
    console.log(`⚠️  ORPHAN DEFS (${orphanDefs.length}) — present in defs/ but missing from registry :`);
    orphanDefs.forEach(id => console.log(`   - ${id}.yaml`));
    console.log();
  }

  console.log(`📊 Total registry : ${registryIds.length} | Defs : ${defFiles.length} | Missing : ${missingDefs.length}`);

  if (missingDefs.length > 0) process.exit(1);
}

main();
