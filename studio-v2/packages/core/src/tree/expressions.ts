/**
 * Centralized Expression Resolution — Single Source of Truth
 *
 * All expression resolution MUST go through this module.
 * Used by:
 *   - studio/engine/codegen/generator.ts  (resolveForCodegen)
 *   - studio/app/src/renderer/NodeRenderer.tsx (resolveForPreview)
 *   - studio/app/src/ui/shared/SmartInput.tsx (EXPRESSION_PREFIXES)
 *
 * Expression syntax:
 *   $state.x          → page state variable
 *   $state.user.name  → nested field of a state object
 *   $query.xData      → query data variable (from hook)
 *   $query.xData.0.name → nested field of query data
 *   $global.x         → global state variable
 *   $const.KEY        → app constant
 *   $env.KEY          → environment variable
 *   $theme.primary    → theme color
 *   $device.width     → device dimension
 *   $date.now         → current timestamp
 *   $nav.currentRoute → current route
 *   $response         → API response (inside onSuccess)
 *   $response.field   → field of API response
 *   $error.message    → error message (inside onError)
 *   fieldName         → item field (inside repeat context)
 *   item.fieldName    → item field (legacy prefix)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CodegenContext {
  /** Current repeat item variable name, e.g. "jpUser" */
  itemVar?: string;
}

export interface PreviewContext {
  /** Current repeat item data */
  itemContext?: Record<string, any>;
  /** All fetched query data, keyed by varName (e.g. "jpUsersData") */
  queryContext?: Record<string, any>;
  /** Current theme colors */
  themeColors?: Record<string, string>;
  /** Global state values keyed by name */
  globalContext?: Record<string, any>;
  /** All node props in the page, keyed by nodeId */
  nodePropsContext?: Record<string, Record<string, any>>;
}

