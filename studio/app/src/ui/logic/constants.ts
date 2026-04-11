/**
 * Logic Panel — Shared constants
 * Single source of truth for all action types, event names, and UI metadata.
 */
import React from 'react';
import { Feather } from '@expo/vector-icons';

export const EVENT_NAMES = [
  'onMount', 'onPress', 'onLongPress', 'onSubmit',
  'onChange', 'onFocus', 'onBlur', 'onScroll',
  'onAppLoad', 'onScreenFocus', 'onScreenBlur',
] as const;
export type EventName = typeof EVENT_NAMES[number];

export const EVENT_META: Record<EventName, { color: string; icon: React.ComponentProps<typeof Feather>['name']; label: string; scope: 'component' | 'screen' | 'app' | 'any' }> = {
  onMount:       { color: '#22c55e', icon: 'sunrise',       label: 'On mount',       scope: 'any' },
  onPress:       { color: '#3b82f6', icon: 'mouse-pointer', label: 'On press',       scope: 'component' },
  onLongPress:   { color: '#6366f1', icon: 'clock',         label: 'Long press',     scope: 'component' },
  onSubmit:      { color: '#06b6d4', icon: 'send',          label: 'On submit',      scope: 'component' },
  onChange:      { color: '#f59e0b', icon: 'edit-2',        label: 'On change',      scope: 'component' },
  onFocus:       { color: '#a78bfa', icon: 'eye',           label: 'On focus',       scope: 'component' },
  onBlur:        { color: '#6a7494', icon: 'eye-off',       label: 'On blur',        scope: 'component' },
  onScroll:      { color: '#ec4899', icon: 'move',          label: 'On scroll',      scope: 'component' },
  onAppLoad:     { color: '#22d3ee', icon: 'zap',           label: 'App loads',      scope: 'app' },
  onScreenFocus: { color: '#f97316', icon: 'monitor',       label: 'Screen focus',   scope: 'screen' },
  onScreenBlur:  { color: '#94a3b8', icon: 'monitor',       label: 'Screen blur',    scope: 'screen' },
};

/** Events that only make sense on interactive components (not layouts) */
export const COMPONENT_ONLY_EVENTS: EventName[] = [
  'onPress', 'onLongPress', 'onSubmit', 'onChange', 'onFocus', 'onBlur',
];

/** Events that apply at screen/page level */
export const SCREEN_EVENTS: EventName[] = ['onScreenFocus', 'onScreenBlur'];

/** Events that apply at app root level */
export const APP_EVENTS: EventName[] = ['onAppLoad'];

export const ACTION_TYPES = [
  // Navigation
  'navigate',
  // State
  'setState', 'setGlobalState', 'resetState', 'mergeState', 'toggleState', 'incrementState',
  // Data / API
  'callApi', 'callCustomFn',
  // Transform & Compute
  'transform', 'compute',
  // Flow control
  'delay', 'conditional', 'loop', 'parallel',
  // UI
  'openModal', 'closeModal', 'alert', 'toast', 'consoleLog',
  // Native
  'haptics', 'share', 'sendSMS', 'biometrics', 'getLocation', 'clipboard', 'openURL', 'playSound',
  // Dev
  'custom',
] as const;
export type ActionType = typeof ACTION_TYPES[number];

