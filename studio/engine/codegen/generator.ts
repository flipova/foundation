/**
 * Code Generator
 *
 * Transforms a PageDocument tree into a React Native .tsx screen file
 * and a companion .hook.ts file.
 *
 * Rules:
 * - ALL logic lives in the hook (no inline handlers in JSX)
 * - ALL action types are handled (navigate, setState, callApi, alert, toast,
 *   openModal, closeModal, consoleLog, haptics, share, sendSMS, biometrics,
 *   getLocation, clipboard, openURL, playSound, custom)
 * - API calls import from services/ via the generated query hook
 * - Naming is delegated to naming.ts (single source of truth)
 */

import type { TreeNode, PageDocument, ActionDef, PageState, AnimationConfig, DataQuery } from "../tree/types";
import { deriveScreenNames, capitalize, normalizeQueryName } from "./naming";
import { resolveForCodegen, resolveForResponse } from "../tree/expressions";
import { getLayoutMeta } from "../../../foundation/layout/registry";
import { deriveSlotConfig, type SlotConfig } from "../../app/src/renderer/slotConfig";

// ---------------------------------------------------------------------------
// Import collection
// ---------------------------------------------------------------------------

interface ImportCollector {
  imports: Map<string, Set<string>>;
}

const COMPONENT_SOURCE = "@flipova/foundation";

function addImport(c: ImportCollector, source: string, name: string) {
  if (!c.imports.has(source)) c.imports.set(source, new Set());
  c.imports.get(source)!.add(name);
}

function collectImports(node: TreeNode, c: ImportCollector): void {
  if (node.kind !== "text" && node.kind !== "slot") {
    addImport(c, COMPONENT_SOURCE, node.registryId);
  }

  // Token bindings
  for (const v of Object.values(node.props)) {
    if (typeof v === "string" && v.startsWith("$")) {
      const [group] = v.slice(1).split(".");
      const tokenMap: Record<string, string> = {
        spacing: "spacing", radii: "radii", shadow: "shadows", fontSize: "fontSizes",
        fontWeight: "fontWeights", lineHeight: "lineHeights", opacity: "opacity",
        duration: "durations", zIndex: "zIndices", color: "colors",
      };
      if (group === "theme") addImport(c, COMPONENT_SOURCE, "useTheme");
      else if (tokenMap[group]) addImport(c, "@flipova/foundation/tokens", tokenMap[group]);
    }
  }

  // Event-driven imports
  if (node.events) {
    for (const actions of Object.values(node.events)) {
      for (const a of actions as ActionDef[]) {
        collectActionImport(a, c);
      }
    }
  }

  // Animation
  if (node.animation?.preset !== "none") {
    addImport(c, "react-native", "Animated");
    addImport(c, "react", "useEffect");
    addImport(c, "react", "useRef");
  }

  for (const child of node.children) collectImports(child, c);
}

function collectActionImport(a: ActionDef, c: ImportCollector) {
  const p = a.payload as any;
  switch (a.type as string) {
    case "navigate":   addImport(c, "expo-router", "useRouter"); break;
    case "alert":      addImport(c, "react-native", "Alert"); break;
    case "toast":      addImport(c, "react-native", "Alert"); break;
    case "share":      addImport(c, "react-native", "Share"); break;
    case "haptics":    addImport(c, "expo-haptics", "* as Haptics"); break;
    case "openURL":    addImport(c, "react-native", "Linking"); break;
    case "clipboard":  addImport(c, "expo-clipboard", "* as Clipboard"); break;
    case "sendSMS":    addImport(c, "expo-sms", "* as SMS"); break;
    case "biometrics": addImport(c, "expo-local-authentication", "* as LocalAuthentication"); break;
    case "getLocation":addImport(c, "expo-location", "* as Location"); break;
    // Recursive: collect imports from nested actions
    case "conditional":
      if (Array.isArray(p.then)) (p.then as ActionDef[]).forEach(a2 => collectActionImport(a2, c));
      if (Array.isArray(p.else)) (p.else as ActionDef[]).forEach(a2 => collectActionImport(a2, c));
      break;
    case "loop":
      if (Array.isArray(p.body)) (p.body as ActionDef[]).forEach(a2 => collectActionImport(a2, c));
      break;
    case "parallel":
      if (Array.isArray(p.lanes)) (p.lanes as ActionDef[][]).forEach(lane => lane.forEach(a2 => collectActionImport(a2, c)));
      break;
  }
}

// ---------------------------------------------------------------------------
// Action rendering
// ---------------------------------------------------------------------------

/**
 * Resolve $response.field → _res.field (inside a callApi success/error block)
 * Delegates to centralized resolveForResponse from expressions.ts.
 */
function resolveResponseExpr(expr: string, errorVar?: string): string {
  return resolveForResponse(expr, { errorVar });
}

/** Render an action that may reference $response (used in onSuccess/onError) */
function renderActionWithResponse(action: ActionDef, errorVar?: string, stateKeys?: Map<string, { type: string; default: string }>): string {
  const san = (s: string) => s.replace(/[^a-zA-Z0-9_]/g, "");
  const p = action.payload as any;
  const resResp = (v: string) => resolveResponseExpr(v, errorVar);
  const resolveVal = (val: string): string => {
    if (!val) return JSON.stringify(val);
    if (val.startsWith('$')) return resResp(val);
    return JSON.stringify(val);
  };
  switch (action.type as string) {
    case "setState": {
      const key = san(String(p.key || "value"));
      if (!key) return "";
      const val = String(p.value ?? "");
      const resolved = val.startsWith('$node.') ? resolveNodeForCodegen(val, stateKeys) : resolveVal(val);
      return `set${capitalize(key)}(${resolved});`;
    }
    case "navigate": {
      const screen = String(p.screen || "");
      return screen.startsWith("$")
        ? `router.push(${resResp(screen)});`
        : `router.push("/${screen}");`;
    }
    case "alert":
      return `Alert.alert(${resolveVal(String(p.title || ""))}, ${resolveVal(String(p.message || ""))});`;
    case "consoleLog": {
      const msg = String(p.message || "log");
      return `console.log(${resolveVal(msg)});`;
    }
    default:
      return renderAction(action, stateKeys);
  }
}

