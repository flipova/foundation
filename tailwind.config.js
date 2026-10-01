// The Tailwind theme is 100% generated from the design registries:
//   design/tokens.xml  (scales: spacing, radii, type, shadow, z, motion)
//   design/themes.xml  (semantic colours, one per gluestack CSS variable)
//   -> components/ui/gluestack-ui-provider/tokens.js   (`npm run design:gen`)
//
// Do NOT add design values here: change the XML and regenerate, so the
// gluestack/nativewind theme and the runtime config can never drift apart.
const tokens = require('./components/ui/gluestack-ui-provider/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: process.env.DARK_MODE ? process.env.DARK_MODE : 'media',
  content: [
    './app/**/*.{html,js,jsx,ts,tsx,mdx}',
    './components/**/*.{html,js,jsx,ts,tsx,mdx}',
    './utils/**/*.{html,js,jsx,ts,tsx,mdx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  safelist: [
    {
      // Semantic colours, kept for dynamically composed class names.
      pattern:
        /(bg|border|text|stroke|fill|ring|divide)-(background|foreground|card|popover|primary|secondary|muted|accent|destructive|success|warning|error|info|border|input|ring)(-foreground)?(\/\d+)?$/,
    },
  ],
  theme: {
    extend: tokens.theme,
  },
};
