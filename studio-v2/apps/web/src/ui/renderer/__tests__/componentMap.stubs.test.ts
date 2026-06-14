/**
 * Property 13 : `getComponent` est null-safe
 * Property 14 : Les stubs émettent un warning en DEV
 *
 * Validates: Requirements 10.1, 10.4
 *
 * Property 13: For any string id, getComponent(id) returns null or a function,
 *              never throws.
 * Property 14: For each stub component (BlurView, LottieAnimation, Tabs, FlatList),
 *              rendering it in DEV mode emits at least one console.warn containing
 *              the component name.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import React from "react";
import { blockRegistry, getBlockMeta } from "../../../../../foundation/layout/registry/blocks";
import { newBlocks } from "../../../../../foundation/layout/registry/blocks/new";
import { applyDefaults } from "../../../../../foundation/layout/registry/defaults";

// ---------------------------------------------------------------------------
// Hoist makeMockComp so it's available inside vi.mock factories (which are hoisted)
// ---------------------------------------------------------------------------

const { makeMockComp } = vi.hoisted(() => {
  const makeMockComp = (name: string) => {
    const comp = (_props: any) => null;
    comp.displayName = name;
    return comp;
  };
  return { makeMockComp };
});

// ---------------------------------------------------------------------------
// Mock react-native
// ---------------------------------------------------------------------------

vi.mock("react-native", () => ({
  View: (_props: any) => null,
  Text: (_props: any) => null,
}));

// ---------------------------------------------------------------------------
// Mock all foundation layout components used in componentMap.ts
// ---------------------------------------------------------------------------

vi.mock("../../../../../foundation/layout/ui/primitives/Box", () => ({ default: makeMockComp("Box") }));
vi.mock("../../../../../foundation/layout/ui/primitives/Stack", () => ({ default: makeMockComp("Stack") }));
vi.mock("../../../../../foundation/layout/ui/primitives/Inline", () => ({ default: makeMockComp("Inline") }));
vi.mock("../../../../../foundation/layout/ui/primitives/Center", () => ({ default: makeMockComp("Center") }));
vi.mock("../../../../../foundation/layout/ui/primitives/Scroll", () => ({ default: makeMockComp("Scroll") }));
vi.mock("../../../../../foundation/layout/ui/primitives/Divider", () => ({ default: makeMockComp("Divider") }));

vi.mock("../../../../../foundation/layout/ui/AuthLayout", () => ({ default: makeMockComp("AuthLayout") }));
vi.mock("../../../../../foundation/layout/ui/BentoLayout", () => ({ default: makeMockComp("BentoLayout") }));
vi.mock("../../../../../foundation/layout/ui/CenteredLayout", () => ({ default: makeMockComp("CenteredLayout") }));
vi.mock("../../../../../foundation/layout/ui/DashboardLayout", () => ({ default: makeMockComp("DashboardLayout") }));
vi.mock("../../../../../foundation/layout/ui/FlexLayout", () => ({ default: makeMockComp("FlexLayout") }));
vi.mock("../../../../../foundation/layout/ui/FooterLayout", () => ({ default: makeMockComp("FooterLayout") }));
vi.mock("../../../../../foundation/layout/ui/GridLayout", () => ({ default: makeMockComp("GridLayout") }));
vi.mock("../../../../../foundation/layout/ui/HeaderContentLayout", () => ({ default: makeMockComp("HeaderContentLayout") }));
vi.mock("../../../../../foundation/layout/ui/MasonryLayout", () => ({ default: makeMockComp("MasonryLayout") }));
vi.mock("../../../../../foundation/layout/ui/ResponsiveLayout", () => ({ default: makeMockComp("ResponsiveLayout") }));
vi.mock("../../../../../foundation/layout/ui/ScrollLayout", () => ({ default: makeMockComp("ScrollLayout") }));
vi.mock("../../../../../foundation/layout/ui/SidebarLayout", () => ({ default: makeMockComp("SidebarLayout") }));
vi.mock("../../../../../foundation/layout/ui/SplitLayout", () => ({ default: makeMockComp("SplitLayout") }));
vi.mock("../../../../../foundation/layout/ui/VoidLayout", () => ({ default: makeMockComp("VoidLayout") }));
vi.mock("../../../../../foundation/layout/ui/RootLayout", () => ({ default: makeMockComp("RootLayout") }));
vi.mock("../../../../../foundation/layout/ui/BottomDrawerLayout", () => ({ default: makeMockComp("BottomDrawerLayout") }));
vi.mock("../../../../../foundation/layout/ui/TopDrawerLayout", () => ({ default: makeMockComp("TopDrawerLayout") }));
vi.mock("../../../../../foundation/layout/ui/LeftDrawerLayout", () => ({ default: makeMockComp("LeftDrawerLayout") }));
vi.mock("../../../../../foundation/layout/ui/CrossTabLayout", () => ({ default: makeMockComp("CrossTabLayout") }));
vi.mock("../../../../../foundation/layout/ui/ParallaxLayout", () => ({ default: makeMockComp("ParallaxLayout") }));
vi.mock("../../../../../foundation/layout/ui/SketchLayout", () => ({ default: makeMockComp("SketchLayout") }));
vi.mock("../../../../../foundation/layout/ui/SwiperLayout", () => ({ default: makeMockComp("SwiperLayout") }));
vi.mock("../../../../../foundation/layout/ui/Swipe2ScreenLayout", () => ({ default: makeMockComp("Swipe2ScreenLayout") }));
vi.mock("../../../../../foundation/layout/ui/SystemLayout", () => ({ SystemUIWrapper: makeMockComp("SystemUIWrapper") }));
vi.mock("../../../../../foundation/layout/ui/TutoLayout", () => ({ TutoLayout: makeMockComp("TutoLayout") }));
vi.mock("../../../../../foundation/layout/ui/DeckLayout", () => ({ default: makeMockComp("DeckLayout") }));
vi.mock("../../../../../foundation/layout/ui/FlipLayout", () => ({ default: makeMockComp("FlipLayout") }));

vi.mock("../../../../../foundation/layout/ui/components/Button", () => ({ default: makeMockComp("Button") }));
vi.mock("../../../../../foundation/layout/ui/components/TextInput", () => ({ default: makeMockComp("TextInput") }));
vi.mock("../../../../../foundation/layout/ui/components/TextArea", () => ({ default: makeMockComp("TextArea") }));
vi.mock("../../../../../foundation/layout/ui/components/Checkbox", () => ({ default: makeMockComp("Checkbox") }));
vi.mock("../../../../../foundation/layout/ui/components/Switch", () => ({ default: makeMockComp("Switch") }));
vi.mock("../../../../../foundation/layout/ui/components/Badge", () => ({ default: makeMockComp("Badge") }));
vi.mock("../../../../../foundation/layout/ui/components/Avatar", () => ({ default: makeMockComp("Avatar") }));
vi.mock("../../../../../foundation/layout/ui/components/IconButton", () => ({ default: makeMockComp("IconButton") }));
vi.mock("../../../../../foundation/layout/ui/components/Chip", () => ({ default: makeMockComp("Chip") }));
vi.mock("../../../../../foundation/layout/ui/components/Spinner", () => ({ default: makeMockComp("Spinner") }));
vi.mock("../../../../../foundation/layout/ui/components/Select", () => ({ default: makeMockComp("Select") }));
vi.mock("../../../../../foundation/layout/ui/components/RadioGroup", () => ({ default: makeMockComp("RadioGroup") }));
vi.mock("../../../../../foundation/layout/ui/components/DatePicker", () => ({ default: makeMockComp("DatePicker") }));
vi.mock("../../../../../foundation/layout/ui/components/FilePicker", () => ({ default: makeMockComp("FilePicker") }));
vi.mock("../../../../../foundation/layout/ui/components/Slider", () => ({ default: makeMockComp("Slider") }));
vi.mock("../../../../../foundation/layout/ui/components/ImageComp", () => ({ default: makeMockComp("ImageComp") }));
vi.mock("../../../../../foundation/layout/ui/components/IconComp", () => ({ default: makeMockComp("IconComp") }));
vi.mock("../../../../../foundation/layout/ui/components/GradientComp", () => ({ default: makeMockComp("GradientComp") }));
vi.mock("../../../../../foundation/layout/ui/components/SeparatorComp", () => ({ default: makeMockComp("SeparatorComp") }));
vi.mock("../../../../../foundation/layout/ui/components/TextComp", () => ({ default: makeMockComp("TextComp") }));
vi.mock("../../../../../foundation/layout/ui/components/VideoComp", () => ({ default: makeMockComp("VideoComp") }));
vi.mock("../../../../../foundation/layout/ui/components/CameraComp", () => ({ default: makeMockComp("CameraComp") }));
vi.mock("../../../../../foundation/layout/ui/components/WebViewComp", () => ({ default: makeMockComp("WebViewComp") }));
vi.mock("../../../../../foundation/layout/ui/components/MapViewComp", () => ({ default: makeMockComp("MapViewComp") }));
vi.mock("../../../../../foundation/layout/ui/components/ProgressBar", () => ({ default: makeMockComp("ProgressBar") }));
vi.mock("../../../../../foundation/layout/ui/components/Accordion", () => ({ default: makeMockComp("Accordion") }));

vi.mock("../../../../../foundation/layout/ui/blocks/AuthFormBlock", () => ({ default: makeMockComp("AuthFormBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/HeaderBlock", () => ({ default: makeMockComp("HeaderBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/FormBlock", () => ({ default: makeMockComp("FormBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/CardBlock", () => ({ default: makeMockComp("CardBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/ListItemBlock", () => ({ default: makeMockComp("ListItemBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/SearchBarBlock", () => ({ default: makeMockComp("SearchBarBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/StatCardBlock", () => ({ default: makeMockComp("StatCardBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/EmptyStateBlock", () => ({ default: makeMockComp("EmptyStateBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/AvatarBlock", () => ({ default: makeMockComp("AvatarBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/ModalBlock", () => ({ default: makeMockComp("ModalBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/ToastBlock", () => ({ default: makeMockComp("ToastBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/SocialLinksBlock", () => ({ default: makeMockComp("SocialLinksBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/ProductCardBlock", () => ({ default: makeMockComp("ProductCardBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/NotificationItemBlock", () => ({ default: makeMockComp("NotificationItemBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/PricingCardBlock", () => ({ default: makeMockComp("PricingCardBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/TransactionItemBlock", () => ({ default: makeMockComp("TransactionItemBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/OnboardingSlideBlock", () => ({ default: makeMockComp("OnboardingSlideBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/ChatBubbleBlock", () => ({ default: makeMockComp("ChatBubbleBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/CalendarEventBlock", () => ({ default: makeMockComp("CalendarEventBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/FileItemBlock", () => ({ default: makeMockComp("FileItemBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/ContactCardBlock", () => ({ default: makeMockComp("ContactCardBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/MapPinBlock", () => ({ default: makeMockComp("MapPinBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/PasswordStrengthBlock", () => ({ default: makeMockComp("PasswordStrengthBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/MediaPickerBlock", () => ({ default: makeMockComp("MediaPickerBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/BannerBlock", () => ({ default: makeMockComp("BannerBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/CommentBlock", () => ({ default: makeMockComp("CommentBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/OTPInputBlock", () => ({ default: makeMockComp("OTPInputBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/TagInputBlock", () => ({ default: makeMockComp("TagInputBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/StepperBlock", () => ({ default: makeMockComp("StepperBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/RatingBlock", () => ({ default: makeMockComp("RatingBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/QuoteBlock", () => ({ default: makeMockComp("QuoteBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/TimelineBlock", () => ({ default: makeMockComp("TimelineBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/CounterBlock", () => ({ default: makeMockComp("CounterBlock") }));
vi.mock("../../../../../foundation/layout/ui/blocks/SegmentedControlBlock", () => ({ default: makeMockComp("SegmentedControlBlock") }));

// ---------------------------------------------------------------------------
// Set __DEV__ = true before importing componentMap
// ---------------------------------------------------------------------------

(globalThis as any).__DEV__ = true;

// ---------------------------------------------------------------------------
// Import the module under test (after mocks are set up)
// ---------------------------------------------------------------------------

import { getComponent, COMPONENT_MAP } from "../componentMap";

// ---------------------------------------------------------------------------
// Stub component names
// ---------------------------------------------------------------------------

const STUB_NAMES = ["BlurView", "LottieAnimation", "Tabs", "FlatList"] as const;

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Property 13 — getComponent is null-safe
// ---------------------------------------------------------------------------

describe("Property 13 — getComponent est null-safe", () => {
  /**
   * Validates: Requirements 10.4
   *
   * For any string id, getComponent(id) must return null or a function,
   * and must never throw.
   */
  it("retourne null ou une fonction pour tout identifiant string, sans jamais lever d'exception", () => {
    fc.assert(
      fc.property(fc.string(), (id) => {
        let result: unknown;
        expect(() => {
          result = getComponent(id);
        }).not.toThrow();

        // Must be null or a function (React component)
        expect(result === null || typeof result === "function").toBe(true);
        return true;
      }),
      { numRuns: 1000 }
    );
  });

  it("retourne null pour un identifiant inconnu", () => {
    expect(getComponent("__unknown_component_xyz__")).toBeNull();
    expect(getComponent("")).toBeNull();
    expect(getComponent("   ")).toBeNull();
  });

  it("retourne une fonction pour les identifiants connus", () => {
    expect(typeof getComponent("Box")).toBe("function");
    expect(typeof getComponent("Button")).toBe("function");
    expect(typeof getComponent("BlurView")).toBe("function");
  });
});

