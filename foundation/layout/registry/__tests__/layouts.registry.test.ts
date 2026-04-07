/**
 * Tests for layout-props-full-control spec
 * Unit tests + Property-based tests (fast-check)
 */

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { layoutRegistry, getLayoutMeta } from "../layouts";
import { applyDefaults } from "../defaults";
import { useStudioItems } from "../../hooks/useStudioItems";
import type { PropType } from "../../types";

// ─── Task 1.1 — "json" présent dans PropType ──────────────────────────────────

describe("PropType", () => {
  it('should include "json" as a valid PropType', () => {
    // Compile-time check: "json" must be assignable to PropType
    const jsonType: PropType = "json";
    expect(jsonType).toBe("json");
  });
});

// ─── Task 2.3 — Nouvelles entrées registre ────────────────────────────────────

describe("Registry — nouvelles entrées", () => {
  it("should contain Swipe2ScreenLayout", () => {
    const meta = getLayoutMeta("Swipe2ScreenLayout");
    expect(meta).toBeDefined();
    expect(meta!.id).toBe("Swipe2ScreenLayout");
  });

  it("should contain SystemLayout", () => {
    const meta = getLayoutMeta("SystemLayout");
    expect(meta).toBeDefined();
    expect(meta!.id).toBe("SystemLayout");
  });

  it("Swipe2ScreenLayout.slides should have type json", () => {
    const meta = getLayoutMeta("Swipe2ScreenLayout")!;
    const slidesProp = meta.props.find((p) => p.name === "slides");
    expect(slidesProp).toBeDefined();
    expect(slidesProp!.type).toBe("json");
  });

  it("SystemLayout.edges should have type json", () => {
    const meta = getLayoutMeta("SystemLayout")!;
    const edgesProp = meta.props.find((p) => p.name === "edges");
    expect(edgesProp).toBeDefined();
    expect(edgesProp!.type).toBe("json");
  });
});

// ─── Task 3.4 — Nouvelles props groupe 1 ─────────────────────────────────────

describe("Registry — nouvelles props groupe 1", () => {
  it("SketchLayout should have background prop", () => {
    const meta = getLayoutMeta("SketchLayout")!;
    const prop = meta.props.find((p) => p.name === "background");
    expect(prop).toBeDefined();
    expect(prop!.type).toBe("color");
    expect(prop!.themeDefault).toBe("background");
  });

  it("ScrollLayout should have headerPadding prop", () => {
    const meta = getLayoutMeta("ScrollLayout")!;
    const prop = meta.props.find((p) => p.name === "headerPadding");
    expect(prop).toBeDefined();
    expect(prop!.type).toBe("spacing");
    expect(prop!.default).toBe(4);
  });

  it("ScrollLayout should have footerPadding prop", () => {
    const meta = getLayoutMeta("ScrollLayout")!;
    const prop = meta.props.find((p) => p.name === "footerPadding");
    expect(prop).toBeDefined();
    expect(prop!.type).toBe("spacing");
    expect(prop!.default).toBe(4);
  });

  it("BentoLayout should have cellConfig prop with type json", () => {
    const meta = getLayoutMeta("BentoLayout")!;
    const prop = meta.props.find((p) => p.name === "cellConfig");
    expect(prop).toBeDefined();
    expect(prop!.type).toBe("json");
    expect(prop!.default).toEqual([]);
  });
});

// ─── Task 4.6 — Nouvelles props groupe 2 ─────────────────────────────────────

