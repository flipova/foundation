/**
 * Code Generator
 *
 * Transforms a PageDocument tree into a React Native .tsx file.
 * The generated code imports from @flipova/foundation and is
 * immediately runnable in an Expo/RN project.
 */

import type { TreeNode, PageDocument } from "../tree/types";

const IMPORT_MAP: Record<string, string> = {
  layout: "@flipova/foundation",
  component: "@flipova/foundation",
  block: "@flipova/foundation",
};

interface ImportCollector {
  imports: Map<string, Set<string>>;
}

function collectImports(node: TreeNode, collector: ImportCollector): void {
  const source = IMPORT_MAP[node.kind] || "@flipova/foundation";
  if (node.kind !== "text" && node.kind !== "slot") {
    if (!collector.imports.has(source)) {
      collector.imports.set(source, new Set());
    }
    collector.imports.get(source)!.add(node.registryId);
  }
  for (const child of node.children) {
    collectImports(child, collector);
  }
}

function renderImports(collector: ImportCollector): string {
  const lines: string[] = [
    `import React from "react";`,
  ];

  for (const [source, names] of collector.imports) {
    const sorted = Array.from(names).sort();
    lines.push(`import { ${sorted.join(", ")} } from "${source}";`);
  }

  return lines.join("\n");
}

function serializeProp(key: string, value: unknown): string {
  if (typeof value === "string") return `${key}="${value}"`;
  if (typeof value === "number") return `${key}={${value}}`;
  if (typeof value === "boolean") return value ? key : `${key}={false}`;
  if (Array.isArray(value)) return `${key}={${JSON.stringify(value)}}`;
  if (typeof value === "object" && value !== null) return `${key}={${JSON.stringify(value)}}`;
  return "";
}

function renderNode(node: TreeNode, indent: number): string {
  const pad = "  ".repeat(indent);

  if (node.kind === "text") {
    return `${pad}<Text>${node.props.text ?? ""}</Text>`;
  }

  const tag = node.registryId;
  const propEntries = Object.entries(node.props).filter(([, v]) => v !== undefined);
  const propsStr = propEntries.map(([k, v]) => serializeProp(k, v)).filter(Boolean).join(" ");
  const opening = propsStr ? `${tag} ${propsStr}` : tag;

  if (node.children.length === 0) {
    return `${pad}<${opening} />`;
  }

  const childrenStr = node.children.map((c) => renderNode(c, indent + 1)).join("\n");
  return `${pad}<${opening}>\n${childrenStr}\n${pad}</${tag}>`;
}

export function generatePageCode(page: PageDocument): string {
  const collector: ImportCollector = { imports: new Map() };
  collectImports(page.root, collector);

  const imports = renderImports(collector);
  const componentName = page.name.replace(/[^a-zA-Z0-9]/g, "") + "Screen";
  const body = renderNode(page.root, 2);

  return `${imports}

export default function ${componentName}() {
  return (
${body}
  );
}
`;
}
