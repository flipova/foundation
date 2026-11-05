import { describe, expect, it } from 'vitest';
import { defaultRegistry, resolveTheme, REQUIRED_ROLES, themeIdFor, withAlpha } from './theme';
import {
  alertRecipe,
  avatarRecipe,
  checkboxRecipe,
  dividerRecipe,
  headingRecipe,
  initialsOf,
  modalRecipe,
  progressRecipe,
  radioRecipe,
  selectRecipe,
  skeletonRecipe,
  spinnerRecipe,
  tabsRecipe,
  textareaRecipe,
  toastRecipe,
} from './recipes';

const themes = Object.keys(defaultRegistry.themes).map((id) => resolveTheme(id));

/** every leaf of a recipe: strings, finite numbers, or nested {width,height}; functions are called with both states */
function leaves(x: unknown, path = ''): Array<[string, unknown]> {
  if (typeof x === 'function')
    return [...leaves(x(true, false), `${path}(true)`), ...leaves(x(false, false), `${path}(false)`)];
  if (x && typeof x === 'object') return Object.entries(x).flatMap(([k, v]) => leaves(v, `${path}.${k}`));
  return [[path, x]];
}

describe('new recipes: every value is real, in every theme', () => {
  for (const t of themes) {
    it(t.id, () => {
      const all = {
        heading: [1, 2, 3, 4, 5, 6].map((level) => headingRecipe({ level: level as 1 }, t)),
        textarea: [textareaRecipe({}, t), textareaRecipe({ rows: 8, invalid: true, disabled: true }, t)],
        select: [selectRecipe({ options: [] }, t), selectRecipe({ options: [], invalid: true, disabled: true }, t)],
        checkbox: [checkboxRecipe({}, t), checkboxRecipe({ checked: true, invalid: true, disabled: true }, t)],
        radio: [
          radioRecipe({ options: [] }, t),
          radioRecipe({ options: [], orientation: 'horizontal', disabled: true }, t),
        ],
        avatar: (['sm', 'md', 'lg', 'xl'] as const).map((size) => avatarRecipe({ size }, t)),
        divider: [dividerRecipe({}, t), dividerRecipe({ orientation: 'vertical' }, t)],
        modal: [modalRecipe({ visible: true }, t)],
        tabs: [tabsRecipe({ tabs: [] }, t)],
        alert: (['info', 'success', 'warning', 'error'] as const).map((variant) => alertRecipe({ variant }, t)),
        toast: (['default', 'info', 'success', 'warning', 'error'] as const).map((variant) =>
          toastRecipe({ variant }, t),
        ),
        progress: [
          progressRecipe({ value: 0 }, t),
          progressRecipe({ value: 50, size: 'lg' }, t),
          progressRecipe({ value: 300 }, t),
          progressRecipe({ value: NaN }, t),
        ],
        skeleton: [skeletonRecipe({}, t), skeletonRecipe({ circle: true, height: 48 }, t)],
        spinner: (['sm', 'md', 'lg'] as const).map((size) => spinnerRecipe({ size }, t)),
      };
      for (const [name, recipes] of Object.entries(all))
        for (const r of recipes)
          for (const [path, v] of leaves(r)) {
            const ok =
              (typeof v === 'number' && Number.isFinite(v)) ||
              (typeof v === 'string' && v !== '' && !v.includes('undefined') && !v.includes('NaN')) ||
              typeof v === 'boolean';
            expect(ok, `${name}${path} = ${String(v)}`).toBe(true);
          }
    });
  }
});

describe('recipes: the values come from the theme', () => {
  const t = themes[0];
  it('feedback colours are the registry status colours', () => {
    expect(alertRecipe({ variant: 'success' }, t).accent).toBe(t.colors.success);
    expect(alertRecipe({ variant: 'error' }, t).accent).toBe(t.colors.error);
    expect(toastRecipe({ variant: 'warning' }, t).accent).toBe(t.colors.warning);
    expect(toastRecipe({}, t).accent).toBe(t.colors.border);
    expect(alertRecipe({ variant: 'info' }, t).container.backgroundColor).toBe(withAlpha(t.colors.info, 0.1));
  });
  it('checkbox, radio and tabs mark their active state with the primary colour', () => {
    expect(checkboxRecipe({ checked: true }, t).box.backgroundColor).toBe(t.colors.primary);
    expect(checkboxRecipe({ checked: false }, t).box.backgroundColor).toBe('transparent');
    expect(radioRecipe({ options: [] }, t).circle(true).borderColor).toBe(t.colors.primary);
    expect(radioRecipe({ options: [] }, t).circle(false).borderColor).toBe(t.colors.input);
    expect(tabsRecipe({ tabs: [] }, t).tab(true, false).borderBottomColor).toBe(t.colors.primary);
  });
  it('sizes follow the scales', () => {
    expect(avatarRecipe({ size: 'lg' }, t).container.width).toBe(t.scale.spacing['14']);
    expect(headingRecipe({ level: 1 }, t).fontSize).toBe(t.scale.fontSizes['4xl']);
    expect(progressRecipe({ value: 40 }, t).bar.width).toBe('40%');
    expect(progressRecipe({ value: -5 }, t).value).toBe(0);
    expect(skeletonRecipe({}, t).pulse.minOpacity).toBe(t.scale.opacity.dim);
  });
  it('initials', () => {
    expect(initialsOf('Ada Lovelace')).toBe('AL');
    expect(initialsOf('ada')).toBe('A');
    expect(initialsOf('  Jean  Claude  Van Damme ')).toBe('JD');
    expect(initialsOf('')).toBe('?');
    expect(initialsOf(undefined)).toBe('?');
  });
});

describe('theme registry', () => {
  it('the bundled registry defines every role the components read, in every theme', () => {
    for (const [id, th] of Object.entries(defaultRegistry.themes))
      for (const r of REQUIRED_ROLES) expect(th.colors[r], `${id}.${r}`).toMatch(/^#[0-9a-f]{6}$/i);
  });
  it('themeIdFor never assumes an id: unknown variant → default pair → any theme of the mode', () => {
    const reg = {
      ...defaultRegistry,
      themes: {
        a: {
          mode: 'light',
          variant: 'v',
          colors: defaultRegistry.themes[Object.keys(defaultRegistry.themes)[0]].colors,
        },
        b: {
          mode: 'dark',
          variant: 'v',
          colors: defaultRegistry.themes[Object.keys(defaultRegistry.themes)[0]].colors,
        },
      },
      variants: { v: { light: 'a', dark: 'b' } },
    };
    expect(themeIdFor('v', 'dark', reg)).toBe('b');
    expect(themeIdFor('nope', 'light', reg)).toBe('a');
    expect(themeIdFor(undefined, 'dark', reg)).toBe('b');
    expect(themeIdFor('nope', 'dark', { ...reg, variants: {} })).toBe('b');
  });
  it('unknown theme id is an error that lists the known ones', () => {
    expect(() => resolveTheme('nope')).toThrow(/unknown theme "nope" \(known: /);
  });
});
