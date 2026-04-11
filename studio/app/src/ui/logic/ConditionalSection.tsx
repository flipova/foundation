/**
 * ConditionalSection — Show/hide visibility logic.
 *
 * Logic clarification:
 *   mode = 'show' → element is VISIBLE when condition is TRUE
 *   mode = 'hide' → element is HIDDEN when condition is TRUE
 *
 * In JSX:
 *   show: {condition && <Element />}   ← renders when condition is truthy
 *   hide: {!condition && <Element />}  ← renders when condition is falsy
 */
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TreeNode } from '../../store/StudioProvider';
import SmartInput from '../shared/SmartInput';
import { C } from './constants';
import type { ItemField } from './useLogicContext';

// ---------------------------------------------------------------------------
// Operators with clear human labels
// ---------------------------------------------------------------------------
const OPERATORS: { op: string; label: string; hint: string }[] = [
  { op: '',              label: 'has a value',   hint: 'True when the variable is not empty/null/false/0' },
  { op: '=== true',     label: 'is true',        hint: 'True when the variable equals exactly true' },
  { op: '=== false',    label: 'is false',       hint: 'True when the variable equals exactly false' },
  { op: '!== null',     label: 'is not null',    hint: 'True when the variable has been set' },
  { op: '=== null',     label: 'is null',        hint: 'True when the variable is null or undefined' },
  { op: '> 0',          label: 'is positive',    hint: 'True when the number is greater than 0' },
  { op: '=== 0',        label: 'is zero',        hint: 'True when the number equals 0' },
  { op: '=== ""',       label: 'is empty text',  hint: 'True when the text is empty' },
  { op: '!== ""',       label: 'has text',       hint: 'True when the text is not empty' },
  { op: '.length > 0',  label: 'list has items', hint: 'True when the array contains at least one item' },
  { op: '.length === 0',label: 'list is empty',  hint: 'True when the array has no items' },
];

// Evaluate a condition expression against a test value
function evaluateCondition(left: string, op: string, testValue: string): boolean | null {
  try {
    let val: any = testValue;
    // Try to parse as JSON
    try { val = JSON.parse(testValue); } catch { val = testValue; }

    const expr = op.startsWith('.') ? `val${op}` : op ? `val ${op}` : `!!val`;
    // eslint-disable-next-line no-new-func
    return new Function('val', `return ${expr}`)(val);
  } catch {
    return null;
  }
}

interface Props {
  value: TreeNode['conditionalRender'];
  onChange: (v: TreeNode['conditionalRender']) => void;
  itemFields?: ItemField[];
}