export const ACTION_META: Record<ActionType, { icon: React.ComponentProps<typeof Feather>['name']; color: string; label: string; group: string }> = {
  navigate:       { icon: 'navigation',    color: '#3b82f6', label: 'Navigate',        group: 'nav' },
  setState:       { icon: 'database',      color: '#8b5cf6', label: 'Set State',       group: 'state' },
  setGlobalState: { icon: 'globe',         color: '#a78bfa', label: 'Set Global',      group: 'state' },
  resetState:     { icon: 'refresh-cw',    color: '#6366f1', label: 'Reset State',     group: 'state' },
  mergeState:     { icon: 'layers',        color: '#8b5cf6', label: 'Merge State',     group: 'state' },
  toggleState:    { icon: 'toggle-left',   color: '#f59e0b', label: 'Toggle State',    group: 'state' },
  incrementState: { icon: 'plus-circle',   color: '#22c55e', label: 'Increment',       group: 'state' },
  callApi:        { icon: 'cloud',         color: '#06b6d4', label: 'Call API',        group: 'data' },
  callCustomFn:   { icon: 'cpu',           color: '#a78bfa', label: 'Custom Function', group: 'data' },
  transform:      { icon: 'filter',        color: '#f97316', label: 'Transform',       group: 'transform' },
  compute:        { icon: 'zap',           color: '#eab308', label: 'Compute',         group: 'transform' },
  delay:          { icon: 'clock',         color: '#94a3b8', label: 'Delay',           group: 'flow' },
  conditional:    { icon: 'git-branch',    color: '#f97316', label: 'Condition',       group: 'flow' },
  loop:           { icon: 'repeat',        color: '#06b6d4', label: 'Loop',            group: 'flow' },
  parallel:       { icon: 'columns',       color: '#8b5cf6', label: 'Parallel',        group: 'flow' },
  openModal:      { icon: 'maximize-2',    color: '#f59e0b', label: 'Open Modal',      group: 'ui' },
  closeModal:     { icon: 'minimize-2',    color: '#f59e0b', label: 'Close Modal',     group: 'ui' },
  alert:          { icon: 'alert-circle',  color: '#ef4444', label: 'Alert',           group: 'ui' },
  toast:          { icon: 'bell',          color: '#22c55e', label: 'Toast',           group: 'ui' },
  consoleLog:     { icon: 'terminal',      color: '#6a7494', label: 'Log',             group: 'dev' },
  haptics:        { icon: 'smartphone',    color: '#a78bfa', label: 'Haptics',         group: 'native' },
  share:          { icon: 'share-2',       color: '#3b82f6', label: 'Share',           group: 'native' },
  sendSMS:        { icon: 'message-square',color: '#22c55e', label: 'Send SMS',        group: 'native' },
  biometrics:     { icon: 'lock',          color: '#f59e0b', label: 'Biometrics',      group: 'native' },
  getLocation:    { icon: 'map-pin',       color: '#ef4444', label: 'Location',        group: 'native' },
  clipboard:      { icon: 'clipboard',     color: '#6a7494', label: 'Clipboard',       group: 'native' },
  openURL:        { icon: 'external-link', color: '#3b82f6', label: 'Open URL',        group: 'native' },
  playSound:      { icon: 'volume-2',      color: '#ec4899', label: 'Play Sound',      group: 'native' },
  custom:         { icon: 'code',          color: '#6a7494', label: 'Custom Code',     group: 'dev' },
};

export const ACTION_GROUPS = [
  { id: 'nav',       label: 'Navigation', color: '#3b82f6' },
  { id: 'state',     label: 'State',      color: '#8b5cf6' },
  { id: 'data',      label: 'Data',       color: '#06b6d4' },
  { id: 'transform', label: 'Transform',  color: '#f97316' },
  { id: 'flow',      label: 'Flow',       color: '#f97316' },
  { id: 'ui',        label: 'UI',         color: '#f59e0b' },
  { id: 'native',    label: 'Native',     color: '#a78bfa' },
  { id: 'dev',       label: 'Dev',        color: '#6a7494' },
] as const;

