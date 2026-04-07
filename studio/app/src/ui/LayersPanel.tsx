/**
 * LayersPanel — Layer tree with slots, move up/down/into, and screens list.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Modal } from 'react-native';
import { useStudio, TreeNode } from '../store/StudioProvider';
import { Feather } from '@expo/vector-icons';
import { deriveSlotConfig } from '../renderer/slotConfig';
import { deriveScreenNames } from '../../../engine/codegen/naming';
import Tooltip from './shared/Tooltip';
import ConfirmModal from './shared/ConfirmModal';
import ResizeHandle from './shared/ResizeHandle';
import { LAYERS_RESPONSIVE } from './layersResponsive';

// ---------------------------------------------------------------------------
// Text constants — exported for unit tests
// ---------------------------------------------------------------------------

export const LAYERS_TEXTS = {
  layersEmpty: 'Aucun composant sur cet écran. Ajoutez-en depuis la bibliothèque.',
  screensEmpty: 'Aucun écran. Créez votre premier écran avec le bouton ci-dessous.',
  moveBanner: 'Sélectionnez une zone de dépôt ou annulez le déplacement.',
  slotEmpty: 'vide',
  tooltipMoveUp: 'Déplacer vers le haut',
  tooltipMoveDown: 'Déplacer vers le bas',
  tooltipDelete: 'Supprimer ce composant',
  tooltipCondition: 'Condition de visibilité active',
  tooltipRepeat: 'Répétition de liste active',
  tooltipEvent: 'Événement interactif actif',
  tooltipBinding: 'Binding de données actif',
} as const;

const C = { bg: '#080c18', surface: '#0d1220', surface2: '#131a2e', border: '#1a2240', text: '#d0d8f0', muted: '#6a7494', primary: '#3b82f6' };

function kindIcon(kind: string): string {
  switch (kind) { case 'layout': return 'layout'; case 'component': return 'box'; case 'block': return 'package'; case 'primitive': return 'grid'; default: return 'circle'; }
}

// Small badge showing the slot population mode (static / template / data)
const MODE_BADGE_CONFIG = {
  static:   { label: 'static',   color: '#6a7494', bg: 'rgba(106,116,148,0.12)' },
  template: { label: 'template', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
  data:     { label: 'data',     color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
} as const;

const SlotModeBadge: React.FC<{ mode: 'static' | 'template' | 'data' }> = ({ mode }) => {
  if (mode === 'static') return null; // don't clutter static slots
  const cfg = MODE_BADGE_CONFIG[mode];
  return (
    <View style={{ backgroundColor: cfg.bg, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 }}>
      <Text style={{ color: cfg.color, fontSize: 7, fontWeight: '700', letterSpacing: 0.3 }}>{cfg.label}</Text>
    </View>
  );
};

const LayerRow: React.FC<{ node: TreeNode; depth: number; parentId?: string; index?: number; panelHeight?: number }> = ({ node, depth, parentId, index = 0, panelHeight = 220 }) => {
  const { selId, setSel, removeNode, movingId, startMove, cancelMove, dropInto, moveUp, moveDown, meta, selectSlot, targetSlot, saveAsTemplate } = useStudio();
  const [collapsed, setCollapsed] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [tplName, setTplName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isSel = node.id === selId;
  const isMoving = node.id === movingId;
  const isDropTarget = !!movingId && movingId !== node.id;
  const m = meta(node.kind, node.registryId);
  const slotCfg = deriveSlotConfig(m?.slots as any);
  const children = node.children || [];
  const namedSlots = slotCfg.mode === 'named' && slotCfg.slots ? slotCfg.slots : [];
  const usedIds = new Set<string>();
  const hasChildren = children.length > 0 || namedSlots.length > 0;
  const hideSecondaryBadges = LAYERS_RESPONSIVE.shouldHideSecondaryBadges(panelHeight);

  return (
    <>
      {isDropTarget && parentId && (
        <Pressable style={s.dropLine} onPress={() => dropInto(parentId, index)}><View style={s.dropLineInner} /></Pressable>
      )}
      <Pressable style={[s.row, isSel && s.rowSel, isMoving && s.rowMoving, { paddingLeft: 8 + depth * 14 }]} onPress={() => setSel(node.id)}>
        {hasChildren && (
          <Pressable onPress={() => setCollapsed(!collapsed)} hitSlop={4} style={{ marginRight: 2 }}>
            <Feather name={collapsed ? 'chevron-right' : 'chevron-down'} size={10} color={C.muted} />
          </Pressable>
        )}
        {!hasChildren && <View style={{ width: 12 }} />}
        <Feather name={kindIcon(node.kind) as any} size={11} color={isSel ? C.primary : C.muted} />
        <Text style={[s.name, isSel && { color: C.primary }]} numberOfLines={1} ellipsizeMode="tail">{node.registryId}</Text>
        {node.slotName && <Text style={s.slotBadge}>{node.slotName}</Text>}
        {node.conditionalRender && (
          <Tooltip text={LAYERS_TEXTS.tooltipCondition}>
            <Feather name="eye" size={9} color="#f59e0b" style={s.indicatorIcon} />
          </Tooltip>
        )}
        {!hideSecondaryBadges && node.repeatBinding && (
          <Tooltip text={LAYERS_TEXTS.tooltipRepeat}>
            <Feather name="repeat" size={9} color="#22d3ee" style={s.indicatorIcon} />
          </Tooltip>
        )}
        {node.events && Object.values(node.events).some((a: any) => a?.length > 0) && (
          <Tooltip text={LAYERS_TEXTS.tooltipEvent}>
            <Feather name="zap" size={9} color="#f59e0b" style={s.indicatorIcon} />
          </Tooltip>
        )}
        {!hideSecondaryBadges && node.bindings && Object.keys(node.bindings).length > 0 && (
          <Tooltip text={LAYERS_TEXTS.tooltipBinding}>
            <Feather name="link" size={9} color="#a78bfa" style={s.indicatorIcon} />
          </Tooltip>
        )}
        {isSel && !movingId && depth > 0 && (
          <View style={[s.actions, hideSecondaryBadges && s.actionsCompact]}>
            <Tooltip text={LAYERS_TEXTS.tooltipMoveUp}>
              <Pressable onPress={() => moveUp(node.id)} hitSlop={4}><Feather name="chevron-up" size={11} color={C.muted} /></Pressable>
            </Tooltip>
            <Tooltip text={LAYERS_TEXTS.tooltipMoveDown}>
              <Pressable onPress={() => moveDown(node.id)} hitSlop={4}><Feather name="chevron-down" size={11} color={C.muted} /></Pressable>
            </Tooltip>
            <Pressable onPress={() => startMove(node.id)} hitSlop={4}><Feather name="move" size={11} color={C.primary} /></Pressable>
            <Pressable onPress={() => setShowSaveInput(true)} hitSlop={4}><Feather name="save" size={10} color="#f59e0b" /></Pressable>
            <Tooltip text={LAYERS_TEXTS.tooltipDelete}>
              <Pressable onPress={() => setShowDeleteConfirm(true)} hitSlop={4}><Feather name="trash-2" size={10} color="#ef4444" /></Pressable>
            </Tooltip>
          </View>
        )}
        {isMoving && <Pressable onPress={cancelMove} hitSlop={6}><Feather name="x-circle" size={12} color={C.primary} /></Pressable>}
      </Pressable>

      {showSaveInput && isSel && (
        <View style={[s.saveRow, { paddingLeft: 8 + (depth + 1) * 14 }]}>
          <TextInput style={s.saveInput} value={tplName} onChangeText={setTplName} placeholder="Template name" placeholderTextColor={C.muted} autoFocus />
          <Pressable onPress={() => { if (tplName.trim()) { saveAsTemplate(node.id, tplName.trim()); setShowSaveInput(false); setTplName(''); } }} style={s.saveBtn}>
            <Feather name="check" size={10} color="#fff" />
          </Pressable>
          <Pressable onPress={() => { setShowSaveInput(false); setTplName(''); }} style={s.saveCancelBtn}>
            <Feather name="x" size={10} color={C.muted} />
          </Pressable>
        </View>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        visible={showDeleteConfirm}
        title="Supprimer le composant"
        message={`Supprimer "${node.registryId}" ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        destructive
        onConfirm={() => { setShowDeleteConfirm(false); removeNode(node.id); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {isDropTarget && (
        <Pressable style={s.dropInto} onPress={() => dropInto(node.id, 0)}>
          <Feather name="corner-down-right" size={10} color={C.primary} />
          <Text style={s.dropIntoText}>Into {node.registryId}</Text>
        </Pressable>
      )}

      {!collapsed && namedSlots.map(slot => {
        const matched = children.filter(c => c.slotName === slot.prop);
        matched.forEach(c => usedIds.add(c.id));
        // Detect if this named slot is actually a named-array (kind: "named-array")
        const slotDef = (m?.slots as any[])?.find((s: any) => s.name === slot.prop);
        const isNamedArray = slotDef?.kind === 'named-array';
        return (
          <View key={slot.prop}>
            <Pressable
              style={[s.slotRow, isNamedArray && s.slotRowArray, { paddingLeft: 8 + (depth + 1) * 14 }, selId === node.id && targetSlot === slot.prop && s.slotRowTargeted]}
              onPress={() => selectSlot(node.id, slot.prop)}
            >
              <Feather name={isNamedArray ? 'copy' : 'inbox'} size={10} color={C.muted} />
              <Text style={s.slotLabel}>{slot.label}</Text>
              {isNamedArray && <SlotModeBadge mode={
                (node.slotBindings?.[slot.prop]?.mode) ??
                (matched.length === 1 && matched[0].repeatBinding ? 'template' : 'static')
              } />}
              {isNamedArray && matched.length > 0 && (
                <Text style={s.slotCount}>{matched.length}</Text>
              )}
              {matched.length === 0 && !movingId && (
                <Text style={s.slotEmpty}>{LAYERS_TEXTS.slotEmpty}</Text>
              )}
              {isDropTarget && (
                <Pressable onPress={() => dropInto(node.id, children.length, slot.prop)} hitSlop={6} style={s.slotDropBtn}>
                  <Feather name="plus-circle" size={10} color={C.primary} />
                  <Text style={s.slotDropText}>Drop</Text>
                </Pressable>
              )}
            </Pressable>
            {matched.map((c, i) => <LayerRow key={c.id} node={c} depth={depth + 2} parentId={node.id} index={i} panelHeight={panelHeight} />)}
          </View>
        );
      })}

      {!collapsed && slotCfg.mode === 'items' && (() => {
        const itemsProp = slotCfg.itemsProp ?? 'items';
        const primarySlotDef = (m?.slots as any[])?.find((s: any) => s.kind === 'items' || (s.array && !s.kind));
        const slotLabel = primarySlotDef?.label ?? 'Items';
        const isTargeted = selId === node.id && targetSlot === itemsProp;
        // Primary items children (no slotName or slotName === itemsProp)
        const primaryChildren = children.filter(c => !c.slotName || c.slotName === itemsProp);
        // Secondary named-array slots (e.g. backContent on FlipLayout)
        const secondarySlots = slotCfg.secondaryArraySlots ?? [];

        // Derive display mode for primary slot
        const primaryBinding = node.slotBindings?.[itemsProp];
        const primaryMode: 'static' | 'template' | 'data' =
          primaryBinding?.mode ??
          (node.repeatBinding ? 'data' :
           primaryChildren.length === 1 && primaryChildren[0].repeatBinding ? 'template' : 'static');

        return (
          <View>
            {/* Primary items slot row */}
            <Pressable
              style={[s.slotRow, { paddingLeft: 8 + (depth + 1) * 14 }, isTargeted && s.slotRowTargeted]}
              onPress={() => selectSlot(node.id, itemsProp)}
            >
              <Feather name="layers" size={10} color={C.muted} />
              <Text style={s.slotLabel}>{slotLabel}</Text>
              <SlotModeBadge mode={primaryMode} />
              {primaryChildren.length === 0 && primaryMode === 'static' && !movingId && (
                <Text style={s.slotEmpty}>{LAYERS_TEXTS.slotEmpty}</Text>
              )}
              {isDropTarget && (
                <Pressable onPress={() => dropInto(node.id, primaryChildren.length, itemsProp)} hitSlop={6} style={s.slotDropBtn}>
                  <Feather name="plus-circle" size={10} color={C.primary} />
                  <Text style={s.slotDropText}>Drop</Text>
                </Pressable>
              )}
            </Pressable>
            {primaryChildren.map((c, i) => (
              <LayerRow key={c.id} node={c} depth={depth + 2} parentId={node.id} index={i} panelHeight={panelHeight} />
            ))}
            {/* Secondary named-array slot rows (e.g. backContent) */}
            {secondarySlots.map(sec => {
              const secChildren = children.filter(c => c.slotName === sec.prop);
              const isSecTargeted = selId === node.id && targetSlot === sec.prop;
              const secBinding = node.slotBindings?.[sec.prop];
              const secMode: 'static' | 'template' | 'data' =
                secBinding?.mode ??
                (secChildren.length === 1 && secChildren[0].repeatBinding ? 'template' : 'static');
              return (
                <View key={sec.prop}>
                  <Pressable
                    style={[s.slotRow, s.slotRowArray, { paddingLeft: 8 + (depth + 1) * 14 }, isSecTargeted && s.slotRowTargeted]}
                    onPress={() => selectSlot(node.id, sec.prop)}
                  >
                    <Feather name="copy" size={10} color={C.muted} />
                    <Text style={s.slotLabel}>{sec.label}</Text>
                    <SlotModeBadge mode={secMode} />
                    {secChildren.length === 0 && secMode === 'static' && !movingId && (
                      <Text style={s.slotEmpty}>{LAYERS_TEXTS.slotEmpty}</Text>
                    )}
                    {isDropTarget && (
                      <Pressable onPress={() => dropInto(node.id, secChildren.length, sec.prop)} hitSlop={6} style={s.slotDropBtn}>
                        <Feather name="plus-circle" size={10} color={C.primary} />
                        <Text style={s.slotDropText}>Drop</Text>
                      </Pressable>
                    )}
                  </Pressable>
                  {secChildren.map((c, i) => (
                    <LayerRow key={c.id} node={c} depth={depth + 2} parentId={node.id} index={i} panelHeight={panelHeight} />
                  ))}
                </View>
              );
            })}
          </View>
        );
      })()}

      {!collapsed && slotCfg.mode !== 'items' && children.filter(c => !usedIds.has(c.id)).map((c, i) => (
        <LayerRow key={c.id} node={c} depth={depth + 1} parentId={node.id} index={i} panelHeight={panelHeight} />
      ))}
    </>
  );
};

