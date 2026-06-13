/**
 * Tabs — Web Component
 *
 * Navigation par onglets avec panneaux de contenu.
 * Utilise @radix-ui/react-tabs (déjà dans les dependencies).
 */

import React, { CSSProperties } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  activeColor?: string;
  background?: string;
  borderRadius?: RadiusToken;
  position?: "top" | "bottom";
  style?: CSSProperties;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultValue,
  value,
  onValueChange,
  activeColor,
  background,
  borderRadius = "none",
  position = "top",
  style,
  className,
}) => {
  const { theme } = useTheme();
  const color = activeColor ?? theme.primary;
  const bg = background ?? theme.card;
  const radius = radii[borderRadius];

  const tabListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    borderBottom: position === "top" ? `1px solid ${theme.border}` : "none",
    borderTop: position === "bottom" ? `1px solid ${theme.border}` : "none",
    backgroundColor: bg,
    order: position === "bottom" ? 1 : 0,
  };

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    borderRadius: radius,
    overflow: "hidden",
    ...style,
  };

  return (
    <RadixTabs.Root
      defaultValue={defaultValue ?? items[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={className}
      style={containerStyle}
    >
      <RadixTabs.List style={tabListStyle}>
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "inherit",
              color: theme.mutedForeground,
              borderBottom: position === "top" ? "2px solid transparent" : "none",
              borderTop: position === "bottom" ? "2px solid transparent" : "none",
              transition: "color 0.15s ease, border-color 0.15s ease",
            }}
            data-active-style={JSON.stringify({ color, borderColor: color })}
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content
          key={item.value}
          value={item.value}
          style={{ flex: 1, outline: "none" }}
        >
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
};

export default Tabs;
