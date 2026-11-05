import React from 'react';
import { View, type TextStyle, type ViewStyle } from 'react-native';
import {
  ActivityIndicator as PaperActivityIndicator,
  Dialog as PaperDialog,
  List as PaperList,
  Avatar as PaperAvatar,
  Checkbox as PaperCheckbox,
  Button as PaperButton,
  Divider as PaperDivider,
  FAB as PaperFab,
  ProgressBar as PaperProgressBar,
  Portal as PaperPortal,
  Card as PaperCard,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Switch as PaperSwitch,
  Text as PaperText,
  TextInput as PaperTextInput,
  type MD3Theme,
} from 'react-native-paper';
import {
  accordionRecipe,
  alertDialogRecipe,
  type AccordionProps,
  type AlertDialogProps,
  avatarRecipe,
  checkboxRecipe,
  initialsOf,
  type AvatarProps,
  type CheckboxProps,
  dividerRecipe,
  fabRecipe,
  headingRecipe,
  iconRecipe,
  progressRecipe,
  spinnerRecipe,
  textareaRecipe,
  type DividerProps,
  type FabProps,
  type HeadingProps,
  type PortalProps,
  type ProgressProps,
  type SpinnerProps,
  type TextareaProps,
  badgeRecipe,
  buttonRecipe,
  cardRecipe,
  inputRecipe,
  switchRecipe,
  textRecipe,
  type BadgeProps,
  type ButtonProps,
  type CardProps,
  type InputProps,
  type ProviderComponents,
  type ResolvedTheme,
  type SwitchProps,
  type TextProps,
} from '../../contract';
import { useResolvedTheme } from '../provider';
import { rnBase } from '../rn-base';
import { defineAdapter } from '../types';

/** The registry theme, spelled as a Material 3 theme: every colour role comes from the registry, never from Paper's palette. */
export function paperTheme(t: ResolvedTheme): MD3Theme {
  const base = t.mode === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const c = t.colors;
  return {
    ...base,
    roundness: t.scale.radii.md,
    colors: {
      ...base.colors,
      primary: c.primary,
      onPrimary: c.primaryForeground,
      secondary: c.secondary,
      onSecondary: c.secondaryForeground,
      error: c.destructive,
      onError: c.destructiveForeground,
      background: c.background,
      onBackground: c.foreground,
      surface: c.card,
      onSurface: c.cardForeground,
      surfaceVariant: c.muted,
      onSurfaceVariant: c.mutedForeground,
      outline: c.border,
      outlineVariant: c.input,
    },
  };
}

// The props handed to Paper are computed by plain functions so that what Paper receives can be checked against the
// recipes without rendering anything (see providers.test.tsx).

export function paperButtonProps(p: ButtonProps, t: ResolvedTheme) {
  const r = buttonRecipe(p, t);
  const { backgroundColor, borderRadius, opacity, borderWidth, borderColor, ...inner } = r.container;
  const variant = p.variant ?? 'default';
  return {
    mode: (variant === 'outline' ? 'outlined' : variant === 'ghost' || variant === 'link' ? 'text' : 'contained') as
      'outlined' | 'text' | 'contained',
    buttonColor: backgroundColor as string,
    textColor: r.label.color as string,
    style: { borderRadius, opacity, ...(borderWidth ? { borderWidth, borderColor } : {}), minWidth: 0 } as ViewStyle,
    contentStyle: inner as ViewStyle,
    labelStyle: { ...r.label, marginVertical: 0, marginHorizontal: 0, letterSpacing: 0 } as TextStyle,
    disabled: !!(p.disabled || p.loading),
    loading: p.loading,
  };
}

export function paperSwitchProps(p: SwitchProps, t: ResolvedTheme) {
  const r = switchRecipe(p, t);
  return { color: r.trackOn, style: { opacity: r.opacity, transform: [{ scale: r.scale }] } };
}

function Button(p: ButtonProps) {
  const t = useResolvedTheme();
  const { style, contentStyle, labelStyle, ...rest } = paperButtonProps(p, t);
  return (
    <PaperButton
      {...rest}
      style={style}
      contentStyle={contentStyle}
      labelStyle={labelStyle}
      onPress={p.onPress}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    >
      {p.children}
    </PaperButton>
  );
}

function Text(p: TextProps) {
  const t = useResolvedTheme();
  return (
    <PaperText style={textRecipe(p, t) as object} numberOfLines={p.isTruncated ? 1 : undefined} testID={p.testID}>
      {p.children}
    </PaperText>
  );
}

