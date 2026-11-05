'use strict';
/**
 * The colour roles the components read (the same list as REQUIRED_ROLES in components/contract/theme.ts; a test keeps
 * the two in step). A theme may define more roles; these it must define, or the components would have no colour.
 */
const REQUIRED_ROLES = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
  'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 'border', 'input', 'ring',
  'success', 'success-foreground', 'warning', 'warning-foreground', 'error', 'error-foreground', 'info', 'info-foreground',
]; // prettier-ignore

/** { themeId: [missing role ids] } for the themes that lack some (given { themeId: { roleId: colour } }) */
function missingRoles(themes) {
  const out = {};
  for (const [id, roles] of Object.entries(themes)) {
    const miss = REQUIRED_ROLES.filter((r) => !(r in roles));
    if (miss.length) out[id] = miss;
  }
  return out;
}

module.exports = { REQUIRED_ROLES, missingRoles };
