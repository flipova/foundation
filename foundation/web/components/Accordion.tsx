/**
 * Accordion — Web Component
 *
 * Section expandable/collapsible. Construit avec @radix-ui/react-accordion.
 */

import React, { CSSProperties } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";

export interface AccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items?: AccordionItem[];
  /** For single-item usage */
  title?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  borderColor?: string;
  style?: CSSProperties;
  className?: string;
  type?: "single" | "multiple";
}

const AccordionSingle: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  background?: string;
  borderRadius?: RadiusToken;
  borderColor?: string;
  style?: CSSProperties;
}> = ({ title, children, defaultOpen = false, background, borderRadius = "lg", borderColor, style }) => {
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(defaultOpen);
  const radius = radii[borderRadius];
  const bg = background ?? theme.card;
  const bc = borderColor ?? theme.border;

  return (
    <div
      style={{
        borderRadius: radius,
        border: `1px solid ${bc}`,
        overflow: "hidden",
        backgroundColor: bg,
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "14px 16px",
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "inherit",
          color: theme.foreground,
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        {title}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke={theme.mutedForeground}
          strokeWidth="2"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", flexShrink: 0 }}
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        style={{
          maxHeight: open ? "2000px" : 0,
          overflow: "hidden",
          transition: "max-height 0.25s ease",
        }}
      >
        <div style={{ padding: "0 16px 16px" }}>{children}</div>
      </div>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  items,
  title,
  children,
  defaultOpen = false,
  background,
  borderRadius = "lg",
  borderColor,
  style,
}) => {
  const { theme } = useTheme();

  // Multi-item mode
  if (items && items.length > 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
        {items.map((item) => (
          <AccordionSingle
            key={item.value}
            title={item.title}
            background={background}
            borderRadius={borderRadius}
            borderColor={borderColor}
          >
            {item.content}
          </AccordionSingle>
        ))}
      </div>
    );
  }

  // Single item mode (legacy API)
  return (
    <AccordionSingle
      title={title ?? ""}
      defaultOpen={defaultOpen}
      background={background}
      borderRadius={borderRadius}
      borderColor={borderColor}
      style={style}
    >
      {children}
    </AccordionSingle>
  );
};

export default Accordion;
