import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { designTheme } from '../theme/design-theme';
import {
  avatarRecipe,
  checkboxRecipe,
  dividerRecipe,
  formControlRecipe,
  headingRecipe,
  linkRecipe,
  progressRecipe,
  skeletonRecipe,
  stackRecipe,
  badgeRecipe,
  buttonRecipe,
  cardRecipe,
  inputRecipe,
  resolveTheme,
  switchRecipe,
  textRecipe,
  type ResolvedTheme,
  type Style,
} from '../contract';
import { FlipovaProvider, type ProviderAdapter } from './index';
import { useComponents } from '../ui';
import { resolveClasses } from './class-resolver';
import {
  avatarClasses,
  checkboxClasses,
  dividerClasses,
  formControlClasses,
  headingClasses,
  linkClasses,
  progressClasses,
  skeletonClasses,
  stackClasses,
  badgeClasses,
  buttonClasses,
  cardClasses,
  inputClasses,
  switchClasses,
  textClasses,
} from './reusables/classes';
import { paper, paperButtonProps, paperSwitchProps, paperTheme } from './paper';
import { TAMAGUI_RENAMES, tamagui, tamaguiConfig } from './tamagui';
import { reusables } from './reusables';
import { gluestack } from './gluestack';

const themeIds = Object.keys(designTheme.themes);
const themes = themeIds.map((id) => resolveTheme(id));

