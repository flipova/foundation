/**
 * Block Registry
 *
 * Functional blocks that combine primitives and base components.
 * Each block is a higher-level UI pattern (auth form, header bar, avatar group, etc.)
 * with named slots and theme-aware styling.
 */

import type { BlockMeta } from "../types";
import { existingBlocks } from "./blocks/existing";
import { newBlocks } from "./blocks/new";

export const blockRegistry: BlockMeta[] = [...existingBlocks, ...newBlocks];

export function getBlockMeta(id: string): BlockMeta | undefined {
  return blockRegistry.find((m) => m.id === id);
}