const ConditionalSection: React.FC<Props> = ({ value, onChange, itemFields }) => {
  const [advanced, setAdvanced] = useState(false);
  const [testValue, setTestValue] = useState('');
  const [showTester, setShowTester] = useState(false);

  const expr = value?.expression || '';
  const mode = value?.mode || 'show';

  // Parse the expression into left + operator
  const parseExpr = (e: string): { left: string; op: string } => {
    for (const { op } of OPERATORS) {
      if (!op) continue;
      if (op.startsWith('.') && e.endsWith(op)) return { left: e.slice(0, -op.length), op };
      if (e.endsWith(' ' + op)) return { left: e.slice(0, -(op.length + 1)), op };
    }
    // No operator matched — strip any trailing .length/.length chains that may have
    // accumulated from previous operator selections, then return bare left with no op
    const stripped = e.replace(/(\.(length))+$/, '');
    return { left: stripped, op: '' };
  };

  const { left, op } = parseExpr(expr);

  const buildExpr = (l: string, o: string) =>
    o ? (o.startsWith('.') ? l + o : l + ' ' + o) : l;

  // mode: 'show' = visible when condition is TRUE
  // mode: 'hide' = hidden when condition is TRUE (= visible when FALSE)
  const setMode = (m: 'show' | 'hide') =>
    onChange(expr ? { expression: expr, mode: m } : undefined);

  const setLeft = (l: string) => {
    // Strip any operator suffix that may have been typed directly into the variable field
    // e.g. "$state.users.length" → "$state.users" (the operator ".length > 0" is selected separately)
    let clean = l;
    for (const { op } of OPERATORS) {
      if (!op) continue;
      if (op.startsWith('.') && clean.endsWith(op)) { clean = clean.slice(0, -op.length); break; }
      if (clean.endsWith(' ' + op)) { clean = clean.slice(0, -(op.length + 1)); break; }
    }
    onChange(clean ? { expression: buildExpr(clean, op), mode } : undefined);
  };

  const setOp = (o: string) =>
    onChange(left ? { expression: buildExpr(left, o), mode } : undefined);

  const clear = () => onChange(undefined);

  // Test result
  const testResult = testValue !== '' && left
    ? evaluateCondition(left, op, testValue)
    : null;

  // What actually happens with the element
  const elementVisible = testResult === null ? null
    : mode === 'show' ? testResult
    : !testResult;

  // Human-readable summary
  const summary = left
    ? mode === 'show'
      ? `Visible when "${left}" ${op || 'has a value'}`
      : `Hidden when "${left}" ${op || 'has a value'}`
    : null;

  return (
    <View style={s.root}>
      {/* Explanation */}
      <View style={s.explainer}>
        <Feather name="info" size={10} color={C.cyan} />
        <Text style={s.explainerText}>
          Control when this element appears. Pick a variable and a condition — the element shows or hides automatically.
        </Text>
      </View>

      {/* Mode selector — SHOW or HIDE */}
      <View style={s.modeSection}>
        <Text style={s.modeLabel}>This element should be…</Text>
        <View style={s.modeRow}>
          <Pressable
            style={[s.modeBtn, mode === 'show' && s.modeBtnShow]}
            onPress={() => setMode('show')}
          >
            <Feather name="eye" size={13} color={mode === 'show' ? '#fff' : C.muted} />
            <View>
              <Text style={[s.modeBtnTitle, mode === 'show' && { color: '#fff' }]}>Visible</Text>
              <Text style={[s.modeBtnSub, mode === 'show' && { color: 'rgba(255,255,255,0.7)' }]}>when condition is met</Text>
            </View>
          </Pressable>
          <Pressable
            style={[s.modeBtn, mode === 'hide' && s.modeBtnHide]}
            onPress={() => setMode('hide')}
          >
            <Feather name="eye-off" size={13} color={mode === 'hide' ? '#fff' : C.muted} />
            <View>
              <Text style={[s.modeBtnTitle, mode === 'hide' && { color: '#fff' }]}>Hidden</Text>
              <Text style={[s.modeBtnSub, mode === 'hide' && { color: 'rgba(255,255,255,0.7)' }]}>when condition is met</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Advanced toggle */}
      <View style={s.advRow}>
        <Text style={s.advLabel}>Condition</Text>
        <Pressable style={[s.advBtn, advanced && s.advBtnOn]} onPress={() => setAdvanced(a => !a)}>
          <Feather name="code" size={9} color={advanced ? C.primary : C.muted} />
          <Text style={[s.advBtnText, advanced && { color: C.primary }]}>Advanced</Text>
        </Pressable>
      </View>

      {advanced ? (
        <SmartInput
          label="Custom expression"
          value={expr}
          onChange={v => onChange(v ? { expression: v, mode } : undefined)}
          propType="string"
          isExpression
          itemFields={itemFields}
          placeholder="$state.isLoggedIn && $state.users.length > 0"
        />
      ) : (
        <>
          <SmartInput
            label="Variable to check"
            value={left}
            onChange={setLeft}
            propType="string"
            isExpression
            itemFields={itemFields}
            placeholder="e.g. $state.isLoggedIn"
          />
          {left && (
            <View style={s.opSection}>
              <Text style={s.opSectionLabel}>When the variable…</Text>
              <View style={s.opGrid}>
                {OPERATORS.map(({ op: o, label, hint }) => (
                  <Pressable
                    key={o}
                    style={[s.opBtn, op === o && s.opBtnOn]}
                    onPress={() => setOp(o)}
                  >
                    <Text style={[s.opBtnText, op === o && s.opBtnTextOn]}>{label}</Text>
                  </Pressable>
                ))}
              </View>
              {/* Show hint for selected operator */}
              {OPERATORS.find(o => o.op === op) && (
                <Text style={s.opHint}>
                  {OPERATORS.find(o => o.op === op)?.hint}
                </Text>
              )}
            </View>
          )}
        </>
      )}

      {/* Summary + generated code */}
      {expr && (
        <View style={s.summaryBox}>
          <View style={s.summaryRow}>
            <Feather name={mode === 'show' ? 'eye' : 'eye-off'} size={11} color={mode === 'show' ? C.success : C.error} />
            <Text style={[s.summaryText, { color: mode === 'show' ? C.success : C.error }]}>
              {summary}
            </Text>
          </View>
          <Text style={s.summaryCode}>
            {mode === 'show'
              ? `{${expr} && <Element />}`
              : `{!(${expr}) && <Element />}`}
          </Text>
        </View>
      )}

      {/* Condition tester */}
      {expr && left && (
        <View style={s.testerSection}>
          <Pressable style={s.testerToggle} onPress={() => setShowTester(t => !t)}>
            <Feather name="play" size={10} color={C.cyan} />
            <Text style={s.testerToggleText}>Test this condition</Text>
            <Feather name={showTester ? 'chevron-up' : 'chevron-down'} size={10} color={C.muted} />
          </Pressable>
          {showTester && (
            <View style={s.tester}>
              <Text style={s.testerDesc}>
                Enter a test value for <Text style={s.testerVar}>{left}</Text> to see what happens:
              </Text>
              <TextInput
                style={s.testerInput}
                value={testValue}
                onChangeText={setTestValue}
                placeholder='e.g. true, "hello", 42, [], null'
                placeholderTextColor={C.muted}
                autoCapitalize="none"
              />
              {testResult !== null && (
                <View style={[s.testerResult, { backgroundColor: elementVisible ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', borderColor: elementVisible ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' }]}>
                  <Feather name={elementVisible ? 'eye' : 'eye-off'} size={14} color={elementVisible ? C.success : C.error} />
                  <View>
                    <Text style={[s.testerResultTitle, { color: elementVisible ? C.success : C.error }]}>
                      {elementVisible ? 'Element is VISIBLE' : 'Element is HIDDEN'}
                    </Text>
                    <Text style={s.testerResultSub}>
                      Condition evaluated to: <Text style={{ fontWeight: '700', color: testResult ? C.success : C.error }}>{String(testResult)}</Text>
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Remove */}
      {expr && (
        <Pressable style={s.clearBtn} onPress={clear}>
          <Feather name="x" size={10} color={C.muted} />
          <Text style={s.clearText}>Remove condition — always show this element</Text>
        </Pressable>
      )}

      {!expr && (
        <View style={s.emptyState}>
          <Text style={s.emptyStateText}>No condition set</Text>
          <Text style={s.emptyStateHint}>This element always shows. Pick a variable above to add a condition.</Text>
        </View>
      )}
    </View>
  );
};

export default ConditionalSection;

const s = StyleSheet.create({
  root: { gap: 10 },
  // Explainer
  explainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: 'rgba(34,211,238,0.06)', borderRadius: 6, padding: 8, borderWidth: 1, borderColor: 'rgba(34,211,238,0.15)' },
  explainerText: { color: C.cyan, fontSize: 9, flex: 1, lineHeight: 13 },
  // Mode selector
  modeSection: { gap: 5 },
  modeLabel: { color: C.muted, fontSize: 10, fontWeight: '600' },
  modeRow: { flexDirection: 'row', gap: 6 },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  modeBtnShow: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: C.success },
  modeBtnHide: { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: C.error },
  modeBtnTitle: { color: C.text, fontSize: 11, fontWeight: '700' },
  modeBtnSub: { color: C.muted, fontSize: 8, marginTop: 1 },
  // Advanced toggle
  advRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  advLabel: { color: C.text, fontSize: 10, fontWeight: '600' },
  advBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border },
  advBtnOn: { borderColor: C.primary },
  advBtnText: { color: C.muted, fontSize: 9 },
  // Operator grid
  opSection: { gap: 6 },
  opSectionLabel: { color: C.muted, fontSize: 9, fontWeight: '600', textTransform: 'uppercase' as any, letterSpacing: 0.5 },
  opGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  opBtn: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  opBtnOn: { backgroundColor: C.primary, borderColor: C.primary },
  opBtnText: { color: C.muted, fontSize: 9, fontWeight: '500' },
  opBtnTextOn: { color: '#fff' },
  opHint: { color: C.muted, fontSize: 9, fontStyle: 'italic' },
  // Summary
  summaryBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 6, borderWidth: 1, borderColor: C.border, padding: 8, gap: 4 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryText: { fontSize: 10, fontWeight: '600', flex: 1 },
  summaryCode: { color: C.muted, fontSize: 9, fontFamily: 'monospace' as any },
  // Tester
  testerSection: { gap: 0 },
  testerToggle: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5 },
  testerToggleText: { color: C.cyan, fontSize: 10, fontWeight: '500', flex: 1 },
  tester: { backgroundColor: 'rgba(34,211,238,0.04)', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(34,211,238,0.15)', padding: 10, gap: 8 },
  testerDesc: { color: C.muted, fontSize: 9, lineHeight: 13 },
  testerVar: { color: C.cyan, fontFamily: 'monospace' as any },
  testerInput: { height: 30, backgroundColor: C.bg, borderRadius: 5, borderWidth: 1, borderColor: C.border, color: C.text, fontSize: 11, paddingHorizontal: 8 },
  testerResult: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 6, borderWidth: 1, padding: 10 },
  testerResultTitle: { fontSize: 11, fontWeight: '700' },
  testerResultSub: { color: C.muted, fontSize: 9, marginTop: 2 },
  // Clear
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 2 },
  clearText: { color: C.muted, fontSize: 9 },
  // Empty
  emptyState: { gap: 3 },
  emptyStateText: { color: C.muted, fontSize: 10, fontWeight: '500' },
  emptyStateHint: { color: C.muted, fontSize: 9, fontStyle: 'italic', lineHeight: 13 },
});
