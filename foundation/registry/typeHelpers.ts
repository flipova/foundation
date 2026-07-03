import { componentRegistry } from "./components";
import { layoutRegistry } from "./layouts";
import type { PropType, PropDescriptor } from "../types";
import type { SpacingToken } from "../tokens/spacing";
import type { RadiusToken } from "../tokens/radii";

type ResolvePropType<T extends PropType, Opts extends readonly string[] | undefined> =
  T extends "string" ? string :
  T extends "number" ? number :
  T extends "boolean" ? boolean :
  T extends "spacing" ? SpacingToken :
  T extends "radius" ? RadiusToken :
  T extends "shadow" ? string :
  T extends "color" ? string :
  T extends "background" ? string | string[] :
  T extends "padding" ? import("../types").LayoutPadding :
  T extends "enum" ? (Opts extends readonly string[] ? Opts[number] : string) :
  T extends "ratio" ? number :
  T extends "json" ? any :
  unknown;

type ExtractPropsFromArray<Props extends readonly PropDescriptor<any>[]> = {
  [P in Props[number] as P["name"]]?: ResolvePropType<P["type"], P["options"]>;
};

// --- COMPONENT PROPS ---
type ComponentRegistry = typeof componentRegistry;
export type ComponentIds = ComponentRegistry[number]["id"];

export type ExtractComponentProps<Id extends ComponentIds> = ExtractPropsFromArray<
  Extract<ComponentRegistry[number], { id: Id }>["props"]
>;

// --- LAYOUT PROPS ---
type LayoutRegistry = typeof layoutRegistry;
export type LayoutIds = LayoutRegistry[number]["id"];

export type ExtractLayoutProps<Id extends LayoutIds> = ExtractPropsFromArray<
  Extract<LayoutRegistry[number], { id: Id }>["props"]
>;