function renderAction(action: ActionDef, stateKeys?: Map<string, { type: string; default: string }>, itemVar?: string): string {
  const san = (s: string) => s.replace(/[^a-zA-Z0-9_]/g, "");
  const p = action.payload as any;
  // Helper: resolve an expression with item context awareness
  const res = (expr: string) => resolveExpression(expr, itemVar, stateKeys);
  /**
   * Resolve a value that may be:
   *  - a $ expression  → res()
   *  - a bare identifier in a repeat context (e.g. "username") → itemVar.username
   *  - a literal string → JSON.stringify
   */
  const resolveVal = (val: string): string => {
    if (!val) return JSON.stringify(val);
    if (val.startsWith('$')) return res(val);
    // Never prefix JS keywords/literals with itemVar
    if (/^(true|false|null|undefined|\d)/.test(val)) return val;
    // Bare identifier (no spaces, parens, operators) inside a repeat context → item field
    if (itemVar && /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(val)) return `${itemVar}.${val}`;
    return JSON.stringify(val);
  };
  switch (action.type as string) {
    case "navigate": {
      const screen = String(action.payload.screen || "");
      return screen.startsWith("$")
        ? `router.push(${res(screen)});`
        : `router.push("/${screen}");`;
    }    case "setState": {
      const key = san(String(action.payload.key || "value"));
      if (!key) return "";
      const val = String(action.payload.value ?? "");
      const resolved = val.startsWith('$node.') ? resolveNodeForCodegen(val, stateKeys) : resolveVal(val);
      return `set${capitalize(key)}(${resolved});`;
    }
    case "alert":
      return `Alert.alert(${resolveVal(String(action.payload.title || ""))}, ${resolveVal(String(action.payload.message || ""))});`;
    case "toast": {
      const msg = resolveVal(String(p.message || ""));
      const variant = String(p.variant || "info");
      // Emit a real toast using Alert as fallback — works cross-platform without extra deps
      return `Alert.alert(${JSON.stringify(capitalize(variant))}, ${msg});`;
    }
    case "openModal": {
      const name = san(String(action.payload.name || "dialog"));
      return `setShow${capitalize(name)}(true);`;
    }
    case "closeModal": {
      const name = san(String(action.payload.name || "dialog"));
      return `setShow${capitalize(name)}(false);`;
    }
    case "callApi": {
      const p = action.payload as any;
      const qName = normalizeQueryName(String(p.queryName || "fetchData").replace(/[^a-zA-Z0-9_]/g, ""));
      const refetchFn = `refetch${capitalize(qName)}`;

      // Build dynamic body if specified
      const bodyEntries = p.body ? Object.entries(p.body as Record<string, string>) : [];
      const hasBody = bodyEntries.length > 0;
      const storeAs = p.storeResponseAs ? String(p.storeResponseAs).replace(/[^a-zA-Z0-9_]/g, "") : null;
      const hasOnSuccess = Array.isArray(p.onSuccess) && p.onSuccess.length > 0;
      const hasOnError = Array.isArray(p.onError) && p.onError.length > 0;

      if (!hasBody && !storeAs && !hasOnSuccess && !hasOnError) {
        // Simple call — no response handling
        return `await ${refetchFn}();`;
      }

      // Complex call — inline try/catch with response handling
      const bodyArg = hasBody
        ? `{ ${bodyEntries.map(([k, v]) => {
            const expr = String(v);
            return expr.startsWith('$node.') ? `${k}: ${resolveNodeForCodegen(expr, stateKeys)}` : `${k}: ${res(expr)}`;
          }).join(", ")} }`
        : undefined;

      const lines: string[] = [];
      lines.push(`try {`);
      lines.push(`  const _res = await ${refetchFn}(${bodyArg ? bodyArg : ""});`);

      if (storeAs) {
        lines.push(`  set${capitalize(storeAs)}(_res);`);
      }

      if (hasOnSuccess) {
        for (const a of p.onSuccess as ActionDef[]) {
          const rendered = renderActionWithResponse(a, undefined, stateKeys);
          if (rendered) lines.push(`  ${rendered}`);
        }
      }

      lines.push(`} catch (_err: any) {`);
      if (hasOnError) {
        for (const a of p.onError as ActionDef[]) {
          const rendered = renderActionWithResponse(a, "_err", stateKeys);
          if (rendered) lines.push(`  ${rendered}`);
        }
      } else {
        lines.push(`  console.error("${qName} failed:", _err);`);
      }
      lines.push(`}`);

      return lines.join("\n    ");
    }
    case "consoleLog": {
      const msg = String(action.payload.message || "log");
      return `console.log(${resolveVal(msg)});`;
    }
    case "playSound":
      return `/* play sound: ${action.payload.uri || ""} */`;
    case "haptics":
      return `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.${action.payload.style || "Medium"});`;
    case "share":
      return `Share.share({ message: ${JSON.stringify(action.payload.message || "")} });`;
    case "sendSMS":
      return `SMS.sendSMSAsync([${JSON.stringify(action.payload.number || "")}], ${JSON.stringify(action.payload.message || "")});`;
    case "biometrics":
      return `LocalAuthentication.authenticateAsync();`;
    case "getLocation":
      return `Location.getCurrentPositionAsync({});`;
    case "clipboard":
      return `Clipboard.setStringAsync(${JSON.stringify(action.payload.text || "")});`;
    case "openURL": {
      const url = String(action.payload.url || "");
      return `if (isSafeUrl(${JSON.stringify(url)})) Linking.openURL(${JSON.stringify(url)});`;
    }
    case "callCustomFn": {
      const p = action.payload as any;
      const fnId = String(p.fnId || "").replace(/[^a-zA-Z0-9_]/g, "");
      const hookName = `use${capitalize(fnId)}`;
      const params = p.params as Record<string, string> || {};
      const paramEntries = Object.entries(params);
      const hasParams = paramEntries.length > 0;
      const storeAs = p.storeResultAs ? String(p.storeResultAs).replace(/[^a-zA-Z0-9_]/g, "") : null;
      
      const lines: string[] = [];
      lines.push(`const _${fnId}Result = await ${hookName}().execute(${hasParams ? paramEntries.map(([k, v]) => res(String(v))).join(", ") : ""});`);
      if (storeAs) {
        lines.push(`set${capitalize(storeAs)}(_${fnId}Result);`);
      }
      return lines.join("\n    ");
    }
    case "custom":
      return String(p.code || "");
    case "setGlobalState": {
      const key = (p.key || "").replace(/[^a-zA-Z0-9_]/g, "");
      if (!key) return "";
      return `setGlobal${capitalize(key)}(${resolveVal(String(p.value ?? ""))});`;
    }
    case "resetState": {
      const key = (p.key || "").replace(/[^a-zA-Z0-9_]/g, "");
      if (!key) return "";
      const def = p.defaultValue;
      return `set${capitalize(key)}(${def !== undefined ? JSON.stringify(def) : "null"});`;
    }
    case "mergeState": {
      const key = (p.key || "").replace(/[^a-zA-Z0-9_]/g, "");
      if (!key) return "";
      const val = String(p.value ?? "{}");
      const resolved = val.startsWith("$") ? res(val) : (itemVar && /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(val) ? `${itemVar}.${val}` : val);
      return `set${capitalize(key)}(prev => ({ ...prev, ...${resolved} }));`;
    }
    case "toggleState": {
      const key = (p.key || "").replace(/[^a-zA-Z0-9_]/g, "");
      if (!key) return "";
      return `set${capitalize(key)}(prev => !prev);`;
    }
    case "incrementState": {
      const key = (p.key || "").replace(/[^a-zA-Z0-9_]/g, "");
      if (!key) return "";
      const by = Number(p.by ?? 1);
      const min = p.min !== undefined ? Number(p.min) : null;
      const max = p.max !== undefined ? Number(p.max) : null;
      let expr = `prev + ${by}`;
      if (min !== null && max !== null) expr = `Math.min(Math.max(${expr}, ${min}), ${max})`;
      else if (min !== null) expr = `Math.max(${expr}, ${min})`;
      else if (max !== null) expr = `Math.min(${expr}, ${max})`;
      return `set${capitalize(key)}(prev => ${expr});`;
    }
    case "delay": {
      const ms = Number(p.ms ?? 500);
      return `await new Promise(r => setTimeout(r, ${ms}));`;
    }
    case "conditional": {
      const cond = p.condition ? res(String(p.condition)) : "false";
      const thenActions: ActionDef[] = Array.isArray(p.then) ? p.then : [];
      const elseActions: ActionDef[] = Array.isArray(p.else) ? p.else : [];
      const thenCode = thenActions.map((a: ActionDef) => renderAction(a, stateKeys, itemVar)).filter(Boolean).map((l: string) => `  ${l}`).join("\n");
      const elseCode = elseActions.map((a: ActionDef) => renderAction(a, stateKeys, itemVar)).filter(Boolean).map((l: string) => `  ${l}`).join("\n");
      const lines = [`if (${cond}) {`, thenCode || "  // no actions"];
      if (elseCode) { lines.push("} else {"); lines.push(elseCode); }
      lines.push("}");
      return lines.join("\n");
    }
    case "transform": {
      if (!p.storeAs || !p.source) return "";
      const key = String(p.storeAs).replace(/[^a-zA-Z0-9_]/g, "");
      const src = res(String(p.source));
      const steps: any[] = Array.isArray(p.steps) ? p.steps : [];
      let expr = src;
      for (const step of steps) {
        const arg = step.arg ? res(String(step.arg)) : undefined;
        const arg2 = step.arg2 ? res(String(step.arg2)) : undefined;
        const field = step.field ? JSON.stringify(step.field) : undefined;
        switch (step.op) {
          case 'filter':    expr = `(${expr}).filter(item => ${arg || 'true'})`; break;
          case 'map':       expr = `(${expr}).map(item => ${arg || 'item'})`; break;
          case 'sort':      expr = field ? `[...(${expr})].sort((a,b) => a[${field}] > b[${field}] ? 1 : -1)` : `[...(${expr})].sort()`; break;
          case 'reverse':   expr = `[...(${expr})].reverse()`; break;
          case 'slice':     expr = `(${expr}).slice(${arg || 0}${arg2 ? `, ${arg2}` : ''})`; break;
          case 'flatten':   expr = `(${expr}).flat()`; break;
          case 'unique':    expr = `[...new Set(${expr})]`; break;
          case 'count':     expr = `(${expr}).length`; break;
          case 'first':     expr = `(${expr})[0]`; break;
          case 'last':      expr = `(${expr}).at(-1)`; break;
          case 'join':      expr = `(${expr}).join(${arg || '","'})`; break;
          case 'sum':       expr = field ? `(${expr}).reduce((s,i) => s + Number(i[${field}]), 0)` : `(${expr}).reduce((s,i) => s + Number(i), 0)`; break;
          case 'uppercase': expr = `String(${expr}).toUpperCase()`; break;
          case 'lowercase': expr = `String(${expr}).toLowerCase()`; break;
          case 'trim':      expr = `String(${expr}).trim()`; break;
          case 'split':     expr = `String(${expr}).split(${arg || '","'})`; break;
          case 'replace':   expr = `String(${expr}).replace(new RegExp(${arg || '""'}, 'g'), ${arg2 || '""'})`; break;
          case 'add':       expr = `Number(${expr}) + Number(${arg || 0})`; break;
          case 'subtract':  expr = `Number(${expr}) - Number(${arg || 0})`; break;
          case 'multiply':  expr = `Number(${expr}) * Number(${arg || 1})`; break;
          case 'divide':    expr = `Number(${arg || 1}) !== 0 ? Number(${expr}) / Number(${arg || 1}) : 0`; break;
          case 'abs':       expr = `Math.abs(Number(${expr}))`; break;
          case 'floor':     expr = `Math.floor(Number(${expr}))`; break;
          case 'ceil':      expr = `Math.ceil(Number(${expr}))`; break;
          case 'round':     expr = `Math.round(Number(${expr}))`; break;
          case 'not':       expr = `!(${expr})`; break;
          case 'stringify': expr = `JSON.stringify(${expr})`; break;
          case 'parse':     expr = `JSON.parse(String(${expr}))`; break;
          case 'get':       expr = field ? `(${expr})?.[${field}]` : expr; break;
          case 'set':       expr = field && arg ? `{ ...(${expr}), [${field}]: ${arg} }` : expr; break;
          case 'keys':      expr = `Object.keys(${expr})`; break;
          case 'values':    expr = `Object.values(${expr})`; break;
          default: break;
        }
      }
      return `set${capitalize(key)}(${expr});`;
    }
    case "compute": {
      if (!p.storeAs || !p.expression) return "";
      const key = String(p.storeAs).replace(/[^a-zA-Z0-9_]/g, "");
      const expr = String(p.expression)
        .replace(/\$state\.([a-zA-Z0-9_]+)/g, "$1")
        .replace(/\$global\.([a-zA-Z0-9_]+)/g, "global_$1");
      return `set${capitalize(key)}(${expr});`;
    }
    case "loop": {
      if (!p.source) return "";
      const src = res(String(p.source));
      const loopItemVar = String(p.itemVar || "item").replace(/[^a-zA-Z0-9_]/g, "");
      const body: ActionDef[] = Array.isArray(p.body) ? p.body : [];
      const bodyCode = body.map((a: ActionDef) => renderAction(a, stateKeys, loopItemVar)).filter(Boolean).map((l: string) => `    ${l}`).join("\n");
      return `for (const ${loopItemVar} of (${src} || [])) {\n${bodyCode || "    // no actions"}\n  }`;
    }
    case "parallel": {
      const lanes: ActionDef[][] = Array.isArray(p.lanes) ? p.lanes : [];
      if (!lanes.length) return "";
      const laneCode = lanes.map((lane: ActionDef[]) => {
        const code = lane.map((a: ActionDef) => renderAction(a, stateKeys, itemVar)).filter(Boolean).join("; ");
        const needsAsync = lane.some(isAsyncAction);
        const asyncKw = needsAsync ? "async " : "";
        return `Promise.resolve().then(${asyncKw}() => { ${code} })`;
      });
      // Join config
      const join = p.join as { mode?: string; timeoutMs?: number; onComplete?: ActionDef[]; onTimeout?: ActionDef[] } | undefined;
      const joinMode = join?.mode || 'all';
      const raceOrAll = joinMode === 'all' ? `Promise.all` : `Promise.race`;
      const onCompleteCode = (join?.onComplete || []).map((a: ActionDef) => renderAction(a, stateKeys, itemVar)).filter(Boolean).join("; ");
      const onTimeoutCode = (join?.onTimeout || []).map((a: ActionDef) => renderAction(a, stateKeys, itemVar)).filter(Boolean).join("; ");
      const lines: string[] = [];
      if (join?.timeoutMs !== undefined) {
        lines.push(`const _timeout = new Promise<void>((_, rej) => setTimeout(() => rej(new Error('timeout')), ${join.timeoutMs}));`);
        lines.push(`try {`);
        lines.push(`  await Promise.race([${raceOrAll}([${laneCode.join(", ")}]), _timeout]);`);
        if (onCompleteCode) lines.push(`  ${onCompleteCode}`);
        lines.push(`} catch (_e: any) {`);
        lines.push(`  if (_e?.message === 'timeout') { ${onTimeoutCode || "/* timeout */"} }`);
        lines.push(`}`);
      } else {
        lines.push(`await ${raceOrAll}([${laneCode.join(", ")}]);`);
        if (onCompleteCode) lines.push(onCompleteCode);
      }
      return lines.join("\n    ");
    }
    default:
      return "";
  }
}

