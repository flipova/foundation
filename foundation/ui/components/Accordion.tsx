/**
 * Accordion — Expandable/collapsible content section.
 */
import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { applyDefaults, getComponentMeta } from "../../registry";
import type { ExtractComponentProps } from "../../registry";
import Box from "../primitives/Box";

const META = getComponentMeta("Accordion")!;

export interface AccordionProps extends ExtractComponentProps<"Accordion"> {
  children?: React.ReactNode;
  onToggle?: (open: boolean) => void;
}

const Accordion: React.FC<AccordionProps> = (rawProps) => {
  const { theme } = useTheme();
  const { children, title, defaultOpen, background, borderRadius, borderColor, onToggle } = applyDefaults(rawProps, META, theme) as Required<AccordionProps>;
  const [open, setOpen] = useState(!!defaultOpen);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  return (
    <Box bg={background || theme.card} borderRadius={borderRadius as any}
      style={{ borderWidth: 1, borderColor: borderColor || theme.border, overflow: "hidden" }}>
      <Pressable onPress={toggle} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: theme.foreground }}>{title || "Section"}</Text>
        <Text style={{ fontSize: 12, color: theme.mutedForeground }}>{open ? "▲" : "▼"}</Text>
      </Pressable>
      {open && <Box px={3 as any} py={3 as any} style={{ borderTopWidth: 1, borderTopColor: borderColor || theme.border }}>{children}</Box>}
    </Box>
  );
};

export default Accordion;
