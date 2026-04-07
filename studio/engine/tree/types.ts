/**
 * Document Tree Types
 *
 * The tree is the central data structure of the builder.
 * A page is a tree of nodes. Each node references a registry item
 * (layout, component, or block) and carries its configured props.
 *
 * The tree is:
 * - Serializable to JSON (saved to disk, sent over WebSocket)
 * - Renderable to React Native code (via codegen)
 * - Renderable to a live preview (via the web preview engine)
 */

export type NodeKind = "layout" | "component" | "block" | "primitive" | "slot" | "text";

export interface TreeNode {
  id: string;
  kind: NodeKind;
  registryId: string;
  props: Record<string, unknown>;
  variant?: string;
  children: TreeNode[];
  slotName?: string;
  styles?: Record<string, unknown>;
  events?: Record<string, ActionDef[]>;
  bindings?: Record<string, string>;
  conditionalRender?: { expression: string; mode: "show" | "hide" };
  /**
   * repeatBinding — iterates an array and passes each item to children.
   * Used for the primary items slot (kind: "items") in DATA mode.
   * source:  expression pointing to an array, e.g. "$query.getUsersData"
   * keyProp: field used as React key, e.g. "id"
   * itemVar: internal codegen alias (auto-derived, not shown in UI)
   */
  repeatBinding?: { source: string; keyProp: string; itemVar?: string };
  /**
   * slotBindings — per-slot data source configuration for named-array slots.
   *
   * Keyed by slot prop name (e.g. "backContent", "social", "actions").
   * Each entry configures how that slot's array is populated:
   *
   * mode: "static"   — children are dropped manually (default, no binding needed)
   * mode: "template" — a single dropped child is repeated via source.map()
   * mode: "data"     — no dropped child; source.map() renders a template inline
   *
   * Example:
   *   slotBindings: {
   *     backContent: { mode: "data", source: "$state.backs", keyProp: "id" }
   *   }
   * → generates: backContent={backs.map((back) => (<BackCard key={back.id} />))}
   */
  slotBindings?: Record<string, {
    mode: "static" | "template" | "data";
    source?: string;
    keyProp?: string;
    itemVar?: string;
  }>;
  /**
   * dataContext — exposes a single object/value to all children.
   * Works like repeatBinding but for a single item (not a list).
   * Typically set when a callApi with storeResponseAs is on this node.
   *
   * source:  expression pointing to the data, e.g. "$state.user"
   * alias:   optional alias for children to reference it (default: last segment of source)
   *
   * Example: node has callApi(login, storeResponseAs: "user")
   *   → dataContext = { source: "$state.user", alias: "user" }
   *   → children can bind "name" → resolves to $state.user.name
   */
  dataContext?: { source: string; alias?: string };
  animation?: AnimationConfig;
}

export type AnimationPreset = "fadeIn" | "fadeOut" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleIn" | "scaleOut" | "bounce" | "rotate" | "pulse" | "none";
export type AnimationTrigger = "onMount" | "onPress" | "onVisible" | "onState";

export interface AnimationConfig {
  preset: AnimationPreset;
  trigger: AnimationTrigger;
  duration: number;
  delay: number;
  easing: "ease" | "linear" | "easeIn" | "easeOut" | "easeInOut" | "spring";
  stateExpression?: string;
}

export type ActionType = "navigate" | "setState" | "callApi" | "callCustomFn" | "openModal" | "closeModal" | "alert" | "toast" | "consoleLog" | "playSound" | "haptics" | "share" | "sendSMS" | "biometrics" | "getLocation" | "clipboard" | "openURL" | "custom";

/**
 * CustomFunction — a user-defined hook stored in the project.
 * Generated as hooks/use{name}.ts
 */
export interface CustomFunction {
  id: string;
  name: string;
  description: string;
  serviceId: string;
  template: string;
  params: { name: string; type: string; stateBinding: string; description: string }[];
  returnStateKey: string;
  returnType: 'object' | 'array' | 'string' | 'boolean' | 'void';
  errorStateKey: string;
  code: string;
}

export interface ActionDef {
  type: ActionType;
  payload: Record<string, unknown>;
}

/**
 * Extended callApi payload — supports dynamic body, response mapping, and error handling.
 *
 * Example for a login form:
 * {
 *   queryName: "login",
 *   body: { email: "$state.email", password: "$state.password" },
 *   onSuccess: [
 *     { type: "setState", payload: { key: "user", value: "$response" } },
 *     { type: "navigate", payload: { screen: "home" } }
 *   ],
 *   onError: [
 *     { type: "setState", payload: { key: "loginError", value: "$response.message" } }
 *   ]
 * }
 *
 * $response refers to the full response body.
 * $response.field accesses a specific field.
 */