function Input(p: InputProps) {
  const t = useResolvedTheme();
  const r = inputRecipe(p, t);
  return (
    <PaperTextInput
      mode="outlined"
      value={p.value}
      defaultValue={p.defaultValue}
      placeholder={p.placeholder}
      onChangeText={p.onChangeText}
      disabled={p.disabled}
      error={p.invalid}
      secureTextEntry={p.secureTextEntry}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
      placeholderTextColor={r.placeholderTextColor}
      outlineColor={r.container.borderColor as string}
      activeOutlineColor={r.focusBorderColor}
      textColor={r.field.color as string}
      outlineStyle={{
        borderRadius: r.container.borderRadius as number,
        borderWidth: r.container.borderWidth as number,
      }}
      style={{
        height: r.container.height as number,
        backgroundColor: 'transparent',
        opacity: r.container.opacity as number,
        fontSize: r.field.fontSize as number,
      }}
      contentStyle={{ paddingHorizontal: r.container.paddingHorizontal as number }}
    />
  );
}

function Card(p: CardProps) {
  const t = useResolvedTheme();
  return (
    <PaperCard mode="outlined" style={cardRecipe(p, t) as object} testID={p.testID}>
      {p.children}
    </PaperCard>
  );
}

function Badge(p: BadgeProps) {
  const t = useResolvedTheme();
  const r = badgeRecipe(p, t);
  return (
    <View style={r.container as object} testID={p.testID}>
      <PaperText style={r.label as object}>{p.children}</PaperText>
    </View>
  );
}

function Switch(p: SwitchProps) {
  const t = useResolvedTheme();
  const { color, style } = paperSwitchProps(p, t);
  return (
    <PaperSwitch
      value={!!p.value}
      onValueChange={p.onValueChange}
      disabled={p.disabled}
      color={color}
      style={style}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    />
  );
}

// ---- the rest of what Paper really has ------------------------------------------------------------------------------

function Heading(p: HeadingProps) {
  const t = useResolvedTheme();
  return (
    <PaperText
      accessibilityRole="header"
      style={headingRecipe(p, t) as object}
      numberOfLines={p.isTruncated ? 1 : undefined}
      testID={p.testID}
    >
      {p.children}
    </PaperText>
  );
}

function Divider(p: DividerProps) {
  const t = useResolvedTheme();
  return <PaperDivider style={dividerRecipe(p, t) as object} testID={p.testID} />;
}

function Spinner(p: SpinnerProps) {
  const t = useResolvedTheme();
  const r = spinnerRecipe(p, t);
  return (
    <PaperActivityIndicator
      animating
      color={r.color}
      size={r.size}
      style={{ transform: [{ scale: r.scale }] }}
      accessibilityLabel={p.accessibilityLabel ?? 'Loading'}
      testID={p.testID}
    />
  );
}

function Progress(p: ProgressProps) {
  const t = useResolvedTheme();
  const r = progressRecipe(p, t);
  return (
    <PaperProgressBar
      progress={r.value / 100}
      color={r.bar.backgroundColor as string}
      style={{
        height: r.track.height as number,
        borderRadius: r.track.borderRadius as number,
        backgroundColor: r.track.backgroundColor as string,
      }}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    />
  );
}

function Textarea(p: TextareaProps) {
  const t = useResolvedTheme();
  const r = textareaRecipe(p, t);
  return (
    <PaperTextInput
      mode="outlined"
      multiline
      numberOfLines={p.rows ?? 4}
      value={p.value}
      defaultValue={p.defaultValue}
      placeholder={p.placeholder}
      onChangeText={p.onChangeText}
      disabled={p.disabled}
      error={p.invalid}
      placeholderTextColor={r.placeholderTextColor}
      outlineColor={r.field.borderColor as string}
      activeOutlineColor={r.focusBorderColor}
      textColor={r.field.color as string}
      outlineStyle={{ borderRadius: r.field.borderRadius as number, borderWidth: r.field.borderWidth as number }}
      style={{
        minHeight: r.field.minHeight as number,
        backgroundColor: 'transparent',
        opacity: r.field.opacity as number,
        fontSize: r.field.fontSize as number,
      }}
      accessibilityLabel={p.accessibilityLabel}
      testID={p.testID}
    />
  );
}