// ─── Transform operations by data type ───────────────────────────────────────
export const TRANSFORM_OPS = {
  array: [
    { op: 'filter',    label: 'Filter',       hint: 'Keep items where condition is true' },
    { op: 'map',       label: 'Map',          hint: 'Transform each item' },
    { op: 'find',      label: 'Find',         hint: 'First item matching condition' },
    { op: 'findIndex', label: 'Find Index',   hint: 'Index of first matching item' },
    { op: 'sort',      label: 'Sort',         hint: 'Sort by field or expression' },
    { op: 'reverse',   label: 'Reverse',      hint: 'Reverse array order' },
    { op: 'slice',     label: 'Slice',        hint: 'Extract a portion' },
    { op: 'concat',    label: 'Concat',       hint: 'Merge with another array' },
    { op: 'unique',    label: 'Unique',       hint: 'Remove duplicates' },
    { op: 'flatten',   label: 'Flatten',      hint: 'Flatten nested arrays' },
    { op: 'count',     label: 'Count',        hint: 'Number of items' },
    { op: 'sum',       label: 'Sum',          hint: 'Sum of a numeric field' },
    { op: 'min',       label: 'Min',          hint: 'Minimum value of a field' },
    { op: 'max',       label: 'Max',          hint: 'Maximum value of a field' },
    { op: 'avg',       label: 'Average',      hint: 'Average of a numeric field' },
    { op: 'groupBy',   label: 'Group By',     hint: 'Group items by a field' },
    { op: 'pluck',     label: 'Pluck',        hint: 'Extract a field from each item' },
    { op: 'first',     label: 'First',        hint: 'First item' },
    { op: 'last',      label: 'Last',         hint: 'Last item' },
    { op: 'nth',       label: 'Nth item',     hint: 'Item at index N' },
    { op: 'includes',  label: 'Includes',     hint: 'Check if value exists' },
    { op: 'push',      label: 'Push',         hint: 'Add item to end' },
    { op: 'unshift',   label: 'Prepend',      hint: 'Add item to start' },
    { op: 'removeAt',  label: 'Remove at',    hint: 'Remove item at index' },
    { op: 'updateAt',  label: 'Update at',    hint: 'Update item at index' },
  ],
  string: [
    { op: 'uppercase',    label: 'Uppercase',     hint: 'Convert to uppercase' },
    { op: 'lowercase',    label: 'Lowercase',     hint: 'Convert to lowercase' },
    { op: 'capitalize',   label: 'Capitalize',    hint: 'Capitalize first letter' },
    { op: 'trim',         label: 'Trim',          hint: 'Remove whitespace' },
    { op: 'split',        label: 'Split',         hint: 'Split into array by separator' },
    { op: 'replace',      label: 'Replace',       hint: 'Replace substring' },
    { op: 'includes',     label: 'Includes',      hint: 'Check if contains substring' },
    { op: 'startsWith',   label: 'Starts with',   hint: 'Check prefix' },
    { op: 'endsWith',     label: 'Ends with',     hint: 'Check suffix' },
    { op: 'slice',        label: 'Slice',         hint: 'Extract substring' },
    { op: 'length',       label: 'Length',        hint: 'String length' },
    { op: 'concat',       label: 'Concat',        hint: 'Join strings' },
    { op: 'template',     label: 'Template',      hint: 'String interpolation: "Hello {name}"' },
    { op: 'padStart',     label: 'Pad Start',     hint: 'Pad to length from start' },
    { op: 'padEnd',       label: 'Pad End',       hint: 'Pad to length from end' },
    { op: 'repeat',       label: 'Repeat',        hint: 'Repeat N times' },
    { op: 'match',        label: 'Regex Match',   hint: 'Match against regex' },
    { op: 'toNumber',     label: 'To Number',     hint: 'Parse as number' },
    { op: 'toBoolean',    label: 'To Boolean',    hint: 'Convert to boolean' },
    { op: 'toJson',       label: 'To JSON',       hint: 'Parse JSON string' },
  ],
  number: [
    { op: 'add',       label: 'Add (+)',       hint: 'Add a value' },
    { op: 'subtract',  label: 'Subtract (−)',  hint: 'Subtract a value' },
    { op: 'multiply',  label: 'Multiply (×)',  hint: 'Multiply by a value' },
    { op: 'divide',    label: 'Divide (÷)',    hint: 'Divide by a value' },
    { op: 'modulo',    label: 'Modulo (%)',    hint: 'Remainder of division' },
    { op: 'power',     label: 'Power (^)',     hint: 'Raise to power' },
    { op: 'abs',       label: 'Absolute',      hint: 'Absolute value' },
    { op: 'round',     label: 'Round',         hint: 'Round to N decimals' },
    { op: 'floor',     label: 'Floor',         hint: 'Round down' },
    { op: 'ceil',      label: 'Ceil',          hint: 'Round up' },
    { op: 'clamp',     label: 'Clamp',         hint: 'Clamp between min and max' },
    { op: 'min',       label: 'Min',           hint: 'Minimum of two values' },
    { op: 'max',       label: 'Max',           hint: 'Maximum of two values' },
    { op: 'random',    label: 'Random',        hint: 'Random number in range' },
    { op: 'toString',  label: 'To String',     hint: 'Convert to string' },
    { op: 'toFixed',   label: 'To Fixed',      hint: 'Format with N decimal places' },
    { op: 'isNaN',     label: 'Is NaN',        hint: 'Check if not a number' },
    { op: 'isFinite',  label: 'Is Finite',     hint: 'Check if finite' },
  ],
  object: [
    { op: 'pick',      label: 'Pick',          hint: 'Keep only specified keys' },
    { op: 'omit',      label: 'Omit',          hint: 'Remove specified keys' },
    { op: 'merge',     label: 'Merge',         hint: 'Merge with another object' },
    { op: 'get',       label: 'Get field',     hint: 'Get a nested field by path' },
    { op: 'set',       label: 'Set field',     hint: 'Set a nested field by path' },
    { op: 'delete',    label: 'Delete field',  hint: 'Remove a field' },
    { op: 'keys',      label: 'Keys',          hint: 'Get array of keys' },
    { op: 'values',    label: 'Values',        hint: 'Get array of values' },
    { op: 'entries',   label: 'Entries',       hint: 'Get array of [key, value] pairs' },
    { op: 'hasKey',    label: 'Has key',       hint: 'Check if key exists' },
    { op: 'toArray',   label: 'To Array',      hint: 'Convert to array of values' },
    { op: 'stringify', label: 'Stringify',     hint: 'Convert to JSON string' },
    { op: 'clone',     label: 'Clone',         hint: 'Deep clone the object' },
  ],
  boolean: [
    { op: 'not',       label: 'NOT (!)',        hint: 'Negate the value' },
    { op: 'and',       label: 'AND (&&)',       hint: 'Logical AND with another value' },
    { op: 'or',        label: 'OR (||)',        hint: 'Logical OR with another value' },
    { op: 'xor',       label: 'XOR',           hint: 'Exclusive OR' },
    { op: 'toString',  label: 'To String',     hint: 'Convert to "true"/"false"' },
    { op: 'toNumber',  label: 'To Number',     hint: 'Convert to 1/0' },
  ],
  date: [
    { op: 'now',       label: 'Now',           hint: 'Current timestamp' },
    { op: 'format',    label: 'Format',        hint: 'Format date as string' },
    { op: 'addDays',   label: 'Add days',      hint: 'Add N days' },
    { op: 'addHours',  label: 'Add hours',     hint: 'Add N hours' },
    { op: 'addMinutes',label: 'Add minutes',   hint: 'Add N minutes' },
    { op: 'diff',      label: 'Difference',    hint: 'Difference between two dates' },
    { op: 'isBefore',  label: 'Is before',     hint: 'Compare dates' },
    { op: 'isAfter',   label: 'Is after',      hint: 'Compare dates' },
    { op: 'toTimestamp',label: 'To timestamp', hint: 'Convert to Unix timestamp' },
    { op: 'fromTimestamp',label: 'From timestamp', hint: 'Parse Unix timestamp' },
  ],
} as const;

