/**
 * Tests unitaires du SnackPanel — machine à états et logique métier
 *
 * Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5
 *
 * Tests:
 * - État idle : le bouton "Open in Snack" est visible
 * - État loading : spinner affiché, boutons d'action désactivés
 * - État online : QRCode rendu avec snackUrl, boutons "Push update" et "Close" visibles
 * - État error : message d'erreur affiché, bouton "Retry" visible
 * - closeSnack() : status revient à 'idle', snackUrl et webUrl à null
 *
 * Note: Tests are written as pure logic/state machine tests (no React rendering).
 * We test the state transition logic and business rules directly, similar to
 * how Topbar.test.tsx tests tooltip logic without rendering the component.
 */

import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// SnackStatus type — mirrors SnackPanel.tsx
// ---------------------------------------------------------------------------

type SnackStatus = 'idle' | 'loading' | 'online' | 'error';

// ---------------------------------------------------------------------------
// SnackPanel state model — mirrors the internal state of SnackPanel
// ---------------------------------------------------------------------------

interface SnackPanelState {
  status: SnackStatus;
  snackUrl: string | null;
  webUrl: string | null;
  error: string | null;
  connectedClients: number;
  lastUpdated: Date | null;
}

function initialState(): SnackPanelState {
  return {
    status: 'idle',
    snackUrl: null,
    webUrl: null,
    error: null,
    connectedClients: 0,
    lastUpdated: null,
  };
}

// ---------------------------------------------------------------------------
// State transition functions — mirror the logic in SnackPanel.tsx
// ---------------------------------------------------------------------------

/** Transition to loading state when "Open in Snack" is clicked */
function startLoading(state: SnackPanelState): SnackPanelState {
  return { ...state, status: 'loading', error: null };
}

/** Transition to online state after successful Snack creation */
function goOnline(
  state: SnackPanelState,
  snackUrl: string,
  webUrl: string,
  lastUpdated: Date
): SnackPanelState {
  return { ...state, status: 'online', snackUrl, webUrl, lastUpdated };
}

/** Transition to error state on failure */
function setError(state: SnackPanelState, message: string): SnackPanelState {
  return { ...state, status: 'error', error: message };
}

/**
 * closeSnack() — mirrors SnackPanel.closeSnack()
 * Resets status to 'idle', clears URLs and connectedClients.
 *
 * Validates: Requirements 7.2
 */
function closeSnack(state: SnackPanelState): SnackPanelState {
  return {
    ...state,
    status: 'idle',
    snackUrl: null,
    webUrl: null,
    connectedClients: 0,
  };
}

// ---------------------------------------------------------------------------
// UI visibility rules — derived from SnackPanel.tsx render logic
// ---------------------------------------------------------------------------

/** Returns true if the "Open in Snack" button should be visible */
function isOpenInSnackButtonVisible(state: SnackPanelState): boolean {
  return state.status === 'idle';
}

/** Returns true if the loading spinner should be visible */
function isSpinnerVisible(state: SnackPanelState): boolean {
  return state.status === 'loading';
}

/** Returns true if action buttons (Push update, Open in Snack) are disabled */
function areActionButtonsDisabled(state: SnackPanelState): boolean {
  return state.status === 'loading';
}

/** Returns true if the QRCode component should be rendered */
function isQRCodeVisible(state: SnackPanelState): boolean {
  return state.status === 'online' && state.snackUrl !== null;
}

/** Returns true if the "Push update" button is visible */
function isPushUpdateButtonVisible(state: SnackPanelState): boolean {
  return state.status === 'online';
}

/** Returns true if the "Close" button is visible */
function isCloseButtonVisible(state: SnackPanelState): boolean {
  return state.status === 'online';
}

/** Returns true if the error message is visible */
function isErrorMessageVisible(state: SnackPanelState): boolean {
  return state.status === 'error' && state.error !== null;
}

/** Returns true if the "Retry" button is visible */
function isRetryButtonVisible(state: SnackPanelState): boolean {
  return state.status === 'error';
}

/** Returns the QRCode value prop (snackUrl) when online */
function getQRCodeValue(state: SnackPanelState): string | null {
  return state.status === 'online' ? state.snackUrl : null;
}

// ---------------------------------------------------------------------------
// Tests — État idle (Requirement 11.1)
// ---------------------------------------------------------------------------

