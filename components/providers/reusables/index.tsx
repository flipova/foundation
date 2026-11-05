import React from 'react';
import { Image, Pressable, Text as RNText, TextInput, View, ActivityIndicator } from 'react-native';
import * as SwitchPrimitive from '@rn-primitives/switch';

import { cssVarTables } from '../css-vars';
import type {
  AvatarProps,
  CheckboxProps,
  DividerProps,
  FormControlProps,
  HeadingProps,
  HStackProps,
  LinkProps,
  ProgressProps,
  SkeletonProps,
  VStackProps,
  BoxProps,
  CenterProps,
  ViewProps,
  BadgeProps,
  ButtonProps,
  CardProps,
  InputProps,
  ProviderComponents,
  SwitchProps,
  TextProps,
} from '../../contract';
import { initialsOf } from '../../contract';
import { rnBase } from '../rn-base';
import { useResolvedTheme } from '../provider';
import { defineAdapter } from '../types';
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
} from './classes';

export * from './classes';

function Button(p: ButtonProps) {
  const t = useResolvedTheme();
  const c = buttonClasses(p);
  const off = p.disabled || p.loading;
  return (
    <Pressable
      className={c.container}
      disabled={off}
      onPress={p.onPress}
      accessibilityRole="button"
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    >
      {p.loading ? <ActivityIndicator size="small" color={t.colors.primaryForeground} /> : null}
      {typeof p.children === 'string' ? <RNText className={c.label}>{p.children}</RNText> : p.children}
    </Pressable>
  );
}

function Text(p: TextProps) {
  return (
    <RNText className={textClasses(p)} numberOfLines={p.isTruncated ? 1 : undefined} testID={p.testID}>
      {p.children}
    </RNText>
  );
}

function Input(p: InputProps) {
  const t = useResolvedTheme();
  const c = inputClasses(p);
  return (
    <View className={c.container}>
      <TextInput
        className={c.field}
        value={p.value}
        defaultValue={p.defaultValue}
        placeholder={p.placeholder}
        placeholderTextColor={t.colors.mutedForeground}
        onChangeText={p.onChangeText}
        editable={!p.disabled}
        secureTextEntry={p.secureTextEntry}
        accessibilityLabel={p.accessibilityLabel}
        testID={p.testID}
      />
    </View>
  );
}

function Card(p: CardProps) {
  return (
    <View className={cardClasses(p)} testID={p.testID}>
      {p.children}
    </View>
  );
}

function Badge(p: BadgeProps) {
  const c = badgeClasses(p);
  return (
    <View className={c.container} testID={p.testID}>
      <RNText className={c.label}>{p.children}</RNText>
    </View>
  );
}

function Switch(p: SwitchProps) {
  const c = switchClasses(p);
  const on = !!p.value;
  return (
    <SwitchPrimitive.Root
      checked={on}
      onCheckedChange={p.onValueChange ?? (() => undefined)}
      disabled={p.disabled}
      className={`${c.root} ${on ? c.trackOn : c.trackOff}`}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    >
      <SwitchPrimitive.Thumb className={`${c.thumb} ${on ? 'ml-auto' : ''}`} />
    </SwitchPrimitive.Root>
  );
}

// ---- plain containers: the library is NativeWind classes over React Native, so these are Views --------------------------

const Box = (p: BoxProps) => <View testID={p.testID}>{p.children}</View>;
const PlainView = (p: ViewProps) => <View testID={p.testID}>{p.children}</View>;
const Center = (p: CenterProps) => (
  <View className="items-center justify-center" testID={p.testID}>
    {p.children}
  </View>
);

const Divider = (p: DividerProps) => <View className={dividerClasses(p)} testID={p.testID} />;
const HStack = (p: HStackProps) => (
  <View className={stackClasses('row', p)} testID={p.testID}>
    {p.children}
  </View>
);
const VStack = (p: VStackProps) => (
  <View className={stackClasses('column', p)} testID={p.testID}>
    {p.children}
  </View>
);
const Heading = (p: HeadingProps) => (
  <RNText
    accessibilityRole="header"
    className={headingClasses(p)}
    numberOfLines={p.isTruncated ? 1 : undefined}
    testID={p.testID}
  >
    {p.children}
  </RNText>
);
const Link = (p: LinkProps) => (
  <RNText accessibilityRole="link" className={linkClasses()} onPress={p.onPress} testID={p.testID}>
    {p.children}
  </RNText>
);

function Avatar(p: AvatarProps) {
  const c = avatarClasses(p);
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={p.accessibilityLabel ?? p.name}
      className={c.container}
      testID={p.testID}
    >
      {p.source ? (
        <Image source={{ uri: p.source }} className={c.image} />
      ) : (
        <RNText className={c.initials}>{initialsOf(p.name)}</RNText>
      )}
    </View>
  );
}

function Progress(p: ProgressProps) {
  const c = progressClasses(p);
  const pct = Math.min(100, Math.max(0, Number.isFinite(p.value) ? p.value : 0));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={p.accessibilityLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={c.track}
      testID={p.testID}
    >
      <View className={c.bar} style={{ width: `${pct}%` }} />
    </View>
  );
}

function Checkbox(p: CheckboxProps) {
  const c = checkboxClasses(p);
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={p.accessibilityLabel ?? p.label}
      aria-checked={!!p.checked}
      aria-disabled={!!p.disabled}
      disabled={p.disabled}
      onPress={() => p.onCheckedChange?.(!p.checked)}
      className={c.row}
      testID={p.testID}
    >
      <View className={c.box}>{p.checked ? <RNText className={c.mark}>✓</RNText> : null}</View>
      {p.label ? <RNText className={c.label}>{p.label}</RNText> : null}
    </Pressable>
  );
}

function FormControl(p: FormControlProps) {
  const c = formControlClasses(p);
  return (
    <View className={c.root} testID={p.testID}>
      {p.label ? (
        <RNText className={c.label}>
          {p.label}
          {p.required ? <RNText className={c.required}> *</RNText> : null}
        </RNText>
      ) : null}
      {p.children}
      {p.error ? (
        <RNText accessibilityRole="alert" className={c.error}>
          {p.error}
        </RNText>
      ) : p.helper ? (
        <RNText className={c.helper}>{p.helper}</RNText>
      ) : null}
    </View>
  );
}

const Skeleton = (p: SkeletonProps) => {
  const h = p.height ?? 16;
  return (
    <View
      className={skeletonClasses(p)}
      style={{ width: (p.circle ? h : (p.width ?? '100%')) as number, height: h }}
      testID={p.testID}
    />
  );
};

const components: ProviderComponents = {
  ...rnBase,
  Button,
  Text,
  Input,
  Card,
  Badge,
  Switch,
  Box,
  View: PlainView,
  Center,
  Divider,
  HStack,
  VStack,
  Heading,
  Link,
  Avatar,
  Progress,
  Checkbox,
  FormControl,
  Skeleton,
};

/** NativeWind classes + shadcn-style roles; the CSS variables of the theme are set on a wrapping view (as gluestack does). */
export const reusables = defineAdapter({
  name: 'reusables',
  Provider: ({ theme, registry, children }) => (
    <View style={[cssVarTables(registry).config[theme.id] as object, { flex: 1 }]}>{children}</View>
  ),
  components,
});
