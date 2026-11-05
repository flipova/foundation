import { describe, expect, it } from 'vitest';
import { designTheme } from '../theme/design-theme';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindTokens from '../providers/gluestack/ui/gluestack-ui-provider/tokens.js';
import {
  badgeRecipe,
  buttonRecipe,
  cardRecipe,
  inputRecipe,
  resolveTheme,
  switchRecipe,
  textRecipe,
  themeIdFor,
  withAlpha,
} from './index';
import type { ButtonSize, ButtonVariant } from './types';

// config.ts imports nativewind (a React Native runtime): read the generated object literal as data instead
const gluestackColors: Record<string, Record<string, string>> = new Function(
  `return ${/export const colors = (\{[\s\S]*?\n\});/.exec(readFileSync(resolve(__dirname, '../providers/gluestack/ui/gluestack-ui-provider/config.ts'), 'utf8'))![1]}`,
)();

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const hexOf = (triplet: string) =>
  `#${triplet
    .split(' ')
    .map((n) => Number(n).toString(16).padStart(2, '0'))
    .join('')}`;

describe('one theme, several outputs', () => {
  it('design-theme.ts carries exactly the colours config.ts gives gluestack / Reusables (CSS variables)', () => {
    for (const [id, t] of Object.entries(designTheme.themes)) {
      const vars = (gluestackColors as Record<string, Record<string, string>>)[id];
      expect(vars, `theme ${id}`).toBeDefined();
      const fromVars = Object.fromEntries(Object.entries(vars).map(([k, v]) => [k.replace(/^--/, ''), hexOf(v)]));
      const fromTheme = Object.fromEntries(Object.entries(t.colors).map(([k, v]) => [kebab(k), v]));
      expect(fromTheme).toEqual(fromVars);
    }
  });

  it('the Tailwind scale (tokens.js) and the neutral scale agree', () => {
    const tw = tailwindTokens.theme as Record<string, Record<string, string>>;
    for (const [id, v] of Object.entries(designTheme.scale.spacing)) expect(tw.spacing[id]).toBe(`${v}px`);
    for (const [id, v] of Object.entries(designTheme.scale.radii)) expect(tw.borderRadius[id]).toBe(`${v}px`);
    for (const [id, v] of Object.entries(designTheme.scale.fontSizes)) expect(tw.fontSize[id]).toBe(`${v}px`);
  });
});

describe('theme resolution', () => {
  it('picks the pair of a variant, falls back to the default pair', () => {
    expect(themeIdFor(undefined, 'dark')).toBe('dark');
    expect(themeIdFor('unknown', 'light')).toBe('light');
  });
  it('refuses an unknown theme', () => expect(() => resolveTheme('nope')).toThrow(/unknown theme/));
  it('alpha', () => expect(withAlpha('#dc2626', 0.4)).toBe('rgba(220, 38, 38, 0.4)'));
});

const ids = Object.keys(designTheme.themes);

describe.each(ids)('recipes on theme %s', (id) => {
  const t = resolveTheme(id);
  it('button: every variant x size resolves to concrete values', () => {
    for (const variant of ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as ButtonVariant[]) {
      for (const size of ['default', 'sm', 'lg', 'icon'] as ButtonSize[]) {
        const r = buttonRecipe({ variant, size }, t);
        expect(r.container.borderRadius).toBe(designTheme.scale.radii.md);
        expect(String(r.container.backgroundColor)).toMatch(/^(#[0-9a-f]{6}|transparent)$/);
        expect(String(r.label.color)).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });
  it('button: the primary button uses the primary role, disabled dims it', () => {
    const on = buttonRecipe({}, t);
    expect(on.container.backgroundColor).toBe(t.colors.primary);
    expect(on.label.color).toBe(t.colors.primaryForeground);
    expect(buttonRecipe({ disabled: true }, t).container.opacity).toBe(0.4);
    expect(buttonRecipe({ variant: 'outline' }, t).container.borderColor).toBe(t.colors.border);
  });
  it('input / card / badge / switch / text', () => {
    expect(inputRecipe({ invalid: true }, t).container.borderColor).toBe(withAlpha(t.colors.destructive, 0.4));
    expect(inputRecipe({}, t).focusBorderColor).toBe(t.colors.ring);
    expect(cardRecipe({}, t).backgroundColor).toBe(t.colors.card);
    expect(cardRecipe({ size: 'sm' }, t).padding).toBe(designTheme.scale.spacing['3']);
    expect(badgeRecipe({ variant: 'outline' }, t).container.borderWidth).toBe(1);
    expect(switchRecipe({ size: 'lg' }, t).scale).toBe(1.25);
    expect(switchRecipe({}, t).trackOn).toBe(t.colors.primary);
    expect(textRecipe({ size: 'xl', bold: true, underline: true }, t)).toEqual({
      color: t.colors.foreground,
      fontSize: designTheme.scale.fontSizes.xl,
      fontWeight: '700',
      textDecorationLine: 'underline',
    });
  });
});
