'use client';
import React, { useEffect, useLayoutEffect } from 'react';
import { config, variants } from './config';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { setFlushStyles } from '@gluestack-ui/utils/nativewind-utils';
import { script } from './script';
import { resolveThemeId } from './theme-context';

export type ModeType = 'light' | 'dark' | 'system';

/** A light/dark pair declared in `design/themes.xml` (e.g. `spring`). */
export type ThemeVariant = keyof typeof variants | (string & {});

const variableStyleTagId = 'nativewind-style';
const createStyle = (styleTagId: string) => {
  const style = document.createElement('style');
  style.id = styleTagId;
  style.appendChild(document.createTextNode(''));
  return style;
};

export const useSafeLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function GluestackUIProvider({
  mode = 'light',
  variant,
  ...props
}: {
  mode?: ModeType;
  variant?: ThemeVariant;
  children?: React.ReactNode;
}) {
  // Every declared theme gets a CSS block. The two default ids keep their historic
  // selectors (:root / .dark) so existing apps and Tailwind's dark: keep working;
  // any OTHER theme (a variant pair such as spring-light/spring-dark) is keyed on
  // [data-theme], which is emitted last so it wins over :root and .dark.
  const themeIds = Object.keys(config);
  const isDefaultId = (id: string) => id === 'light' || id === 'dark';
  let cssVariablesWithMode = ``;
  let variantCss = ``;
  themeIds.forEach((configKey) => {
    const cssVariables = Object.keys(
      config[configKey as keyof typeof config]
    ).reduce((acc: string, curr: string) => {
      acc += `${curr}:${config[configKey as keyof typeof config][curr]}; `;
      return acc;
    }, '');
    if (isDefaultId(configKey)) {
      cssVariablesWithMode +=
        configKey === 'dark' ? `\n .dark {\n ` : `\n:root {\n`;
      cssVariablesWithMode += `${cssVariables} \n}`;
    } else {
      variantCss += `\n[data-theme='${configKey}'] {\n${cssVariables} \n}`;
    }
  });
  cssVariablesWithMode += variantCss;

  setFlushStyles(cssVariablesWithMode);

  const handleMediaQuery = React.useCallback((e: MediaQueryListEvent) => {
    const resolved = e.matches ? 'dark' : 'light';
    script(resolved, resolveThemeId(variants, variant, resolved), resolved);
  }, [variant]);

  // The script keeps the light/dark class AND the variant class/attribute in step.
  const activeMode = mode === 'system' ? 'light' : mode;
  const themeId = resolveThemeId(variants, variant, activeMode);
  const modeClass = themeId === activeMode ? '' : themeId;

  useSafeLayoutEffect(() => {
    if (mode !== 'system') {
      const documentElement = document.documentElement;
      if (documentElement) {
        documentElement.setAttribute('data-theme', themeId);
        documentElement.classList.remove('light', 'dark', modeClass);
        documentElement.classList.add(mode);
        if (modeClass) {
          documentElement.classList.add(modeClass);
        }
        documentElement.style.colorScheme = mode;
      }
    }
  }, [mode, themeId, modeClass]);

  useSafeLayoutEffect(() => {
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    media.addListener(handleMediaQuery);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  useSafeLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const documentElement = document.documentElement;
      if (documentElement) {
        const head = documentElement.querySelector('head');
        let style = head?.querySelector(`[id='${variableStyleTagId}']`);
        if (!style) {
          style = createStyle(variableStyleTagId);
          style.innerHTML = cssVariablesWithMode;
          if (head) head.appendChild(style);
        }
      }
    }
  }, []);

  return (
    <>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(${script.toString()})('${mode}', '${themeId}', '${modeClass}')`,
        }}
      />
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </>
  );
}
