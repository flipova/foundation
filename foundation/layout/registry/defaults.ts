/**
 * Helpers to extract and apply defaults and constants from any registry meta.
 * Works with LayoutMeta, ComponentMeta, and BlockMeta.
 */

import type { ColorScheme } from "../../theme/types";
import type { AnyMeta, LayoutConstants, LayoutMeta, VariantDescriptor } from "../types";

export function extractDefaults(meta: AnyMeta): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  for (const prop of meta.props) {
    if (prop.default !== undefined) {
      defaults[prop.name] = prop.default;
    }
  }
  return defaults;
}

export function resolveThemeDefaults(
  meta: AnyMeta,
  theme: ColorScheme,
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const prop of meta.props) {
    if (prop.themeDefault) {
      resolved[prop.name] = theme[prop.themeDefault as keyof ColorScheme] as string;
    }
  }
  return resolved;
}

export function applyDefaults<T extends object>(
  props: T,
  meta: AnyMeta,
  theme?: ColorScheme,
): T {
  const themeDefaults = theme ? resolveThemeDefaults(meta, theme) : {};
  const staticDefaults = extractDefaults(meta);
  const result = { ...themeDefaults, ...staticDefaults } as Record<string, unknown>;

  for (const key of Object.keys(props)) {
    const value = (props as Record<string, unknown>)[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result as T;
}

export function applyVariant<T extends object>(
  props: T,
  variant: VariantDescriptor,
): T {
  const result = { ...variant.overrides } as Record<string, unknown>;
  for (const key of Object.keys(props)) {
    const value = (props as Record<string, unknown>)[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}

export function getConstants(meta: LayoutMeta): LayoutConstants {
  return meta.constants ?? {};
}
