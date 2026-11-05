/**
 * Type surface of the generated Tailwind theme.
 *
 * The runtime value is `tokens.js`, GENERATED from `design/tokens.xml` +
 * `design/themes.xml` by `npm run design:gen` -- do not edit that file.
 * This stub only types it, so `tailwind.config.ts` also works.
 *
 * Consume it from your Tailwind config:
 *
 *   const tokens = require('@flipova/foundation/tokens');
 *   module.exports = { theme: { extend: tokens.theme } };
 */
declare const tokens: {
  theme: Record<string, Record<string, string | string[]>>;
};

export = tokens;
