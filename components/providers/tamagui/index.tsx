import React from 'react';
import { Image, Switch as RNSwitch, TextInput } from 'react-native';
import { TamaguiProvider, Text as TText, View as TView, createTamagui, createTokens, styled } from '@tamagui/core';
import type {
  FormControlProps,
  IconProps,
  LinkProps,
  LiquidGlassProps,
  AvatarProps,
  CheckboxProps,
  ProgressProps,
  BoxProps,
  CenterProps,
  DividerProps,
  HeadingProps,
  HStackProps,
  VStackProps,
  ViewProps,
  BadgeProps,
  ButtonProps,
  CardProps,
  InputProps,
  ProviderComponents,
  ResolvedTheme,
  SwitchProps,
  TextProps,
} from '../../contract';
import { defaultRegistry, type ThemeRegistry } from '../../contract';
import {
  formControlRecipe,
  iconRecipe,
  linkRecipe,
  liquidGlassRecipe,
  avatarRecipe,
  checkboxRecipe,
  initialsOf,
  progressRecipe,
  badgeRecipe,
  buttonRecipe,
  cardRecipe,
  centerRecipe,
  dividerRecipe,
  headingRecipe,
  inputRecipe,
  stackRecipe,
  switchRecipe,
  textRecipe,
} from '../../contract';
import { useResolvedTheme } from '../provider';
import { rnBase } from '../rn-base';
import { defineAdapter } from '../types';

/** Tamagui refuses token names that are CSS-wide keywords (`none`...): those are renamed here, and only here. */
export const TAMAGUI_RENAMES: Record<string, string> = { none: 'zero' };
const rename = (scale: Record<string, number>) =>
  Object.fromEntries(Object.entries(scale).map(([k, v]) => [TAMAGUI_RENAMES[k] ?? k, v]));
const numeric = (scale: Record<string, number>) => Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, v]));

/**
 * The registry as a Tamagui configuration: tokens from the scales, one Tamagui theme per registry theme (colour roles
 * become `$primary`, `$cardForeground`...). Nothing in it is written by hand.
 */
export function buildTamaguiConfig(designTheme: ThemeRegistry = defaultRegistry) {
  const tokens = createTokens({
    color: Object.fromEntries(Object.entries(Object.values(designTheme.themes)[0].colors).map(([k, v]) => [k, v])),
    space: { ...numeric(designTheme.scale.spacing) },
    size: { ...numeric(designTheme.scale.spacing) },
    radius: { ...rename(designTheme.scale.radii) },
    zIndex: { 0: 0 },
  } as never);
  const themes = Object.fromEntries(Object.entries(designTheme.themes).map(([id, t]) => [id, { ...t.colors }]));
  return createTamagui({
    tokens,
    themes,
    fonts: {
      body: {
        family: (designTheme.scale.fontFamilies.system ?? Object.values(designTheme.scale.fontFamilies)[0]).native,
        size: numeric(designTheme.scale.fontSizes),
        lineHeight: numeric(designTheme.scale.fontSizes),
        weight: { 4: '400' },
        letterSpacing: { 4: 0 },
      },
    } as never,
    settings: { defaultFont: 'body' } as never,
  } as never);
}

export const tamaguiConfig = buildTamaguiConfig();

const configs = new WeakMap<ThemeRegistry, ReturnType<typeof buildTamaguiConfig>>();
function configFor(registry: ThemeRegistry) {
  let c = configs.get(registry);
  if (!c) configs.set(registry, (c = buildTamaguiConfig(registry)));
  return c;
}

// Styled primitives. Colours are theme roles ('$primary'), so switching theme re-resolves them.
const Btn = styled(TView, {
  name: 'FlipovaButton',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$md',
  gap: '$2',
} as never);
const Surface = styled(TView, { name: 'FlipovaSurface' } as never);
const Label = styled(TText, { name: 'FlipovaLabel' } as never);

/** Tamagui resolves `$token` strings through the theme; recipes already hold final values, which Tamagui passes through. */
function Button(p: ButtonProps) {
  const t = useResolvedTheme();
  const r = buttonRecipe(p, t);
  return (
    <Btn
      {...({
        style: r.container,
        disabled: !!(p.disabled || p.loading),
        onPress: p.onPress,
        role: 'button',
        focusable: true,
        accessibilityLabel: p.accessibilityLabel,
        testID: p.testID,
      } as object)}
    >
      {typeof p.children === 'string' ? <Label {...({ style: r.label } as object)}>{p.children}</Label> : p.children}
    </Btn>
  );
}

function Text(p: TextProps) {
  const t = useResolvedTheme();
  return (
    <Label {...({ style: textRecipe(p, t), numberOfLines: p.isTruncated ? 1 : undefined, testID: p.testID } as object)}>
      {p.children}
    </Label>
  );
}

function Input(p: InputProps) {
  const t = useResolvedTheme();
  const r = inputRecipe(p, t);
  return (
    <Surface {...({ style: r.container } as object)}>
      <TextInput
        style={r.field as object}
        value={p.value}
        defaultValue={p.defaultValue}
        placeholder={p.placeholder}
        placeholderTextColor={r.placeholderTextColor}
        onChangeText={p.onChangeText}
        editable={!p.disabled}
        secureTextEntry={p.secureTextEntry}
        accessibilityLabel={p.accessibilityLabel}
        testID={p.testID}
      />
    </Surface>
  );
}

function Card(p: CardProps) {
  const t = useResolvedTheme();
  return <Surface {...({ style: cardRecipe(p, t), testID: p.testID } as object)}>{p.children}</Surface>;
}

