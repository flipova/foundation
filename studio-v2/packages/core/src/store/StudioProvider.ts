/**
 * StudioProvider — Re-exports for backward-compat with legacy imports.
 * Apps that used to import from '...core/store/StudioProvider' still work.
 */
export { useStudioStore } from './index';
export type { StudioState } from './index';
export type { TreeNode, ActionDef, NodeKind, ProjectDocument, PageDocument } from '../tree/types';
export type { RegItem, Reg } from '../tree/types';
