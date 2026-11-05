import type {
  AvatarProps,
  CheckboxProps,
  DividerProps,
  HeadingProps,
  ProgressProps,
  SkeletonProps,
  StackProps,
  BadgeProps,
  ButtonProps,
  CardProps,
  InputProps,
  SwitchProps,
  TextProps,
} from '../../contract';

/**
 * The Tailwind classes of the Reusables adapter (shadcn naming: bg-primary, text-muted-foreground...). They only name
 * theme roles and scale steps; the values come from the CSS variables / Tailwind theme generated from the same
 * registry as every other provider, and the tests resolve them back to numbers and compare with the recipes.
 */
const join = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(' ');

export function buttonClasses({ variant = 'default', size = 'default', disabled }: ButtonProps) {
  const bg = {
    default: 'bg-primary',
    destructive: 'bg-destructive',
    outline: 'border border-border bg-background',
    secondary: 'bg-secondary',
    ghost: '',
    link: '',
  }[variant];
  const dims = { default: 'px-4 py-2', sm: 'min-h-8 px-3', lg: 'min-h-10 px-8', icon: 'min-h-9 min-w-9' }[size];
  const fg = {
    default: 'text-primary-foreground',
    destructive: 'text-white',
    outline: 'text-foreground',
    secondary: 'text-secondary-foreground',
    ghost: 'text-foreground',
    link: 'text-primary',
  }[variant];
  return {
    container: join('flex-row items-center justify-center rounded-md gap-2', bg, dims, disabled && 'opacity-40'),
    label: join('font-medium', size === 'sm' ? 'text-xs' : 'text-sm', fg),
  };
}

export const textClasses = ({ size = 'md', bold, underline, strikeThrough }: TextProps) =>
  join(
    'text-foreground',
    `text-${size}`,
    bold && 'font-bold',
    underline && 'underline',
    strikeThrough && 'line-through',
  );

export function inputClasses({ disabled, invalid }: InputProps) {
  return {
    container: join(
      'h-9 w-full flex-row items-center gap-2 rounded-md border bg-transparent px-3',
      invalid ? 'border-destructive/40' : 'border-border',
      disabled && 'opacity-50',
    ),
    field: 'flex-1 h-full py-1 text-sm text-foreground',
  };
}

export const cardClasses = ({ size = 'default' }: CardProps) =>
  join('flex-col bg-card border border-border rounded-xl shadow-sm', size === 'sm' ? 'p-3 gap-3' : 'p-4 gap-6');

export function badgeClasses({ variant = 'default' }: BadgeProps) {
  const bg = {
    default: 'bg-primary',
    secondary: 'bg-secondary',
    destructive: 'bg-destructive',
    outline: 'border border-border bg-transparent',
  }[variant];
  const fg = {
    default: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    destructive: 'text-white',
    outline: 'text-foreground',
  }[variant];
  return {
    container: join('flex-row items-center justify-center rounded-sm px-2 py-0.5', bg),
    label: join('text-xs font-medium uppercase', fg),
  };
}

export function switchClasses({ size = 'md', disabled }: SwitchProps) {
  return {
    root: join(
      'h-6 w-11 flex-row items-center rounded-full',
      { sm: 'scale-75', md: '', lg: 'scale-125' }[size],
      disabled && 'opacity-40',
    ),
    trackOn: 'bg-primary',
    trackOff: 'bg-input',
    thumb: 'h-5 w-5 rounded-full bg-background',
  };
}

// ---- the rest of the contract that a Tailwind class list can express ---------------------------------------------------

export const dividerClasses = ({ orientation = 'horizontal' }: DividerProps) =>
  orientation === 'vertical' ? 'w-px self-stretch bg-border' : 'h-px w-full bg-border';

export const stackClasses = (direction: 'row' | 'column', { space = '2' }: StackProps) =>
  `${direction === 'row' ? 'flex-row' : 'flex-col'} gap-${space}`;

const HEADING_SIZE = { 1: '4xl', 2: '3xl', 3: '2xl', 4: 'xl', 5: 'lg', 6: 'md' } as const;
export const headingClasses = ({ level = 2 }: HeadingProps) =>
  join(
    'text-foreground',
    `text-${HEADING_SIZE[level]}`,
    level <= 4 ? 'font-bold' : 'font-semibold',
    level <= 2 && 'tracking-tight',
  );

export const linkClasses = () => 'text-primary text-md underline';

const AVATAR_BOX = { sm: '8', md: '10', lg: '14', xl: '20' } as const;
const AVATAR_TEXT = { sm: 'xs', md: 'sm', lg: 'xl', xl: '3xl' } as const;
export function avatarClasses({ size = 'md' }: AvatarProps) {
  const box = AVATAR_BOX[size];
  return {
    container: `h-${box} w-${box} rounded-full overflow-hidden items-center justify-center bg-muted`,
    image: `h-${box} w-${box}`,
    initials: `text-muted-foreground text-${AVATAR_TEXT[size]} font-medium`,
  };
}

const PROGRESS_HEIGHT = { sm: '1', md: '2', lg: '3' } as const;
/** the bar's width is the value itself, so it goes in `style`, not in a class */
export const progressClasses = ({ size = 'md' }: Pick<ProgressProps, 'size'>) => ({
  track: `w-full h-${PROGRESS_HEIGHT[size]} rounded-full overflow-hidden bg-muted`,
  bar: 'h-full rounded-full bg-primary',
});

export function checkboxClasses({ checked = false, disabled = false, invalid = false }: CheckboxProps) {
  return {
    row: join('flex-row items-center gap-2', disabled && 'opacity-40'),
    box: join(
      'h-5 w-5 items-center justify-center rounded-sm border',
      invalid ? 'border-destructive/60' : checked ? 'border-primary' : 'border-input',
      checked ? 'bg-primary' : 'bg-transparent',
    ),
    mark: 'text-primary-foreground text-xs',
    label: 'text-foreground text-sm',
  };
}

export const formControlClasses = ({ disabled = false }: { disabled?: boolean }) => ({
  root: join('gap-1.5', disabled && 'opacity-50'),
  label: 'text-foreground text-sm font-medium',
  required: 'text-destructive',
  helper: 'text-muted-foreground text-xs',
  error: 'text-destructive text-xs',
});

/** width / height come from the props, so they go in `style` */
export const skeletonClasses = ({ circle = false }: SkeletonProps) =>
  join('bg-muted', circle ? 'rounded-full' : 'rounded-md');