export interface CallApiPayload {
  queryName: string;
  /** Dynamic body — values can be $state.x, $global.x, or literal strings */
  body?: Record<string, string>;
  /** Actions to run on success — can reference $response */
  onSuccess?: ActionDef[];
  /** Actions to run on error — can reference $response.message */
  onError?: ActionDef[];
  /** Store the full response in a state var directly */
  storeResponseAs?: string;
}

export interface PageState {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  default: unknown;
  scope: "page" | "app";
}

export interface PageDocument {
  id: string;
  /** Human-readable display name, e.g. "Home Screen" */
  name: string;
  /** URL-safe slug used as the file name and expo-router route, e.g. "home-screen" */
  route: string;
  root: TreeNode;
  state?: PageState[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDocument {
  name: string;
  version: string;
  theme: string;
  /** URL-safe slug used as the app identifier, e.g. "my-app" */
  slug?: string;
  /** Bundle identifier for native builds, e.g. "com.example.app" */
  bundleId?: string;
  /** Screen orientation: "portrait" | "landscape" | "default" */
  orientation?: string;
  /** Per-theme token overrides: { themeName: { tokenKey: value } } */
  themeOverrides?: Record<string, Record<string, string>>;
  pages: PageDocument[];
  services: ServiceConfig[];
  navigation: NavigationConfig;
  queries?: DataQuery[];
  customFunctions?: CustomFunction[];
  auth?: AuthConfig;
  capabilities?: NativeCapability[];
  deepLinking?: { scheme: string; prefixes: string[] };
  screenGroups?: ScreenGroup[];
  globalState?: GlobalStateVar[];
  constants?: AppConstant[];
  envVars?: EnvVar[];
  statusBar?: { style: string; hidden: boolean; translucent: boolean; backgroundColor?: string };
  tabBarConfig?: { backgroundColor?: string; activeTintColor?: string; inactiveTintColor?: string; showLabels?: boolean };
  drawerConfig?: DrawerConfig;
}

export interface DrawerConfig {
  backgroundColor?: string;
  activeTintColor?: string;
  inactiveTintColor?: string;
  drawerPosition?: 'left' | 'right';
}

export interface ScreenGroup {
  id: string;
  name: string;
  type: "tabs" | "stack" | "drawer" | "auth" | "protected" | "custom";
  screenIds: string[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export interface GlobalStateVar {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  default: unknown;
  persist?: "none" | "async" | "secure";
}

export interface AppConstant {
  key: string;
  value: string;
}

export interface EnvVar {
  key: string;
  value: string;
  secret?: boolean;
}

export interface DataQuery {
  id: string;
  name: string;
  serviceId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  params?: Record<string, unknown>;
  /** Request body for POST/PUT/PATCH — values can be $state.x expressions */
  body?: Record<string, string>;
  /** Response headers to include */
  headers?: Record<string, string>;
  transform?: string;
  autoFetch?: boolean;
  /**
   * alias — the state variable name where the response is stored.
   * When set, the response is automatically stored in $state.{alias}.
   * This is the ONLY way to access query data in bindings/repeat/conditional.
   *
   * Example: alias = "users" → response stored in $state.users
   *   → use $state.users in repeat source
   *   → use $state.users[0].name in bindings
   */
  alias?: string;
}

export interface ServiceConfig {
  id: string;
  type: "supabase" | "rest" | "graphql" | "firebase" | "custom";
  name: string;
  config: Record<string, unknown>;
}

export interface NavigationConfig {
  type: "stack" | "tabs" | "drawer";
  screens: NavigationScreen[];
}

export interface NavigationScreen {
  name: string;
  pageId: string;
  icon?: string;
  options?: Record<string, unknown>;
  route?: string;
  params?: string[];
  requireAuth?: boolean;
  transition?: "default" | "fade" | "slide" | "modal" | "none";
}

export interface AuthConfig {
  enabled: boolean;
  provider: "supabase" | "firebase" | "custom";
  serviceId?: string;
  loginScreen?: string;
  signupScreen?: string;
  redirectAfterLogin?: string;
}

export interface NativeCapability {
  id: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface StudioPlugin {
  id: string;
  name: string;
  version: string;
  components?: PluginComponent[];
  blocks?: PluginBlock[];
  panels?: PluginPanel[];
  codegenHooks?: PluginCodegenHook[];
}

export interface PluginComponent {
  id: string;
  label: string;
  description: string;
  category: string;
  props: Record<string, unknown>[];
  render: string;
}

export interface PluginBlock {
  id: string;
  label: string;
  description: string;
  category: string;
  slots: Record<string, unknown>[];
  props: Record<string, unknown>[];
}

export interface PluginPanel {
  id: string;
  label: string;
  position: "left" | "right" | "bottom";
  render: string;
}

export interface PluginCodegenHook {
  event: "beforeImports" | "afterImports" | "beforeReturn" | "afterComponent" | "projectFile";
  handler: string;
}