function Fab(p: FabProps) {
  const t = useResolvedTheme();
  const r = fabRecipe(p, t);
  return (
    <PaperFab
      icon={() => <PaperText style={r.icon as object}>{iconRecipe({ name: p.icon ?? 'plus' }, t).glyph}</PaperText>}
      label={p.label}
      onPress={p.onPress}
      color={r.label.color as string}
      style={{
        position: 'absolute',
        right: r.container.right as number,
        bottom: r.container.bottom as number,
        backgroundColor: r.container.backgroundColor as string,
        borderRadius: r.container.borderRadius as number,
      }}
      accessibilityLabel={p.accessibilityLabel ?? p.label ?? 'Action'}
      testID={p.testID}
    />
  );
}

const Portal = (p: PortalProps) => <PaperPortal>{p.children}</PaperPortal>;

function Checkbox(p: CheckboxProps) {
  const t = useResolvedTheme();
  const r = checkboxRecipe(p, t);
  return (
    <View style={r.row as object} testID={p.testID}>
      <PaperCheckbox
        status={p.checked ? 'checked' : 'unchecked'}
        onPress={() => p.onCheckedChange?.(!p.checked)}
        disabled={p.disabled}
        color={t.colors.primary}
        uncheckedColor={r.box.borderColor as string}
        aria-label={p.accessibilityLabel ?? p.label}
      />
      {p.label ? <PaperText style={r.label as object}>{p.label}</PaperText> : null}
    </View>
  );
}

function Avatar(p: AvatarProps) {
  const t = useResolvedTheme();
  const r = avatarRecipe(p, t);
  const size = r.container.width as number;
  return p.source ? (
    <PaperAvatar.Image
      size={size}
      source={{ uri: p.source }}
      accessibilityLabel={p.accessibilityLabel ?? p.name}
      testID={p.testID}
    />
  ) : (
    <PaperAvatar.Text
      size={size}
      label={initialsOf(p.name)}
      color={r.initials.color as string}
      style={{ backgroundColor: r.container.backgroundColor as string }}
      labelStyle={{ fontSize: r.initials.fontSize as number }}
      accessibilityLabel={p.accessibilityLabel ?? p.name}
      testID={p.testID}
    />
  );
}

function AlertDialog(p: AlertDialogProps) {
  const t = useResolvedTheme();
  const r = alertDialogRecipe(t);
  return (
    <PaperPortal>
      <PaperDialog
        visible={p.visible}
        onDismiss={p.onCancel}
        style={{ backgroundColor: r.panel.backgroundColor as string, borderRadius: r.panel.borderRadius as number }}
        testID={p.testID}
      >
        <PaperDialog.Title style={r.title as object}>{p.title}</PaperDialog.Title>
        {p.description ? (
          <PaperDialog.Content>
            <PaperText style={r.description as object}>{p.description}</PaperText>
          </PaperDialog.Content>
        ) : null}
        <PaperDialog.Actions>
          <PaperButton textColor={t.colors.foreground} onPress={p.onCancel}>
            {p.cancelLabel ?? 'Cancel'}
          </PaperButton>
          <PaperButton textColor={p.destructive ? t.colors.destructive : t.colors.primary} onPress={p.onConfirm}>
            {p.confirmLabel ?? 'Confirm'}
          </PaperButton>
        </PaperDialog.Actions>
      </PaperDialog>
    </PaperPortal>
  );
}

function Accordion({ items, type = 'single', value, defaultValue = [], onValueChange, testID }: AccordionProps) {
  const t = useResolvedTheme();
  const r = accordionRecipe(t);
  const [inner, setInner] = React.useState<string[]>(defaultValue);
  const open = value ?? inner;
  const toggle = (key: string) => {
    const next = open.includes(key) ? open.filter((k) => k !== key) : type === 'single' ? [key] : [...open, key];
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <View style={r.container as object} testID={testID}>
      {items.map((it) => (
        <PaperList.Accordion
          key={it.key}
          id={it.key}
          title={it.title}
          expanded={open.includes(it.key)}
          onPress={() => (it.disabled ? undefined : toggle(it.key))}
          titleStyle={r.title as object}
          style={{ backgroundColor: 'transparent', opacity: it.disabled ? 0.4 : 1 }}
        >
          <View style={r.content as object}>{it.content}</View>
        </PaperList.Accordion>
      ))}
    </View>
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
  Heading,
  Divider,
  Spinner,
  Progress,
  Textarea,
  Fab,
  Portal,
  Checkbox,
  Avatar,
  AlertDialog,
  Accordion,
};

export const paper = defineAdapter({
  name: 'paper',
  Provider: ({ theme, children }) => <PaperProvider theme={paperTheme(theme)}>{children}</PaperProvider>,
  components,
});