// ---------------------------------------------------------------------------
// Node props resolution for $node.* expressions
// ---------------------------------------------------------------------------

/**
 * Resolve $node.id.prop expressions for codegen.
 * If the prop name (last segment) matches a known state variable, emit that variable.
 * Otherwise emit a commented placeholder — never a stale snapshot value.
 *
 * e.g. "$node.n_123.email" → "email" if "email" ∈ stateKeys
 *                          → "/* $node non résolu: $node.n_123.email *\/" otherwise
 */
function resolveNodeForCodegen(
  expr: string,
  stateKeys?: Map<string, { type: string; default: string }>
): string {
  if (!expr.startsWith('$node.')) return expr;
  // expr format: $node.<nodeId>.<prop>[.<nested>...]
  const parts = expr.slice(6).split('.'); // ['nodeId', 'prop', ...]
  if (parts.length < 2) return `/* $node non résolu: ${expr} */`;
  const propName = parts[1]; // first prop segment after nodeId
  if (stateKeys && stateKeys.has(propName)) {
    return propName;
  }
  return `/* $node non résolu: ${expr} */`;
}

// ---------------------------------------------------------------------------
// Expression resolver — delegates to centralized expressions.ts
// ---------------------------------------------------------------------------

/**
 * Resolve a binding/expression string to its JS equivalent in generated code.
 * Delegates to resolveForCodegen from studio/engine/tree/expressions.ts.
 * Also handles $node.id.prop resolution when stateKeys is provided.
 */
function resolveExpression(
  expr: string,
  itemVar?: string,
  stateKeys?: Map<string, { type: string; default: string }>
): string {
  if (expr.startsWith('$node.')) {
    return resolveNodeForCodegen(expr, stateKeys);
  }
  return resolveForCodegen(expr, { itemVar });
}

// ---------------------------------------------------------------------------
// Tree analysis helpers
// ---------------------------------------------------------------------------

