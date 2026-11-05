import React from 'react';
import type {
  SkeletonProps,
  BoxProps,
  CenterProps,
  DividerProps,
  HeadingProps,
  HStackProps,
  LinkProps,
  PressableProps,
  SpinnerProps,
  TextareaProps,
  VStackProps,
  BadgeProps,
  ButtonProps,
  CardProps,
  InputProps,
  ProviderComponents,
  SwitchProps,
  TextProps,
} from '../../contract';
import { Badge as GBadge, BadgeText } from './ui/badge';
import { Box as GBox } from './ui/box';
import { Skeleton as GSkeleton } from './ui/skeleton';
import { Center as GCenter } from './ui/center';
import { Divider as GDivider } from './ui/divider';
import { Heading as GHeading } from './ui/heading';
import { HStack as GHStack } from './ui/hstack';
import { Link as GLink, LinkText } from './ui/link';
import { Pressable as GPressable } from './ui/pressable';
import { Spinner as GSpinner } from './ui/spinner';
import { Textarea as GTextarea, TextareaInput } from './ui/textarea';
import { VStack as GVStack } from './ui/vstack';
import { Button as GButton, ButtonSpinner, ButtonText } from './ui/button';
import { Card as GCard } from './ui/card';
import { Input as GInput, InputField } from './ui/input';
import { Switch as GSwitch } from './ui/switch';
import { Text as GText } from './ui/text';
import { createGluestackUIProvider } from './ui/gluestack-ui-provider';
import * as more from './more';
import { cssVarTables } from '../css-vars';
import { stackRecipe } from '../../contract';
import { useResolvedTheme } from '../provider';
import type { ThemeRegistry } from '../../contract';
import { rnBase } from '../rn-base';
import { defineAdapter } from '../types';

/** The reference implementation: the package's own gluestack components, exposed through the contract. */
function Button(p: ButtonProps) {
  return (
    <GButton
      variant={p.variant}
      size={p.size}
      isDisabled={p.disabled || p.loading}
      onPress={p.onPress}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    >
      {p.loading ? <ButtonSpinner /> : null}
      {typeof p.children === 'string' ? <ButtonText>{p.children}</ButtonText> : p.children}
    </GButton>
  );
}

const Text = (p: TextProps) => (
  <GText
    size={p.size}
    bold={p.bold}
    underline={p.underline}
    strikeThrough={p.strikeThrough}
    isTruncated={p.isTruncated}
    testID={p.testID}
  >
    {p.children}
  </GText>
);

const Input = (p: InputProps) => (
  <GInput isDisabled={p.disabled} isInvalid={p.invalid}>
    <InputField
      value={p.value}
      defaultValue={p.defaultValue}
      placeholder={p.placeholder}
      onChangeText={p.onChangeText}
      type={p.secureTextEntry ? 'password' : 'text'}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    />
  </GInput>
);

const Card = (p: CardProps) => (
  <GCard size={p.size} testID={p.testID}>
    {p.children}
  </GCard>
);

const Badge = (p: BadgeProps) => (
  <GBadge variant={p.variant} testID={p.testID}>
    <BadgeText>{p.children}</BadgeText>
  </GBadge>
);

const Switch = (p: SwitchProps) => (
  <GSwitch
    value={!!p.value}
    onValueChange={p.onValueChange}
    isDisabled={p.disabled}
    size={p.size}
    accessibilityLabel={p.accessibilityLabel}
    testID={p.testID}
  />
);

// ---- layout and the rest of the components this library really has ----------------------------------------------

const Box = (p: BoxProps) => <GBox testID={p.testID}>{p.children}</GBox>;
const Center = (p: CenterProps) => <GCenter testID={p.testID}>{p.children}</GCenter>;

// the gap comes from the same spacing step as every other provider, not from gluestack's own `space` presets
function HStack(p: HStackProps) {
  const gap = stackRecipe('row', p, useResolvedTheme()).gap;
  return (
    <GHStack testID={p.testID} style={{ gap: gap as number }}>
      {p.children}
    </GHStack>
  );
}
function VStack(p: VStackProps) {
  const gap = stackRecipe('column', p, useResolvedTheme()).gap;
  return (
    <GVStack testID={p.testID} style={{ gap: gap as number }}>
      {p.children}
    </GVStack>
  );
}

const HEADING_SIZE = { 1: '3xl', 2: '2xl', 3: 'xl', 4: 'lg', 5: 'md', 6: 'sm' } as const;
const Heading = (p: HeadingProps) => (
  <GHeading size={HEADING_SIZE[p.level ?? 2]} isTruncated={p.isTruncated} testID={p.testID}>
    {p.children}
  </GHeading>
);

const Divider = (p: DividerProps) => <GDivider orientation={p.orientation} testID={p.testID} />;

const Spinner = (p: SpinnerProps) => (
  <GSpinner size={p.size === 'lg' ? 'large' : 'small'} aria-label={p.accessibilityLabel} testID={p.testID} />
);

const Pressable = (p: PressableProps) => (
  <GPressable onPress={p.onPress} disabled={p.disabled} accessibilityLabel={p.accessibilityLabel} testID={p.testID}>
    {p.children}
  </GPressable>
);

const Link = (p: LinkProps) => (
  <GLink href={p.href} onPress={p.onPress} testID={p.testID}>
    {typeof p.children === 'string' ? <LinkText>{p.children}</LinkText> : p.children}
  </GLink>
);

const Textarea = (p: TextareaProps) => (
  <GTextarea isDisabled={p.disabled} isInvalid={p.invalid}>
    <TextareaInput
      value={p.value}
      defaultValue={p.defaultValue}
      placeholder={p.placeholder}
      onChangeText={p.onChangeText}
      numberOfLines={p.rows ?? 4}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    />
  </GTextarea>
);

const Skeleton = (p: SkeletonProps) => (
  <GSkeleton
    variant={p.circle ? 'circular' : 'rounded'}
    style={{ width: p.width as number | undefined, height: p.height }}
    testID={p.testID}
  />
);

const components: ProviderComponents = {
  ...rnBase,
  Button,
  Text,
  Input,
  Card,
  Badge,
  Switch,
  Box,
  Center,
  HStack,
  VStack,
  Heading,
  Divider,
  Spinner,
  Pressable,
  Link,
  Textarea,
  Skeleton,
  ...more,
} as ProviderComponents;

// one gluestack provider per registry: the theme is the app's own, never a file inside this package
const providers = new WeakMap<ThemeRegistry, ReturnType<typeof createGluestackUIProvider>>();
function providerFor(registry: ThemeRegistry) {
  let p = providers.get(registry);
  if (!p) providers.set(registry, (p = createGluestackUIProvider(cssVarTables(registry))));
  return p;
}

export const gluestack = defineAdapter({
  name: 'gluestack',
  Provider: ({ theme, registry, children }) => {
    const Themed = providerFor(registry);
    return (
      <Themed mode={theme.mode as 'light' | 'dark'} variant={theme.variant}>
        {children}
      </Themed>
    );
  },
  components,
});