// ---------------------------------------------------------------------------
// Property 14 — Stubs emit a console.warn in DEV mode
// ---------------------------------------------------------------------------

describe("Property 14 — Les stubs émettent un warning en DEV", () => {
  /**
   * Validates: Requirements 10.1
   *
   * For each stub component (BlurView, LottieAnimation, Tabs, FlatList),
   * rendering it in DEV mode must emit at least one console.warn
   * containing the component name.
   */
  it("chaque stub émet un console.warn contenant son nom lors du rendu en mode DEV", () => {
    fc.assert(
      fc.property(fc.constantFrom(...STUB_NAMES), (stubName) => {
        consoleWarnSpy.mockClear();

        const StubComp = COMPONENT_MAP[stubName];
        expect(StubComp).toBeDefined();
        expect(typeof StubComp).toBe("function");

        // Render the stub component (stubs are always function components)
        (StubComp as React.FC<any>)({});

        // At least one warn must have been emitted
        expect(consoleWarnSpy).toHaveBeenCalled();

        // At least one warn must contain the stub component name
        const warnMessages = consoleWarnSpy.mock.calls.map((args: unknown[]) =>
          args.join(" ")
        );
        const containsName = warnMessages.some((msg: string) => msg.includes(stubName));
        expect(containsName).toBe(true);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it.each(STUB_NAMES)(
    "%s émet un console.warn contenant '%s' lors du rendu",
    (stubName) => {
      consoleWarnSpy.mockClear();

      const StubComp = COMPONENT_MAP[stubName];
      (StubComp as React.FC<any>)({});

      expect(consoleWarnSpy).toHaveBeenCalled();
      const allWarnings = consoleWarnSpy.mock.calls.map((args: unknown[]) => args.join(" "));
      expect(allWarnings.some((msg: string) => msg.includes(stubName))).toBe(true);
    }
  );

  it("n'émet pas de warning pour les composants non-stub (safe)", () => {
    consoleWarnSpy.mockClear();

    // Box is a direct component (not wrapped in safe/stub), so calling it won't warn
    const BoxComp = COMPONENT_MAP["Box"];
    (BoxComp as React.FC<any>)({});

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Feature: foundation-component-map-blocks — Properties 1–9
// ---------------------------------------------------------------------------

// Feature: foundation-component-map-blocks, Property 1: tous les IDs attendus sont dans COMPONENT_MAP
describe('Property 1 — Couverture complète du COMPONENT_MAP', () => {
  it('tous les IDs de layouts et blocs attendus sont dans COMPONENT_MAP', () => {
    const expectedIds = [
      'ParallaxLayout', 'SketchLayout', 'SwiperLayout', 'Swipe2ScreenLayout',
      'SystemLayout', 'TutoLayout', 'DeckLayout', 'FlipLayout',
      'SocialLinksBlock', 'ProductCardBlock', 'NotificationItemBlock', 'PricingCardBlock',
      'TransactionItemBlock', 'OnboardingSlideBlock', 'ChatBubbleBlock', 'CalendarEventBlock',
      'FileItemBlock', 'ContactCardBlock', 'MapPinBlock', 'PasswordStrengthBlock',
      'MediaPickerBlock', 'BannerBlock', 'CommentBlock', 'OTPInputBlock',
      'TagInputBlock', 'StepperBlock', 'RatingBlock', 'QuoteBlock',
      'TimelineBlock', 'CounterBlock', 'SegmentedControlBlock',
    ];
    fc.assert(
      fc.property(fc.constantFrom(...expectedIds), (id) => {
        expect(COMPONENT_MAP[id]).toBeDefined();
        expect(COMPONENT_MAP[id]).not.toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: foundation-component-map-blocks, Property 2: aucune valeur null dans COMPONENT_MAP
describe('Property 2 — Absence de valeurs nulles dans le COMPONENT_MAP', () => {
  it('aucune entrée du COMPONENT_MAP ne vaut undefined ou null', () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.keys(COMPONENT_MAP)), (id) => {
        expect(COMPONENT_MAP[id]).toBeDefined();
        expect(COMPONENT_MAP[id]).not.toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: foundation-component-map-blocks, Property 3: rendu avec props vides ne propage pas d'exception
describe('Property 3 — Résilience au rendu (safe wrapper)', () => {
  it('tout composant du COMPONENT_MAP peut être rendu avec des props vides sans crash', () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.keys(COMPONENT_MAP)), (id) => {
        const Comp = COMPONENT_MAP[id];
        expect(() => (Comp as React.FC<any>)({})).not.toThrow();
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: foundation-component-map-blocks, Property 4: getBlockMeta couvre tous les nouveaux blocs
describe('Property 4 — Couverture du registre de blocs', () => {
  it('getBlockMeta retourne le bon BlockMeta pour chaque id de newBlocks', () => {
    fc.assert(
      fc.property(fc.constantFrom(...newBlocks.map(b => b.id)), (id) => {
        const meta = getBlockMeta(id);
        expect(meta).toBeDefined();
        expect(meta!.id).toBe(id);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: foundation-component-map-blocks, Property 5: pas de doublon d'id dans blockRegistry
describe('Property 5 — Absence de doublons dans le registre', () => {
  it("blockRegistry ne contient aucun doublon d'id", () => {
    const ids = blockRegistry.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// Feature: foundation-component-map-blocks, Property 6: tous les BlockMeta de newBlocks ont les champs obligatoires
describe('Property 6 — Intégrité structurelle des BlockMeta', () => {
  it('chaque BlockMeta de newBlocks a les champs obligatoires non-vides', () => {
    fc.assert(
      fc.property(fc.constantFrom(...newBlocks), (meta) => {
        expect(typeof meta.id).toBe('string');
        expect(meta.id.length).toBeGreaterThan(0);
        expect(typeof meta.label).toBe('string');
        expect(meta.label.length).toBeGreaterThan(0);
        expect(typeof meta.description).toBe('string');
        expect(typeof meta.category).toBe('string');
        expect(Array.isArray(meta.tags)).toBe(true);
        expect(Array.isArray(meta.props)).toBe(true);
        expect(Array.isArray(meta.slots)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: foundation-component-map-blocks, Property 7: props enum ont des options, props color ont un themeDefault ou default
describe('Property 7 — Typage des props visuelles et enum', () => {
  it('les props enum ont des options et les props color ont un themeDefault ou default', () => {
    fc.assert(
      fc.property(fc.constantFrom(...newBlocks), (meta) => {
        for (const prop of meta.props) {
          if (prop.type === 'enum') {
            expect(Array.isArray(prop.options)).toBe(true);
            expect(prop.options!.length).toBeGreaterThan(0);
          }
          if (prop.type === 'color') {
            expect(prop.themeDefault !== undefined || prop.default !== undefined).toBe(true);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: foundation-component-map-blocks, Property 8: aucune prop callback dans les BlockMeta
describe('Property 8 — Exclusion des callbacks', () => {
  it('aucune PropMeta de newBlocks ne commence par "on"', () => {
    fc.assert(
      fc.property(fc.constantFrom(...newBlocks), (meta) => {
        for (const prop of meta.props) {
          expect(prop.name.startsWith('on')).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: foundation-component-map-blocks, Property 9: applyDefaults ne lève pas d'exception sur props vides
describe("Property 9 — Robustesse d'applyDefaults", () => {
  it("applyDefaults({}, meta, theme) ne lève pas d'exception pour tout BlockMeta de newBlocks", () => {
    const mockTheme = {
      primary: '#6366f1', background: '#ffffff', foreground: '#0f172a',
      card: '#ffffff', border: '#e2e8f0', muted: '#f1f5f9',
      mutedForeground: '#64748b', input: '#f8fafc',
    } as any;
    fc.assert(
      fc.property(fc.constantFrom(...newBlocks), (meta) => {
        expect(() => applyDefaults({}, meta, mockTheme)).not.toThrow();
        const result = applyDefaults({}, meta, mockTheme);
        for (const prop of meta.props) {
          if (prop.default !== undefined) {
            expect((result as any)[prop.name]).not.toBeUndefined();
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
