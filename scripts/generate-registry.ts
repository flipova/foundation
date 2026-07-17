import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const ROOT = process.cwd();
const UI_DIR = path.join(ROOT, 'foundation/ui/components');
const OUT_FILE = path.join(ROOT, 'foundation/registry/generated.ts');

function findMetaFiles(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      findMetaFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.meta.yaml')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const metaFiles = findMetaFiles(UI_DIR);
const registryData: Record<string, any> = {};

for (const file of metaFiles) {
  const metaContent = fs.readFileSync(file, 'utf8');
  const meta = yaml.load(metaContent) as any;
  const key = meta?.id || meta?.name;
  if (meta && key) {
    registryData[key] = meta;
  }
}

let out = `/**
 * AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
 * This file is generated from scanning .meta.yaml files.
 */
import type { ComponentMeta, BlockMeta, LayoutMeta, PrimitiveMeta } from "../types";

`;

const components: string[] = [];
const blocks: string[] = [];
const layouts: string[] = [];
const primitives: string[] = [];

for (const [id, meta] of Object.entries(registryData)) {
    const { type, ...rest } = meta;
    
    // We output the object literal.
    // To get deep readonly inference, we just do `as const`.
    
    const metaName = `${id}Meta`;
    if (type === "component") {
        components.push(metaName);
    } else if (type === "block") {
        blocks.push(metaName);
    } else if (type === "layout") {
        layouts.push(metaName);
    } else if (type === "primitive") {
        primitives.push(metaName);
    }

    out += `export const ${metaName} = ${JSON.stringify(rest, null, 2)} as const;\n\n`;
}

out += `export const componentRegistry = [\n  ${components.join(',\n  ')}\n] as const;\n\n`;
out += `export const blockRegistry = [\n  ${blocks.join(',\n  ')}\n] as const;\n\n`;
out += `export const layoutRegistry = [\n  ${layouts.join(',\n  ')}\n] as const;\n\n`;
out += `export const primitiveRegistry = [\n  ${primitives.join(',\n  ')}\n] as const;\n\n`;

out += `export function getComponentMeta(id: string): any { return componentRegistry.find((m: any) => m.id === id); }\n`;
out += `export function getBlockMeta(id: string): any { return blockRegistry.find((m: any) => m.id === id); }\n`;
out += `export function getLayoutMeta(id: string): any { return layoutRegistry.find((m: any) => m.id === id); }\n`;
out += `export function getPrimitiveMeta(id: string): any { return primitiveRegistry.find((m: any) => m.id === id); }\n`;

const registryDir = path.dirname(OUT_FILE);
if (!fs.existsSync(registryDir)) {
  fs.mkdirSync(registryDir, { recursive: true });
}

fs.writeFileSync(OUT_FILE, out);
fs.writeFileSync(path.join(registryDir, 'index.ts'), `export * from './generated';\n`);
console.log('Successfully generated registry/generated.ts and registry/index.ts');
