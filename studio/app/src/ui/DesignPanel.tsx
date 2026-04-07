/**
 * DesignPanel — WYSIWYG widget-based style editor.
 * No forms. Visual widgets only: alignment grids, box models, live previews.
 */
import React, { useCallback, useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../store/StudioProvider';
import SmartInput from './shared/SmartInput';
import { usePanelWidth } from './shared/usePanelWidth';
import { DESIGN_RESPONSIVE } from './designResponsive';

export const DESIGN_TEXTS = {
  emptyState: 'Sélectionnez un composant sur le canvas.',
} as const;

const C = {
  bg: '#07090f', surface: '#0d1220', s2: '#131a2e', border: '#1a2240',
  text: '#d0d8f0', muted: '#4a5470',
  blue: '#3b82f6', green: '#22c55e', purple: '#8b5cf6',
  orange: '#f59e0b', pink: '#ec4899', cyan: '#06b6d4',
};

// ─── Tiny inline editable number ─────────────────────────────────────────────
const Num: React.FC<{
  value: any; onChange: (v: any) => void;
  style?: any; color?: string; placeholder?: string;
}> = ({ value, onChange, style, color = C.text, placeholder = '–' }) => (
  <TextInput
    style={[{ color, fontSize: 11, fontWeight: '600' as any, textAlign: 'center', minWidth: 24 }, style]}
    value={value !== undefined && value !== null ? String(value) : ''}
    onChangeText={t => { if (t === '' || t === '-') { onChange(undefined); return; } const n = parseFloat(t); if (!isNaN(n)) onChange(n); }}
    keyboardType="numeric"
    placeholderTextColor={C.muted}
    placeholder={placeholder}
  />
);

// ─── Section ─────────────────────────────────────────────────────────────────
const Section: React.FC<{
  title: string; icon: React.ComponentProps<typeof Feather>['name']; color: string;
  open?: boolean; onToggle?: () => void; children: React.ReactNode;
  badge?: string;
}> = ({ title, icon, color, open: ext, onToggle, children, badge }) => {
  const [internal, setInternal] = useState(true);
  const open = ext !== undefined ? ext : internal;
  const toggle = onToggle ?? (() => setInternal(o => !o));
  return (
    <View style={s.section}>
      <Pressable style={s.sHead} onPress={toggle}>
        <View style={[s.sIcon, { backgroundColor: color + '22' }]}>
          <Feather name={icon} size={11} color={color} />
        </View>
        <Text style={s.sTitle}>{title}</Text>
        {badge ? <Text style={[s.sBadge, { color }]}>{badge}</Text> : null}
        <Feather name={open ? 'chevron-down' : 'chevron-right'} size={11} color={C.muted} />
      </Pressable>
      {open && <View style={s.sBody}>{children}</View>}
    </View>
  );
};

// ─── AlignmentGrid ────────────────────────────────────────────────────────────
// 3×3 grid for start/center/end × start/center/stretch
// Extra row below for space-between/around/evenly
// Re-click active cell → resets to defaults
const JUSTIFY_GRID = ['flex-start', 'center', 'flex-end'] as const;
const ALIGN_GRID   = ['flex-start', 'center', 'stretch'] as const;
const JUSTIFY_EXTRA = [
  { v: 'space-between', icon: 'align-justify'   as const, label: 'Between' },
  { v: 'space-around',  icon: 'align-center'    as const, label: 'Around'  },
  { v: 'space-evenly',  icon: 'more-horizontal' as const, label: 'Evenly'  },
] as const;
const ALIGN_EXTRA = [
  { v: 'baseline', icon: 'minus' as const, label: 'Baseline' },
] as const;

const AlignmentGrid: React.FC<{
  justify: string; align: string; direction: string;
  onJustify: (v: string) => void; onAlign: (v: string) => void;
}> = ({ justify, align, direction, onJustify, onAlign }) => {
  const isRow = direction === 'row' || direction === 'row-reverse';
  const activeCol = JUSTIFY_GRID.indexOf(justify as any);
  const activeRow = ALIGN_GRID.indexOf(align as any);
  const isExtraJ = JUSTIFY_EXTRA.some(o => o.v === justify);
  const isExtraA = ALIGN_EXTRA.some(o => o.v === align);

  const handleCell = (col: number, row: number) => {
    const j = JUSTIFY_GRID[col];
    const a = ALIGN_GRID[row];
    // Re-click active → reset to flex-start / stretch
    if (col === activeCol && row === activeRow) {
      onJustify('flex-start');
      onAlign('stretch');
    } else {
      onJustify(j);
      onAlign(a);
    }
  };

  return (
    <View style={s.alignWrap}>
      {/* 3×3 grid */}
      <View style={s.alignGrid}>
        {[0, 1, 2].map(row => (
          <View key={row} style={s.alignGridRow}>
            {[0, 1, 2].map(col => {
              const isActive = col === activeCol && row === activeRow && !isExtraJ && !isExtraA;
              return (
                <Pressable
                  key={col}
                  style={[s.alignCell, isActive && { backgroundColor: C.blue + '30', borderColor: C.blue }]}
                  onPress={() => handleCell(col, row)}
                >
                  <View style={[s.alignDot, isActive && { backgroundColor: C.blue }]} />
                </Pressable>
              );
            })}
          </View>
        ))}
        {/* Direction arrow overlaid */}
        <View style={s.alignDirOverlay} pointerEvents="none">
          <Feather name={isRow ? 'arrow-right' : 'arrow-down'} size={22} color={C.blue + '40'} />
        </View>
      </View>

      {/* Extra justify options: space-between/around/evenly */}
      <View style={s.alignExtraRow}>
        {JUSTIFY_EXTRA.map(o => {
          const on = justify === o.v;
          return (
            <Pressable key={o.v}
              style={[s.alignExtraBtn, on && { backgroundColor: C.blue + '25', borderColor: C.blue }]}
              onPress={() => on ? onJustify('flex-start') : onJustify(o.v)}>
              <Feather name={o.icon} size={11} color={on ? C.blue : C.muted} />
              <Text style={[s.alignExtraTxt, on && { color: C.blue }]}>{o.label}</Text>
            </Pressable>
          );
        })}
        {/* Baseline align */}
        {ALIGN_EXTRA.map(o => {
          const on = align === o.v;
          return (
            <Pressable key={o.v}
              style={[s.alignExtraBtn, on && { backgroundColor: C.blue + '25', borderColor: C.blue }]}
              onPress={() => on ? onAlign('stretch') : onAlign(o.v)}>
              <Feather name={o.icon} size={11} color={on ? C.blue : C.muted} />
              <Text style={[s.alignExtraTxt, on && { color: C.blue }]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Current values label */}
      <Text style={[s.microLabel, { textAlign: 'center', marginTop: 2 }]}>
        {justify.replace('flex-','').replace('space-','sp-')} · {align.replace('flex-','')}
      </Text>
    </View>
  );
};

// ─── DirectionPicker ──────────────────────────────────────────────────────────
// 4 arrow buttons in a 2×2 grid
const DirectionPicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const opts = [
    { v: 'column',         icon: 'arrow-down'  as const },
    { v: 'row',            icon: 'arrow-right' as const },
    { v: 'column-reverse', icon: 'arrow-up'    as const },
    { v: 'row-reverse',    icon: 'arrow-left'  as const },
  ];
  return (
    <View style={s.dirGrid}>
      {opts.map(o => {
        const on = value === o.v;
        return (
          <Pressable key={o.v} style={[s.dirBtn, on && { backgroundColor: C.blue, borderColor: C.blue }]} onPress={() => onChange(o.v)}>
            <Feather name={o.icon} size={13} color={on ? '#fff' : C.muted} />
          </Pressable>
        );
      })}
    </View>
  );
};

// ─── SpacingWidget ────────────────────────────────────────────────────────────
// Interactive box model — tap any value to edit inline
const SpacingWidget: React.FC<{ st: Record<string, any>; ch: (k: string, v: any) => void }> = ({ st, ch }) => {
  const mg = '#f59e0b'; const pd = '#22c55e';
  const V: React.FC<{ k: string; color: string }> = ({ k, color }) => (
    <Num value={st[k]} onChange={v => ch(k, v)} color={color} placeholder="0"
      style={{ width: 28, height: 20, backgroundColor: color + '15', borderRadius: 3, fontSize: 10 }} />
  );
  return (
    <View style={s.spWidget}>
      {/* Margin ring */}
      <View style={[s.spRing, { borderColor: mg + '50', backgroundColor: mg + '06' }]}>
        <Text style={[s.spRingLbl, { color: mg }]}>M</Text>
        <View style={s.spTop}><V k="marginTop" color={mg} /></View>
        <View style={s.spSides}>
          <V k="marginLeft" color={mg} />
          {/* Padding ring */}
          <View style={[s.spRing, s.spRingInner, { borderColor: pd + '50', backgroundColor: pd + '06' }]}>
            <Text style={[s.spRingLbl, { color: pd, fontSize: 6 }]}>P</Text>
            <View style={s.spTop}><V k="paddingTop" color={pd} /></View>
            <View style={s.spSides}>
              <V k="paddingLeft" color={pd} />
              <View style={s.spCore}>
                <Text style={s.spCoreTxt}>{st.width ? `${st.width}` : 'W'} × {st.height ? `${st.height}` : 'H'}</Text>
              </View>
              <V k="paddingRight" color={pd} />
            </View>
            <View style={s.spBot}><V k="paddingBottom" color={pd} /></View>
          </View>
          <V k="marginRight" color={mg} />
        </View>
        <View style={s.spBot}><V k="marginBottom" color={mg} /></View>
      </View>
    </View>
  );
};

// ─── DimWidget ────────────────────────────────────────────────────────────────
// W × H with visual box + lock ratio toggle
const DimWidget: React.FC<{ st: Record<string, any>; ch: (k: string, v: any) => void }> = ({ st, ch }) => {
  const [locked, setLocked] = useState(false);
  const w = st.width; const h = st.height;
  const handleW = (v: any) => {
    ch('width', v);
    if (locked && w && h && v) ch('height', Math.round((Number(h) / Number(w)) * Number(v)));
  };
  const handleH = (v: any) => {
    ch('height', v);
    if (locked && w && h && v) ch('width', Math.round((Number(w) / Number(h)) * Number(v)));
  };
  return (
    <View style={s.dimWidget}>
      {/* Visual box preview */}
      <View style={s.dimPreview}>
        <View style={[s.dimBox, {
          width: Math.min(Math.max(Number(w) || 60, 30), 100),
          height: Math.min(Math.max(Number(h) || 40, 20), 70),
        }]}>
          <Text style={s.dimBoxTxt}>{w || 'auto'}</Text>
          <Feather name="x" size={9} color={C.muted} />
          <Text style={s.dimBoxTxt}>{h || 'auto'}</Text>
        </View>
      </View>
      {/* W / lock / H row */}
      <View style={s.dimRow}>
        <View style={s.dimField}>
          <Text style={s.dimLbl}>W</Text>
          <Num value={w} onChange={handleW} style={s.dimInput} />
        </View>
        <Pressable style={[s.dimLock, locked && { backgroundColor: C.blue + '30', borderColor: C.blue }]} onPress={() => setLocked(l => !l)}>
          <Feather name={locked ? 'lock' : 'unlock'} size={10} color={locked ? C.blue : C.muted} />
        </Pressable>
        <View style={s.dimField}>
          <Text style={s.dimLbl}>H</Text>
          <Num value={h} onChange={handleH} style={s.dimInput} />
        </View>
      </View>
      {/* Min/Max compact */}
      <View style={s.dimMinMax}>
        {[['Min W', 'minWidth'], ['Min H', 'minHeight'], ['Max W', 'maxWidth'], ['Max H', 'maxHeight']].map(([lbl, k]) => (
          <View key={k} style={s.dimMini}>
            <Text style={s.dimMiniLbl}>{lbl}</Text>
            <Num value={st[k]} onChange={v => ch(k, v)} style={s.dimMiniInput} color={C.muted} />
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── ColorSwatch ──────────────────────────────────────────────────────────────
// Large tappable color swatch — opens SmartInput inline
const ColorSwatch: React.FC<{
  value: any; onChange: (v: any) => void; label?: string; size?: 'lg' | 'sm';
}> = ({ value, onChange, label, size = 'sm' }) => {
  const [editing, setEditing] = useState(false);
  const isLg = size === 'lg';
  return (
    <View style={s.swatchWrap}>
      <Pressable
        style={[s.swatch, isLg && s.swatchLg, { backgroundColor: value || 'transparent' }]}
        onPress={() => setEditing(e => !e)}
      >
        {!value && <Feather name="slash" size={isLg ? 20 : 10} color={C.muted} />}
        {isLg && value && (
          <View style={s.swatchEditHint}>
            <Feather name="edit-2" size={12} color="rgba(255,255,255,0.7)" />
          </View>
        )}
      </Pressable>
      {label && !isLg && <Text style={s.swatchLabel}>{label}</Text>}
      {editing && (
        <View style={s.swatchEditor}>
          <SmartInput label="" value={value} onChange={v => { onChange(v); }} propType="color" />
        </View>
      )}
    </View>
  );
};

// ─── OpacityBar ───────────────────────────────────────────────────────────────
// Visual gradient bar showing opacity — tap segments to set value
const OpacityBar: React.FC<{ value: any; onChange: (v: any) => void; color?: string }> = ({ value, onChange, color = C.blue }) => {
  const opacity = value !== undefined ? Number(value) : 1;
  const segments = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  return (
    <View style={s.opacityWrap}>
      <View style={s.opacityBar}>
        {/* Checkerboard bg */}
        <View style={s.opacityChecker} />
        {/* Color fill */}
        <View style={[s.opacityFill, { backgroundColor: color, opacity }]} />
        {/* Segments */}
        {segments.map(v => (
          <Pressable key={v} style={[s.opacitySeg, Math.abs(opacity - v) < 0.05 && s.opacitySegActive]} onPress={() => onChange(v)} />
        ))}
      </View>
      <Num value={opacity !== 1 ? opacity : undefined} onChange={onChange} placeholder="1"
        style={{ width: 32, textAlign: 'center', color: C.text, fontSize: 10 }} />
    </View>
  );
};

// ─── RadiusWidget ─────────────────────────────────────────────────────────────
// Visual rounded box — tap corners to edit
const RadiusWidget: React.FC<{ st: Record<string, any>; ch: (k: string, v: any) => void }> = ({ st, ch }) => {
  const [corner, setCorner] = useState<string | null>(null);
  const r = Number(st.borderRadius) || 0;
  const tl = Number(st.borderTopLeftRadius ?? r);
  const tr = Number(st.borderTopRightRadius ?? r);
  const bl = Number(st.borderBottomLeftRadius ?? r);
  const br = Number(st.borderBottomRightRadius ?? r);

  const corners = [
    { k: 'borderTopLeftRadius',     v: tl, pos: s.cornerTL, icon: 'corner-up-left'    as const },
    { k: 'borderTopRightRadius',    v: tr, pos: s.cornerTR, icon: 'corner-up-right'   as const },
    { k: 'borderBottomLeftRadius',  v: bl, pos: s.cornerBL, icon: 'corner-down-left'  as const },
    { k: 'borderBottomRightRadius', v: br, pos: s.cornerBR, icon: 'corner-down-right' as const },
  ];

  return (
    <View style={s.radiusWidget}>
      {/* Visual box */}
      <View style={s.radiusPreview}>
        <View style={[s.radiusBox, { borderTopLeftRadius: tl, borderTopRightRadius: tr, borderBottomLeftRadius: bl, borderBottomRightRadius: br }]} />
        {/* Corner tap targets */}
        {corners.map(c => (
          <Pressable key={c.k} style={[s.cornerBtn, c.pos, corner === c.k && { backgroundColor: C.cyan + '40' }]}
            onPress={() => setCorner(corner === c.k ? null : c.k)}>
            {c.v ? (
              <Text style={[s.cornerVal, corner === c.k && { color: C.cyan }]}>{c.v}</Text>
            ) : (
              <Feather name={c.icon} size={10} color={corner === c.k ? C.cyan : C.muted} />
            )}
          </Pressable>
        ))}
      </View>
      {/* All corners shorthand */}
      <View style={s.radiusAllRow}>
        <Text style={s.radiusAllLbl}>All</Text>
        <Num value={st.borderRadius} onChange={v => { ch('borderRadius', v); ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'].forEach(k => ch(k, v)); }}
          style={s.radiusAllInput} />
        {corner && (
          <View style={s.radiusCornerEdit}>
            <Text style={[s.radiusAllLbl, { color: C.cyan }]}>{corner.replace('border','').replace('Radius','').replace(/([A-Z])/g, ' $1').trim()}</Text>
            <Num value={st[corner]} onChange={v => ch(corner, v)} style={[s.radiusAllInput, { borderColor: C.cyan }]} color={C.cyan} />
          </View>
        )}
      </View>
    </View>
  );
};

// ─── TypoWidget ───────────────────────────────────────────────────────────────
// Live preview + icon toolbar — no separate weight/align rows
const TypoWidget: React.FC<{ st: Record<string, any>; ch: (k: string, v: any) => void }> = ({ st, ch }) => {
  const weights = ['300','400','500','600','700','800'] as const;
  const wIdx = weights.indexOf((st.fontWeight || '400') as any);
  const wLabels: Record<string, string> = { '300':'Light','400':'Regular','500':'Medium','600':'SemiBold','700':'Bold','800':'ExtraBold' };

  return (
    <View style={s.typoWidget}>
      {/* Live preview */}
      <View style={s.typoPreview}>
        <Text style={{
          fontSize: Math.min(Math.max(Number(st.fontSize) || 28, 14), 52),
          fontWeight: (st.fontWeight || '400') as any,
          color: st.color || C.text,
          fontStyle: st.fontStyle === 'italic' ? 'italic' : 'normal',
          textDecorationLine: (st.textDecorationLine as any) || 'none',
          letterSpacing: Number(st.letterSpacing) || 0,
          textAlign: (st.textAlign as any) || 'center',
        }}>Aa</Text>
        <Text style={s.typoHint}>{st.fontSize || '–'}px · {wLabels[st.fontWeight || '400'] || '–'}</Text>
      </View>

      {/* Toolbar row: B I U | align icons */}
      <View style={s.typoToolbar}>
        <Pressable style={[s.toolBtn, (st.fontWeight === '700' || st.fontWeight === '800') && s.toolBtnOn]}
          onPress={() => ch('fontWeight', st.fontWeight === '700' ? '400' : '700')}>
          <Text style={[s.toolBtnTxt, { fontWeight: '700' as any }, (st.fontWeight === '700' || st.fontWeight === '800') && { color: C.pink }]}>B</Text>
        </Pressable>
        <Pressable style={[s.toolBtn, st.fontStyle === 'italic' && s.toolBtnOn]}
          onPress={() => ch('fontStyle', st.fontStyle === 'italic' ? 'normal' : 'italic')}>
          <Text style={[s.toolBtnTxt, { fontStyle: 'italic' as any }, st.fontStyle === 'italic' && { color: C.pink }]}>I</Text>
        </Pressable>
        <Pressable style={[s.toolBtn, st.textDecorationLine === 'underline' && s.toolBtnOn]}
          onPress={() => ch('textDecorationLine', st.textDecorationLine === 'underline' ? 'none' : 'underline')}>
          <Text style={[s.toolBtnTxt, { textDecorationLine: 'underline' as any }, st.textDecorationLine === 'underline' && { color: C.pink }]}>U</Text>
        </Pressable>
        <View style={s.toolSep} />
        {(['left','center','right','justify'] as const).map(a => (
          <Pressable key={a} style={[s.toolBtn, (st.textAlign || 'left') === a && s.toolBtnOn]} onPress={() => ch('textAlign', a)}>
            <Feather name={`align-${a}` as any} size={11} color={(st.textAlign || 'left') === a ? C.pink : C.muted} />
          </Pressable>
        ))}
        <View style={s.toolSep} />
        {/* Transform */}
        {(['none','uppercase','lowercase'] as const).map(t => {
          const lbl = t === 'none' ? 'Aa' : t === 'uppercase' ? 'AA' : 'aa';
          return (
            <Pressable key={t} style={[s.toolBtn, (st.textTransform || 'none') === t && s.toolBtnOn]} onPress={() => ch('textTransform', t)}>
              <Text style={[s.toolBtnTxt, (st.textTransform || 'none') === t && { color: C.pink }]}>{lbl}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Weight slider — drag-style visual */}
      <View style={s.weightSlider}>
        <Text style={s.weightSliderLbl}>Weight</Text>
        <View style={s.weightTrack}>
          {weights.map((w, i) => {
            const on = (st.fontWeight || '400') === w;
            return (
              <Pressable key={w} style={[s.weightStop, on && { backgroundColor: C.pink }]} onPress={() => ch('fontWeight', w)}>
                <Text style={[s.weightStopTxt, on && { color: '#fff' }]}>{w}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Size / LineH / Spacing — compact stepper row */}
      <View style={s.typoMetrics}>
        {[
          { lbl: 'Size', k: 'fontSize', step: 1 },
          { lbl: 'Line', k: 'lineHeight', step: 1 },
          { lbl: 'Kern', k: 'letterSpacing', step: 0.5 },
        ].map(({ lbl, k, step }) => {
          const v = Number(st[k]) || 0;
          return (
            <View key={k} style={s.typoMetric}>
              <Text style={s.typoMetricLbl}>{lbl}</Text>
              <View style={s.typoMetricRow}>
                <Pressable onPress={() => ch(k, +(v - step).toFixed(1))} style={s.metricBtn}>
                  <Feather name="minus" size={8} color={C.muted} />
                </Pressable>
                <Num value={st[k]} onChange={vv => ch(k, vv)} style={s.typoMetricInput} />
                <Pressable onPress={() => ch(k, +(v + step).toFixed(1))} style={s.metricBtn}>
                  <Feather name="plus" size={8} color={C.muted} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {/* Color */}
      <View style={s.typoColorRow}>
        <Text style={s.typoMetricLbl}>Color</Text>
        <ColorSwatch value={st.color} onChange={v => ch('color', v)} />
      </View>
    </View>
  );
};

// ─── Main DesignPanel ─────────────────────────────────────────────────────────
const DesignPanel: React.FC = () => {
  const { selId, node, updateStyles } = useStudio();
  const { width } = usePanelWidth(280, DESIGN_RESPONSIVE.MIN_WIDTH, DESIGN_RESPONSIVE.MAX_WIDTH);
  const sel = selId ? node(selId) : null;
  const ch = useCallback((key: string, value: any) => {
    if (selId) updateStyles(selId, { [key]: value });
  }, [selId, updateStyles]);

  const ss = useRef<Record<string, boolean>>({
    Layout: true, Item: false, Dimensions: true, Spacing: true,
    Position: false, Appearance: true, Border: false, Typography: false, Effects: false,
    Transform: false, Interaction: false,
  });
  const [, fu] = useState(0);
  const tog = useCallback((n: string) => { ss.current[n] = !ss.current[n]; fu(x => x + 1); }, []);

  if (!sel) return (
    <View style={s.empty}>
      <Feather name="target" size={22} color={C.muted} />
      <Text style={s.emptyTxt}>{DESIGN_TEXTS.emptyState}</Text>
    </View>
  );

  const st = sel.styles || {};
  const isAbs = st.position === 'absolute';
  const dir = (st.flexDirection as string) || 'column';
  const justify = (st.justifyContent as string) || 'flex-start';
  const align = (st.alignItems as string) || 'flex-start';

  return (
    <ScrollView style={s.root} contentContainerStyle={s.rootContent} showsVerticalScrollIndicator={false}>

      {/* ── LAYOUT ─────────────────────────────────────────────────────── */}
      <Section title="Layout" icon="columns" color={C.blue} open={ss.current.Layout} onToggle={() => tog('Layout')}
        badge={`${dir.replace('-reverse',' rev')} · ${justify.replace('flex-','').replace('space-','sp-')}`}>
        <View style={s.layoutWidget}>
          {/* Direction picker */}
          <View style={s.layoutLeft}>
            <Text style={s.microLabel}>DIRECTION</Text>
            <DirectionPicker value={dir} onChange={v => ch('flexDirection', v)} />
            <Text style={[s.microLabel, { marginTop: 8 }]}>WRAP</Text>
            <Pressable style={[s.wrapToggle, (st.flexWrap === 'wrap') && { borderColor: C.cyan, backgroundColor: C.cyan + '20' }]}
              onPress={() => ch('flexWrap', st.flexWrap === 'wrap' ? 'nowrap' : 'wrap')}>
              <Feather name="corner-down-right" size={11} color={st.flexWrap === 'wrap' ? C.cyan : C.muted} />
              <Text style={[s.wrapToggleTxt, st.flexWrap === 'wrap' && { color: C.cyan }]}>
                {st.flexWrap === 'wrap' ? 'Wrap' : 'No wrap'}
              </Text>
            </Pressable>
          </View>
          {/* Alignment grid */}
          <View style={s.layoutRight}>
            <Text style={s.microLabel}>PLACEMENT</Text>
            <AlignmentGrid justify={justify} align={align} direction={dir}
              onJustify={v => ch('justifyContent', v)} onAlign={v => ch('alignItems', v)} />
          </View>
        </View>
        {/* Gap — compact inline */}
        <View style={s.gapRow}>
          <Text style={s.microLabel}>GAP</Text>
          <View style={s.gapFields}>
            {[['All', 'gap'], ['Row', 'rowGap'], ['Col', 'columnGap']].map(([lbl, k]) => (
              <View key={k} style={s.gapField}>
                <Text style={s.gapLbl}>{lbl}</Text>
                <Num value={st[k]} onChange={v => ch(k, v)} style={s.gapInput} />
              </View>
            ))}
          </View>
        </View>
        {/* Visibility toggle */}
        <Pressable style={[s.visToggle, st.display === 'none' && { borderColor: C.muted, opacity: 0.5 }]}
          onPress={() => ch('display', st.display === 'none' ? 'flex' : 'none')}>
          <Feather name={st.display === 'none' ? 'eye-off' : 'eye'} size={11} color={st.display === 'none' ? C.muted : C.blue} />
          <Text style={[s.visToggleTxt, st.display === 'none' && { color: C.muted }]}>
            {st.display === 'none' ? 'Hidden' : 'Visible'}
          </Text>
        </Pressable>
      </Section>

      {/* ── DIMENSIONS ──────────────────────────────────────────────────── */}
      <Section title="Dimensions" icon="maximize" color={C.purple} open={ss.current.Dimensions} onToggle={() => tog('Dimensions')}>
        <DimWidget st={st} ch={ch} />
        {/* Overflow — 3 big visual tiles */}
        <Text style={[s.microLabel, { marginTop: 8 }]}>OVERFLOW</Text>
        <View style={s.overflowTiles}>
          {(['visible','hidden','scroll'] as const).map(v => {
            const on = (st.overflow || 'visible') === v;
            return (
              <Pressable key={v} style={[s.overflowTile, on && { borderColor: C.purple, backgroundColor: C.purple + '20' }]}
                onPress={() => ch('overflow', v)}>
                <Feather name={v === 'visible' ? 'eye' : v === 'hidden' ? 'eye-off' : 'list'} size={16}
                  color={on ? C.purple : C.muted} />
                <Text style={[s.overflowTileTxt, on && { color: C.purple }]}>{v}</Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      {/* ── SPACING ─────────────────────────────────────────────────────── */}
      <Section title="Spacing" icon="move" color={C.orange} open={ss.current.Spacing} onToggle={() => tog('Spacing')}>
        <SpacingWidget st={st} ch={ch} />
      </Section>

      {/* ── ITEM ───────────────────────────────────────────────────────── */}
      <Section title="Item" icon="maximize-2" color={C.green} open={ss.current.Item} onToggle={() => tog('Item')}>
        {/* Align self — mini 1×5 grid */}
        <Text style={s.microLabel}>ALIGN SELF</Text>
        <View style={s.alignSelfRow}>
          {(['auto','flex-start','center','flex-end','stretch'] as const).map(v => {
            const on = (st.alignSelf || 'auto') === v;
            const icon: Record<string, React.ComponentProps<typeof Feather>['name']> = {
              auto: 'refresh-cw', 'flex-start': 'align-start-vertical' as any,
              center: 'align-center-vertical' as any, 'flex-end': 'align-end-vertical' as any, stretch: 'maximize-2',
            };
            const lbl = v === 'flex-start' ? 'Start' : v === 'flex-end' ? 'End' : v.charAt(0).toUpperCase() + v.slice(1);
            return (
              <Pressable key={v} style={[s.alignSelfBtn, on && { backgroundColor: C.green + '25', borderColor: C.green }]}
                onPress={() => ch('alignSelf', v)}>
                <Feather name={icon[v] || 'circle'} size={13} color={on ? C.green : C.muted} />
                <Text style={[s.alignSelfSub, on && { color: C.green }]}>{lbl}</Text>
              </Pressable>
            );
          })}
        </View>
        {/* Flex grow/shrink as visual bars */}
        <Text style={[s.microLabel, { marginTop: 8 }]}>FLEX</Text>
        {[['Grow', 'flexGrow', C.green], ['Shrink', 'flexShrink', C.orange]].map(([lbl, k, col]) => {
          const v = Math.min(Number(st[k as string]) || 0, 1);
          return (
            <View key={k as string} style={s.flexBarRow}>
              <Text style={s.flexBarLbl}>{lbl as string}</Text>
              <View style={s.flexBarTrack}>
                <View style={[s.flexBarFill, { width: `${v * 100}%` as any, backgroundColor: col as string }]} />
                {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                  <Pressable key={tick} style={[s.flexBarTick, { left: `${tick * 100}%` as any }]}
                    onPress={() => ch(k as string, tick)} />
                ))}
              </View>
              <Num value={st[k as string]} onChange={vv => ch(k as string, vv)} style={s.flexBarNum} color={col as string} />
            </View>
          );
        })}
        <View style={s.gapFields}>
          <View style={s.gapField}><Text style={s.gapLbl}>Basis</Text><Num value={st.flexBasis} onChange={v => ch('flexBasis', v)} style={s.gapInput} /></View>
          <View style={s.gapField}><Text style={s.gapLbl}>Flex</Text><Num value={st.flex} onChange={v => ch('flex', v)} style={s.gapInput} /></View>
        </View>
      </Section>

      {/* ── POSITION ────────────────────────────────────────────────────── */}
      <Section title="Position" icon="crosshair" color={C.orange} open={ss.current.Position} onToggle={() => tog('Position')}>
        <View style={s.posTiles}>
          {(['relative','absolute'] as const).map(v => {
            const on = (st.position || 'relative') === v;
            return (
              <Pressable key={v} style={[s.posTile, on && { borderColor: C.orange, backgroundColor: C.orange + '20' }]}
                onPress={() => ch('position', v)}>
                <Feather name={v === 'relative' ? 'align-center' : 'move'} size={16} color={on ? C.orange : C.muted} />
                <Text style={[s.posTileTxt, on && { color: C.orange }]}>{v}</Text>
              </Pressable>
            );
          })}
        </View>
        {isAbs && (
          <View style={s.insetGrid}>
            {[['T', 'top'], ['R', 'right'], ['B', 'bottom'], ['L', 'left']].map(([lbl, k]) => (
              <View key={k} style={s.insetField}>
                <Text style={s.insetLbl}>{lbl}</Text>
                <Num value={st[k]} onChange={v => ch(k, v)} style={s.insetInput} />
              </View>
            ))}
          </View>
        )}
        <View style={s.gapFields}>
          <View style={s.gapField}><Text style={s.gapLbl}>Z</Text><Num value={st.zIndex} onChange={v => ch('zIndex', v)} style={s.gapInput} /></View>
        </View>
      </Section>

      {/* ── APPEARANCE ──────────────────────────────────────────────────── */}
      <Section title="Appearance" icon="droplet" color={C.pink} open={ss.current.Appearance} onToggle={() => tog('Appearance')}>
        {/* Big color swatch */}
        <ColorSwatch value={st.backgroundColor as string | undefined} onChange={v => ch('backgroundColor', v)} size="lg" />
        {/* Opacity bar */}
        <Text style={[s.microLabel, { marginTop: 8 }]}>OPACITY</Text>
        <OpacityBar value={st.opacity} onChange={v => ch('opacity', v)} color={st.backgroundColor as string || C.blue} />
        <View style={s.gapFields}>
          <View style={s.gapField}><Text style={s.gapLbl}>Ratio</Text><Num value={st.aspectRatio} onChange={v => ch('aspectRatio', Number(v) || undefined)} style={s.gapInput} /></View>
        </View>
      </Section>

      {/* ── BORDER ──────────────────────────────────────────────────────── */}
      <Section title="Border" icon="square" color={C.cyan} open={ss.current.Border} onToggle={() => tog('Border')}>
        {/* Width + Color inline */}
        <View style={s.borderTopRow}>
          <View style={s.borderWidthField}>
            <Text style={s.microLabel}>WIDTH</Text>
            <Num value={st.borderWidth} onChange={v => ch('borderWidth', Number(v) || 0)} style={s.borderWidthInput} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.microLabel}>COLOR</Text>
            <ColorSwatch value={st.borderColor} onChange={v => ch('borderColor', v)} />
          </View>
        </View>
        {/* Style — visual dashes */}
        <View style={s.borderStyleRow}>
          {([
            ['solid',  'minus'  as const, 'Solid'],
            ['dashed', 'more-horizontal' as const, 'Dashed'],
            ['dotted', 'more-vertical'   as const, 'Dotted'],
          ] as const).map(([v, icon, lbl]) => {
            const on = (st.borderStyle || 'solid') === v;
            return (
              <Pressable key={v} style={[s.borderStyleBtn, on && { borderColor: C.cyan, backgroundColor: C.cyan + '20' }]}
                onPress={() => ch('borderStyle', v)}>
                <Feather name={icon} size={14} color={on ? C.cyan : C.muted} />
                <Text style={[s.borderStyleTxt, on && { color: C.cyan }]}>{lbl}</Text>
              </Pressable>
            );
          })}
        </View>
        {/* Radius widget */}
        <Text style={[s.microLabel, { marginTop: 8 }]}>RADIUS</Text>
        <RadiusWidget st={st} ch={ch} />
      </Section>

      {/* ── TYPOGRAPHY ──────────────────────────────────────────────────── */}
      <Section title="Typography" icon="type" color={C.pink} open={ss.current.Typography} onToggle={() => tog('Typography')}>
        <TypoWidget st={st} ch={ch} />
      </Section>

      {/* ── EFFECTS ─────────────────────────────────────────────────────── */}
      <Section title="Effects" icon="zap" color={C.orange} open={ss.current.Effects} onToggle={() => tog('Effects')}>
        <View style={s.borderTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.microLabel}>SHADOW COLOR</Text>
            <ColorSwatch value={st.shadowColor} onChange={v => ch('shadowColor', v)} />
          </View>
        </View>
        <View style={s.gapFields}>
          {[['Opacity','shadowOpacity'],['Blur','shadowRadius'],['X','shadowOffsetX'],['Y','shadowOffsetY'],['Elev.','elevation']].map(([lbl, k]) => {
            const val = k === 'shadowOffsetX' ? (st.shadowOffset as any)?.width : k === 'shadowOffsetY' ? (st.shadowOffset as any)?.height : st[k];
            const handleChange = (v: any) => {
              if (k === 'shadowOffsetX') ch('shadowOffset', { width: v, height: (st.shadowOffset as any)?.height || 0 });
              else if (k === 'shadowOffsetY') ch('shadowOffset', { width: (st.shadowOffset as any)?.width || 0, height: v });
              else ch(k, v);
            };
            return (
              <View key={k} style={s.gapField}>
                <Text style={s.gapLbl}>{lbl}</Text>
                <Num value={val} onChange={handleChange} style={s.gapInput} />
              </View>
            );
          })}
        </View>
      </Section>

      {/* ── TRANSFORM ───────────────────────────────────────────────────── */}
      <Section title="Transform" icon="refresh-cw" color={C.purple} open={ss.current.Transform} onToggle={() => tog('Transform')}>
        {/* Rotate dial */}
        <Text style={s.microLabel}>ROTATE</Text>
        <View style={s.rotateRow}>
          {[-90, -45, -15, 0, 15, 45, 90].map(deg => {
            const cur = Number((st.transform as any)?.[0]?.rotate?.replace('deg','')) || 0;
            const on = cur === deg;
            return (
              <Pressable key={deg} style={[s.rotateTick, on && { backgroundColor: C.purple, borderColor: C.purple }]}
                onPress={() => ch('transform', deg === 0 ? undefined : [{ rotate: `${deg}deg` }])}>
                <Text style={[s.rotateTickTxt, on && { color: '#fff' }]}>{deg}°</Text>
              </Pressable>
            );
          })}
        </View>
        {/* Scale / Translate / Skew */}
        <Text style={[s.microLabel, { marginTop: 8 }]}>SCALE & TRANSLATE</Text>
        <View style={s.gapFields}>
          {[
            ['Scale X', 'scaleX'], ['Scale Y', 'scaleY'],
            ['Trans X', 'translateX'], ['Trans Y', 'translateY'],
            ['Skew X', 'skewX'], ['Skew Y', 'skewY'],
          ].map(([lbl, k]) => {
            const transforms = (st.transform as any[]) || [];
            const found = transforms.find((t: any) => k in t);
            const val = found ? found[k] : undefined;
            return (
              <View key={k} style={s.gapField}>
                <Text style={s.gapLbl}>{lbl}</Text>
                <Num value={val} onChange={v => {
                  const others = transforms.filter((t: any) => !(k in t));
                  ch('transform', v !== undefined ? [...others, { [k]: k.startsWith('skew') ? `${v}deg` : Number(v) }] : others.length ? others : undefined);
                }} style={s.gapInput} />
              </View>
            );
          })}
        </View>
        {/* Transform origin */}
        <Text style={[s.microLabel, { marginTop: 8 }]}>ORIGIN</Text>
        <View style={s.originGrid}>
          {[
            ['top left','top center','top right'],
            ['center left','center','center right'],
            ['bottom left','bottom center','bottom right'],
          ].map((row, ri) => (
            <View key={ri} style={s.originRow}>
              {row.map(v => {
                const on = (st.transformOrigin as string || 'center') === v;
                return (
                  <Pressable key={v} style={[s.originDot, on && { backgroundColor: C.purple }]}
                    onPress={() => ch('transformOrigin', v)} />
                );
              })}
            </View>
          ))}
        </View>
      </Section>

      {/* ── INTERACTION ─────────────────────────────────────────────────── */}
      <Section title="Interaction" icon="mouse-pointer" color={C.cyan} open={ss.current.Interaction} onToggle={() => tog('Interaction')}>
        {/* Pointer events */}
        <Text style={s.microLabel}>POINTER EVENTS</Text>
        <View style={s.gapFields}>
          {(['auto','none','box-none','box-only'] as const).map(v => {
            const on = (st.pointerEvents as string || 'auto') === v;
            return (
              <Pressable key={v} style={[s.gapField, on && { borderColor: C.cyan, backgroundColor: C.cyan + '20' }]}
                onPress={() => ch('pointerEvents', v)}>
                <Feather name={v === 'none' ? 'slash' : v === 'auto' ? 'mouse-pointer' : v === 'box-none' ? 'square' : 'box'} size={12} color={on ? C.cyan : C.muted} />
                <Text style={[s.gapLbl, on && { color: C.cyan }]}>{v}</Text>
              </Pressable>
            );
          })}
        </View>
        {/* Cursor (web) */}
        <Text style={[s.microLabel, { marginTop: 8 }]}>CURSOR</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.gapFields}>
          {(['auto','default','pointer','grab','grabbing','not-allowed','crosshair','text','move','zoom-in','zoom-out'] as const).map(v => {
            const on = (st.cursor as string) === v;
            return (
              <Pressable key={v} style={[s.cursorChip, on && { borderColor: C.cyan, backgroundColor: C.cyan + '20' }]}
                onPress={() => ch('cursor', v)}>
                <Text style={[s.cursorChipTxt, on && { color: C.cyan }]}>{v}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {/* User select */}
        <Text style={[s.microLabel, { marginTop: 8 }]}>USER SELECT</Text>
        <View style={s.gapFields}>
          {(['auto','none','text','all'] as const).map(v => {
            const on = (st.userSelect as string || 'auto') === v;
            return (
              <Pressable key={v} style={[s.gapField, on && { borderColor: C.cyan, backgroundColor: C.cyan + '20' }]}
                onPress={() => ch('userSelect', v)}>
                <Text style={[s.gapLbl, on && { color: C.cyan }]}>{v}</Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

    </ScrollView>
  );
};

export default DesignPanel;

const s = StyleSheet.create({
  root: { flex: 1 },
  rootContent: { paddingBottom: 40 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 24 },
  emptyTxt: { color: C.muted, fontSize: 11, textAlign: 'center' },

  // Section
  section: { borderBottomWidth: 1, borderBottomColor: C.border },
  sHead: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: C.bg },
  sIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  sTitle: { flex: 1, color: C.text, fontSize: 11, fontWeight: '700', letterSpacing: -0.1 },
  sBadge: { fontSize: 8, fontWeight: '600', opacity: 0.7 },
  sBody: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 16, gap: 8, backgroundColor: C.surface },

  microLabel: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' as any, marginBottom: 4 },

  // Layout widget
  layoutWidget: { flexDirection: 'row', gap: 10 },
  layoutLeft: { width: 90, gap: 4 },
  layoutRight: { flex: 1, gap: 2 },

  // Direction picker
  dirGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, width: 90 },
  dirBtn: { width: 40, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },

  // Wrap toggle
  wrapToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  wrapToggleTxt: { color: C.muted, fontSize: 9, fontWeight: '500' },

  // Alignment grid
  alignGrid: { width: '100%', aspectRatio: 1, maxWidth: 120, alignSelf: 'center', position: 'relative' },
  alignGridRow: { flex: 1, flexDirection: 'row' },
  alignCell: { flex: 1, margin: 2, borderRadius: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  alignDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.muted },
  alignDirOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' as any },
  alignWrap: { gap: 4 },
  alignExtraRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  alignExtraBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  alignExtraTxt: { color: C.muted, fontSize: 9, fontWeight: '500' },

  // Gap
  gapRow: { gap: 4 },
  gapFields: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  gapField: { flex: 1, minWidth: 44, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, paddingHorizontal: 6, paddingVertical: 4, alignItems: 'center', overflow: 'hidden' },
  gapLbl: { color: C.muted, fontSize: 8, fontWeight: '600', marginBottom: 2 },
  gapInput: { color: C.text, fontSize: 11, fontWeight: '500', textAlign: 'center', minWidth: 28 },

  // Visibility
  visToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignSelf: 'flex-start' },
  visToggleTxt: { color: C.blue, fontSize: 10, fontWeight: '500' },

  // Dim widget
  dimWidget: { gap: 8 },
  dimPreview: { height: 90, backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  dimBox: { borderWidth: 1.5, borderColor: C.blue, borderRadius: 4, backgroundColor: C.blue + '15', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4, paddingHorizontal: 10, paddingVertical: 6 },
  dimBoxTxt: { color: C.blue, fontSize: 10, fontWeight: '600' },
  dimBoxSep: { color: C.muted, fontSize: 10 },
  dimRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dimField: { flex: 1, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, paddingHorizontal: 8, paddingVertical: 5, alignItems: 'center', overflow: 'hidden' },
  dimLbl: { color: C.muted, fontSize: 8, fontWeight: '700', marginBottom: 2 },
  dimInput: { color: C.text, fontSize: 12, fontWeight: '600', textAlign: 'center', minWidth: 36 },
  dimLock: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  dimMinMax: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dimMini: { flex: 1, minWidth: 60, backgroundColor: C.s2, borderRadius: 5, borderWidth: 1, borderColor: C.border, paddingHorizontal: 6, paddingVertical: 3, alignItems: 'center', overflow: 'hidden' },
  dimMiniLbl: { color: C.muted, fontSize: 7, fontWeight: '600', marginBottom: 1 },
  dimMiniInput: { color: C.muted, fontSize: 10, textAlign: 'center', minWidth: 28 },

  // Overflow tiles
  overflowTiles: { flexDirection: 'row', gap: 4 },
  overflowTile: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 10, borderRadius: 8, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  overflowTileTxt: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },

  // Spacing widget
  spWidget: { gap: 0 },
  spRing: { borderRadius: 8, borderWidth: 1, padding: 6, gap: 2 },
  spRingInner: { flex: 1, borderRadius: 6, padding: 5, gap: 2 },
  spRingLbl: { fontSize: 7, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' as any, textAlign: 'center' },
  spTop: { alignItems: 'center' },
  spBot: { alignItems: 'center' },
  spSides: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  spCore: { flex: 1, height: 36, backgroundColor: C.s2, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  spCoreTxt: { color: C.muted, fontSize: 8 },

  // Align self
  alignSelfRow: { flexDirection: 'row', gap: 3 },
  alignSelfBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, gap: 2 },
  alignSelfTxt: { color: C.muted, fontSize: 14 },
  alignSelfSub: { color: C.muted, fontSize: 7, fontWeight: '600' },

  // Flex bars
  flexBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flexBarLbl: { width: 40, color: C.muted, fontSize: 9, fontWeight: '600' },
  flexBarTrack: { flex: 1, height: 6, backgroundColor: C.s2, borderRadius: 3, overflow: 'hidden', position: 'relative' },
  flexBarFill: { height: 6, borderRadius: 3 },
  flexBarTick: { position: 'absolute', top: -4, width: 14, height: 14, borderRadius: 7, backgroundColor: 'transparent' },
  flexBarNum: { width: 28, textAlign: 'center', fontSize: 10, fontWeight: '600' },

  // Position
  posTiles: { flexDirection: 'row', gap: 4 },
  posTile: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 10, borderRadius: 8, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  posTileTxt: { color: C.muted, fontSize: 9, fontWeight: '600' },
  insetGrid: { flexDirection: 'row', gap: 4 },
  insetField: { flex: 1, backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, paddingHorizontal: 6, paddingVertical: 4, alignItems: 'center', overflow: 'hidden' },
  insetLbl: { color: C.muted, fontSize: 8, fontWeight: '700', marginBottom: 2 },
  insetInput: { color: C.text, fontSize: 11, fontWeight: '500', textAlign: 'center', minWidth: 24 },

  // Color swatch
  swatchWrap: { gap: 4 },
  swatch: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  swatchLg: { width: '100%', height: 80, borderRadius: 10 },
  swatchEditHint: { position: 'absolute', bottom: 6, right: 6 },
  swatchLabel: { color: C.muted, fontSize: 8, fontWeight: '600' },
  swatchEditor: { marginTop: 4 },

  // Opacity bar
  opacityWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  opacityBar: { flex: 1, height: 20, borderRadius: 6, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: C.border },
  opacityChecker: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.s2 },
  opacityFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  opacitySeg: { position: 'absolute', top: 0, bottom: 0, width: '9.09%' as any },
  opacitySegActive: { borderWidth: 1.5, borderColor: '#fff', borderRadius: 3 },

  // Radius widget
  radiusWidget: { gap: 8 },
  radiusPreview: { height: 80, backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  radiusBox: { width: 60, height: 50, borderWidth: 2, borderColor: C.cyan, backgroundColor: C.cyan + '15' },
  cornerBtn: { position: 'absolute', width: 24, height: 24, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  cornerTL: { top: 6, left: 6 },
  cornerTR: { top: 6, right: 6 },
  cornerBL: { bottom: 6, left: 6 },
  cornerBR: { bottom: 6, right: 6 },
  cornerVal: { color: C.muted, fontSize: 9, fontWeight: '700' },
  radiusAllRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radiusAllLbl: { color: C.muted, fontSize: 9, fontWeight: '600', width: 28 },
  radiusAllInput: { flex: 1, backgroundColor: C.s2, borderRadius: 5, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 11, fontWeight: '500', textAlign: 'center', paddingVertical: 4 },
  radiusCornerEdit: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },

  // Typography widget
  typoWidget: { gap: 8 },
  typoPreview: { height: 80, backgroundColor: C.s2, borderRadius: 8, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  typoHint: { position: 'absolute', bottom: 5, right: 8, color: C.muted, fontSize: 8 },
  typoToolbar: { flexDirection: 'row', gap: 3, alignItems: 'center', flexWrap: 'wrap' },
  toolBtn: { width: 28, height: 28, borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  toolBtnOn: { backgroundColor: C.pink + '20', borderColor: C.pink },
  toolBtnTxt: { color: C.muted, fontSize: 11 },
  toolSep: { width: 1, height: 18, backgroundColor: C.border, marginHorizontal: 2 },
  weightSlider: { gap: 4 },
  weightSliderLbl: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' as any },
  weightTrack: { flexDirection: 'row', gap: 2 },
  weightStop: { flex: 1, paddingVertical: 5, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  weightStopTxt: { color: C.muted, fontSize: 8, fontWeight: '600' },
  typoMetrics: { flexDirection: 'row', gap: 6 },
  typoMetric: { flex: 1, gap: 3 },
  typoMetricLbl: { color: C.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' as any },
  typoMetricRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  typoMetricInput: { flex: 1, color: C.text, fontSize: 10, fontWeight: '500', textAlign: 'center', paddingVertical: 4 },
  metricBtn: { width: 22, height: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  typoColorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  // Border
  borderTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  borderWidthField: { width: 60, alignItems: 'center', gap: 2 },
  borderWidthInput: { color: C.text, fontSize: 14, fontWeight: '600', textAlign: 'center', backgroundColor: C.s2, borderRadius: 6, borderWidth: 1, borderColor: C.border, paddingVertical: 6, width: 60 },
  borderStyleRow: { flexDirection: 'row', gap: 4 },
  borderStyleBtn: { flex: 1, paddingVertical: 8, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  borderStyleTxt: { color: C.muted, fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  // Transform
  rotateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  rotateTick: { paddingHorizontal: 7, paddingVertical: 5, borderRadius: 6, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  rotateTickTxt: { color: C.muted, fontSize: 9, fontWeight: '600' },
  originGrid: { gap: 3, alignSelf: 'flex-start' },
  originRow: { flexDirection: 'row', gap: 3 },
  originDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  // Interaction
  cursorChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  cursorChipTxt: { color: C.muted, fontSize: 9, fontWeight: '500' },
});