describe("Registry — nouvelles props groupe 2", () => {
  it("DeckLayout should have cardBackground, cardBorderRadius, containerWidth, containerHeight, peekCount", () => {
    const meta = getLayoutMeta("DeckLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("cardBackground");
    expect(names).toContain("cardBorderRadius");
    expect(names).toContain("containerWidth");
    expect(names).toContain("containerHeight");
    expect(names).toContain("peekCount");
  });

  it("FlipLayout should have cardBorderRadius, cardAspectRatio, cardMaxHeight, dezoomDuration, flipDuration, slideOutDuration", () => {
    const meta = getLayoutMeta("FlipLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("cardBorderRadius");
    expect(names).toContain("cardAspectRatio");
    expect(names).toContain("cardMaxHeight");
    expect(names).toContain("dezoomDuration");
    expect(names).toContain("flipDuration");
    expect(names).toContain("slideOutDuration");
  });

  it("DashboardLayout should have headerBackground, sidebarBackground, contentBackground, footerBackground", () => {
    const meta = getLayoutMeta("DashboardLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("headerBackground");
    expect(names).toContain("sidebarBackground");
    expect(names).toContain("contentBackground");
    expect(names).toContain("footerBackground");
  });

  it("TutoLayout should have accentColor, textBackground, textColor, mutedTextColor", () => {
    const meta = getLayoutMeta("TutoLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("accentColor");
    expect(names).toContain("textBackground");
    expect(names).toContain("textColor");
    expect(names).toContain("mutedTextColor");
  });

  it("ParallaxLayout should have background and rowBackground", () => {
    const meta = getLayoutMeta("ParallaxLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("background");
    expect(names).toContain("rowBackground");
  });
});

// ─── Task 5.6 — Nouvelles props groupe 3 ─────────────────────────────────────

describe("Registry — nouvelles props groupe 3", () => {
  it("BottomDrawerLayout should have handleColor, backdropOpacity, contentScaleWhenOpen", () => {
    const meta = getLayoutMeta("BottomDrawerLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("handleColor");
    expect(names).toContain("backdropOpacity");
    expect(names).toContain("contentScaleWhenOpen");
  });

  it("TopDrawerLayout should have handleColor, backdropOpacity, contentScaleWhenOpen, closeButtonBackground", () => {
    const meta = getLayoutMeta("TopDrawerLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("handleColor");
    expect(names).toContain("backdropOpacity");
    expect(names).toContain("contentScaleWhenOpen");
    expect(names).toContain("closeButtonBackground");
  });

  it("LeftDrawerLayout should have handleColor, backdropOpacity, contentScaleWhenOpen", () => {
    const meta = getLayoutMeta("LeftDrawerLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("handleColor");
    expect(names).toContain("backdropOpacity");
    expect(names).toContain("contentScaleWhenOpen");
  });

  it("CrossTabLayout should have springDamping, springStiffness, longPressDuration, dragScale", () => {
    const meta = getLayoutMeta("CrossTabLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("springDamping");
    expect(names).toContain("springStiffness");
    expect(names).toContain("longPressDuration");
    expect(names).toContain("dragScale");
  });

  it("SwiperLayout should have springDamping, springStiffness, cardCountBackground, cardCountTextColor", () => {
    const meta = getLayoutMeta("SwiperLayout")!;
    const names = meta.props.map((p) => p.name);
    expect(names).toContain("springDamping");
    expect(names).toContain("springStiffness");
    expect(names).toContain("cardCountBackground");
    expect(names).toContain("cardCountTextColor");
  });
});

// ─── Task 2.4 / 6.1 — Property-based tests ───────────────────────────────────

const mockTheme: Record<string, string> = {
  background: "#ffffff",
  foreground: "#000000",
  card: "#f5f5f5",
  primary: "#0070f3",
  primaryForeground: "#ffffff",
  secondary: "#888888",
  secondaryForeground: "#ffffff",
  muted: "#e5e5e5",
  mutedForeground: "#666666",
  border: "#dddddd",
  input: "#eeeeee",
  ring: "#0070f3",
  destructive: "#ff0000",
  destructiveForeground: "#ffffff",
  accent: "#f0f0f0",
  accentForeground: "#000000",
  popover: "#ffffff",
  popoverForeground: "#000000",
};

describe("Property 4 — unicité des ids dans le registre", () => {
  it("all layout ids should be unique", () => {
    const ids = layoutRegistry.map((m) => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe("Property 1 — cohérence des defaults", () => {
  it("applyDefaults({}, META, mockTheme) should return declared defaults", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          ...layoutRegistry.filter((m) => m.props.some((p) => p.default !== undefined))
        ),
        (meta) => {
          const result = applyDefaults({}, meta, mockTheme as any);
          return meta.props
            .filter((p) => p.default !== undefined)
            .every(
              (p) =>
                JSON.stringify((result as any)[p.name]) ===
                JSON.stringify(p.default)
            );
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Property 5 — props enum ont des options non-vides", () => {
  it("all enum props should have non-empty options", () => {
    fc.assert(
      fc.property(fc.constantFrom(...layoutRegistry), (meta) => {
        return meta.props
          .filter((p) => p.type === "enum")
          .every((p) => Array.isArray(p.options) && p.options.length > 0);
      }),
      { numRuns: 100 }
    );
  });
});

describe("Property 6 — themeDefault uniquement sur color/background", () => {
  it("themeDefault should only be on color or background props", () => {
    fc.assert(
      fc.property(fc.constantFrom(...layoutRegistry), (meta) => {
        return meta.props
          .filter((p) => p.themeDefault !== undefined)
          .every((p) => p.type === "color" || p.type === "background");
      }),
      { numRuns: 100 }
    );
  });
});

describe("Property 2 — priorité de résolution applyDefaults", () => {
  it("explicit value should override themeDefault and default", () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (explicitValue) => {
        const meta = layoutRegistry.find((m) =>
          m.props.some((p) => p.themeDefault && p.default !== undefined)
        );
        if (!meta) return true;
        const prop = meta.props.find(
          (p) => p.themeDefault && p.default !== undefined
        )!;
        const result = applyDefaults(
          { [prop.name]: explicitValue } as any,
          meta,
          mockTheme as any
        );
        return (result as any)[prop.name] === explicitValue;
      }),
      { numRuns: 100 }
    );
  });
});

describe("Property 3 — opacité des valeurs json", () => {
  it("json values should be passed through unchanged", () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (jsonValue) => {
        const meta = layoutRegistry.find((m) =>
          m.props.some((p) => p.type === "json")
        )!;
        const prop = meta.props.find((p) => p.type === "json")!;
        const result = applyDefaults({ [prop.name]: jsonValue } as any, meta);
        return (
          JSON.stringify((result as any)[prop.name]) ===
          JSON.stringify(jsonValue)
        );
      }),
      { numRuns: 100 }
    );
  });
});

// ─── layout-full-props-standard — Property tests ─────────────────────────────

describe("Property 1 — multi-item slot name is 'items'", () => {
  // Feature: layout-full-props-standard, Property 1: multi-item slot name is "items"
  // Validates: Requirements 1.5, 2.5, 3.5, 4.1–4.5, 30.4
  it("primary required array slot should have name 'items'", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...layoutRegistry.filter(m => m.slots.some(s => s.array))),
        (meta) => {
          // Only the primary (required) array slot must be named "items"
          const primaryArraySlot = meta.slots.find(s => s.array && s.required);
          return primaryArraySlot === undefined || primaryArraySlot.name === "items";
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("Property 2 — previewItemCount >= 3 for multi-item layouts", () => {
  // Feature: layout-full-props-standard, Property 2: previewItemCount >= 3 for array slots
  // Validates: Requirements 1.6, 2.6, 3.6, 4.6, 12.2, 30.1
  it("all multi-item layouts should declare previewItemCount >= 3", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...layoutRegistry.filter(m => m.slots.some(s => s.array))),
        (meta) => (meta.previewItemCount ?? 0) >= 3
      ),
      { numRuns: 100 }
    );
  });
});

describe("Property 3 — useStudioItems returns N placeholders for empty input", () => {
  // Feature: layout-full-props-standard, Property 3: useStudioItems returns N placeholders for empty input
  // Validates: Requirements 1.7, 2.7, 3.7, 4.7
  it("useStudioItems([], N, factory) should return exactly N items for any N >= 1", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (n) => {
          const result = useStudioItems([], n, (i: number) => i);
          return result.length === n;
        }
      ),
      { numRuns: 100 }
    );
  });
});



// ─── Task 19 — layout-full-props-standard unit tests ─────────────────────────

describe("layout-full-props-standard — slot renames and previewItemCount", () => {
  it("DeckLayout slot is { name: 'items', kind: 'items' } and previewItemCount === 4", () => {
    const meta = getLayoutMeta("DeckLayout")!;
    const slot = meta.slots.find((s) => s.kind === 'items');
    expect(slot).toBeDefined();
    expect(slot!.name).toBe("items");
    expect(slot!.kind).toBe("items");
    expect(meta.previewItemCount).toBe(4);
  });

  it("FlipLayout slot is { name: 'items', kind: 'items' } and previewItemCount === 3", () => {
    const meta = getLayoutMeta("FlipLayout")!;
    const slot = meta.slots.find((s) => s.kind === 'items');
    expect(slot).toBeDefined();
    expect(slot!.name).toBe("items");
    expect(slot!.kind).toBe("items");
    expect(meta.previewItemCount).toBe(3);
  });

  it("SwiperLayout slot is { name: 'items', kind: 'items' } and previewItemCount === 4", () => {
    const meta = getLayoutMeta("SwiperLayout")!;
    const slot = meta.slots.find((s) => s.kind === 'items');
    expect(slot).toBeDefined();
    expect(slot!.name).toBe("items");
    expect(slot!.kind).toBe("items");
    expect(meta.previewItemCount).toBe(4);
  });
});

describe("layout-full-props-standard — DeckLayout new props", () => {
  it("DeckLayout has peekRotation prop with default: 0", () => {
    const meta = getLayoutMeta("DeckLayout")!;
    const prop = meta.props.find((p) => p.name === "peekRotation");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(0);
  });

  it("DeckLayout has direction prop with default: 'horizontal' and options ['horizontal','vertical']", () => {
    const meta = getLayoutMeta("DeckLayout")!;
    const prop = meta.props.find((p) => p.name === "direction");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe("horizontal");
    expect(prop!.options).toEqual(["horizontal", "vertical"]);
  });

  it("DeckLayout has background prop with themeDefault: 'background'", () => {
    const meta = getLayoutMeta("DeckLayout")!;
    const prop = meta.props.find((p) => p.name === "background");
    expect(prop).toBeDefined();
    expect(prop!.themeDefault).toBe("background");
  });
});

describe("layout-full-props-standard — FlipLayout / SwiperLayout constants cleanup", () => {
  it("FlipLayout constants does NOT contain swipeThreshold", () => {
    const meta = getLayoutMeta("FlipLayout")!;
    expect((meta.constants as any)?.swipeThreshold).toBeUndefined();
  });

  it("SwiperLayout constants does NOT contain swipeThreshold", () => {
    const meta = getLayoutMeta("SwiperLayout")!;
    expect((meta.constants as any)?.swipeThreshold).toBeUndefined();
  });

  it("FlipLayout has flipPerspective prop with default: 1200", () => {
    const meta = getLayoutMeta("FlipLayout")!;
    const prop = meta.props.find((p) => p.name === "flipPerspective");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(1200);
  });

  it("FlipLayout has swipeThreshold prop with default: 40", () => {
    const meta = getLayoutMeta("FlipLayout")!;
    const prop = meta.props.find((p) => p.name === "swipeThreshold");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(40);
  });

  it("SwiperLayout has preloadRange prop with default: 2", () => {
    const meta = getLayoutMeta("SwiperLayout")!;
    const prop = meta.props.find((p) => p.name === "preloadRange");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(2);
  });

  it("SwiperLayout has swipeThreshold prop with default: 40", () => {
    const meta = getLayoutMeta("SwiperLayout")!;
    const prop = meta.props.find((p) => p.name === "swipeThreshold");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(40);
  });
});

describe("layout-full-props-standard — CrossTabLayout new props", () => {
  it("CrossTabLayout has background prop with themeDefault: 'background'", () => {
    const meta = getLayoutMeta("CrossTabLayout")!;
    const prop = meta.props.find((p) => p.name === "background");
    expect(prop).toBeDefined();
    expect(prop!.themeDefault).toBe("background");
  });
});

describe("layout-full-props-standard — CenteredLayout new props", () => {
  it("CenteredLayout has mobilePadding prop with default: 4", () => {
    const meta = getLayoutMeta("CenteredLayout")!;
    const prop = meta.props.find((p) => p.name === "mobilePadding");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(4);
  });

  it("CenteredLayout has desktopPadding prop with default: 6", () => {
    const meta = getLayoutMeta("CenteredLayout")!;
    const prop = meta.props.find((p) => p.name === "desktopPadding");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(6);
  });
});

describe("layout-full-props-standard — AuthLayout new props", () => {
  it("AuthLayout has formMaxWidth prop with default: 520", () => {
    const meta = getLayoutMeta("AuthLayout")!;
    const prop = meta.props.find((p) => p.name === "formMaxWidth");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(520);
  });

  it("AuthLayout has formScrollPaddingY prop with default: 8", () => {
    const meta = getLayoutMeta("AuthLayout")!;
    const prop = meta.props.find((p) => p.name === "formScrollPaddingY");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(8);
  });

  it("AuthLayout has formScrollPaddingX prop with default: 4", () => {
    const meta = getLayoutMeta("AuthLayout")!;
    const prop = meta.props.find((p) => p.name === "formScrollPaddingX");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(4);
  });
});

describe("layout-full-props-standard — DashboardLayout new props", () => {
  it("DashboardLayout has headerPaddingX prop with default: 4", () => {
    const meta = getLayoutMeta("DashboardLayout")!;
    const prop = meta.props.find((p) => p.name === "headerPaddingX");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(4);
  });

  it("DashboardLayout has mobileHeaderMinHeight prop with default: 60", () => {
    const meta = getLayoutMeta("DashboardLayout")!;
    const prop = meta.props.find((p) => p.name === "mobileHeaderMinHeight");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(60);
  });
});

describe("layout-full-props-standard — ResponsiveLayout new props", () => {
  it("ResponsiveLayout has mobileHeaderHeight prop with default: 56", () => {
    const meta = getLayoutMeta("ResponsiveLayout")!;
    const prop = meta.props.find((p) => p.name === "mobileHeaderHeight");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(56);
  });

  it("ResponsiveLayout has tabletFooterHeight prop with default: 48", () => {
    const meta = getLayoutMeta("ResponsiveLayout")!;
    const prop = meta.props.find((p) => p.name === "tabletFooterHeight");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(48);
  });

  it("ResponsiveLayout has sidebarMaxWidth prop with default: 320", () => {
    const meta = getLayoutMeta("ResponsiveLayout")!;
    const prop = meta.props.find((p) => p.name === "sidebarMaxWidth");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(320);
  });
});

describe("layout-full-props-standard — FlexLayout new props", () => {
  it("FlexLayout has align prop with default: 'stretch'", () => {
    const meta = getLayoutMeta("FlexLayout")!;
    const prop = meta.props.find((p) => p.name === "align");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe("stretch");
  });

  it("FlexLayout has justify prop with default: 'flex-start'", () => {
    const meta = getLayoutMeta("FlexLayout")!;
    const prop = meta.props.find((p) => p.name === "justify");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe("flex-start");
  });
});

describe("layout-full-props-standard — SplitLayout new props", () => {
  it("SplitLayout has leftBorderRadius prop with default: 'none'", () => {
    const meta = getLayoutMeta("SplitLayout")!;
    const prop = meta.props.find((p) => p.name === "leftBorderRadius");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe("none");
  });

  it("SplitLayout has rightBorderRadius prop with default: 'none'", () => {
    const meta = getLayoutMeta("SplitLayout")!;
    const prop = meta.props.find((p) => p.name === "rightBorderRadius");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe("none");
  });
});

describe("layout-full-props-standard — SidebarLayout new props", () => {
  it("SidebarLayout has sidebarMinWidth prop with default: 150", () => {
    const meta = getLayoutMeta("SidebarLayout")!;
    const prop = meta.props.find((p) => p.name === "sidebarMinWidth");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(150);
  });

  it("SidebarLayout has sidebarMaxWidth prop with default: 600", () => {
    const meta = getLayoutMeta("SidebarLayout")!;
    const prop = meta.props.find((p) => p.name === "sidebarMaxWidth");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(600);
  });
});

describe("layout-full-props-standard — BottomDrawerLayout new props", () => {
  it("BottomDrawerLayout has handleBarColor prop with themeDefault: 'border'", () => {
    const meta = getLayoutMeta("BottomDrawerLayout")!;
    const prop = meta.props.find((p) => p.name === "handleBarColor");
    expect(prop).toBeDefined();
    expect(prop!.themeDefault).toBe("border");
  });

  it("BottomDrawerLayout has handleButtonSize prop with default: 56", () => {
    const meta = getLayoutMeta("BottomDrawerLayout")!;
    const prop = meta.props.find((p) => p.name === "handleButtonSize");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(56);
  });
});

describe("layout-full-props-standard — TopDrawerLayout new props", () => {
  it("TopDrawerLayout has closeButtonSize prop with default: 36", () => {
    const meta = getLayoutMeta("TopDrawerLayout")!;
    const prop = meta.props.find((p) => p.name === "closeButtonSize");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(36);
  });

  it("TopDrawerLayout has closeButtonBorderColor prop with themeDefault: 'border'", () => {
    const meta = getLayoutMeta("TopDrawerLayout")!;
    const prop = meta.props.find((p) => p.name === "closeButtonBorderColor");
    expect(prop).toBeDefined();
    expect(prop!.themeDefault).toBe("border");
  });

  it("TopDrawerLayout has closeButtonTextColor prop with themeDefault: 'mutedForeground'", () => {
    const meta = getLayoutMeta("TopDrawerLayout")!;
    const prop = meta.props.find((p) => p.name === "closeButtonTextColor");
    expect(prop).toBeDefined();
    expect(prop!.themeDefault).toBe("mutedForeground");
  });
});

describe("layout-full-props-standard — LeftDrawerLayout new props", () => {
  it("LeftDrawerLayout has handleBarColor prop with themeDefault: 'border'", () => {
    const meta = getLayoutMeta("LeftDrawerLayout")!;
    const prop = meta.props.find((p) => p.name === "handleBarColor");
    expect(prop).toBeDefined();
    expect(prop!.themeDefault).toBe("border");
  });

  it("LeftDrawerLayout has handleBarWidth prop with default: 40", () => {
    const meta = getLayoutMeta("LeftDrawerLayout")!;
    const prop = meta.props.find((p) => p.name === "handleBarWidth");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(40);
  });
});

describe("layout-full-props-standard — ScrollLayout new props", () => {
  it("ScrollLayout has mobileHeaderHeight prop with default: 60", () => {
    const meta = getLayoutMeta("ScrollLayout")!;
    const prop = meta.props.find((p) => p.name === "mobileHeaderHeight");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(60);
  });

  it("ScrollLayout has mobileFooterHeight prop with default: 50", () => {
    const meta = getLayoutMeta("ScrollLayout")!;
    const prop = meta.props.find((p) => p.name === "mobileFooterHeight");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(50);
  });
});

describe("layout-full-props-standard — HeaderContentLayout new props", () => {
  it("HeaderContentLayout has scrollEventThrottle prop with default: 16", () => {
    const meta = getLayoutMeta("HeaderContentLayout")!;
    const prop = meta.props.find((p) => p.name === "scrollEventThrottle");
    expect(prop).toBeDefined();
    expect(prop!.default).toBe(16);
  });
});

// ─── Task 19.1 — Property 4: Zero-breaking-change defaults ───────────────────

describe("Property 4 — zero-breaking-change defaults", () => {
  // Feature: layout-full-props-standard, Property 4: applyDefaults({}, META, theme) returns exact declared defaults
  // Validates: Requirements 28.1, 28.2
  it("applyDefaults({}, META, theme) should return exact declared defaults for every layout", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          ...layoutRegistry.filter((m) => m.props.some((p) => p.default !== undefined))
        ),
        (meta) => {
          const result = applyDefaults({}, meta, mockTheme as any);
          return meta.props
            .filter((p) => p.default !== undefined)
            .every(
              (p) =>
                JSON.stringify((result as any)[p.name]) ===
                JSON.stringify(p.default)
            );
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Task 19.2 — Property 5: Ratio props have min and max ────────────────────

describe("Property 5 — ratio props have min and max", () => {
  // Feature: layout-full-props-standard, Property 5: Ratio props have min and max defined
  // Validates: Requirements 29.4, 30.2
  it("all ratio props in the registry should have both min and max defined", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...layoutRegistry),
        (meta) =>
          meta.props
            .filter((p) => p.type === "ratio")
            .every((p) => p.min !== undefined && p.max !== undefined)
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Task 19.3 — Property 6: Enum props have non-empty options ───────────────

describe("Property 6 — enum props have non-empty options array", () => {
  // Feature: layout-full-props-standard, Property 6: Enum props have non-empty options array
  // Validates: Requirements 29.5, 30.3
  it("all enum props in the registry should have a non-empty options array", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...layoutRegistry),
        (meta) =>
          meta.props
            .filter((p) => p.type === "enum")
            .every((p) => Array.isArray(p.options) && p.options.length > 0)
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Task 19.4 — Property 7: Group values are valid ──────────────────────────

describe("Property 7 — group values are valid", () => {
  // Feature: layout-full-props-standard, Property 7: Group values are one of style/layout/behavior/content
  // Validates: Requirement 29.6
  it("every prop group should be one of style, layout, behavior, content", () => {
    const validGroups = ["style", "layout", "behavior", "content"];
    fc.assert(
      fc.property(
        fc.constantFrom(...layoutRegistry),
        (meta) =>
          meta.props.every(
            (p) => !p.group || validGroups.includes(p.group)
          )
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Task 19.5 — Property 8: Color props use correct type ────────────────────

describe("Property 8 — color/background props use type 'color' or 'background'", () => {
  // Feature: layout-full-props-standard, Property 8: Color/background props use type "color" or "background"
  // Validates: Requirement 29.1
  it("props ending with Background or Color, or named background, should have type 'color' or 'background'", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...layoutRegistry),
        (meta) =>
          meta.props
            .filter(
              (p) =>
                /[Bb]ackground$/.test(p.name) ||
                /[Cc]olor$/.test(p.name) ||
                p.name === "background"
            )
            .every((p) => p.type === "color" || p.type === "background")
      ),
      { numRuns: 100 }
    );
  });
});