const buttonCases = (['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const).flatMap((variant) =>
  (['default', 'sm', 'lg', 'icon'] as const).flatMap((size) =>
    [false, true].map((disabled) => ({ variant, size, disabled })),
  ),
);

/** Every key a class list resolves must equal the recipe's; a key the classes leave out may only be a neutral value. */
function expectSameStyle(fromClasses: Style, fromRecipe: Style, what: string) {
  for (const [k, v] of Object.entries(fromClasses)) {
    if (k.startsWith('__')) continue;
    expect(fromRecipe[k], `${what}: ${k}`).toEqual(v);
  }
  for (const [k, v] of Object.entries(fromRecipe)) {
    if (k in fromClasses) continue;
    if (/^(shadow|elevation)/.test(k)) continue; // checked separately (shadow-sm)
    expect(
      [undefined, 'transparent', 1, 0],
      `${what}: recipe has ${k}=${JSON.stringify(v)} that the classes do not give`,
    ).toContain(v as never);
  }
}

describe('Reusables: classes resolve to the recipe values', () => {
  for (const t of themes) {
    describe(t.id, () => {
      it('Button', () => {
        for (const p of buttonCases) {
          const c = buttonClasses(p);
          const r = buttonRecipe(p, t);
          expectSameStyle(resolveClasses(c.container, t), r.container, `button ${JSON.stringify(p)} container`);
          const label = resolveClasses(c.label, t);
          expect(label.color).toBe(r.label.color);
          expect(label.fontSize).toBe(r.label.fontSize);
          expect(label.fontWeight).toBe(r.label.fontWeight);
        }
      });
      it('Text', () => {
        for (const size of ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const)
          for (const flags of [
            {},
            { bold: true },
            { underline: true },
            { strikeThrough: true },
            { underline: true, strikeThrough: true },
          ]) {
            const p = { size, ...flags };
            expectSameStyle(resolveClasses(textClasses(p), t), textRecipe(p, t), `text ${JSON.stringify(p)}`);
          }
      });
      it('Input', () => {
        for (const p of [{}, { disabled: true }, { invalid: true }]) {
          const r = inputRecipe(p, t);
          const c = inputClasses(p);
          const cont = resolveClasses(c.container, t);
          expectSameStyle(cont, r.container, `input ${JSON.stringify(p)} container`);
          expectSameStyle(resolveClasses(c.field, t), r.field, `input ${JSON.stringify(p)} field`);
        }
      });
      it('Card', () => {
        for (const size of ['default', 'sm'] as const) {
          const cls = cardClasses({ size });
          expect(cls).toContain('shadow-sm');
          expectSameStyle(resolveClasses(cls, t), cardRecipe({ size }, t), `card ${size}`);
        }
      });
      it('Badge', () => {
        for (const variant of ['default', 'secondary', 'destructive', 'outline'] as const) {
          const c = badgeClasses({ variant });
          const r = badgeRecipe({ variant }, t);
          expectSameStyle(resolveClasses(c.container, t), r.container, `badge ${variant}`);
          expectSameStyle(resolveClasses(c.label, t), r.label, `badge ${variant} label`);
        }
      });
      it('Switch', () => {
        for (const size of ['sm', 'md', 'lg'] as const)
          for (const disabled of [false, true]) {
            const c = switchClasses({ size, disabled });
            const r = switchRecipe({ size, disabled }, t);
            const root = resolveClasses(c.root, t);
            expect(root.width).toBe(r.width);
            expect(root.height).toBe(r.height);
            expect(root.opacity ?? 1).toBe(r.opacity);
            expect((root as Style).__scale ?? 1).toBe(r.scale);
            expect(resolveClasses(c.trackOn, t).backgroundColor).toBe(r.trackOn);
            expect(resolveClasses(c.trackOff, t).backgroundColor).toBe(r.trackOff);
            expect(resolveClasses(c.thumb, t).backgroundColor).toBe(r.thumb);
          }
      });
      it('Divider, stacks, Heading, Link', () => {
        for (const o of ['horizontal', 'vertical'] as const)
          expectSameStyle(
            resolveClasses(dividerClasses({ orientation: o }), t),
            dividerRecipe({ orientation: o }, t),
            `divider ${o}`,
          );
        for (const space of ['0', '1', '1.5', '2', '4', '8'])
          for (const d of ['row', 'column'] as const)
            expectSameStyle(
              resolveClasses(stackClasses(d, { space }), t),
              stackRecipe(d, { space }, t),
              `stack ${d} ${space}`,
            );
        for (const level of [1, 2, 3, 4, 5, 6] as const)
          expectSameStyle(
            resolveClasses(headingClasses({ level }), t),
            headingRecipe({ level }, t),
            `heading ${level}`,
          );
        expectSameStyle(resolveClasses(linkClasses(), t), linkRecipe(t), 'link');
      });
      it('Avatar, Progress, Checkbox, FormControl, Skeleton', () => {
        for (const size of ['sm', 'md', 'lg', 'xl'] as const) {
          const c = avatarClasses({ size });
          const r = avatarRecipe({ size }, t);
          expectSameStyle(resolveClasses(c.container, t), r.container, `avatar ${size}`);
          expectSameStyle(resolveClasses(c.image, t), r.image, `avatar image ${size}`);
          expectSameStyle(resolveClasses(c.initials, t), r.initials, `avatar initials ${size}`);
        }
        for (const size of ['sm', 'md', 'lg'] as const) {
          const c = progressClasses({ size });
          const r = progressRecipe({ value: 50, size }, t);
          expectSameStyle(resolveClasses(c.track, t), r.track, `progress track ${size}`);
          expectSameStyle(resolveClasses(c.bar, t), { ...r.bar, width: undefined } as never, `progress bar ${size}`);
        }
        for (const checked of [false, true])
          for (const disabled of [false, true])
            for (const invalid of [false, true]) {
              const p = { checked, disabled, invalid };
              const c = checkboxClasses(p);
              const r = checkboxRecipe(p, t);
              expectSameStyle(resolveClasses(c.row, t), r.row, `checkbox row ${JSON.stringify(p)}`);
              expectSameStyle(resolveClasses(c.box, t), r.box, `checkbox box ${JSON.stringify(p)}`);
              expectSameStyle(resolveClasses(c.mark, t), r.mark, 'checkbox mark');
              expectSameStyle(resolveClasses(c.label, t), r.label, 'checkbox label');
            }
        for (const disabled of [false, true]) {
          const c = formControlClasses({ disabled });
          const r = formControlRecipe(disabled, t);
          expectSameStyle(resolveClasses(c.root, t), r.root, `formcontrol root ${disabled}`);
          expectSameStyle(resolveClasses(c.label, t), r.label, 'formcontrol label');
          expectSameStyle(resolveClasses(c.required, t), r.required, 'formcontrol required');
          expectSameStyle(resolveClasses(c.helper, t), r.helper, 'formcontrol helper');
          expectSameStyle(resolveClasses(c.error, t), r.error, 'formcontrol error');
        }
        for (const circle of [false, true]) {
          const r = skeletonRecipe({ circle, height: 20 }, t).block;
          expectSameStyle(
            resolveClasses(skeletonClasses({ circle }), t),
            { ...r, width: undefined, height: undefined } as never,
            `skeleton ${circle}`,
          );
        }
      });
    });
  }
});

describe('Paper: what is handed to the library matches the recipes', () => {
  for (const t of themes) {
    it(`${t.id}: theme roles`, () => {
      const m = paperTheme(t);
      expect(m.dark).toBe(t.mode === 'dark');
      expect(m.roundness).toBe(t.scale.radii.md);
      expect(m.colors.primary).toBe(t.colors.primary);
      expect(m.colors.onPrimary).toBe(t.colors.primaryForeground);
      expect(m.colors.background).toBe(t.colors.background);
      expect(m.colors.surface).toBe(t.colors.card);
      expect(m.colors.error).toBe(t.colors.destructive);
      expect(m.colors.outline).toBe(t.colors.border);
    });
    it(`${t.id}: Button props`, () => {
      for (const p of buttonCases) {
        const r = buttonRecipe(p, t);
        const props = paperButtonProps(p, t);
        expect(props.buttonColor).toBe(r.container.backgroundColor);
        expect(props.textColor).toBe(r.label.color);
        expect(props.style.borderRadius).toBe(r.container.borderRadius);
        expect(props.style.opacity).toBe(r.container.opacity);
        expect(props.labelStyle.fontSize).toBe(r.label.fontSize);
        expect(props.labelStyle.fontWeight).toBe(r.label.fontWeight);
        expect(props.contentStyle.gap).toBe(r.container.gap);
        if (r.container.paddingHorizontal !== undefined)
          expect(props.contentStyle.paddingHorizontal).toBe(r.container.paddingHorizontal);
        if (r.container.minHeight !== undefined) expect(props.contentStyle.minHeight).toBe(r.container.minHeight);
        expect(props.disabled).toBe(p.disabled);
      }
    });
    it(`${t.id}: Switch props`, () => {
      for (const size of ['sm', 'md', 'lg'] as const) {
        const r = switchRecipe({ size, disabled: true }, t);
        const props = paperSwitchProps({ size, disabled: true }, t);
        expect(props.color).toBe(r.trackOn);
        expect(props.style.opacity).toBe(r.opacity);
        expect(props.style.transform).toEqual([{ scale: r.scale }]);
      }
    });
  }
});

describe('Tamagui: configuration built from the registry', () => {
  const cfg = tamaguiConfig as unknown as {
    tokens: Record<string, Record<string, { val: unknown }>>;
    themes: Record<string, Record<string, unknown>>;
  };
  const val = (x: unknown) => (x && typeof x === 'object' && 'val' in (x as object) ? (x as { val: unknown }).val : x);

  it('has one Tamagui theme per registry theme', () => {
    expect(Object.keys(cfg.themes).sort()).toEqual([...themeIds].sort());
  });
  it('theme colours equal the registry colours', () => {
    for (const t of themes)
      for (const [role, hex] of Object.entries(t.colors))
        expect(val(cfg.themes[t.id][role]), `${t.id}.${role}`).toBe(hex);
  });
  it('space and radius tokens equal the scales', () => {
    for (const [k, v] of Object.entries(designTheme.scale.spacing))
      expect(val(cfg.tokens.space[k]), `space.${k}`).toBe(v);
    for (const [k, v] of Object.entries(designTheme.scale.radii))
      expect(val(cfg.tokens.radius[TAMAGUI_RENAMES[k] ?? k]), `radius.${k}`).toBe(v);
  });
});

const adapters: ProviderAdapter[] = [gluestack, reusables, paper, tamagui];

function Kit({
  onPress,
  onChange,
  onSwitch,
}: {
  onPress: () => void;
  onChange: (s: string) => void;
  onSwitch: (v: boolean) => void;
}) {
  const { Button, Text, Input, Card, Badge, Switch } = useComponents();
  return (
    <div>
      <Card testID="card">
        <Text testID="text" bold>
          Hello text
        </Text>
        <Badge testID="badge" variant="secondary">
          New
        </Badge>
        <Button testID="button" onPress={onPress}>
          Press me
        </Button>
        <Input testID="input" placeholder="Your name" onChangeText={onChange} accessibilityLabel="name" />
        <Switch testID="switch" value={false} onValueChange={onSwitch} accessibilityLabel="notify" />
      </Card>
    </div>
  );
}

describe.each(adapters.map((a) => [a.name, a] as const))('smoke render: %s', (_name, adapter) => {
  for (const mode of ['light', 'dark'] as const) {
    it(`renders the six components in ${mode} and reacts to input`, () => {
      const onPress = vi.fn();
      const onChange = vi.fn();
      const onSwitch = vi.fn();
      render(
        <FlipovaProvider adapter={adapter} mode={mode}>
          <Kit onPress={onPress} onChange={onChange} onSwitch={onSwitch} />
        </FlipovaProvider>,
      );
      expect(screen.getByText('Hello text')).toBeTruthy();
      expect(screen.getByText('New')).toBeTruthy();
      fireEvent.click(screen.getByText('Press me'));
      expect(onPress).toHaveBeenCalledTimes(1);
      const input = screen.getByPlaceholderText('Your name');
      fireEvent.change(input, { target: { value: 'Ada' } });
      expect(onChange).toHaveBeenCalledWith('Ada');
      expect(screen.getByLabelText('notify')).toBeTruthy();
    });
  }
  it('does not press a disabled button', () => {
    const onPress = vi.fn();
    function K() {
      const { Button } = useComponents();
      return (
        <Button disabled onPress={onPress}>
          Nope
        </Button>
      );
    }
    render(
      <FlipovaProvider adapter={adapter}>
        <K />
      </FlipovaProvider>,
    );
    fireEvent.click(screen.getByText('Nope'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

export type { ResolvedTheme };
