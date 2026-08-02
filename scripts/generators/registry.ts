import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export function buildRegistry(uiDir: string, outFile: string) {
  function findMetaFiles(dir: string, fileList: string[] = []) {
    if (!fs.existsSync(dir)) return fileList;
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

  const metaFiles = findMetaFiles(uiDir);
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

  out += `export function getComponentMeta(id: string): any { return componentRegistry.find((m: any) => m.id === id) || layoutRegistry.find((m: any) => m.id === id) || primitiveRegistry.find((m: any) => m.id === id) || blockRegistry.find((m: any) => m.id === id); }\n`;
  out += `export function getBlockMeta(id: string): any { return blockRegistry.find((m: any) => m.id === id) || getComponentMeta(id); }\n`;
  out += `export function getLayoutMeta(id: string): any { return layoutRegistry.find((m: any) => m.id === id) || getComponentMeta(id); }\n`;
  out += `export function getPrimitiveMeta(id: string): any { return primitiveRegistry.find((m: any) => m.id === id) || getComponentMeta(id); }\n`;
  out += `export function getMeta(id: string): any { return getComponentMeta(id); }\n`;

  const registryDir = path.dirname(outFile);
  if (!fs.existsSync(registryDir)) {
    fs.mkdirSync(registryDir, { recursive: true });
  }

  fs.writeFileSync(outFile, out);
  fs.writeFileSync(path.join(registryDir, 'index.ts'), `export * from './generated';\n`);
  
  return { components, blocks, layouts, primitives };
}