/** Single screen row with inline rename and generated file name hint */
const ScreenRow: React.FC<{ page: any; names: ReturnType<typeof deriveScreenNames>; isActive: boolean; groupId?: string }> = ({ page, names, isActive, groupId }) => {
  const { setPageId, deletePage, renamePage, updateProject, project } = useStudio();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(page.name);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => { if (!editing) setDraft(page.name); }, [page.name, editing]);

  const commitRename = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === page.name) { setEditing(false); return; }
    await renamePage(page.id, trimmed);
    setEditing(false);
  };

  const allGroups: any[] = (project as any)?.screenGroups || [];
  const otherGroups = allGroups.filter((g: any) => g.id !== groupId);

  const moveToGroup = (targetId: string) => {
    const updatedGroups = allGroups.map((g: any) => {
      if (g.id === groupId) return { ...g, screenIds: (g.screenIds || []).filter((s: string) => s !== page.id) };
      if (g.id === targetId) return { ...g, screenIds: [...(g.screenIds || []), page.id] };
      return g;
    });
    updateProject({ screenGroups: updatedGroups } as any);
    setShowMoveModal(false);
  };

  const typeIcon: Record<string, React.ComponentProps<typeof Feather>['name']> = {
    tabs: 'grid', drawer: 'menu', stack: 'layers', auth: 'lock', protected: 'shield', custom: 'folder',
  };
  const typeColor: Record<string, string> = {
    tabs: '#3b82f6', drawer: '#8b5cf6', stack: '#6a7494', auth: '#f59e0b', protected: '#22c55e', custom: '#6a7494',
  };

  return (
    <>
      <ConfirmModal
        visible={showDeleteConfirm}
        title={`Supprimer "${page.name}"`}
        message="Cette action est irréversible. L'écran et son contenu seront supprimés."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        destructive
        onConfirm={() => { setShowDeleteConfirm(false); deletePage(page.id); }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Move to group modal */}
      <Modal visible={showMoveModal} transparent animationType="fade" onRequestClose={() => setShowMoveModal(false)}>
        <Pressable style={s.moveOverlay} onPress={() => setShowMoveModal(false)}>
          <Pressable style={s.moveSheet} onPress={e => e.stopPropagation()}>
            <View style={s.moveSheetHeader}>
              <Feather name="move" size={13} color={C.primary} />
              <Text style={s.moveSheetTitle}>Déplacer "{page.name}"</Text>
              <Pressable onPress={() => setShowMoveModal(false)} hitSlop={8}>
                <Feather name="x" size={14} color={C.muted} />
              </Pressable>
            </View>
            <Text style={s.moveSheetSub}>Choisir le groupe de destination</Text>
            {allGroups.map((g: any) => {
              const isCurrent = g.id === groupId;
              const color = typeColor[g.type] || C.muted;
              return (
                <Pressable
                  key={g.id}
                  style={[s.moveGroupItem, isCurrent && s.moveGroupItemCurrent]}
                  onPress={() => !isCurrent && moveToGroup(g.id)}
                  disabled={isCurrent}
                >
                  <View style={[s.moveGroupIcon, { backgroundColor: color + '20' }]}>
                    <Feather name={typeIcon[g.type] || 'folder'} size={13} color={color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.moveGroupName, isCurrent && { color: C.muted }]}>{g.name}</Text>
                    <Text style={s.moveGroupType}>{g.type} · {(g.screenIds || []).length} screens</Text>
                  </View>
                  {isCurrent ? (
                    <View style={s.moveGroupCurrentBadge}>
                      <Text style={s.moveGroupCurrentText}>actuel</Text>
                    </View>
                  ) : (
                    <Feather name="arrow-right" size={13} color={C.muted} />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      <Pressable style={[s.screenRow, isActive && s.screenRowOn, groupId && { paddingLeft: 28 }]} onPress={() => setPageId(page.id)}>
        <Feather name="file-text" size={11} color={isActive ? C.primary : C.muted} />
        <View style={{ flex: 1 }}>
          {editing ? (
            <TextInput
              style={s.renameInput}
              value={draft}
              onChangeText={setDraft}
              onBlur={commitRename}
              onSubmitEditing={commitRename}
              autoFocus
            />
          ) : (
            <>
              <Text style={[s.screenName, isActive && { color: C.primary }]} numberOfLines={1}>{page.name}</Text>
              <Text style={s.screenHint}>/{names.fileName}</Text>
            </>
          )}
        </View>

        {!editing && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            {/* Rename */}
            <Pressable style={s.rowAction} onPress={() => { setDraft(page.name); setEditing(true); }} hitSlop={4}>
              <Feather name="edit-2" size={10} color={C.muted} />
            </Pressable>

            {/* Move — always show if there are groups (even just one, to show context) */}
            {allGroups.length > 1 && (
              <Pressable style={s.rowAction} onPress={() => setShowMoveModal(true)} hitSlop={4}>
                <Feather name="move" size={10} color={C.muted} />
              </Pressable>
            )}

            {/* Delete */}
            <Pressable style={[s.rowAction, s.rowActionDanger]} onPress={() => setShowDeleteConfirm(true)} hitSlop={4}>
              <Feather name="trash-2" size={10} color="#ef4444" />
            </Pressable>
          </View>
        )}
      </Pressable>
    </>
  );
};

/** Group row with inline rename */
const GroupRow: React.FC<{ group: any }> = ({ group }) => {
  const { project, setPageId, pageId, updateScreenGroup, removeScreenGroup, updateProject } = useStudio();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(group.name);
  const [expanded, setExpanded] = useState(true);
  const [showAddPage, setShowAddPage] = useState(false);

  const commitRename = () => {
    const t = draft.trim();
    if (t && t !== group.name) updateScreenGroup(group.id, { name: t });
    setEditing(false);
  };

  const allGroups: any[] = (project as any)?.screenGroups || [];

  // Pages not in ANY group — these can be added to this group
  const unassignedPages = (project?.pages || []).filter(
    (p: any) => !allGroups.some((g: any) => (g.screenIds || []).includes(p.id))
  );

  // Move a page into this group, removing it from any other group first
  const movePageToGroup = (pageId: string) => {
    const updatedGroups = allGroups.map((g: any) => {
      if (g.id === group.id) {
        // Add to this group (avoid duplicates)
        if ((g.screenIds || []).includes(pageId)) return g;
        return { ...g, screenIds: [...(g.screenIds || []), pageId] };
      }
      // Remove from any other group
      return { ...g, screenIds: (g.screenIds || []).filter((s: string) => s !== pageId) };
    });
    updateProject({ screenGroups: updatedGroups } as any);
  };

  const typeIcon: Record<string, React.ComponentProps<typeof Feather>['name']> = {
    auth: 'lock', protected: 'shield', tabs: 'grid', drawer: 'menu', stack: 'layers', custom: 'folder',
  };
  const typeColor: Record<string, string> = {
    auth: '#f59e0b', protected: '#22c55e', tabs: '#3b82f6', drawer: '#8b5cf6', stack: '#6a7494', custom: '#6a7494',
  };

  return (
    <View style={s.groupBlock}>
      {/* Group header */}
      <Pressable style={s.groupHeader} onPress={() => setExpanded(e => !e)}>
        <Feather name={expanded ? 'chevron-down' : 'chevron-right'} size={10} color={C.muted} />
        <Feather name={typeIcon[group.type] || 'folder'} size={11} color={typeColor[group.type] || C.muted} />
        {editing ? (
          <TextInput
            style={[s.renameInput, { flex: 1 }]}
            value={draft}
            onChangeText={setDraft}
            onBlur={commitRename}
            onSubmitEditing={commitRename}
            autoFocus
          />
        ) : (
          <Text style={s.groupName} numberOfLines={1}>{group.name}</Text>
        )}
        <View style={[s.groupTypeBadge, { backgroundColor: (typeColor[group.type] || C.muted) + '20' }]}>
          <Text style={[s.groupTypeText, { color: typeColor[group.type] || C.muted }]}>{group.type}</Text>
        </View>
        {!editing && (
          <Pressable onPress={() => { setDraft(group.name); setEditing(true); }} hitSlop={4}>
            <Feather name="edit-2" size={9} color={C.muted} />
          </Pressable>
        )}
        <Pressable onPress={() => removeScreenGroup(group.id)} hitSlop={4}>
          <Feather name="trash-2" size={9} color='#ef4444' />
        </Pressable>
      </Pressable>

      {/* Group pages */}
      {expanded && (
        <>
          {(group.screenIds || []).map((sid: string) => {
            const pg = project?.pages.find((p: any) => p.id === sid);
            if (!pg) return null;
            const names = deriveScreenNames(pg.name);
            return (
              <ScreenRow key={sid} page={pg} names={names} isActive={pg.id === pageId} groupId={group.id} />
            );
          })}
          {/* Add page to group */}
          {showAddPage ? (
            <View style={s.addPagePicker}>
              <Text style={s.addPagePickerTitle}>Add a screen to this group:</Text>
              {unassignedPages.length === 0 ? (
                <Text style={s.addPagePickerEmpty}>All screens are already in a group</Text>
              ) : (
                unassignedPages.map((p: any) => (
                  <Pressable key={p.id} style={s.addPagePickerItem} onPress={() => {
                    movePageToGroup(p.id);
                    setShowAddPage(false);
                  }}>
                    <Feather name="plus" size={10} color={C.primary} />
                    <Text style={s.addPagePickerItemText}>{p.name}</Text>
                  </Pressable>
                ))
              )}
              <Pressable onPress={() => setShowAddPage(false)} style={{ alignSelf: 'center', marginTop: 4 }}>
                <Text style={{ color: C.muted, fontSize: 9 }}>Cancel</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={s.addPageBtn} onPress={() => setShowAddPage(true)}>
              <Feather name="plus" size={10} color={C.primary} />
              <Text style={s.addPageBtnText}>Add screen to group</Text>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
};

const LayersPanel: React.FC = () => {
  const { bottomTab, setBottomTab, page, project, setPageId, pageId, addPage, deletePage, movingId, cancelMove, addScreenGroup, removeScreenGroup, updateScreenGroup } = useStudio();
  const pg = page();
  const [panelHeight, setPanelHeight] = useState(220);

  const onResize = useCallback((delta: number) => {
    setPanelHeight(h => Math.min(LAYERS_RESPONSIVE.MAX_HEIGHT, Math.max(LAYERS_RESPONSIVE.MIN_HEIGHT, h - delta)));
  }, []);

  return (
    <View style={[s.root, { height: panelHeight }]}>
      <ResizeHandle side="right" onResize={onResize} vertical currentSize={panelHeight} />
      <View style={s.tabs}>
        {(['layers', 'screens'] as const).map(t => (
          <Pressable key={t} style={[s.tab, bottomTab === t && s.tabOn]} onPress={() => setBottomTab(t)}>
            <Feather name={t === 'layers' ? 'layers' : 'monitor'} size={11} color={bottomTab === t ? C.primary : C.muted} />
            <Text style={[s.tabText, bottomTab === t && s.tabTextOn]}>{t.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      {bottomTab === 'layers' ? (
        <ScrollView style={s.scroll}>
          {movingId && (
            <Pressable style={s.cancelBar} onPress={cancelMove}>
              <Feather name="x-circle" size={12} color={C.primary} />
              <Text style={s.cancelText}>{LAYERS_TEXTS.moveBanner}</Text>
            </Pressable>
          )}
          {pg?.root ? (
            <LayerRow node={pg.root} depth={0} panelHeight={panelHeight} />
          ) : (
            <Text style={s.emptyText}>{LAYERS_TEXTS.layersEmpty}</Text>
          )}
        </ScrollView>
      ) : (
        <View style={s.scroll}>
          <ScrollView style={{ flex: 1 }}>
            <Text style={s.groupSectionTitle}>SCREENS</Text>
            {(() => {
              const ungroupedPages = project?.pages.filter((p: any) =>
                !((project as any)?.screenGroups || []).some((g: any) => (g.screenIds || []).includes(p.id))
              ) || [];
              if (ungroupedPages.length === 0 && !((project as any)?.screenGroups?.length > 0)) {
                return <Text style={s.emptyText}>{LAYERS_TEXTS.screensEmpty}</Text>;
              }
              return ungroupedPages.map(p => {
                const names = deriveScreenNames(p.name);
                return <ScreenRow key={p.id} page={p} names={names} isActive={p.id === pageId} />;
              });
            })()}
            {(project as any)?.screenGroups?.length > 0 && (
              <>
                <Text style={[s.groupSectionTitle, { marginTop: 8 }]}>GROUPS</Text>
                {((project as any).screenGroups || []).map((g: any) => (
                  <GroupRow key={g.id} group={g} />
                ))}
              </>
            )}
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 4, margin: 6 }}>
            <Pressable style={[s.createBtn, { flex: 2 }]} onPress={async () => { await addPage('Screen ' + ((project?.pages.length || 0) + 1)); }}>
              <Feather name="plus" size={12} color="#fff" />
              <Text style={s.createBtnText}>Screen</Text>
            </Pressable>
            <Pressable style={[s.createBtn, { flex: 1, backgroundColor: '#8b5cf6' }]} onPress={() => {
              addScreenGroup({ id: 'grp_' + Date.now(), name: 'Group', type: 'stack', screenIds: [] });
            }}>
              <Feather name="folder-plus" size={12} color="#fff" />
            </Pressable>
            <Pressable style={[s.createBtn, { flex: 1, backgroundColor: '#f59e0b' }]} onPress={() => {
              addScreenGroup({ id: 'grp_' + Date.now(), name: 'auth', type: 'auth', screenIds: [] });
            }}>
              <Feather name="lock" size={12} color="#fff" />
            </Pressable>
            <Pressable style={[s.createBtn, { flex: 1, backgroundColor: '#22c55e' }]} onPress={() => {
              addScreenGroup({ id: 'grp_' + Date.now(), name: 'protected', type: 'protected', screenIds: [], requireAuth: true, redirectTo: 'login' });
            }}>
              <Feather name="shield" size={12} color="#fff" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default LayersPanel;

const s = StyleSheet.create({
  root: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.border },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 6, gap: 4 },
  tabOn: { borderBottomWidth: 2, borderBottomColor: C.primary },
  tabText: { color: C.muted, fontSize: 9, fontWeight: '600', letterSpacing: 0.5 },
  tabTextOn: { color: C.primary },
  scroll: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingRight: 6, gap: 4 },
  rowSel: { backgroundColor: 'rgba(59,130,246,0.08)' },
  rowMoving: { backgroundColor: 'rgba(59,130,246,0.15)', borderLeftWidth: 2, borderLeftColor: C.primary },
  name: { flex: 1, color: C.text, fontSize: 11, fontWeight: '500' },
  slotBadge: { fontSize: 8, color: C.primary, backgroundColor: 'rgba(59,130,246,0.1)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3 },
  indicatorIcon: { marginLeft: 1 },
  indicatorBadge: { fontSize: 8 },
  actions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actionsCompact: { gap: 3 },
  slotRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3, paddingRight: 8, gap: 4, opacity: 0.6 },
  slotRowArray: { opacity: 0.75 },
  slotLabel: { flex: 1, color: C.muted, fontSize: 10, fontStyle: 'italic', marginLeft: 4 },
  slotEmpty: { fontSize: 8, color: C.muted, opacity: 0.5, fontStyle: 'italic' },
  slotCount: { fontSize: 8, color: C.primary, backgroundColor: 'rgba(59,130,246,0.12)', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 3, fontWeight: '600' },
  slotRowTargeted: { backgroundColor: 'rgba(34,197,94,0.1)' },
  slotDropBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(59,130,246,0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  slotDropText: { fontSize: 8, color: C.primary, fontWeight: '600' },
  dropLine: { height: 6, marginHorizontal: 8, justifyContent: 'center' },
  dropLineInner: { height: 2, backgroundColor: C.primary, borderRadius: 1 },
  dropInto: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 3, marginLeft: 20 },
  dropIntoText: { color: C.primary, fontSize: 9, fontWeight: '600' },
  cancelBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(59,130,246,0.08)', padding: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  cancelText: { color: C.primary, fontSize: 10, fontWeight: '500' },
  screenRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8 },
  screenRowOn: { backgroundColor: 'rgba(59,130,246,0.08)' },
  screenName: { color: C.text, fontSize: 12, fontWeight: '500', flex: 1 },
  screenHint: { color: C.muted, fontSize: 9, marginTop: 1 },
  rowAction: { width: 22, height: 22, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  rowActionDanger: { backgroundColor: 'rgba(239,68,68,0.08)' },
  moveOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  moveSheet: {
    width: 280, backgroundColor: C.surface, borderRadius: 12,
    borderWidth: 1, borderColor: C.border, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 24,
  },
  moveSheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  moveSheetTitle: { flex: 1, color: C.text, fontSize: 13, fontWeight: '600' },
  moveSheetSub: { color: C.muted, fontSize: 10, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 4 },
  moveGroupItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  moveGroupItemCurrent: { opacity: 0.45 },
  moveGroupIcon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  moveGroupName: { color: C.text, fontSize: 12, fontWeight: '500' },
  moveGroupType: { color: C.muted, fontSize: 9, marginTop: 1 },
  moveGroupCurrentBadge: { backgroundColor: C.surface2, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  moveGroupCurrentText: { color: C.muted, fontSize: 9, fontWeight: '600' },
  renameInput: { height: 22, backgroundColor: C.surface2, borderRadius: 4, borderWidth: 1, borderColor: C.primary, color: C.text, fontSize: 11, paddingHorizontal: 6 },
  groupSectionTitle: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
  groupBlock: { borderBottomWidth: 1, borderBottomColor: C.border },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7 },
  groupName: { color: C.text, fontSize: 11, fontWeight: '600', flex: 1 },
  groupTypeBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  groupTypeText: { fontSize: 8, fontWeight: '700' },
  addPageBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 28, paddingVertical: 5 },
  addPageBtnText: { color: C.primary, fontSize: 9, fontWeight: '500' },
  addPagePicker: { backgroundColor: C.surface2, marginHorizontal: 8, marginBottom: 4, borderRadius: 6, borderWidth: 1, borderColor: C.border, padding: 8, gap: 4 },
  addPagePickerTitle: { color: C.text, fontSize: 10, fontWeight: '600', marginBottom: 4 },
  addPagePickerEmpty: { color: C.muted, fontSize: 9, fontStyle: 'italic' },
  addPagePickerItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5, paddingHorizontal: 4 },
  addPagePickerItemText: { color: C.text, fontSize: 11 },
  createBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: C.primary, borderRadius: 6, paddingVertical: 7 },
  createBtnText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  saveRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 3, paddingRight: 8 },
  saveInput: { flex: 1, height: 24, backgroundColor: C.surface2, borderRadius: 4, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 10, paddingHorizontal: 6 },
  saveBtn: { width: 22, height: 22, borderRadius: 4, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' },
  saveCancelBtn: { width: 22, height: 22, borderRadius: 4, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: C.muted, fontSize: 11, fontStyle: 'italic', textAlign: 'center', padding: 16, lineHeight: 16 },
});