function hasActionType(node: TreeNode, type: ActionDef["type"]): boolean {
  if (node.events) {
    for (const actions of Object.values(node.events)) {
      for (const a of actions as ActionDef[]) {
        if (a.type === type) return true;
        // Walk into parallel lanes
        if ((a.type as string) === "parallel") {
          const lanes: ActionDef[][] = Array.isArray((a.payload as any).lanes) ? (a.payload as any).lanes : [];
          if (lanes.some(lane => lane.some(la => la.type === type))) return true;
        }
      }
    }
  }
  return node.children.some(c => hasActionType(c, type));
}

/** Collect all react-native named imports needed by the hook (Alert, Share, Linking, etc.) */
function collectHookRNImports(node: TreeNode): Set<string> {
  const rn = new Set<string>();
  const walk = (n: TreeNode) => {
    if (n.events) {
      for (const actions of Object.values(n.events)) {
        for (const a of actions as ActionDef[]) {
          collectActionRNImport(a, rn);
        }
      }
    }
    for (const c of n.children) walk(c);
  };
  walk(node);
  return rn;
}

function collectActionRNImport(a: ActionDef, rn: Set<string>) {
  const p = a.payload as any;
  switch (a.type as string) {
    case "alert":
    case "toast":      rn.add("Alert"); break;
    case "share":      rn.add("Share"); break;
    case "openURL":    rn.add("Linking"); break;
    case "conditional":
      if (Array.isArray(p.then)) (p.then as ActionDef[]).forEach(a2 => collectActionRNImport(a2, rn));
      if (Array.isArray(p.else)) (p.else as ActionDef[]).forEach(a2 => collectActionRNImport(a2, rn));
      break;
    case "loop":
      if (Array.isArray(p.body)) (p.body as ActionDef[]).forEach(a2 => collectActionRNImport(a2, rn));
      break;
    case "parallel":
      if (Array.isArray(p.lanes)) (p.lanes as ActionDef[][]).forEach(lane => lane.forEach(a2 => collectActionRNImport(a2, rn)));
      if (p.join?.onComplete) (p.join.onComplete as ActionDef[]).forEach(a2 => collectActionRNImport(a2, rn));
      if (p.join?.onTimeout) (p.join.onTimeout as ActionDef[]).forEach(a2 => collectActionRNImport(a2, rn));
      break;
  }
}

function hasNavigateAction(node: TreeNode): boolean {
  return hasActionType(node, "navigate");
}

/**
 * Collect all query names needed by this page.
 *
 * Sources:
 * 1. callApi actions → resolve query ID to normalized name
 * 2. repeatBinding.source → "$query.jpUsersData" → "jpUsers"
 * 3. bindings/conditionalRender/repeatBinding that reference $query.*
 *
 * Returns a Map<normalizedName, { autoFetch: boolean }> so the hook knows
 * whether to call useEffect on mount or just expose the refetch function.
 */
function collectApiCalls(
  node: TreeNode,
  out: Map<string, { autoFetch: boolean }>,
  queries?: DataQuery[]
): void {
  // callApi events
  if (node.events) {
    for (const actions of Object.values(node.events)) {
      for (const a of actions as ActionDef[]) {
        if (a.type === "callApi" && a.payload.queryName) {
          const raw = String(a.payload.queryName);
          const query = queries?.find(q => q.id === raw || q.name === raw);
          const name = normalizeQueryName(query ? query.name : raw);
          if (name && !out.has(name)) out.set(name, { autoFetch: false });
        }
      }
    }
  }

  // repeatBinding.source → "$query.jpUsersData" → jpUsers (auto-fetch)
  if (node.repeatBinding?.source?.startsWith("$query.")) {
    const varName = node.repeatBinding.source.slice(7); // "jpUsersData"
    const baseName = varName.endsWith("Data") ? varName.slice(0, -4) : varName; // "jpUsers"
    // Find the matching query to get its real normalized name
    const query = queries?.find(q => normalizeQueryName(q.name) === baseName || q.name === baseName);
    const name = query ? normalizeQueryName(query.name) : baseName;
    if (name) out.set(name, { autoFetch: true }); // always auto-fetch for repeat sources
  }

  // bindings that reference $query.*
  if (node.bindings) {
    for (const expr of Object.values(node.bindings)) {
      if (expr?.startsWith("$query.")) {
        const varName = expr.slice(7).split(".")[0]; // "jpUsersData" or "jpUsersData[0]"
        const baseName = varName.endsWith("Data") ? varName.slice(0, -4) : varName;
        const query = queries?.find(q => normalizeQueryName(q.name) === baseName);
        const name = query ? normalizeQueryName(query.name) : baseName;
        if (name && !out.has(name)) out.set(name, { autoFetch: false });
      }
    }
  }

  // bindings that reference $state.alias where alias matches a DataQuery alias
  if (node.bindings) {
    for (const expr of Object.values(node.bindings)) {
      if (expr?.startsWith("$state.")) {
        const alias = expr.slice(7).split(".")[0]; // e.g. "users" from "$state.users.name"
        const query = queries?.find(q => q.alias === alias);
        if (query) {
          const name = normalizeQueryName(query.name);
          if (name && !out.has(name)) out.set(name, { autoFetch: query.autoFetch ?? false });
        }
      }
    }
  }

  // repeatBinding.source → "$state.alias" where alias matches a DataQuery alias
  if (node.repeatBinding?.source?.startsWith("$state.")) {
    const alias = node.repeatBinding.source.slice(7).split(".")[0];
    const query = queries?.find(q => q.alias === alias);
    if (query) {
      const name = normalizeQueryName(query.name);
      // repeatBinding via $state always needs auto-fetch — same as $query.*
      if (name) out.set(name, { autoFetch: true });
    }
  }

  // conditionalRender expression
  if (node.conditionalRender?.expression?.startsWith("$query.")) {
    const varName = node.conditionalRender.expression.slice(7).split(".")[0];
    const baseName = varName.endsWith("Data") ? varName.slice(0, -4) : varName;
    if (baseName && !out.has(baseName)) out.set(baseName, { autoFetch: false });
  }

  for (const c of node.children) collectApiCalls(c, out, queries);
}

function collectAnimations(node: TreeNode, list: { id: string; config: AnimationConfig }[]): void {
  if (node.animation?.preset !== "none") list.push({ id: node.id, config: node.animation! });
  for (const c of node.children) collectAnimations(c, list);
}

function collectStyles(node: TreeNode, map: Map<string, Record<string, unknown>>): void {
  const styles = (node as any).styles as Record<string, unknown> | undefined;
  if (styles) {
    const filtered = Object.fromEntries(Object.entries(styles).filter(([, v]) => v != null));
    if (Object.keys(filtered).length > 0) map.set(node.id, filtered);
  }
  for (const c of node.children) collectStyles(c, map);
}