export interface ResponseContext {
  /** Error variable name in generated code, default "_err" */
  errorVar?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** All valid expression prefixes — used for detection and linker tabs */
export const EXPRESSION_PREFIXES = [
  '$state.',
  '$query.',
  '$global.',
  '$const.',
  '$env.',
  '$theme.',
  '$device.',
  '$date.',
  '$nav.',
  '$node.',
  '$response',
  '$error',
] as const;

export type ExpressionPrefix = typeof EXPRESSION_PREFIXES[number];

/** Check if a string is a dynamic expression */
export function isExpression(value: string): boolean {
  return EXPRESSION_PREFIXES.some(p => value.startsWith(p));
}

/** Literal values that must never be resolved as bare fields in itemContext */
const LITERAL_VALUES = new Set(['true', 'false', 'null', 'undefined', '0', '1', 'none', 'auto']);

// ---------------------------------------------------------------------------
// Codegen resolution — returns JS code string
// ---------------------------------------------------------------------------

/**
 * Resolve an expression to its JavaScript equivalent for code generation.
 *
 * @param expr    The expression string (e.g. "$state.email")
 * @param ctx     Optional codegen context (itemVar for repeat)
 * @returns       JavaScript code string (e.g. "email")
 */
export function resolveForCodegen(expr: string, ctx?: CodegenContext): string {
  if (!expr) return expr;

  // State variables — $state.x → x (hook destructured var)
  if (expr.startsWith('$state.')) return expr.slice(7);

  // Global state — $global.x → globalState.x
  if (expr.startsWith('$global.')) return `globalState.${expr.slice(8)}`;

  // Node prop reference — $node.{nodeId}.{propName}
  // In generated code, node props are passed as component props — no direct equivalent.
  // The pattern is: bind the prop to a state var, then use the state var.
  // For codegen we emit a comment + the prop name as a fallback.
  if (expr.startsWith('$node.')) {
    const rest = expr.slice(6); // "nodeId.propName"
    const dotIdx = rest.indexOf('.');
    if (dotIdx > 0) {
      const propName = rest.slice(dotIdx + 1);
      // Resolve as a state variable if the prop was bound to one
      return propName;
    }
    return `/* node prop: ${rest} */`;
  }

  // Query data — $query.xData → xData (hook destructured var)
  if (expr.startsWith('$query.')) return expr.slice(7);

  // Constants — $const.KEY → CONSTANTS.KEY
  if (expr.startsWith('$const.')) return `CONSTANTS.${expr.slice(7)}`;

  // Environment variables — $env.KEY → process.env.KEY
  if (expr.startsWith('$env.')) return `process.env.${expr.slice(5)}`;

  // Theme — $theme.x → theme.x
  if (expr.startsWith('$theme.')) return `theme.${expr.slice(7)}`;

  // Device
  if (expr.startsWith('$device.width'))    return "Dimensions.get('window').width";
  if (expr.startsWith('$device.height'))   return "Dimensions.get('window').height";
  if (expr.startsWith('$device.platform')) return "Platform.OS";
  if (expr.startsWith('$device.isIOS'))    return "Platform.OS === 'ios'";
  if (expr.startsWith('$device.isAndroid'))return "Platform.OS === 'android'";

  // Date
  if (expr.startsWith('$date.now'))        return "Date.now()";
  if (expr.startsWith('$date.today'))      return "new Date().toISOString().split('T')[0]";
  if (expr.startsWith('$date.timestamp'))  return "Math.floor(Date.now() / 1000)";

  // Navigation
  if (expr.startsWith('$nav.currentRoute'))return "/* current route */";
  if (expr.startsWith('$nav.params'))      return "/* route params */";
  if (expr.startsWith('$nav.goBack'))      return "router.back()";

  // Generic $ prefix fallback
  if (expr.startsWith('$')) return expr.slice(1);

  // Legacy item.field prefix
  if (expr.startsWith('item.')) return expr;

  // Bare field name inside a repeat context → prefix with itemVar
  if (ctx?.itemVar && !expr.includes('(') && !expr.includes(' ')) {
    return `${ctx.itemVar}.${expr}`;
  }

  return expr;
}

/**
 * Resolve an expression that may reference $response or $error.
 * Used inside callApi onSuccess/onError blocks.
 */
export function resolveForResponse(expr: string, ctx?: ResponseContext): string {
  const errVar = ctx?.errorVar || '_err';

  if (expr === '$response') return '_res';
  if (expr.startsWith('$response.')) return '_res.' + expr.slice(10);
  if (expr === '$error' || expr === '$response.error') return errVar;
  if (expr.startsWith('$error.')) return errVar + '.' + expr.slice(7);

  return resolveForCodegen(expr);
}

// ---------------------------------------------------------------------------
// Preview resolution — returns runtime value
// ---------------------------------------------------------------------------

/**
 * Resolve an expression to its runtime value for the live preview.
 *
 * @param expr    The expression string
 * @param ctx     Preview context (itemContext, queryContext, themeColors)
 * @returns       The resolved runtime value, or a placeholder string
 */
export function resolveForPreview(expr: unknown, ctx: PreviewContext = {}): any {
  // Non-string values (boolean, number, null, object) are returned as-is — no expression resolution
  if (typeof expr !== 'string') return expr;
  if (!expr) return undefined;

  const { itemContext, queryContext, themeColors, globalContext, nodePropsContext } = ctx;

  // Bare field name — resolve from repeat item context first
  if (itemContext && !expr.startsWith('$') && !expr.startsWith('@') && !expr.startsWith('#') && !LITERAL_VALUES.has(expr)) {
    const val = getNestedValue(itemContext, expr.split('.'));
    if (val !== undefined) return val;
  }

  // Legacy: item.field
  if (expr.startsWith('item.') && itemContext) {
    return getNestedValue(itemContext, expr.slice(5).split('.'));
  }
  if (expr === 'item' && itemContext) return itemContext;

  // $node.{nodeId}.{propName} — reactive node prop reference
  if (expr.startsWith('$node.') && nodePropsContext) {
    const rest = expr.slice(6); // "nodeId.propName" or "nodeId.propName.nested"
    const dotIdx = rest.indexOf('.');
    if (dotIdx > 0) {
      const nodeId = rest.slice(0, dotIdx);
      const propPath = rest.slice(dotIdx + 1).split('.');
      const nodeProps = nodePropsContext[nodeId];
      if (nodeProps) return getNestedValue(nodeProps, propPath);
    }
    return `[node.${rest}]`;
  }

  // $global.x — resolve from global context
  if (expr.startsWith('$global.')) {
    if (globalContext) {
      const key = expr.slice(8);
      const parts = key.split('.');
      const val = getNestedValue(globalContext, parts);
      if (val !== undefined) return val;
    }
    return `[${expr.slice(8)}]`;
  }

  // $query.xData or $query.xData.field.nested
  if (expr.startsWith('$query.') && queryContext) {
    const rest = expr.slice(7);
    const parts = rest.split('.');
    const varName = parts[0];
    const data = queryContext[varName];
    if (data !== undefined) {
      if (parts.length === 1) return data;
      return getNestedValue(data, parts.slice(1));
    }
    return `[${varName}]`;
  }

  // $theme.x — resolve from theme colors
  if (expr.startsWith('$theme.') && themeColors) {
    const key = expr.slice(7);
    return themeColors[key] || expr;
  }

  // $state.x — check queryContext (where auto-fetched + storeResponseAs data lives)
  if (expr.startsWith('$state.') && queryContext) {
    const key = expr.slice(7); // e.g. "user" or "user.name" or "users[0].name"
    // Handle bracket notation: users[0].name → users, 0, name
    const normalized = key.replace(/\[(\d+)\]/g, '.$1');
    const parts = normalized.split('.');
    const rootKey = parts[0];
    const stateVal = queryContext[rootKey];
    if (stateVal !== undefined) {
      if (parts.length === 1) return stateVal;
      return getNestedValue(stateVal, parts.slice(1));
    }
    return `[${key}]`;
  }

  // $state.x — show placeholder (no real state in preview)
  if (expr.startsWith('$state.')) return `[${expr.slice(7)}]`;

  // $query.x — fallback placeholder (no queryContext)
  if (expr.startsWith('$query.')) return `[${expr.slice(7)}]`;

  // $const.x
  if (expr.startsWith('$const.')) return `[${expr.slice(7)}]`;

  // $env.x
  if (expr.startsWith('$env.')) return `[${expr.slice(5)}]`;

  // $device.*
  if (expr.startsWith('$device.')) return `[${expr.slice(8)}]`;

  // $date.*
  if (expr.startsWith('$date.')) return `[${expr.slice(6)}]`;

  // $nav.*
  if (expr.startsWith('$nav.')) return `[${expr.slice(5)}]`;

  // Plain literal
  return expr;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNestedValue(obj: any, path: string[]): any {
  let val = obj;
  for (const key of path) {
    if (val == null) return undefined;
    val = Array.isArray(val) ? val[Number(key)] : val[key];
  }
  return val;
}

// ---------------------------------------------------------------------------
// URL Safety Validation
// ---------------------------------------------------------------------------

/**
 * Validate that a URL uses a safe protocol before opening it.
 * Allowed protocols: https:, http:, mailto:, tel:
 *
 * Used by:
 *   - NodeRenderer.tsx (preview openURL action)
 *   - generator.ts (codegen openURL action guard)
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}
