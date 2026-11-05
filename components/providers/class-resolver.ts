import { designTheme } from '../theme/design-theme';
import type { ResolvedTheme } from '../contract';
import { withAlpha } from '../contract';
import type { Style } from '../contract';

/**
 * Resolves the Tailwind utilities the Reusables adapter uses back to the style values they stand for, from the same
 * registry the CSS variables and the Tailwind theme are generated from. It exists to test the class lists; it throws
 * on a utility it does not know, so adding a class to the adapter forces teaching this table about it.
 */
const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

export function resolveClasses(classes: string, t: ResolvedTheme): Style {
  const out: Style = {};
  const colour = (name: string): string | undefined => {
    if (name === 'white') return '#ffffff';
    if (name === 'transparent') return 'transparent';
    const hit = Object.entries(t.colors).find(([k]) => kebab(k) === name.replace(/\/\d+$/, ''));
    if (!hit) return undefined;
    const alpha = /\/(\d+)$/.exec(name);
    return alpha ? withAlpha(hit[1], Number(alpha[1]) / 100) : hit[1];
  };
  const sp = (k: string) => (designTheme.scale.spacing as Record<string, number>)[k];
  const set = (k: string, v: string | number | undefined, cls: string) => {
    if (v === undefined) throw new Error(`class "${cls}": no such value in the registry`);
    out[k] = v;
  };

  for (const cls of classes.split(/\s+/).filter(Boolean)) {
    let m: RegExpExecArray | null;
    if (cls === 'flex-row') out.flexDirection = 'row';
    else if (cls === 'flex-col') out.flexDirection = 'column';
    else if (cls === 'items-center') out.alignItems = 'center';
    else if (cls === 'justify-center') out.justifyContent = 'center';
    else if (cls === 'flex-1') out.flex = 1;
    else if (cls === 'w-full') out.width = '100%';
    else if (cls === 'h-full') out.height = '100%';
    else if (cls === 'border') out.borderWidth = 1;
    else if (cls === 'h-px') out.height = 1;
    else if (cls === 'w-px') out.width = 1;
    else if (cls === 'self-stretch') out.alignSelf = 'stretch';
    else if (cls === 'overflow-hidden') out.overflow = 'hidden';
    else if (cls === 'tracking-tight') out.__tight = 1;
    else if (cls === 'uppercase') out.textTransform = 'uppercase';
    else if (cls === 'underline')
      out.textDecorationLine = out.textDecorationLine ? `${out.textDecorationLine} underline` : 'underline';
    else if (cls === 'line-through')
      out.textDecorationLine = out.textDecorationLine ? `underline line-through` : 'line-through';
    else if (cls === 'shadow-sm') out.__shadow = 'sm';
    else if ((m = /^rounded-(.+)$/.exec(cls)))
      set('borderRadius', (designTheme.scale.radii as Record<string, number>)[m[1]], cls);
    else if ((m = /^p-(.+)$/.exec(cls))) set('padding', sp(m[1]), cls);
    else if ((m = /^px-(.+)$/.exec(cls))) set('paddingHorizontal', sp(m[1]), cls);
    else if ((m = /^py-(.+)$/.exec(cls))) set('paddingVertical', sp(m[1]), cls);
    else if ((m = /^gap-(.+)$/.exec(cls))) set('gap', sp(m[1]), cls);
    else if ((m = /^min-h-(.+)$/.exec(cls))) set('minHeight', sp(m[1]), cls);
    else if ((m = /^min-w-(.+)$/.exec(cls))) set('minWidth', sp(m[1]), cls);
    else if ((m = /^h-(.+)$/.exec(cls))) set('height', sp(m[1]), cls);
    else if ((m = /^w-(.+)$/.exec(cls))) set('width', sp(m[1]), cls);
    else if ((m = /^opacity-(\d+)$/.exec(cls))) out.opacity = Number(m[1]) / 100;
    else if ((m = /^scale-(\d+)$/.exec(cls))) out.__scale = Number(m[1]) / 100;
    else if ((m = /^font-(.+)$/.exec(cls)) && m[1] in designTheme.scale.fontWeights)
      out.fontWeight = String((designTheme.scale.fontWeights as Record<string, number>)[m[1]]);
    else if ((m = /^border-(.+)$/.exec(cls))) set('borderColor', colour(m[1]), cls);
    else if ((m = /^bg-(.+)$/.exec(cls))) set('backgroundColor', colour(m[1]), cls);
    else if ((m = /^text-(.+)$/.exec(cls))) {
      const size = (designTheme.scale.fontSizes as Record<string, number>)[m[1]];
      if (size !== undefined) out.fontSize = size;
      else set('color', colour(m[1]), cls);
    } else throw new Error(`class "${cls}" is not known to the resolver`);
  }
  // tracking-tight is a fraction of the font size (the registry's letterSpacings.tight), as the recipes compute it
  if (out.__tight) {
    const size = out.fontSize as number;
    out.letterSpacing = Math.round(size * (t.scale.letterSpacings as Record<string, number>).tight * 100) / 100;
    delete out.__tight;
  }
  return out;
}