/** Collect all state keys that need to be declared */
function collectStateKeys(
  node: TreeNode,
  pageState: PageState[],
  out: Map<string, { type: string; default: string }>,
  queries?: DataQuery[]
): void {
  for (const ps of pageState) {
    out.set(ps.name, { type: ps.type, default: stateDefaultLiteral(ps) });
  }
  // Add state vars from query aliases (autoFetch queries store response in $state.alias)
  if (queries) {
    for (const q of queries) {
      if (q.alias && !out.has(q.alias)) {
        // Determine the type based on the query method and known response shape
        // GET queries typically return arrays, POST/PUT return objects
        const isArrayResponse = q.method === 'GET';
        out.set(q.alias, {
          type: isArrayResponse ? 'any[]' : 'any',
          default: isArrayResponse ? '[]' : 'null',
        });
      }
    }
  }
  const walk = (n: TreeNode) => {
    if (n.events) {
      for (const actions of Object.values(n.events)) {
        for (const a of actions as ActionDef[]) {
          const p = a.payload as any;
          if (a.type === "setState" && p.key) {
            const key = String(p.key).replace(/[^a-zA-Z0-9_]/g, "");
            if (key && !out.has(key)) out.set(key, { type: "any", default: "null" });
          }
          if ((a.type === "openModal" || a.type === "closeModal") && p.name) {
            const name = String(p.name).replace(/[^a-zA-Z0-9_]/g, "");
            if (name) {
              const showKey = `show${capitalize(name)}`;
              if (!out.has(showKey)) out.set(showKey, { type: "boolean", default: "false" });
            }
          }
          if (a.type === "callApi" && p.storeResponseAs) {
            const key = String(p.storeResponseAs).replace(/[^a-zA-Z0-9_]/g, "");
            if (key && !out.has(key)) out.set(key, { type: "any", default: "null" });
          }
          // transform / compute store results
          if (((a.type as string) === "transform" || (a.type as string) === "compute") && p.storeAs) {
            const key = String(p.storeAs).replace(/[^a-zA-Z0-9_]/g, "");
            if (key && !out.has(key)) out.set(key, { type: "any", default: "null" });
          }
          // incrementState / toggleState / mergeState / resetState / setGlobalState
          if (["incrementState","toggleState","mergeState","resetState"].includes(a.type as string) && p.key) {
            const key = String(p.key).replace(/[^a-zA-Z0-9_]/g, "");
            if (key && !out.has(key)) out.set(key, { type: "any", default: "null" });
          }
          // parallel lanes + join callbacks
          if ((a.type as string) === "parallel") {
            const lanes: ActionDef[][] = Array.isArray(p.lanes) ? p.lanes : [];
            const join = p.join as { onComplete?: ActionDef[]; onTimeout?: ActionDef[] } | undefined;
            const walkActions = (acts: ActionDef[]) => acts.forEach(la => {
              const lp = la.payload as any;
              if (la.type === "setState" && lp.key) {
                const k = String(lp.key).replace(/[^a-zA-Z0-9_]/g, "");
                if (k && !out.has(k)) out.set(k, { type: "any", default: "null" });
              }
            });
            lanes.forEach(lane => walkActions(lane));
            if (join?.onComplete) walkActions(join.onComplete);
            if (join?.onTimeout) walkActions(join.onTimeout);
          }
          // conditional branches
          if ((a.type as string) === "conditional") {
            const walkBranch = (acts: ActionDef[]) => acts.forEach(ba => {
              const bp = ba.payload as any;
              if (ba.type === "setState" && bp.key) {
                const k = String(bp.key).replace(/[^a-zA-Z0-9_]/g, "");
                if (k && !out.has(k)) out.set(k, { type: "any", default: "null" });
              }
            });
            if (Array.isArray(p.then)) walkBranch(p.then);
            if (Array.isArray(p.else)) walkBranch(p.else);
          }
        }
      }
    }
    for (const c of n.children) walk(c);
  };
  walk(node);
}

function stateDefaultLiteral(ps: PageState): string {
  if (ps.default != null) return JSON.stringify(ps.default);
  switch (ps.type) {
    case "string":  return '""';
    case "number":  return "0";
    case "boolean": return "false";
    case "object":  return "{}";
    case "array":   return "[]";
    default:        return "null";
  }
}

/** Derive handler name from node + event */
function getHandlerName(node: TreeNode, eventName: string): string {
  const comp = node.registryId.replace(/[^a-zA-Z0-9]/g, "");
  const ev   = eventName.replace(/^on/, "");
  return `handle${comp}${capitalize(ev)}`;
}

/** Returns true if any action in the list requires async/await */
function isAsyncAction(a: ActionDef): boolean {
  const p = a.payload as any;
  const type = a.type as string;
  if (["callApi", "callCustomFn", "delay", "loop", "parallel"].includes(type)) return true;
  if (type === "conditional") {
    const thenAsync = Array.isArray(p.then) && (p.then as ActionDef[]).some(isAsyncAction);
    const elseAsync = Array.isArray(p.else) && (p.else as ActionDef[]).some(isAsyncAction);
    return thenAsync || elseAsync;
  }
  return false;
}

/** Collect all handlers: handlerName → { body, itemVar } */
function collectHandlers(
  node: TreeNode,
  out: Map<string, { body: string[]; itemVar?: string }>,
  deps: { needsRouter: boolean; apiCalls: Set<string> },
  stateKeys?: Map<string, { type: string; default: string }>,
  itemVar?: string
): void {
  if (node.events) {
    for (const [ev, actions] of Object.entries(node.events)) {
      if ((actions as ActionDef[]).length > 0) {
        const name = getHandlerName(node, ev);
        const body = (actions as ActionDef[]).map(a => `    ${renderAction(a, stateKeys, itemVar)}`).filter(Boolean);
        // Mark as async if any action needs it
        const needsAsync = (actions as ActionDef[]).some(isAsyncAction);
        if (needsAsync && body.length > 0 && !body[0].includes("__async__")) {
          body.unshift("    // __async__");
        }
        out.set(name, { body, itemVar });
      }
    }
  }
  // Propagate itemVar into repeat children so handlers inside maps resolve item fields correctly
  const childItemVar = node.repeatBinding
    ? (node.repeatBinding.itemVar || deriveItemVar(node.repeatBinding.source))
    : itemVar;
  for (const c of node.children) collectHandlers(c, out, deps, stateKeys, childItemVar);
}

// ---------------------------------------------------------------------------
// JSX rendering
// ---------------------------------------------------------------------------

function serializeProp(key: string, value: unknown): string {
  if (typeof value === "string") {
    if (value.startsWith("$")) {
      const [group, token] = value.slice(1).split(".");
      const tokenMap: Record<string, string> = {
        spacing: "spacing", radii: "radii", shadow: "shadows", fontSize: "fontSizes",
        fontWeight: "fontWeights", lineHeight: "lineHeights", opacity: "opacity",
        duration: "durations", zIndex: "zIndices", color: "colors",
      };
      // Design tokens
      if (group === "theme") return `${key}={theme.${token}}`;
      if (tokenMap[group]) return `${key}={${tokenMap[group]}[${JSON.stringify(token)}]}`;
      // All other $ expressions ($state.*, $global.*, $nav.*, $device.*, etc.)
      const resolved = resolveForCodegen(value);
      return `${key}={${resolved}}`;
    }
    return `${key}="${value}"`;
  }
  if (typeof value === "number")  return `${key}={${value}}`;
  if (typeof value === "boolean") return value ? key : `${key}={false}`;
  if (Array.isArray(value))       return `${key}={${JSON.stringify(value)}}`;
  if (typeof value === "object" && value !== null) return `${key}={${JSON.stringify(value)}}`;
  return "";
}

function serializeStyleObject(styles: Record<string, unknown>): string {
  const parts = Object.entries(styles)
    .filter(([, v]) => v != null)
    .map(([k, v]) => {
      if (typeof v === "string" && v.startsWith("$")) {
        const [group, token] = v.slice(1).split(".");
        if (group === "theme") return `${k}: theme.${token}`;
        const map: Record<string, string> = { spacing: "spacing", radii: "radii", fontSize: "fontSizes", fontWeight: "fontWeights", opacity: "opacity" };
        if (map[group]) return `${k}: ${map[group]}[${JSON.stringify(token)}]`;
        // All other $ expressions in styles
        return `${k}: ${resolveForCodegen(v)}`;
      }
      return typeof v === "string" ? `${k}: ${JSON.stringify(v)}` : `${k}: ${v}`;
    });
  return `{ ${parts.join(", ")} }`;
}

/** Derive a clean camelCase itemVar from a source expression, e.g. "$query.getUsersData" → "user" */
function deriveItemVar(source: string): string {
  // Try to extract a meaningful name from the source
  // "$query.getUsersData" → "getUsersData" → strip "get"/"Data" → "users" → singular "user"
  const raw = source.replace(/^\$query\./, "").replace(/^\$state\./, "").replace(/Data$/, "");
  const name = raw.replace(/^get/, "").replace(/[^a-zA-Z0-9]/g, "");
  if (!name) return "item";
  // Singularize naively: "users" → "user", "posts" → "post"
  const lower = name.charAt(0).toLowerCase() + name.slice(1);
  if (lower.endsWith("ies")) return lower.slice(0, -3) + "y";
  if (lower.endsWith("s") && lower.length > 2) return lower.slice(0, -1);
  return lower;
}

