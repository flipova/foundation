export const script = (mode: string, themeId: string, modeClass: string) => {
  const documentElement = document.documentElement;

  function getSystemColorMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  try {
    const isSystem = mode === 'system';
    const resolved = isSystem ? getSystemColorMode() : mode;
    // `data-theme` carries the variant pair (spring-light, spring-dark, ...);
    // the light/dark CLASS is kept alongside it so Tailwind's dark: variants
    // keep working while a seasonal palette is mounted.
    documentElement.setAttribute('data-theme', themeId);
    documentElement.classList.remove('light', 'dark', modeClass);
    documentElement.classList.add(resolved);
    if (themeId !== resolved) {
      documentElement.classList.add(modeClass);
    }
    documentElement.style.colorScheme = resolved;
  } catch (e) {
    console.error(e);
  }
};