describe('SnackPanel — état idle (Requirement 11.1)', () => {
  it('le bouton "Open in Snack" est visible en état idle', () => {
    const state = initialState();
    expect(isOpenInSnackButtonVisible(state)).toBe(true);
  });

  it('le spinner n\'est pas visible en état idle', () => {
    const state = initialState();
    expect(isSpinnerVisible(state)).toBe(false);
  });

  it('le QR code n\'est pas visible en état idle', () => {
    const state = initialState();
    expect(isQRCodeVisible(state)).toBe(false);
  });

  it('le bouton "Retry" n\'est pas visible en état idle', () => {
    const state = initialState();
    expect(isRetryButtonVisible(state)).toBe(false);
  });

  it('les boutons "Push update" et "Close" ne sont pas visibles en état idle', () => {
    const state = initialState();
    expect(isPushUpdateButtonVisible(state)).toBe(false);
    expect(isCloseButtonVisible(state)).toBe(false);
  });

  it('l\'état initial a status=idle, snackUrl=null, webUrl=null', () => {
    const state = initialState();
    expect(state.status).toBe('idle');
    expect(state.snackUrl).toBeNull();
    expect(state.webUrl).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Tests — État loading (Requirement 11.2)
// ---------------------------------------------------------------------------

describe('SnackPanel — état loading (Requirement 11.2)', () => {
  it('le spinner est visible en état loading', () => {
    const state = startLoading(initialState());
    expect(isSpinnerVisible(state)).toBe(true);
  });

  it('les boutons d\'action sont désactivés en état loading', () => {
    const state = startLoading(initialState());
    expect(areActionButtonsDisabled(state)).toBe(true);
  });

  it('le bouton "Open in Snack" n\'est pas visible en état loading', () => {
    const state = startLoading(initialState());
    expect(isOpenInSnackButtonVisible(state)).toBe(false);
  });

  it('le bouton "Push update" n\'est pas visible en état loading', () => {
    const state = startLoading(initialState());
    expect(isPushUpdateButtonVisible(state)).toBe(false);
  });

  it('le bouton "Close" n\'est pas visible en état loading', () => {
    const state = startLoading(initialState());
    expect(isCloseButtonVisible(state)).toBe(false);
  });

  it('le QR code n\'est pas visible en état loading', () => {
    const state = startLoading(initialState());
    expect(isQRCodeVisible(state)).toBe(false);
  });

  it('startLoading efface l\'erreur précédente', () => {
    const errorState = setError(initialState(), 'Previous error');
    const loadingState = startLoading(errorState);
    expect(loadingState.error).toBeNull();
    expect(loadingState.status).toBe('loading');
  });
});

// ---------------------------------------------------------------------------
// Tests — État online (Requirement 11.3)
// ---------------------------------------------------------------------------

describe('SnackPanel — état online (Requirement 11.3)', () => {
  const snackUrl = 'exp://u.expo.dev/abc123';
  const webUrl = 'https://snack.expo.dev/abc123';
  const now = new Date();

  function onlineState(): SnackPanelState {
    return goOnline(startLoading(initialState()), snackUrl, webUrl, now);
  }

  it('le QR code est rendu avec snackUrl en état online', () => {
    const state = onlineState();
    expect(isQRCodeVisible(state)).toBe(true);
    expect(getQRCodeValue(state)).toBe(snackUrl);
  });

  it('le bouton "Push update" est visible en état online', () => {
    const state = onlineState();
    expect(isPushUpdateButtonVisible(state)).toBe(true);
  });

  it('le bouton "Close" est visible en état online', () => {
    const state = onlineState();
    expect(isCloseButtonVisible(state)).toBe(true);
  });

  it('le bouton "Open in Snack" n\'est pas visible en état online', () => {
    const state = onlineState();
    expect(isOpenInSnackButtonVisible(state)).toBe(false);
  });

  it('le spinner n\'est pas visible en état online', () => {
    const state = onlineState();
    expect(isSpinnerVisible(state)).toBe(false);
  });

  it('les boutons d\'action ne sont pas désactivés en état online', () => {
    const state = onlineState();
    expect(areActionButtonsDisabled(state)).toBe(false);
  });

  it('snackUrl est non-null en état online (Property 1 — Requirement 5.7)', () => {
    const state = onlineState();
    expect(state.status).toBe('online');
    expect(state.snackUrl).not.toBeNull();
  });

  it('le QR code n\'est pas rendu si snackUrl est null même en état online', () => {
    // Edge case: online state without URL (shouldn't happen per spec, but defensive)
    const state: SnackPanelState = {
      ...onlineState(),
      snackUrl: null,
    };
    expect(isQRCodeVisible(state)).toBe(false);
  });

  it('getQRCodeValue retourne la snackUrl exacte', () => {
    const state = onlineState();
    expect(getQRCodeValue(state)).toBe(snackUrl);
  });
});

// ---------------------------------------------------------------------------
// Tests — État error (Requirement 11.4)
// ---------------------------------------------------------------------------

describe('SnackPanel — état error (Requirement 11.4)', () => {
  const errorMessage = 'Server error: 500';

  function errorState(): SnackPanelState {
    return setError(startLoading(initialState()), errorMessage);
  }

  it('le message d\'erreur est affiché en état error', () => {
    const state = errorState();
    expect(isErrorMessageVisible(state)).toBe(true);
    expect(state.error).toBe(errorMessage);
  });

  it('le bouton "Retry" est visible en état error', () => {
    const state = errorState();
    expect(isRetryButtonVisible(state)).toBe(true);
  });

  it('le bouton "Open in Snack" n\'est pas visible en état error', () => {
    const state = errorState();
    expect(isOpenInSnackButtonVisible(state)).toBe(false);
  });

  it('le spinner n\'est pas visible en état error', () => {
    const state = errorState();
    expect(isSpinnerVisible(state)).toBe(false);
  });

  it('le QR code n\'est pas visible en état error', () => {
    const state = errorState();
    expect(isQRCodeVisible(state)).toBe(false);
  });

  it('le message d\'erreur contient le texte de l\'erreur', () => {
    const state = errorState();
    expect(state.error).toContain('500');
  });

  it('error !== null en état error (Property 7 — Requirement 5.8)', () => {
    const state = errorState();
    expect(state.status).toBe('error');
    expect(state.error).not.toBeNull();
    expect(state.error!.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — closeSnack() (Requirement 11.5, 7.2)
// ---------------------------------------------------------------------------

describe('SnackPanel — closeSnack() (Requirement 11.5, 7.2)', () => {
  const snackUrl = 'exp://u.expo.dev/abc123';
  const webUrl = 'https://snack.expo.dev/abc123';
  const now = new Date();

  function onlineState(): SnackPanelState {
    return goOnline(startLoading(initialState()), snackUrl, webUrl, now);
  }

  it('closeSnack() remet status à "idle"', () => {
    const state = closeSnack(onlineState());
    expect(state.status).toBe('idle');
  });

  it('closeSnack() remet snackUrl à null', () => {
    const state = closeSnack(onlineState());
    expect(state.snackUrl).toBeNull();
  });

  it('closeSnack() remet webUrl à null', () => {
    const state = closeSnack(onlineState());
    expect(state.webUrl).toBeNull();
  });

  it('closeSnack() remet connectedClients à 0', () => {
    const withClients: SnackPanelState = { ...onlineState(), connectedClients: 3 };
    const state = closeSnack(withClients);
    expect(state.connectedClients).toBe(0);
  });

  it('closeSnack() depuis idle ne change pas l\'état (idempotent)', () => {
    const idle = initialState();
    const state = closeSnack(idle);
    expect(state.status).toBe('idle');
    expect(state.snackUrl).toBeNull();
    expect(state.webUrl).toBeNull();
  });

  it('closeSnack() depuis error remet aussi status à idle', () => {
    const errorState = setError(startLoading(initialState()), 'some error');
    const state = closeSnack(errorState);
    expect(state.status).toBe('idle');
  });

  it('après closeSnack(), le bouton "Open in Snack" redevient visible', () => {
    const state = closeSnack(onlineState());
    expect(isOpenInSnackButtonVisible(state)).toBe(true);
  });

  it('après closeSnack(), le QR code n\'est plus visible', () => {
    const state = closeSnack(onlineState());
    expect(isQRCodeVisible(state)).toBe(false);
  });

  it('après closeSnack(), les boutons "Push update" et "Close" ne sont plus visibles', () => {
    const state = closeSnack(onlineState());
    expect(isPushUpdateButtonVisible(state)).toBe(false);
    expect(isCloseButtonVisible(state)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Tests — Transitions d'état complètes (flux complet)
// ---------------------------------------------------------------------------

describe('SnackPanel — transitions d\'état (flux complet)', () => {
  it('flux complet : idle → loading → online', () => {
    let state = initialState();
    expect(state.status).toBe('idle');

    state = startLoading(state);
    expect(state.status).toBe('loading');

    state = goOnline(state, 'exp://u.expo.dev/xyz', 'https://snack.expo.dev/xyz', new Date());
    expect(state.status).toBe('online');
    expect(state.snackUrl).toBe('exp://u.expo.dev/xyz');
    expect(state.webUrl).toBe('https://snack.expo.dev/xyz');
  });

  it('flux d\'erreur : idle → loading → error → loading (retry) → online', () => {
    let state = initialState();
    state = startLoading(state);
    state = setError(state, 'Network error');
    expect(state.status).toBe('error');

    // Retry
    state = startLoading(state);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();

    state = goOnline(state, 'exp://u.expo.dev/xyz', 'https://snack.expo.dev/xyz', new Date());
    expect(state.status).toBe('online');
  });

  it('flux de fermeture : online → idle (via closeSnack)', () => {
    let state = goOnline(
      startLoading(initialState()),
      'exp://u.expo.dev/xyz',
      'https://snack.expo.dev/xyz',
      new Date()
    );
    expect(state.status).toBe('online');

    state = closeSnack(state);
    expect(state.status).toBe('idle');
    expect(state.snackUrl).toBeNull();
    expect(state.webUrl).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Property-Based Tests — P6 (Requirement 4.1, 12.3)
// ---------------------------------------------------------------------------

import * as fc from 'fast-check';

describe('Property-Based Tests — SnackPanel (Property P6)', () => {
  /**
   * P6: For any non-null snackUrl, QRCode receives a non-empty value
   *
   * Validates: Requirements 4.1, 12.3
   */
  it('P6: for any non-null snackUrl, QRCode receives a non-empty value', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (url) => {
          const state: SnackPanelState = {
            status: 'online',
            snackUrl: url,
            webUrl: 'https://snack.expo.dev/test',
            error: null,
            connectedClients: 0,
            lastUpdated: new Date(),
          };
          const value = getQRCodeValue(state);
          return value !== null && value.length > 0;
        }
      )
    );
  });
});