/**
 * Build secondary array slot props for items-mode layouts with multiple array slots.
 * e.g. FlipLayout has `items` (primary) + `backContent` (secondary, kind: "named-array").
 * Reads `node.slotBindings[slotProp]` to determine STATIC / TEMPLATE / DATA mode.
 * Returns a string like ` backContent={[...]}` or ` backContent={source.map(...)}`.
 */
function buildSecondaryArraySlotProps(
  namedSlotChildren: TreeNode[],
  slotCfg: SlotConfig,
  indent: number,
  pad: string,
  handlerMap: Map<string, { body: string[]; itemVar?: string }>,
  styleMap: Map<string, Record<string, unknown>> | undefined,
  itemVar: string | undefined,
  stateKeys: Map<string, { type: string; default: string }> | undefined,
  node?: TreeNode,
): string {
  if (!slotCfg.secondaryArraySlots?.length) return "";
  const parts: string[] = [];
  for (const secondarySlot of slotCfg.secondaryArraySlots) {
    const slotChildren = namedSlotChildren.filter(c => c.slotName === secondarySlot.prop);
    const slotBinding = node?.slotBindings?.[secondarySlot.prop];

    if (slotBinding && slotBinding.mode !== 'static' && slotBinding.source) {
      const { source, keyProp = 'id', itemVar: explicitVar } = slotBinding;
      const loopVar = explicitVar || deriveItemVar(source);
      const keyExpr = `${loopVar}.${keyProp}`;
      const resolvedSource = resolveExpression(source);
      const templateChild = slotChildren[0];

      if (templateChild) {
        const childJsx = renderNode(templateChild, indent + 2, handlerMap, styleMap, loopVar, stateKeys, keyExpr);
        parts.push(` ${secondarySlot.prop}={${resolvedSource}.map((${loopVar}) => (\n${childJsx}\n${pad}))}`);
      } else {
        parts.push(` ${secondarySlot.prop}={[]}`);
      }
    } else if (slotChildren.length === 0) {
      parts.push(` ${secondarySlot.prop}={[]}`);
    } else {
      const renderedItems = slotChildren.map(c => renderNode(c, indent + 2, handlerMap, styleMap, itemVar, stateKeys)).join(",\n");
      parts.push(` ${secondarySlot.prop}={[\n${renderedItems}\n${pad}]}`);
    }
  }
  return parts.join("");
}