function Badge(p: BadgeProps) {
  const t = useResolvedTheme();
  const r = badgeRecipe(p, t);
  return (
    <Surface {...({ style: r.container, testID: p.testID } as object)}>
      <Label {...({ style: r.label } as object)}>{p.children}</Label>
    </Surface>
  );
}

function Switch(p: SwitchProps) {
  const t = useResolvedTheme();
  const r = switchRecipe(p, t);
  return (
    <RNSwitch
      value={!!p.value}
      onValueChange={p.onValueChange}
      disabled={p.disabled}
      trackColor={{ true: r.trackOn, false: r.trackOff }}
      thumbColor={r.thumb}
      style={{ opacity: r.opacity, transform: [{ scale: r.scale }] }}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    />
  );
}

// ---- layout and text primitives Tamagui really has (View / Text), styled from the recipes ----------------------------

const box = (style: object | undefined, p: { testID?: string; children?: React.ReactNode }) => (
  <Surface {...({ style, testID: p.testID } as object)}>{p.children}</Surface>
);
const Box = (p: BoxProps) => box(undefined, p);
const View = (p: ViewProps) => box(undefined, p);
const Center = (p: CenterProps) => box(centerRecipe(), p);
function HStack(p: HStackProps) {
  return box(stackRecipe('row', p, useResolvedTheme()), p);
}
function VStack(p: VStackProps) {
  return box(stackRecipe('column', p, useResolvedTheme()), p);
}
function Divider(p: DividerProps) {
  return box(dividerRecipe(p, useResolvedTheme()), p);
}
function Heading(p: HeadingProps) {
  const t = useResolvedTheme();
  return (
    <Label
      {...({
        role: 'heading',
        style: headingRecipe(p, t),
        numberOfLines: p.isTruncated ? 1 : undefined,
        testID: p.testID,
      } as object)}
    >
      {p.children}
    </Label>
  );
}

function Checkbox(p: CheckboxProps) {
  const r = checkboxRecipe(p, useResolvedTheme());
  return (
    <Surface
      {...({
        role: 'checkbox',
        'aria-checked': !!p.checked,
        'aria-disabled': !!p.disabled,
        'aria-label': p.accessibilityLabel ?? p.label,
        style: r.row,
        onPress: p.disabled ? undefined : () => p.onCheckedChange?.(!p.checked),
        testID: p.testID,
      } as object)}
    >
      <Surface {...({ style: r.box } as object)}>
        {p.checked ? <Label {...({ style: r.mark } as object)}>✓</Label> : null}
      </Surface>
      {p.label ? <Label {...({ style: r.label } as object)}>{p.label}</Label> : null}
    </Surface>
  );
}

function Avatar(p: AvatarProps) {
  const r = avatarRecipe(p, useResolvedTheme());
  return (
    <Surface
      {...({
        role: 'img',
        'aria-label': p.accessibilityLabel ?? p.name,
        style: r.container,
        testID: p.testID,
      } as object)}
    >
      {p.source ? (
        <Image source={{ uri: p.source }} style={r.image as never} />
      ) : (
        <Label {...({ style: r.initials } as object)}>{initialsOf(p.name)}</Label>
      )}
    </Surface>
  );
}

function Progress(p: ProgressProps) {
  const r = progressRecipe(p, useResolvedTheme());
  return (
    <Surface
      {...({
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': r.value,
        'aria-label': p.accessibilityLabel,
        style: r.track,
        testID: p.testID,
      } as object)}
    >
      <Surface {...({ style: r.bar } as object)} />
    </Surface>
  );
}

function Icon(p: IconProps) {
  const r = iconRecipe(p, useResolvedTheme());
  return (
    <Label
      {...({
        style: r.style,
        'aria-label': p.accessibilityLabel,
        'aria-hidden': p.accessibilityLabel ? undefined : true,
        testID: p.testID,
      } as object)}
    >
      {r.glyph}
    </Label>
  );
}

function Link(p: LinkProps) {
  const t = useResolvedTheme();
  return (
    <Label {...({ role: 'link', style: linkRecipe(t), onPress: p.onPress, testID: p.testID } as object)}>
      {p.children}
    </Label>
  );
}

function LiquidGlass(p: LiquidGlassProps) {
  return box(liquidGlassRecipe(useResolvedTheme()), p);
}

function FormControl(p: FormControlProps) {
  const r = formControlRecipe(!!p.disabled, useResolvedTheme());
  return (
    <Surface {...({ style: r.root, testID: p.testID } as object)}>
      {p.label ? (
        <Label {...({ style: r.label } as object)}>
          {p.label}
          {p.required ? <Label {...({ style: r.required } as object)}> *</Label> : null}
        </Label>
      ) : null}
      {p.children}
      {p.error ? (
        <Label {...({ role: 'alert', style: r.error } as object)}>{p.error}</Label>
      ) : p.helper ? (
        <Label {...({ style: r.helper } as object)}>{p.helper}</Label>
      ) : null}
    </Surface>
  );
}

const components: ProviderComponents = {
  ...rnBase,
  Button,
  Text,
  Input,
  Card,
  Badge,
  Switch,
  Box,
  View,
  Center,
  HStack,
  VStack,
  Divider,
  Heading,
  Checkbox,
  Avatar,
  Progress,
  Icon,
  Link,
  LiquidGlass,
  FormControl,
};

export const tamagui = defineAdapter({
  name: 'tamagui',
  Provider: ({
    theme,
    registry,
    children,
  }: {
    theme: ResolvedTheme;
    registry: ThemeRegistry;
    children?: React.ReactNode;
  }) => (
    <TamaguiProvider config={configFor(registry)} defaultTheme={theme.id}>
      {children}
    </TamaguiProvider>
  ),
  components,
});