export type TransformDataType = keyof typeof TRANSFORM_OPS;

// ─── Condition operators ──────────────────────────────────────────────────────
export const CONDITION_OPS = [
  { op: '==',         label: '= equals' },
  { op: '!=',         label: '≠ not equals' },
  { op: '>',          label: '> greater than' },
  { op: '>=',         label: '≥ greater or equal' },
  { op: '<',          label: '< less than' },
  { op: '<=',         label: '≤ less or equal' },
  { op: 'contains',   label: '⊃ contains' },
  { op: 'startsWith', label: '⌐ starts with' },
  { op: 'endsWith',   label: '¬ ends with' },
  { op: 'isEmpty',    label: '∅ is empty' },
  { op: 'isNotEmpty', label: '≠∅ is not empty' },
  { op: 'isNull',     label: '∅ is null/undefined' },
  { op: 'isNotNull',  label: '≠∅ is not null' },
  { op: 'isTrue',     label: '✓ is true' },
  { op: 'isFalse',    label: '✗ is false' },
  { op: 'isNumber',   label: '# is number' },
  { op: 'isString',   label: 'Aa is string' },
  { op: 'isArray',    label: '[] is array' },
  { op: 'regex',      label: '/…/ matches regex' },
] as const;

export const STATE_TYPES = ['string', 'number', 'boolean', 'object', 'array'] as const;
export type StateType = typeof STATE_TYPES[number];

export const ANIM_PRESETS = [
  'none', 'fadeIn', 'fadeOut',
  'slideUp', 'slideDown', 'slideLeft', 'slideRight',
  'scaleIn', 'scaleOut', 'bounce', 'rotate', 'pulse',
] as const;

export const ANIM_TRIGGERS = ['onMount', 'onPress', 'onVisible', 'onState'] as const;
export const ANIM_EASINGS  = ['ease', 'linear', 'easeIn', 'easeOut', 'easeInOut', 'spring'] as const;

export const METHOD_COLORS: Record<string, string> = {
  GET: '#22c55e', POST: '#3b82f6', PUT: '#f59e0b', PATCH: '#8b5cf6', DELETE: '#ef4444',
};

export const C = {
  bg:      '#07090f',
  surface: '#0d1220',
  s2:      '#131a2e',
  border:  '#1a2240',
  text:    '#d0d8f0',
  muted:   '#4a5470',
  primary: '#3b82f6',
  success: '#22c55e',
  error:   '#ef4444',
  warn:    '#f59e0b',
  cyan:    '#22d3ee',
  accent:  '#a78bfa',
};