function renderNode(
  node: TreeNode,
  indent: number,
  handlerMap: Map<string, { body: string[]; itemVar?: string }>,
  styleMap?: Map<string, Record<string, unknown>>,
  itemVar?: string,
  stateKeys?: Map<string, { type: string; default: string }>,
  keyExpr?: string
): string {
  const pad = "  ".repeat(indent);

  if (node.kind === "text") return `${pad}<Text>${node.props.text ?? ""}</Text>`;

  const tag = node.registryId;
  const mergedProps = { ...node.props };
  if (node.bindings) {
    for (const [k, expr] of Object.entries(node.bindings)) {
      if (expr) mergedProps[k] = `__BIND__${expr}`;
    }
  }
  const propsArr = Object.entries(mergedProps)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      if (typeof v === "string" && v.startsWith("__BIND__")) {
        const expr = v.slice(8);
        const resolved = expr.startsWith('$node.') ? resolveNodeForCodegen(expr, stateKeys) : resolveExpression(expr, itemVar);
        return `${k}={${resolved}}`;
      }
      return serializeProp(k, v);
    })
    .filter(Boolean);

  // Inject key prop first — avoids regex-based post-injection which breaks on arrow functions
  if (keyExpr) propsArr.unshift(`key={${keyExpr}}`);

  // Wire event handlers
  if (node.events) {
    for (const [ev, actions] of Object.entries(node.events)) {
      if ((actions as ActionDef[]).length > 0) {
        const handlerName = getHandlerName(node, ev);
        // Inside a repeat context, pass the item variable so the handler can use item fields
        if (itemVar) {
          propsArr.push(`${ev}={() => ${handlerName}(${itemVar})}`);
        } else {
          propsArr.push(`${ev}={${handlerName}}`);
        }
      }
    }
  }

  // Named slot children as props — handled below after slot config detection
  // (moved down so we can correctly split primary items slot vs secondary/named slots)

  // Detect if this node is a multi-item layout (mode: 'items') — if so, pass items as prop
  // Only layouts have array slots; ComponentMeta/BlockMeta don't have slots
  const layoutMeta = getLayoutMeta(node.registryId);
  const slotCfg = deriveSlotConfig(layoutMeta?.slots as any);
  const isItemsMode = slotCfg.mode === 'items';
  const itemsPropName = slotCfg.itemsProp ?? 'items';

  // Collect all array-slot prop names so we can strip them from propsArr
  // (prevents duplicate props when stale values are stored on node.props)
  const arraySlotPropNames = new Set<string>();
  if (isItemsMode) {
    arraySlotPropNames.add(itemsPropName);
    for (const s of slotCfg.secondaryArraySlots ?? []) arraySlotPropNames.add(s.prop);
  }

  // Named slot children as props — for mode:'named', or secondary array slots in mode:'items'
  // Primary items-slot children (slotName === itemsPropName or no slotName) go into jsxChildren
  const namedSlotChildren = node.children.filter(c => {
    if (!c.slotName || c.slotName === 'children') return false;
    if (isItemsMode && c.slotName === itemsPropName) return false; // primary slot → jsxChildren
    return true;
  });
  const jsxChildren = node.children.filter(c =>
    !c.slotName || c.slotName === 'children' || (isItemsMode && c.slotName === itemsPropName)
  );

  // Render named slot children as JSX props
  for (const sc of namedSlotChildren) {
    if (isItemsMode && slotCfg.secondaryArraySlots?.some(s => s.prop === sc.slotName)) {
      // Secondary array slot — will be rendered as an array prop below
      continue;
    }
    // Check if this named slot is a named-array (kind: "named-array") — render as array prop
    const slotDef = layoutMeta?.slots?.find((s: any) => s.name === sc.slotName);
    const isNamedArray = slotDef?.kind === 'named-array' || (slotDef?.kind === undefined && slotDef?.array === true);
    if (isNamedArray) {
      // Collect all children for this named-array slot and render as array
      // (handled in the named-array batch below — skip individual rendering here)
      continue;
    }
    propsArr.push(`${sc.slotName}={(
${renderNode(sc, indent + 1, handlerMap, styleMap, itemVar, stateKeys)}
${pad})}`);
  }

  // Render named-array slot children as array props (for mode:'named' layouts like blocks)
  if (!isItemsMode) {
    const namedArraySlotNames = new Set(
      (layoutMeta?.slots ?? [])
        .filter((s: any) => s.kind === 'named-array' || (s.kind === undefined && s.array === true))
        .map((s: any) => s.name)
    );
    for (const slotName of namedArraySlotNames) {
      const slotChildren = namedSlotChildren.filter(c => c.slotName === slotName);
      const slotBinding = node.slotBindings?.[slotName];

      if (slotBinding && slotBinding.mode !== 'static' && slotBinding.source) {
        // TEMPLATE or DATA mode for this named-array slot
        const { source, keyProp = 'id', itemVar: explicitVar } = slotBinding;
        const loopVar = explicitVar || deriveItemVar(source);
        const keyExpr = `${loopVar}.${keyProp}`;
        const resolvedSource = resolveExpression(source);

        if (slotBinding.mode === 'template' && slotChildren.length > 0) {
          const templateChild = slotChildren[0];
          const childJsx = renderNode(templateChild, indent + 2, handlerMap, styleMap, loopVar, stateKeys, keyExpr);
          propsArr.push(`${slotName}={${resolvedSource}.map((${loopVar}) => (\n${childJsx}\n${pad}))}`);
        } else if (slotBinding.mode === 'data' && slotChildren.length > 0) {
          const templateChild = slotChildren[0];
          const childJsx = renderNode(templateChild, indent + 2, handlerMap, styleMap, loopVar, stateKeys, keyExpr);
          propsArr.push(`${slotName}={${resolvedSource}.map((${loopVar}) => (\n${childJsx}\n${pad}))}`);
        } else {
          // Fallback: static array
          if (slotChildren.length === 0) {
            propsArr.push(`${slotName}={[]}`);
          } else {
            const renderedItems = slotChildren.map(c => renderNode(c, indent + 2, handlerMap, styleMap, itemVar, stateKeys)).join(',\n');
            propsArr.push(`${slotName}={[\n${renderedItems}\n${pad}]}`);
          }
        }
      } else {
        // STATIC mode
        if (slotChildren.length === 0) {
          propsArr.push(`${slotName}={[]}`);
        } else {
          const renderedItems = slotChildren.map(c => renderNode(c, indent + 2, handlerMap, styleMap, itemVar, stateKeys)).join(',\n');
          propsArr.push(`${slotName}={[\n${renderedItems}\n${pad}]}`);
        }
      }
    }
  }

  // Strip any array-slot prop names from propsArr to prevent duplicates
  // (stale values stored on node.props must not collide with slot-generated props)
  const filteredPropsArr = isItemsMode
    ? propsArr.filter(p => !arraySlotPropNames.has(p.split('=')[0].split('{')[0].trim()))
    : propsArr;

  const propsStr = filteredPropsArr.join(" ");
  const styleKey = styleMap?.has(node.id) ? `s_${node.id.replace(/[^a-zA-Z0-9]/g, "_")}` : null;
  const styleStr = styleKey ? ` style={styles.${styleKey}}` : "";
  const opening = propsStr ? `${tag} ${propsStr}${styleStr}` : `${tag}${styleStr}`;

  let jsx: string;
  if (jsxChildren.length === 0) {
    // empty case — items-mode nodes must emit items={[]} not a bare self-closing tag
    if (isItemsMode) {
      const secondaryProps = buildSecondaryArraySlotProps(namedSlotChildren, slotCfg, indent, pad, handlerMap, styleMap, itemVar, stateKeys, node);
      jsx = `${pad}<${opening} ${itemsPropName}={[]}${secondaryProps} />`;
    } else {
      jsx = `${pad}<${opening} />`;
    }
  } else {
    // Handle repeatBinding: map children instead of wrapping parent
    if (node.repeatBinding) {
      const { source, keyProp = "id" } = node.repeatBinding;
      const loopVar = node.repeatBinding.itemVar || deriveItemVar(source);
      const keyExpr = `${loopVar}.${keyProp}`;
      const resolvedSource = resolveExpression(source);
      
      // Render children with the loop variable in context, wrapped in map
      const mappedChildren = jsxChildren.map((child, idx) => {
        // Pass keyExpr only to the first child — it becomes the React key prop
        return renderNode(child, indent + 2, handlerMap, styleMap, loopVar, stateKeys, idx === 0 ? keyExpr : undefined);
      }).join("\n");
      
      const childrenStr = `${pad}  {${resolvedSource}.map((${loopVar}) => (\n${mappedChildren}\n${pad}  ))}`;
      // Task 4.2 (DATA mode): layout has repeatBinding + isItemsMode → items={source.map(...)}
      if (isItemsMode) {
        const mapExpr = `{${resolvedSource}.map((${loopVar}) => (\n${mappedChildren}\n${pad}))}`;
        const secondaryProps = buildSecondaryArraySlotProps(namedSlotChildren, slotCfg, indent, pad, handlerMap, styleMap, itemVar, stateKeys, node);
        const openingWithItems = `${opening} ${itemsPropName}=${mapExpr}${secondaryProps}`;
        jsx = `${pad}<${openingWithItems} />`;
      } else {
        jsx = `${pad}<${opening}>\n${childrenStr}\n${pad}</${tag}>`;
      }
    } else {
      if (isItemsMode) {
        // Task 4.3 (TEMPLATE mode): single child with repeatBinding → items={childSource.map(...)}
        const templateChild = jsxChildren.length === 1 ? jsxChildren[0] : null;
        if (templateChild?.repeatBinding) {
          const { source, keyProp = "id" } = templateChild.repeatBinding;
          const loopVar = templateChild.repeatBinding.itemVar || deriveItemVar(source);
          const keyExpr = `${loopVar}.${keyProp}`;
          const resolvedSource = resolveExpression(source);
          const childJsx = renderNode(templateChild, indent + 2, handlerMap, styleMap, loopVar, stateKeys, keyExpr);
          const mapExpr = `{${resolvedSource}.map((${loopVar}) => (\n${childJsx}\n${pad}))}`;
          const secondaryProps = buildSecondaryArraySlotProps(namedSlotChildren, slotCfg, indent, pad, handlerMap, styleMap, itemVar, stateKeys, node);
          jsx = `${pad}<${opening} ${itemsPropName}=${mapExpr}${secondaryProps} />`;
        } else {
          // STATIC mode: N children, no repeatBinding → items={[<C1 />, <C2 />, ...]}
          const renderedItems = jsxChildren.map(c => renderNode(c, indent + 2, handlerMap, styleMap, itemVar, stateKeys)).join(",\n");
          const itemsExpr = `{[\n${renderedItems}\n${pad}]}`;
          const secondaryProps = buildSecondaryArraySlotProps(namedSlotChildren, slotCfg, indent, pad, handlerMap, styleMap, itemVar, stateKeys, node);
          jsx = `${pad}<${opening} ${itemsPropName}=${itemsExpr}${secondaryProps} />`;
        }
      } else {
        const childrenStr = jsxChildren.map(c => renderNode(c, indent + 1, handlerMap, styleMap, itemVar, stateKeys)).join("\n");
        jsx = `${pad}<${opening}>\n${childrenStr}\n${pad}</${tag}>`;
      }
    }
  }

  // Remove the old repeatBinding block that wrapped the parent
  // (the logic above now handles this inside children rendering)

  if (node.conditionalRender) {
    const { expression, mode } = node.conditionalRender;
    const expr = expression.startsWith('$node.') ? resolveNodeForCodegen(expression, stateKeys) : resolveExpression(expression, itemVar);
    jsx = mode === "show"
      ? `${pad}{${expr} && (\n${jsx}\n${pad})}`
      : `${pad}{!${expr} && (\n${jsx}\n${pad})}`;
  }

  return jsx;
}

