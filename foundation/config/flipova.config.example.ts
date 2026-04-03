/**
 * Example flipova.config.ts
 *
 * Place this file at the root of your project.
 * Import it in your App.tsx and pass it to FoundationProvider.
 *
 * ```tsx
 * import { FoundationProvider } from "@flipova/foundation/config";
 * import config from "./flipova.config";
 *
 * export default function App() {
 *   return (
 *     <FoundationProvider config={config}>
 *       <MyApp />
 *     </FoundationProvider>
 *   );
 * }
 * ```
 */

import { defineConfig } from "@flipova/foundation/config";

export default defineConfig({
  tokens: {
    spacing: {
      0: 0, 1: 2, 2: 4, 3: 8, 4: 12, 5: 16, 6: 20, 8: 32, 10: 40, 12: 48,
    },
    radii: {
      none: 0, sm: 4, md: 8, lg: 16, xl: 24, full: 9999,
    },
    breakpoints: {
      xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280, "2xl": 1536,
    },
  },

  themes: {
    brand: {
      colors: {
        primary: "#FF6B00",
        primaryForeground: "#FFFFFF",
        secondary: "#1A1A2E",
        secondaryForeground: "#FFFFFF",
        background: "#FAFAFA",
        foreground: "#1A1A2E",
        card: "#FFFFFF",
        cardForeground: "#1A1A2E",
        muted: "#F1F1F1",
        mutedForeground: "#6B7280",
        border: "#E5E7EB",
        input: "#F3F4F6",
        ring: "#FF6B00",
        accent: "#FFE0CC",
        accentForeground: "#FF6B00",
        destructive: "#DC2626",
        destructiveForeground: "#FFFFFF",
        success: "#16A34A",
        warning: "#D97706",
        error: "#DC2626",
        info: "#2563EB",
        transparent: "transparent",
      },
      gradients: {
        primary: ["#FF6B00", "#FF8C33"],
        vibrant: ["#FF6B00", "#1A1A2E"],
      },
    },

    brandDark: {
      colors: {
        primary: "#FF8C33",
        primaryForeground: "#FFFFFF",
        background: "#0F0F1A",
        foreground: "#F8FAFC",
        card: "#1A1A2E",
        cardForeground: "#F8FAFC",
        muted: "#2A2A3E",
        mutedForeground: "#9CA3AF",
        border: "#3A3A4E",
        input: "#2A2A3E",
      },
    },
  },

  defaultTheme: "brand",
});