function renderImports(c: ImportCollector): string {
  const lines = [`import React from "react";`];
  for (const [source, names] of c.imports) {
    const sorted = Array.from(names).sort();
    const stars  = sorted.filter(n => n.startsWith("* as "));
    const named  = sorted.filter(n => !n.startsWith("* as "));
    for (const s of stars) lines.push(`import ${s} from "${source}";`);
    if (named.length > 0) lines.push(`import { ${named.join(", ")} } from "${source}";`);
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Public: generatePageCode
// ---------------------------------------------------------------------------

export function generatePageCode(page: PageDocument, queries?: DataQuery[]): string {
  const { componentName, hookName } = deriveScreenNames(page.name);

  const collector: ImportCollector = { imports: new Map() };
  collectImports(page.root, collector);

  const stateKeys = new Map<string, { type: string; default: string }>();
  collectStateKeys(page.root, page.state || [], stateKeys, queries);

  const apiCalls = new Map<string, { autoFetch: boolean }>();
  collectApiCalls(page.root, apiCalls, queries);

  const handlers = new Map<string, { body: string[]; itemVar?: string }>();
  collectHandlers(page.root, handlers, { needsRouter: hasNavigateAction(page.root), apiCalls: new Set(apiCalls.keys()) }, stateKeys);

  const styleMap = new Map<string, Record<string, unknown>>();
  collectStyles(page.root, styleMap);
  const useStyleSheet = styleMap.size > 0;

  if (useStyleSheet) addImport(collector, "react-native", "StyleSheet");

  const body = renderNode(page.root, 2, handlers, useStyleSheet ? styleMap : undefined, undefined, stateKeys);

  let styleBlock = "";
  if (useStyleSheet) {
    const entries = Array.from(styleMap.entries()).map(([id, styles]) => {
      const key = `s_${id.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const parts = Object.entries(styles).map(([k, v]) =>
        typeof v === "string" ? `${k}: ${JSON.stringify(v)}` : `${k}: ${v}`
      );
      return `  ${key}: { ${parts.join(", ")} }`;
    });
    styleBlock = `\nconst styles = StyleSheet.create({\n${entries.join(",\n")}\n});\n`;
  }

  const destructured = [
    ...stateKeys.keys(),
    ...Array.from(apiCalls.keys()).flatMap(q => [`${q}Data`, `${q}Loading`, `${q}Error`, `refetch${capitalize(q)}`]),
    ...handlers.keys(),
  ].join(", ");

  return `${renderImports(collector)}
import { ${hookName} } from "./${componentName}.hook";

export default function ${componentName}() {
  const { ${destructured} } = ${hookName}();

  return (
${body}
);
}
${styleBlock}`;
}

// ---------------------------------------------------------------------------
// Public: generatePageHook
// ---------------------------------------------------------------------------

// Check if a page tree uses $global.* expressions anywhere
function checkUsesGlobal(node: TreeNode): boolean {
const check = (expr?: string) => expr?.startsWith('$global.');
if (node.bindings && Object.values(node.bindings).some(check)) return true;
if (check(node.conditionalRender?.expression)) return true;
if (check(node.repeatBinding?.source)) return true;
if (node.events) {
for (const acts of Object.values(node.events)) {
for (const a of acts as ActionDef[]) {
if (a.type === 'setState' && check(String(a.payload.value || ''))) return true;
if (a.type === 'callApi' && a.payload.body) {
for (const v of Object.values(a.payload.body as Record<string, string>)) {
if (check(v)) return true;
}
}
}
}
}
return node.children.some(checkUsesGlobal);
}

export function generatePageHook(page: PageDocument, queries?: DataQuery[], hookDir?: string): string {
const { hookName } = deriveScreenNames(page.name, page.route);
const needsRouter = hasNavigateAction(page.root);
const usesGlobal = checkUsesGlobal(page.root);

const stateKeys = new Map<string, { type: string; default: string }>();
collectStateKeys(page.root, page.state || [], stateKeys, queries);

const apiCalls = new Map<string, { autoFetch: boolean }>();
collectApiCalls(page.root, apiCalls, queries);

const handlers = new Map<string, { body: string[]; itemVar?: string }>();
collectHandlers(page.root, handlers, { needsRouter, apiCalls: new Set(apiCalls.keys()) }, stateKeys);

const depth = hookDir ? hookDir.split("/").filter(Boolean).length : 1;
const relativeToControllers = "../".repeat(depth) + "controllers";
const relativeToProviders = "../".repeat(depth) + "app/providers";

const handlerDeps = (body: string[]): string => {
const deps: string[] = [];
if (needsRouter && body.some(l => l.includes("router."))) deps.push("router");
for (const qName of apiCalls.keys()) {
if (body.some(l => l.includes(`refetch${capitalize(qName)}`))) deps.push(`refetch${capitalize(qName)}`);
}
if (usesGlobal) deps.push("globalState");
return deps.join(", ");
};
const needsEffect = Array.from(apiCalls.values()).some(v => v.autoFetch) || Array.from(apiCalls.entries()).some(([qName]) => {
  const query = queries?.find(q => normalizeQueryName(q.name) === qName);
  return query?.alias && stateKeys.has(query.alias);
});
const reactHooks = ["useState", "useCallback"];
if (needsEffect) reactHooks.push("useEffect");const imports: string[] = [`import { ${reactHooks.join(", ")} } from "react";`];
if (needsRouter) imports.push(`import { useRouter } from "expo-router";`);
if (usesGlobal) imports.push(`import { useGlobalState } from "${relativeToProviders}/GlobalStateProvider";`);

// React Native named imports needed by action handlers
const rnImports = collectHookRNImports(page.root);
if (rnImports.size > 0) {
  imports.push(`import { ${[...rnImports].sort().join(", ")} } from "react-native";`);
}

for (const qName of apiCalls.keys()) {
imports.push(`import { use${capitalize(qName)} } from "${relativeToControllers}/${qName}.controller";`);
}

const stateLines = Array.from(stateKeys.entries()).map(
([k, v]) => `  const [${k}, set${capitalize(k)}] = useState<${v.type === "any" ? "any" : v.type}>(${v.default});`
);

// Query hook lines — auto-fetch queries use useEffect, others just expose refetch
const queryLines = Array.from(apiCalls.entries()).map(([qName]) => {
return `  const { data: ${qName}Data, loading: ${qName}Loading, error: ${qName}Error, refetch: refetch${capitalize(qName)} } = use${capitalize(qName)}();`;
});

// For auto-fetch queries, add a useEffect call
const autoFetchEffects = Array.from(apiCalls.entries())
.filter(([, { autoFetch }]) => autoFetch)
.map(([qName]) => `  useEffect(() => { refetch${capitalize(qName)}(); }, []);`);

// For queries whose alias matches a state key, sync data → state when data arrives
// e.g. jpUsersData → setJpUsers(jpUsersData) so the screen can use jpUsers.map(...)
const dataSyncEffects = Array.from(apiCalls.entries())
.filter(([qName]) => {
  const query = queries?.find(q => normalizeQueryName(q.name) === qName);
  return query?.alias && stateKeys.has(query.alias);
})
.map(([qName]) => {
  const query = queries!.find(q => normalizeQueryName(q.name) === qName)!;
  const alias = query.alias!;
  return `  useEffect(() => { if (${qName}Data !== null && ${qName}Data !== undefined) set${capitalize(alias)}(${qName}Data as any); }, [${qName}Data]);`;
});

const handlerLines = Array.from(handlers.entries()).map(([name, { body, itemVar: hItemVar }]) => {
const deps = handlerDeps(body);
const needsAsync = body.some(l => l.includes("__async__") || l.includes("await "));
const cleanBody = body.filter(l => !l.includes("// __async__"));
const asyncKw = needsAsync ? "async " : "";
// If this handler lives inside a repeat context, accept the item as a parameter
const param = hItemVar ? `${hItemVar}: any` : "";
return `  const ${name} = useCallback(${asyncKw}(${param}) => {\n${cleanBody.join("\n")}\n  }, [${deps}]);`;
});

const returnFields = [
...Array.from(stateKeys.keys()).flatMap(k => [`    ${k},`, `    set${capitalize(k)},`]),
...(usesGlobal ? ["    globalState,"] : []),
...Array.from(apiCalls.keys()).flatMap(q => [
`    ${q}Data,`,
`    ${q}Loading,`,
`    ${q}Error,`,
`    refetch${capitalize(q)},`,
]),
...Array.from(handlers.keys()).map(k => `    ${k},`),
];

const bodyLines = [
needsRouter ? "  const router = useRouter();" : "",
usesGlobal ? "  const globalState = useGlobalState();" : "",
...stateLines,
...(queryLines.length > 0 ? ["", ...queryLines] : []),
...(autoFetchEffects.length > 0 ? ["", ...autoFetchEffects] : []),
...(dataSyncEffects.length > 0 ? ["", ...dataSyncEffects] : []),
"",
...handlerLines,
"",
"  return {",
...returnFields,
"  };",
].filter(l => l !== undefined).join("\n");

  return `${imports.join("\n")}

export function ${hookName}() {
${bodyLines}
}
`;
}

