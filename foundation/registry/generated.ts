/**
 * AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
 * This file is generated from scanning .meta.yaml files.
 */
import type { ComponentMeta, BlockMeta, LayoutMeta, PrimitiveMeta } from "../types";

export const BoxMeta = {
  "id": "Box",
  "label": "Box",
  "description": "Flexible container with spacing, background, and border support.",
  "category": "primitive",
  "tags": [
    "box",
    "container",
    "view",
    "div"
  ],
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": false
    }
  ],
  "props": [
    {
      "name": "flex",
      "label": "Flex",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "bg",
      "label": "Background",
      "type": "color",
      "group": "style"
    },
    {
      "name": "p",
      "label": "Padding",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "px",
      "label": "Padding X",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "py",
      "label": "Padding Y",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "m",
      "label": "Margin",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "mx",
      "label": "Margin X",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "my",
      "label": "Margin Y",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "width",
      "label": "Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "minHeight",
      "label": "Min Height",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style"
    },
    {
      "name": "overflow",
      "label": "Overflow",
      "type": "enum",
      "group": "style",
      "options": [
        "visible",
        "hidden",
        "scroll"
      ]
    },
    {
      "name": "justifyContent",
      "label": "Justify",
      "type": "enum",
      "group": "layout",
      "options": [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly"
      ]
    },
    {
      "name": "alignItems",
      "label": "Align Items",
      "type": "enum",
      "group": "layout",
      "options": [
        "stretch",
        "flex-start",
        "flex-end",
        "center",
        "baseline"
      ]
    },
    {
      "name": "alignSelf",
      "label": "Align Self",
      "type": "enum",
      "group": "layout",
      "options": [
        "auto",
        "flex-start",
        "center",
        "flex-end",
        "stretch"
      ]
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Box, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function BoxExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Box Example</Text>\n          <Box />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const CenterMeta = {
  "id": "Center",
  "label": "Center",
  "description": "Centers content both horizontally and vertically.",
  "category": "primitive",
  "tags": [
    "center",
    "align",
    "middle"
  ],
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": false
    }
  ],
  "props": [
    {
      "name": "flex",
      "label": "Flex",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "bg",
      "label": "Background",
      "type": "color",
      "group": "style"
    },
    {
      "name": "p",
      "label": "Padding",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "py",
      "label": "Padding Y",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "width",
      "label": "Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Center, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function CenterExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Center Example</Text>\n          <Center />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const InlineMeta = {
  "id": "Inline",
  "label": "Inline",
  "description": "Horizontal row with spacing and alignment.",
  "category": "primitive",
  "tags": [
    "inline",
    "horizontal",
    "row",
    "hstack"
  ],
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": false
    }
  ],
  "props": [
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 2
    },
    {
      "name": "align",
      "label": "Align",
      "type": "enum",
      "group": "layout",
      "options": [
        "stretch",
        "flex-start",
        "center",
        "flex-end",
        "baseline"
      ]
    },
    {
      "name": "justify",
      "label": "Justify",
      "type": "enum",
      "group": "layout",
      "options": [
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around"
      ]
    },
    {
      "name": "wrap",
      "label": "Wrap",
      "type": "boolean",
      "group": "layout",
      "default": false
    },
    {
      "name": "bg",
      "label": "Background",
      "type": "color",
      "group": "style"
    },
    {
      "name": "p",
      "label": "Padding",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "flex",
      "label": "Flex",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "fillWidth",
      "label": "Fill Width",
      "type": "boolean",
      "group": "layout",
      "default": false
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Inline, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function InlineExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Inline Example</Text>\n          <Inline\n          spacing={2}\n          align=\"stretch\"\n          justify=\"flex-start\"\n          wrap={false}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ScrollMeta = {
  "id": "Scroll",
  "label": "Scroll",
  "description": "Scrollable container.",
  "category": "primitive",
  "tags": [
    "scroll",
    "scrollview",
    "overflow"
  ],
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": false
    }
  ],
  "props": [
    {
      "name": "horizontal",
      "label": "Horizontal",
      "type": "boolean",
      "group": "layout",
      "default": false
    },
    {
      "name": "showsScrollIndicator",
      "label": "Show Indicator",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "scrollEnabled",
      "label": "Scroll Enabled",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "bg",
      "label": "Background",
      "type": "color",
      "group": "style"
    },
    {
      "name": "p",
      "label": "Padding",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "flex",
      "label": "Flex",
      "type": "number",
      "group": "layout"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Scroll, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function ScrollExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Scroll Example</Text>\n          <Scroll\n          horizontal={false}\n          showsScrollIndicator={true}\n          scrollEnabled={true}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const StackMeta = {
  "id": "Stack",
  "label": "Stack",
  "description": "Vertical stack with consistent spacing between children.",
  "category": "primitive",
  "tags": [
    "stack",
    "vertical",
    "column",
    "vstack"
  ],
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": false
    }
  ],
  "props": [
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 2
    },
    {
      "name": "align",
      "label": "Align",
      "type": "enum",
      "group": "layout",
      "options": [
        "stretch",
        "flex-start",
        "center",
        "flex-end"
      ]
    },
    {
      "name": "bg",
      "label": "Background",
      "type": "color",
      "group": "style"
    },
    {
      "name": "p",
      "label": "Padding",
      "type": "spacing",
      "group": "layout"
    },
    {
      "name": "flex",
      "label": "Flex",
      "type": "number",
      "group": "layout"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Stack, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function StackExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Stack Example</Text>\n          <Stack\n          spacing={2}\n          align=\"stretch\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const BadgeWrapperMeta = {
  "id": "BadgeWrapper",
  "name": "BadgeWrapper",
  "description": "Wraps an element and places a customizable notification badge in the top right corner.",
  "props": [
    {
      "name": "count",
      "type": "number",
      "description": "Number to display in badge. If 0, no badge is shown unless showZero is true.",
      "default": 0
    },
    {
      "name": "showZero",
      "type": "boolean",
      "description": "Show badge even if count is 0",
      "default": false
    },
    {
      "name": "color",
      "type": "string",
      "description": "Badge background color",
      "default": null
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, BadgeWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function BadgeWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">BadgeWrapper Example</Text>\n          <BadgeWrapper\n          count={0}\n          showZero={false}\n          color=\"Sample\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const BlurWrapperMeta = {
  "id": "BlurWrapper",
  "name": "BlurWrapper",
  "description": "Wraps children in a frosted glass/blur container.",
  "props": [
    {
      "name": "intensity",
      "type": "number",
      "description": "Blur intensity (1-100)",
      "default": 50
    },
    {
      "name": "tint",
      "type": "string",
      "description": "Tint color (light, dark, default)",
      "default": "default"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, BlurWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function BlurWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">BlurWrapper Example</Text>\n          <BlurWrapper\n          intensity={50}\n          tint=\"default\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const CollapsibleWrapperMeta = {
  "id": "CollapsibleWrapper",
  "name": "CollapsibleWrapper",
  "description": "A container that smoothly expands or collapses its children height.",
  "props": [
    {
      "name": "isExpanded",
      "type": "boolean",
      "description": "Whether the container is expanded",
      "default": false
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, CollapsibleWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function CollapsibleWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">CollapsibleWrapper Example</Text>\n          <CollapsibleWrapper\n          isExpanded={false}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const FadeInWrapperMeta = {
  "id": "FadeInWrapper",
  "name": "FadeInWrapper",
  "description": "Animates its children in with a smooth opacity fade on mount.",
  "props": [
    {
      "name": "duration",
      "type": "number",
      "description": "Animation duration in ms",
      "default": 500
    },
    {
      "name": "delay",
      "type": "number",
      "description": "Animation delay in ms",
      "default": 0
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, FadeInWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function FadeInWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">FadeInWrapper Example</Text>\n          <FadeInWrapper\n          duration={500}\n          delay={0}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const KeyboardAvoidWrapperMeta = {
  "id": "KeyboardAvoidWrapper",
  "name": "KeyboardAvoidWrapper",
  "description": "Automatically handles keyboard layout shifting for its wrapped children.",
  "props": [
    {
      "name": "offset",
      "type": "number",
      "description": "Extra offset above keyboard",
      "default": 20
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, KeyboardAvoidWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function KeyboardAvoidWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">KeyboardAvoidWrapper Example</Text>\n          <KeyboardAvoidWrapper\n          offset={20}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SafeAreaWrapperMeta = {
  "id": "SafeAreaWrapper",
  "name": "SafeAreaWrapper",
  "description": "A convenient wrapper that applies safe area boundaries to specific sections of children.",
  "props": [
    {
      "name": "edges",
      "type": "array",
      "description": "Edges to apply safe area (top, bottom, left, right)",
      "default": [
        "top",
        "bottom"
      ]
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, SafeAreaWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function SafeAreaWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">SafeAreaWrapper Example</Text>\n          <SafeAreaWrapper />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ScalePressWrapperMeta = {
  "id": "ScalePressWrapper",
  "name": "ScalePressWrapper",
  "description": "Wraps any element and adds a bouncy shrink effect when pressed.",
  "props": [
    {
      "name": "scaleTo",
      "type": "number",
      "description": "Scale factor when pressed",
      "default": 0.95
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, ScalePressWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function ScalePressWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">ScalePressWrapper Example</Text>\n          <ScalePressWrapper\n          scaleTo={0.95}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ShimmerWrapperMeta = {
  "id": "ShimmerWrapper",
  "name": "ShimmerWrapper",
  "description": "Adds a shiny animated loading shimmer effect over its children.",
  "props": [
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "Whether to show the shimmer",
      "default": true
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, ShimmerWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function ShimmerWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">ShimmerWrapper Example</Text>\n          <ShimmerWrapper\n          isLoading={true}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SkeletonWrapperMeta = {
  "id": "SkeletonWrapper",
  "name": "SkeletonWrapper",
  "description": "A wrapper component that measures its children and displays an animated shimmering skeleton outline when loading.",
  "tags": [
    "base",
    "wrapper",
    "loader",
    "skeleton",
    "shimmer"
  ],
  "props": {
    "isLoading": {
      "type": "boolean",
      "description": "Whether the component is currently loading. If true, shows skeleton.",
      "required": true
    }
  },
  "example": "import React from 'react';\nimport { FoundationProvider, SkeletonWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function SkeletonWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">SkeletonWrapper Example</Text>\n          <SkeletonWrapper\n          isLoading={true}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SlideUpWrapperMeta = {
  "id": "SlideUpWrapper",
  "name": "SlideUpWrapper",
  "description": "Animates its children sliding up from below on mount.",
  "props": [
    {
      "name": "duration",
      "type": "number",
      "description": "Animation duration in ms",
      "default": 500
    },
    {
      "name": "delay",
      "type": "number",
      "description": "Animation delay in ms",
      "default": 0
    },
    {
      "name": "distance",
      "type": "number",
      "description": "Distance to slide from in pixels",
      "default": 50
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, SlideUpWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function SlideUpWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">SlideUpWrapper Example</Text>\n          <SlideUpWrapper\n          duration={500}\n          delay={0}\n          distance={50}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const TooltipWrapperMeta = {
  "id": "TooltipWrapper",
  "name": "TooltipWrapper",
  "description": "Wraps a component and displays a tooltip bubble near it.",
  "props": [
    {
      "name": "text",
      "type": "string",
      "description": "Tooltip text",
      "default": null
    },
    {
      "name": "isVisible",
      "type": "boolean",
      "description": "Whether tooltip is visible",
      "default": false
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, TooltipWrapper, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function TooltipWrapperExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">TooltipWrapper Example</Text>\n          <TooltipWrapper\n          text=\"Sample\"\n          isVisible={false}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const AccordionMeta = {
  "id": "Accordion",
  "label": "Accordion",
  "description": "Expandable/collapsible content section.",
  "category": "display",
  "tags": [
    "accordion",
    "collapse",
    "expand",
    "faq"
  ],
  "themeMapping": {
    "bg": "card",
    "text": "foreground",
    "border": "border"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "title",
      "label": "Title",
      "type": "string",
      "group": "content",
      "default": "Section"
    },
    {
      "name": "defaultOpen",
      "label": "Default open",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "lg"
    },
    {
      "name": "borderColor",
      "label": "Border color",
      "type": "color",
      "group": "style",
      "themeDefault": "border"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Accordion, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function AccordionExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Accordion Example</Text>\n          <Accordion\n          title=\"Section\"\n          defaultOpen={false}\n          borderRadius=\"lg\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const AudioMeta = {
  "id": "Audio",
  "name": "Audio",
  "description": "A base component for audio playback using expo-av.",
  "tags": [
    "base",
    "media",
    "audio",
    "player"
  ],
  "props": {
    "source": {
      "type": "string",
      "description": "The source URI of the audio file",
      "required": true
    },
    "autoPlay": {
      "type": "boolean",
      "description": "Whether the audio should auto-play",
      "default": false
    }
  },
  "example": "import React from 'react';\nimport { FoundationProvider, Audio, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function AudioExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Audio Example</Text>\n          <Audio\n          source=\"Sample\"\n          autoPlay={false}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const AvatarMeta = {
  "id": "Avatar",
  "label": "Avatar",
  "description": "User avatar with image, initials, or icon fallback.",
  "category": "display",
  "tags": [
    "avatar",
    "user",
    "profile",
    "image"
  ],
  "themeMapping": {
    "bg": "muted",
    "text": "mutedForeground"
  },
  "variants": [
    {
      "name": "circle",
      "label": "Circle",
      "overrides": {
        "borderRadius": "full"
      }
    },
    {
      "name": "square",
      "label": "Square",
      "overrides": {
        "borderRadius": "md"
      }
    }
  ],
  "sizes": [
    "xs",
    "sm",
    "md",
    "lg",
    "xl"
  ],
  "sizeMap": {
    "xs": {
      "height": 24,
      "width": 24,
      "fontSize": 10
    },
    "sm": {
      "height": 32,
      "width": 32,
      "fontSize": 12
    },
    "md": {
      "height": 40,
      "width": 40,
      "fontSize": 14
    },
    "lg": {
      "height": 56,
      "width": 56,
      "fontSize": 18
    },
    "xl": {
      "height": 72,
      "width": 72,
      "fontSize": 24
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "variant",
      "label": "Shape",
      "type": "enum",
      "group": "style",
      "default": "circle",
      "options": [
        "circle",
        "square"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "xs",
        "sm",
        "md",
        "lg",
        "xl"
      ]
    },
    {
      "name": "source",
      "label": "Image source",
      "type": "string",
      "group": "content"
    },
    {
      "name": "initials",
      "label": "Initials",
      "type": "string",
      "group": "content"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "muted"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Avatar, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function AvatarExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Avatar Example</Text>\n          <Avatar\n          variant=\"circle\"\n          size=\"md\"\n          source=\"Image source\"\n          initials=\"Initials\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const AvatarPickerMeta = {
  "id": "AvatarPicker",
  "name": "AvatarPicker",
  "description": "Allows users to select an avatar from a list of predefined options or upload one.",
  "tags": [
    "base",
    "input",
    "picker",
    "avatar"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, AvatarPicker, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function AvatarPickerExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">AvatarPicker Example</Text>\n          <AvatarPicker />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const BadgeMeta = {
  "id": "Badge",
  "label": "Badge",
  "description": "Small status indicator or label.",
  "category": "display",
  "tags": [
    "badge",
    "tag",
    "label",
    "status"
  ],
  "themeMapping": {
    "bg": "primary",
    "text": "primaryForeground"
  },
  "variants": [
    {
      "name": "solid",
      "label": "Solid",
      "overrides": {}
    },
    {
      "name": "outline",
      "label": "Outline",
      "overrides": {
        "bg": "transparent",
        "borderWidth": 1
      }
    },
    {
      "name": "subtle",
      "label": "Subtle",
      "overrides": {}
    }
  ],
  "sizes": [
    "sm",
    "md"
  ],
  "sizeMap": {},
  "colorMap": {
    "primary": {
      "solid": [
        "primary",
        "primaryForeground"
      ],
      "subtle": [
        "primary",
        "primaryForeground"
      ]
    },
    "secondary": {
      "solid": [
        "secondary",
        "secondaryForeground"
      ],
      "subtle": [
        "secondary",
        "secondaryForeground"
      ]
    },
    "success": {
      "solid": [
        "success",
        "#fff"
      ],
      "subtle": [
        "#dcfce7",
        "#166534"
      ]
    },
    "warning": {
      "solid": [
        "warning",
        "#fff"
      ],
      "subtle": [
        "#fef3c7",
        "#92400e"
      ]
    },
    "error": {
      "solid": [
        "error",
        "#fff"
      ],
      "subtle": [
        "#fee2e2",
        "#991b1b"
      ]
    },
    "info": {
      "solid": [
        "info",
        "#fff"
      ],
      "subtle": [
        "#e0f2fe",
        "#0369a1"
      ]
    }
  },
  "props": [
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "solid",
      "options": [
        "solid",
        "outline",
        "subtle"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md"
      ]
    },
    {
      "name": "color",
      "label": "Color scheme",
      "type": "enum",
      "group": "style",
      "default": "primary",
      "options": [
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
        "info"
      ]
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "full"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Badge, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function BadgeExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Badge Example</Text>\n          <Badge\n          label=\"Label\"\n          variant=\"solid\"\n          size=\"md\"\n          color=\"primary\"\n          borderRadius=\"full\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const BlurViewMeta = {
  "id": "BlurView",
  "label": "Blur View",
  "description": "Blurred background overlay container.",
  "category": "display",
  "tags": [
    "blur",
    "glass",
    "frosted",
    "overlay"
  ],
  "themeMapping": {},
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "intensity",
      "label": "Intensity",
      "type": "number",
      "group": "style",
      "default": 50
    },
    {
      "name": "tint",
      "label": "Tint",
      "type": "enum",
      "group": "style",
      "default": "default",
      "options": [
        "default",
        "light",
        "dark"
      ]
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "spacing",
      "group": "layout"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, BlurView, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function BlurViewExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Blur View Example</Text>\n          <BlurView\n          intensity={50}\n          tint=\"default\"\n          borderRadius=\"none\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ButtonMeta = {
  "id": "Button",
  "label": "Button",
  "description": "Pressable button with variant and size support.",
  "category": "action",
  "example": "import React from 'react';\nimport { FoundationProvider, Button, Inline, Stack, Text } from '@flipova/foundation';\n\nexport default function ButtonExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Stack spacing={4} style={{ padding: 20 }}>\n        <Text variant=\"heading\" size=\"md\">Button Actions</Text>\n        <Inline spacing={3} alignItems=\"center\">\n          <Button\n          label=\"Button\"\n          variant=\"primary\"\n          size=\"md\"\n          disabled={false}\n          loading={false}\n          fullWidth={false}\n        onPress={() => console.log('Button pressed')} />\n        </Inline>\n      </Stack>\n    </FoundationProvider>\n  );\n}",
  "tags": [
    "button",
    "cta",
    "action",
    "pressable"
  ],
  "themeMapping": {
    "bg": "primary",
    "text": "primaryForeground"
  },
  "variants": [
    {
      "name": "primary",
      "label": "Primary",
      "overrides": {
        "borderWidth": 0
      }
    },
    {
      "name": "secondary",
      "label": "Secondary",
      "overrides": {
        "borderWidth": 0
      }
    },
    {
      "name": "outline",
      "label": "Outline",
      "overrides": {
        "bg": "transparent",
        "borderWidth": 1
      }
    },
    {
      "name": "ghost",
      "label": "Ghost",
      "overrides": {
        "bg": "transparent",
        "borderWidth": 0
      }
    },
    {
      "name": "destructive",
      "label": "Destructive",
      "overrides": {
        "borderWidth": 0
      }
    }
  ],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {
    "sm": {
      "height": 32,
      "px": 3,
      "fontSize": 13
    },
    "md": {
      "height": 40,
      "px": 4,
      "fontSize": 15
    },
    "lg": {
      "height": 48,
      "px": 5,
      "fontSize": 17
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content",
      "default": "Button"
    },
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "primary",
      "options": [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "destructive"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "loading",
      "label": "Loading",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "fullWidth",
      "label": "Full width",
      "type": "boolean",
      "group": "layout",
      "default": false
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "md"
    },
    {
      "name": "iconPosition",
      "label": "Icon position",
      "type": "enum",
      "group": "layout",
      "default": "left",
      "options": [
        "left",
        "right"
      ]
    }
  ]
} as const;

export const CameraMeta = {
  "id": "Camera",
  "label": "Camera",
  "description": "Camera viewfinder for photo/video capture.",
  "category": "media",
  "tags": [
    "camera",
    "photo",
    "capture",
    "scan"
  ],
  "themeMapping": {
    "bg": "muted"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "facing",
      "label": "Facing",
      "type": "enum",
      "group": "behavior",
      "default": "back",
      "options": [
        "front",
        "back"
      ]
    },
    {
      "name": "flash",
      "label": "Flash",
      "type": "enum",
      "group": "behavior",
      "default": "off",
      "options": [
        "off",
        "on",
        "auto"
      ]
    },
    {
      "name": "enableTorch",
      "label": "Torch",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "width",
      "label": "Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout",
      "default": 300
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "lg"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Camera, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function CameraExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Camera Example</Text>\n          <Camera\n          facing=\"back\"\n          flash=\"off\"\n          enableTorch={false}\n          height={300}\n          borderRadius=\"lg\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const CardMeta = {
  "id": "Card",
  "label": "Card",
  "description": "Surface container used to group and display information.",
  "category": "display",
  "tags": [
    "card",
    "surface",
    "container"
  ],
  "themeMapping": {
    "bg": "card",
    "text": "cardForeground",
    "border": "border"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "shadow",
      "label": "Shadow",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "none",
        "sm",
        "md",
        "lg",
        "xl"
      ]
    },
    {
      "name": "interactive",
      "label": "Interactive",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "md"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Card, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function CardExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Card Example</Text>\n          <Card\n          shadow=\"md\"\n          interactive={false}\n          padding={4}\n          borderRadius=\"md\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const CheckboxMeta = {
  "id": "Checkbox",
  "label": "Checkbox",
  "description": "Toggle checkbox with label.",
  "category": "input",
  "tags": [
    "checkbox",
    "toggle",
    "form",
    "boolean"
  ],
  "themeMapping": {
    "active": "primary",
    "border": "border"
  },
  "variants": [
    {
      "name": "square",
      "label": "Square",
      "overrides": {
        "borderRadius": "sm"
      }
    },
    {
      "name": "rounded",
      "label": "Rounded",
      "overrides": {
        "borderRadius": "full"
      }
    }
  ],
  "sizes": [
    "sm",
    "md"
  ],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "square",
      "options": [
        "square",
        "rounded"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md"
      ]
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "activeColor",
      "label": "Active color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    },
    {
      "name": "checked",
      "label": "Checked",
      "type": "boolean",
      "group": "behavior",
      "default": false
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, Checkbox, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function CheckboxExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Checkbox Input</Text>\n          <Checkbox\n          variant=\"square\"\n          size=\"md\"\n          disabled={false}\n          label=\"Label\"\n          checked={false}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ChipMeta = {
  "id": "Chip",
  "label": "Chip",
  "description": "Selectable chip / tag with optional close action.",
  "category": "input",
  "tags": [
    "chip",
    "tag",
    "filter",
    "selectable"
  ],
  "themeMapping": {
    "bg": "muted",
    "text": "foreground",
    "active": "primary"
  },
  "variants": [
    {
      "name": "filled",
      "label": "Filled",
      "overrides": {}
    },
    {
      "name": "outline",
      "label": "Outline",
      "overrides": {
        "bg": "transparent",
        "borderWidth": 1
      }
    }
  ],
  "sizes": [
    "sm",
    "md"
  ],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "filled",
      "options": [
        "filled",
        "outline"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md"
      ]
    },
    {
      "name": "selected",
      "label": "Selected",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "closable",
      "label": "Closable",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "full"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, Chip, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function ChipExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Chip Input</Text>\n          <Chip\n          label=\"Label\"\n          variant=\"filled\"\n          size=\"md\"\n          selected={false}\n          closable={false}\n          disabled={false}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ColorPickerMeta = {
  "id": "ColorPicker",
  "name": "ColorPicker",
  "description": "A visual grid of color swatches for choosing a theme or element color.",
  "tags": [
    "base",
    "input",
    "picker",
    "color"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, ColorPicker, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function ColorPickerExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">ColorPicker Example</Text>\n          <ColorPicker />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const DatePickerMeta = {
  "id": "DatePicker",
  "label": "Date Picker",
  "description": "Date/time picker input.",
  "category": "input",
  "tags": [
    "date",
    "time",
    "picker",
    "calendar",
    "form"
  ],
  "themeMapping": {
    "bg": "input",
    "text": "foreground",
    "border": "border",
    "accent": "primary"
  },
  "variants": [],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {
    "sm": {
      "height": 32,
      "fontSize": 13
    },
    "md": {
      "height": 40,
      "fontSize": 15
    },
    "lg": {
      "height": 48,
      "fontSize": 17
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "mode",
      "label": "Mode",
      "type": "enum",
      "group": "behavior",
      "default": "date",
      "options": [
        "date",
        "time",
        "datetime"
      ]
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "placeholder",
      "label": "Placeholder",
      "type": "string",
      "group": "content",
      "default": "Select date"
    },
    {
      "name": "error",
      "label": "Error message",
      "type": "string",
      "group": "content"
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "md"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, DatePicker, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function DatePickerExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Date Picker Input</Text>\n          <DatePicker\n          size=\"md\"\n          mode=\"date\"\n          label=\"Label\"\n          placeholder=\"Select date\"\n          error=\"Error message\"\n          disabled={false}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const DividerMeta = {
  "id": "Divider",
  "label": "Divider",
  "description": "Horizontal or vertical divider line.",
  "category": "primitive",
  "tags": [
    "divider",
    "separator",
    "line",
    "hr"
  ],
  "slots": [],
  "props": [
    {
      "name": "vertical",
      "label": "Vertical",
      "type": "boolean",
      "group": "layout",
      "default": false
    },
    {
      "name": "color",
      "label": "Color",
      "type": "color",
      "group": "style"
    },
    {
      "name": "thickness",
      "label": "Thickness",
      "type": "number",
      "group": "style",
      "default": 1
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Divider, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function DividerExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Divider Example</Text>\n          <Divider\n          vertical={false}\n          thickness={1}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const EmojiPickerMeta = {
  "id": "EmojiPicker",
  "name": "EmojiPicker",
  "description": "A grid of emojis categorized by type.",
  "tags": [
    "base",
    "input",
    "picker",
    "emoji"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, EmojiPicker, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function EmojiPickerExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">EmojiPicker Example</Text>\n          <EmojiPicker />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const FilePickerMeta = {
  "id": "FilePicker",
  "label": "File Picker",
  "description": "File/image upload input.",
  "category": "input",
  "tags": [
    "file",
    "upload",
    "image",
    "picker",
    "form"
  ],
  "themeMapping": {
    "bg": "muted",
    "text": "foreground",
    "border": "border",
    "accent": "primary"
  },
  "variants": [
    {
      "name": "button",
      "label": "Button",
      "overrides": {}
    },
    {
      "name": "dropzone",
      "label": "Drop Zone",
      "overrides": {}
    }
  ],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "button",
      "options": [
        "button",
        "dropzone"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "accept",
      "label": "Accept types",
      "type": "string",
      "group": "behavior",
      "default": "image/*"
    },
    {
      "name": "multiple",
      "label": "Multiple",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content",
      "default": "Upload file"
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "md"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, FilePicker, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function FilePickerExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">File Picker Input</Text>\n          <FilePicker\n          variant=\"button\"\n          size=\"md\"\n          accept=\"image/*\"\n          multiple={false}\n          label=\"Upload file\"\n          disabled={false}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const FlatListMeta = {
  "id": "FlatList",
  "label": "List",
  "description": "Scrollable list with virtualization.",
  "category": "display",
  "example": "import React from 'react';\nimport { FoundationProvider, FlatList, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function FlatListExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">List Example</Text>\n          <FlatList\n          horizontal={false}\n          numColumns={1}\n          spacing={0}\n          showsScrollIndicator={true}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}",
  "tags": [
    "list",
    "flatlist",
    "scroll",
    "virtualized"
  ],
  "themeMapping": {
    "bg": "background"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "horizontal",
      "label": "Horizontal",
      "type": "boolean",
      "group": "layout",
      "default": false
    },
    {
      "name": "numColumns",
      "label": "Columns",
      "type": "number",
      "group": "layout",
      "default": 1
    },
    {
      "name": "spacing",
      "label": "Item spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "showsScrollIndicator",
      "label": "Scroll indicator",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style"
    }
  ]
} as const;

export const GifPickerMeta = {
  "id": "GifPicker",
  "name": "GifPicker",
  "description": "A placeholder picker for GIFs.",
  "tags": [
    "base",
    "input",
    "picker",
    "gif"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, GifPicker, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function GifPickerExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">GifPicker Example</Text>\n          <GifPicker />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const GradientMeta = {
  "id": "Gradient",
  "label": "Gradient",
  "description": "Linear gradient background container.",
  "category": "display",
  "tags": [
    "gradient",
    "linear",
    "background",
    "color"
  ],
  "themeMapping": {},
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "startColor",
      "label": "Start color",
      "type": "color",
      "group": "style",
      "default": "#3b82f6"
    },
    {
      "name": "endColor",
      "label": "End color",
      "type": "color",
      "group": "style",
      "default": "#8b5cf6"
    },
    {
      "name": "direction",
      "label": "Direction",
      "type": "enum",
      "group": "style",
      "default": "vertical",
      "options": [
        "vertical",
        "horizontal",
        "diagonal"
      ]
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "spacing",
      "group": "layout"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Gradient, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function GradientExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Gradient Example</Text>\n          <Gradient\n          startColor=\"#3b82f6\"\n          endColor=\"#8b5cf6\"\n          direction=\"vertical\"\n          borderRadius=\"none\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const IconMeta = {
  "id": "Icon",
  "label": "Icon",
  "description": "Vector icon from Feather icon set.",
  "category": "display",
  "tags": [
    "icon",
    "feather",
    "vector",
    "symbol"
  ],
  "themeMapping": {
    "color": "foreground"
  },
  "variants": [],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "name",
      "label": "Icon name",
      "type": "string",
      "group": "content",
      "default": "star"
    },
    {
      "name": "size",
      "label": "Size",
      "type": "number",
      "group": "style",
      "default": 24
    },
    {
      "name": "color",
      "label": "Color",
      "type": "color",
      "group": "style",
      "themeDefault": "foreground"
    },
    {
      "name": "strokeWidth",
      "label": "Stroke width",
      "type": "number",
      "group": "style",
      "default": 2
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Icon, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function IconExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Icon Example</Text>\n          <Icon\n          name=\"star\"\n          size={24}\n          strokeWidth={2}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const IconButtonMeta = {
  "id": "IconButton",
  "label": "Icon Button",
  "description": "Pressable icon-only button.",
  "category": "action",
  "tags": [
    "icon",
    "button",
    "action"
  ],
  "themeMapping": {
    "bg": "muted",
    "icon": "foreground"
  },
  "variants": [
    {
      "name": "filled",
      "label": "Filled",
      "overrides": {}
    },
    {
      "name": "ghost",
      "label": "Ghost",
      "overrides": {
        "bg": "transparent"
      }
    },
    {
      "name": "outline",
      "label": "Outline",
      "overrides": {
        "bg": "transparent",
        "borderWidth": 1
      }
    }
  ],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {
    "sm": {
      "height": 32,
      "width": 32,
      "iconSize": 16
    },
    "md": {
      "height": 40,
      "width": 40,
      "iconSize": 20
    },
    "lg": {
      "height": 48,
      "width": 48,
      "iconSize": 24
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "ghost",
      "options": [
        "filled",
        "ghost",
        "outline"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "full"
    },
    {
      "name": "color",
      "label": "Icon color",
      "type": "color",
      "group": "style",
      "themeDefault": "foreground"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, IconButton, Inline, Stack, Text } from '@flipova/foundation';\n\nexport default function IconButtonExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Stack spacing={4} style={{ padding: 20 }}>\n        <Text variant=\"heading\" size=\"md\">Icon Button Actions</Text>\n        <Inline spacing={3} alignItems=\"center\">\n          <IconButton\n          variant=\"ghost\"\n          size=\"md\"\n          disabled={false}\n          borderRadius=\"full\"\n        onPress={() => console.log('IconButton pressed')} />\n        </Inline>\n      </Stack>\n    </FoundationProvider>\n  );\n}"
} as const;

export const IconPickerMeta = {
  "id": "IconPicker",
  "name": "IconPicker",
  "description": "A searchable grid of icons.",
  "tags": [
    "base",
    "input",
    "picker",
    "icon"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, IconPicker, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function IconPickerExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">IconPicker Example</Text>\n          <IconPicker />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ImageMeta = {
  "id": "Image",
  "label": "Image",
  "description": "Image component with source, resize mode, and placeholder.",
  "category": "display",
  "tags": [
    "image",
    "photo",
    "picture",
    "media"
  ],
  "themeMapping": {
    "bg": "muted"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "source",
      "label": "Source URL",
      "type": "string",
      "group": "content"
    },
    {
      "name": "alt",
      "label": "Alt text",
      "type": "string",
      "group": "content"
    },
    {
      "name": "resizeMode",
      "label": "Resize mode",
      "type": "enum",
      "group": "style",
      "default": "cover",
      "options": [
        "cover",
        "contain",
        "stretch",
        "center"
      ]
    },
    {
      "name": "width",
      "label": "Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout",
      "default": 200
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "background",
      "label": "Placeholder bg",
      "type": "color",
      "group": "style",
      "themeDefault": "muted"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Image, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function ImageExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Image Example</Text>\n          <Image\n          source=\"Source URL\"\n          alt=\"Alt text\"\n          resizeMode=\"cover\"\n          height={200}\n          borderRadius=\"none\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const LottieAnimationMeta = {
  "id": "LottieAnimation",
  "label": "Lottie",
  "description": "Lottie animation player.",
  "category": "media",
  "tags": [
    "lottie",
    "animation",
    "motion",
    "json"
  ],
  "themeMapping": {},
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "source",
      "label": "Source URL",
      "type": "string",
      "group": "content"
    },
    {
      "name": "autoPlay",
      "label": "Auto play",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "loop",
      "label": "Loop",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "speed",
      "label": "Speed",
      "type": "number",
      "group": "behavior",
      "default": 1
    },
    {
      "name": "width",
      "label": "Width",
      "type": "number",
      "group": "layout",
      "default": 200
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout",
      "default": 200
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, LottieAnimation, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function LottieAnimationExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Lottie Example</Text>\n          <LottieAnimation\n          source=\"Source URL\"\n          autoPlay={true}\n          loop={true}\n          speed={1}\n          width={200}\n          height={200}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const MapViewMeta = {
  "id": "MapView",
  "label": "Map",
  "description": "Interactive map view with markers.",
  "category": "media",
  "tags": [
    "map",
    "location",
    "gps",
    "marker"
  ],
  "themeMapping": {},
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "latitude",
      "label": "Latitude",
      "type": "number",
      "group": "content",
      "default": 48.8566
    },
    {
      "name": "longitude",
      "label": "Longitude",
      "type": "number",
      "group": "content",
      "default": 2.3522
    },
    {
      "name": "zoom",
      "label": "Zoom",
      "type": "number",
      "group": "content",
      "default": 12
    },
    {
      "name": "width",
      "label": "Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout",
      "default": 300
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "lg"
    },
    {
      "name": "showsUserLocation",
      "label": "User location",
      "type": "boolean",
      "group": "behavior",
      "default": true
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, MapView, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function MapViewExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Map Example</Text>\n          <MapView\n          latitude={48.8566}\n          longitude={2.3522}\n          zoom={12}\n          height={300}\n          borderRadius=\"lg\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const NumberInputMeta = {
  "id": "NumberInput",
  "name": "NumberInput",
  "description": "A specialized input for numbers with increment/decrement steppers.",
  "tags": [
    "base",
    "input",
    "number",
    "stepper"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, NumberInput, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function NumberInputExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">NumberInput Example</Text>\n          <NumberInput />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const OTPInputMeta = {
  "id": "OTPInput",
  "name": "OTPInput",
  "description": "A multi-cell One-Time-Password input.",
  "tags": [
    "base",
    "input",
    "otp"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, OTPInput, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function OTPInputExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">OTPInput Example</Text>\n          <OTPInput />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const PasswordInputMeta = {
  "id": "PasswordInput",
  "name": "PasswordInput",
  "description": "A secure text input with visibility toggle.",
  "tags": [
    "base",
    "input",
    "password",
    "secure"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, PasswordInput, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function PasswordInputExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">PasswordInput Example</Text>\n          <PasswordInput />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const PressableMeta = {
  "id": "Pressable",
  "label": "Pressable",
  "description": "Generic pressable wrapper with feedback.",
  "category": "action",
  "tags": [
    "pressable",
    "touchable",
    "tap",
    "click"
  ],
  "themeMapping": {},
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "opacity",
      "label": "Press opacity",
      "type": "number",
      "group": "style",
      "default": 0.7
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Pressable, Inline, Stack, Text } from '@flipova/foundation';\n\nexport default function PressableExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Stack spacing={4} style={{ padding: 20 }}>\n        <Text variant=\"heading\" size=\"md\">Pressable Actions</Text>\n        <Inline spacing={3} alignItems=\"center\">\n          <Pressable\n          disabled={false}\n          opacity={0.7}\n        onPress={() => console.log('Pressable pressed')} />\n        </Inline>\n      </Stack>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ProgressBarMeta = {
  "id": "ProgressBar",
  "label": "Progress Bar",
  "description": "Horizontal progress indicator.",
  "category": "feedback",
  "tags": [
    "progress",
    "bar",
    "loading",
    "percentage"
  ],
  "themeMapping": {
    "active": "primary",
    "track": "muted"
  },
  "variants": [],
  "sizes": [
    "sm",
    "md"
  ],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "progress",
      "label": "Progress (0-1)",
      "type": "number",
      "group": "content",
      "default": 0.5
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md"
      ]
    },
    {
      "name": "color",
      "label": "Color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    },
    {
      "name": "trackColor",
      "label": "Track color",
      "type": "color",
      "group": "style",
      "themeDefault": "muted"
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "full"
    },
    {
      "name": "showLabel",
      "label": "Show label",
      "type": "boolean",
      "group": "behavior",
      "default": false
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, ProgressBar, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function ProgressBarExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Progress Bar Example</Text>\n          <ProgressBar\n          progress={0.5}\n          size=\"md\"\n          borderRadius=\"full\"\n          showLabel={false}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const RadioGroupMeta = {
  "id": "RadioGroup",
  "label": "Radio Group",
  "description": "Group of radio buttons for single selection.",
  "category": "input",
  "tags": [
    "radio",
    "group",
    "select",
    "form"
  ],
  "themeMapping": {
    "active": "primary",
    "border": "border",
    "text": "foreground"
  },
  "variants": [],
  "sizes": [
    "sm",
    "md"
  ],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md"
      ]
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "direction",
      "label": "Direction",
      "type": "enum",
      "group": "layout",
      "default": "column",
      "options": [
        "column",
        "row"
      ]
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 2
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "activeColor",
      "label": "Active color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, RadioGroup, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function RadioGroupExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Radio Group Input</Text>\n          <RadioGroup\n          size=\"md\"\n          label=\"Label\"\n          direction=\"column\"\n          spacing={2}\n          disabled={false}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SearchInputMeta = {
  "id": "SearchInput",
  "name": "SearchInput",
  "description": "A specialized input for searching with a clear button.",
  "tags": [
    "base",
    "input",
    "search"
  ],
  "props": [],
  "example": "import React from 'react';\nimport { FoundationProvider, SearchInput, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function SearchInputExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">SearchInput Example</Text>\n          <SearchInput />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SelectMeta = {
  "id": "Select",
  "label": "Select",
  "description": "Dropdown select input with options.",
  "category": "input",
  "tags": [
    "select",
    "dropdown",
    "picker",
    "form"
  ],
  "themeMapping": {
    "bg": "input",
    "text": "foreground",
    "border": "border"
  },
  "variants": [
    {
      "name": "outlined",
      "label": "Outlined",
      "overrides": {
        "borderWidth": 1
      }
    },
    {
      "name": "filled",
      "label": "Filled",
      "overrides": {
        "borderWidth": 0
      }
    }
  ],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {
    "sm": {
      "height": 32,
      "px": 3,
      "fontSize": 13,
      "labelSize": 11
    },
    "md": {
      "height": 40,
      "px": 4,
      "fontSize": 15,
      "labelSize": 13
    },
    "lg": {
      "height": 48,
      "px": 5,
      "fontSize": 17,
      "labelSize": 14
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "outlined",
      "options": [
        "outlined",
        "filled"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "placeholder",
      "label": "Placeholder",
      "type": "string",
      "group": "content",
      "default": "Select..."
    },
    {
      "name": "error",
      "label": "Error message",
      "type": "string",
      "group": "content"
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "md"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "input"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, Select, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function SelectExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Select Input</Text>\n          <Select\n          variant=\"outlined\"\n          size=\"md\"\n          label=\"Label\"\n          placeholder=\"Select...\"\n          error=\"Error message\"\n          disabled={false}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SeparatorMeta = {
  "id": "Separator",
  "label": "Separator",
  "description": "Visual separator with optional label.",
  "category": "display",
  "tags": [
    "separator",
    "divider",
    "or",
    "line"
  ],
  "themeMapping": {
    "color": "border",
    "text": "mutedForeground"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "color",
      "label": "Color",
      "type": "color",
      "group": "style",
      "themeDefault": "border"
    },
    {
      "name": "thickness",
      "label": "Thickness",
      "type": "number",
      "group": "style",
      "default": 1
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "orientation",
      "label": "Orientation",
      "type": "enum",
      "group": "layout",
      "default": "horizontal",
      "options": [
        "horizontal",
        "vertical"
      ]
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Separator, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function SeparatorExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Separator Example</Text>\n          <Separator\n          label=\"Label\"\n          thickness={1}\n          spacing={4}\n          orientation=\"horizontal\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SliderMeta = {
  "id": "Slider",
  "label": "Slider",
  "description": "Range slider input.",
  "category": "input",
  "tags": [
    "slider",
    "range",
    "input",
    "form"
  ],
  "themeMapping": {
    "active": "primary",
    "track": "muted"
  },
  "variants": [],
  "sizes": [
    "sm",
    "md"
  ],
  "sizeMap": {
    "sm": {
      "trackHeight": 4,
      "thumbSize": 16,
      "labelSize": 11,
      "valueSize": 12
    },
    "md": {
      "trackHeight": 6,
      "thumbSize": 20,
      "labelSize": 13,
      "valueSize": 14
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md"
      ]
    },
    {
      "name": "min",
      "label": "Min",
      "type": "number",
      "group": "behavior",
      "default": 0
    },
    {
      "name": "max",
      "label": "Max",
      "type": "number",
      "group": "behavior",
      "default": 100
    },
    {
      "name": "step",
      "label": "Step",
      "type": "number",
      "group": "behavior",
      "default": 1
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "showValue",
      "label": "Show value",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "activeColor",
      "label": "Active color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, Slider, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function SliderExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Slider Input</Text>\n          <Slider\n          size=\"md\"\n          min={0}\n          max={100}\n          step={1}\n          label=\"Label\"\n          showValue={true}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SpinnerMeta = {
  "id": "Spinner",
  "label": "Spinner",
  "description": "Loading indicator.",
  "category": "feedback",
  "tags": [
    "spinner",
    "loading",
    "indicator"
  ],
  "themeMapping": {
    "color": "primary"
  },
  "variants": [],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "color",
      "label": "Color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Spinner, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function SpinnerExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Spinner Example</Text>\n          <Spinner\n          size=\"md\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SwitchMeta = {
  "id": "Switch",
  "label": "Switch",
  "description": "Toggle switch.",
  "category": "input",
  "tags": [
    "switch",
    "toggle",
    "boolean"
  ],
  "themeMapping": {
    "active": "primary",
    "track": "muted"
  },
  "variants": [],
  "sizes": [
    "sm",
    "md"
  ],
  "sizeMap": {
    "sm": {
      "scale": 0.8,
      "labelSize": 13,
      "width": 36,
      "height": 20
    },
    "md": {
      "scale": 1,
      "labelSize": 15,
      "width": 44,
      "height": 24
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md"
      ]
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "activeColor",
      "label": "Active color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    },
    {
      "name": "trackColor",
      "label": "Track color",
      "type": "color",
      "group": "style",
      "themeDefault": "muted"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, Switch, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function SwitchExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Switch Input</Text>\n          <Switch\n          size=\"md\"\n          disabled={false}\n          label=\"Label\"\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const TabsMeta = {
  "id": "Tabs",
  "label": "Tabs",
  "description": "Tab navigation with content panels.",
  "category": "navigation",
  "tags": [
    "tabs",
    "navigation",
    "panel",
    "switch"
  ],
  "themeMapping": {
    "active": "primary",
    "bg": "card",
    "border": "border"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "activeColor",
      "label": "Active color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "position",
      "label": "Position",
      "type": "enum",
      "group": "layout",
      "default": "top",
      "options": [
        "top",
        "bottom"
      ]
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Tabs, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function TabsExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Tabs Example</Text>\n          <Tabs\n          borderRadius=\"none\"\n          position=\"top\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const TextMeta = {
  "id": "Text",
  "label": "Text",
  "description": "Text display component with typography control.",
  "category": "display",
  "tags": [
    "text",
    "label",
    "paragraph",
    "heading",
    "typography"
  ],
  "themeMapping": {
    "color": "foreground"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "text",
      "label": "Text",
      "type": "string",
      "group": "content",
      "default": "Text"
    },
    {
      "name": "fontSize",
      "label": "Font size",
      "type": "number",
      "group": "style",
      "default": 14
    },
    {
      "name": "fontWeight",
      "label": "Font weight",
      "type": "enum",
      "group": "style",
      "default": "400",
      "options": [
        "300",
        "400",
        "500",
        "600",
        "700",
        "800"
      ]
    },
    {
      "name": "color",
      "label": "Color",
      "type": "color",
      "group": "style",
      "themeDefault": "foreground"
    },
    {
      "name": "textAlign",
      "label": "Align",
      "type": "enum",
      "group": "style",
      "default": "left",
      "options": [
        "left",
        "center",
        "right"
      ]
    },
    {
      "name": "numberOfLines",
      "label": "Max lines",
      "type": "number",
      "group": "behavior"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Text, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function TextExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Text Example</Text>\n          <Text\n          text=\"Text\"\n          fontSize={14}\n          fontWeight=\"400\"\n          textAlign=\"left\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const TextAreaMeta = {
  "id": "TextArea",
  "label": "Text Area",
  "description": "Multi-line text input.",
  "category": "input",
  "tags": [
    "textarea",
    "multiline",
    "input",
    "form"
  ],
  "themeMapping": {
    "bg": "input",
    "text": "foreground",
    "border": "border"
  },
  "variants": [
    {
      "name": "outlined",
      "label": "Outlined",
      "overrides": {
        "borderWidth": 1,
        "bg": "transparent"
      }
    },
    {
      "name": "filled",
      "label": "Filled",
      "overrides": {
        "borderWidth": 0
      }
    }
  ],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {
    "sm": {
      "height": 80,
      "px": 3,
      "py": 2,
      "fontSize": 13,
      "labelSize": 11
    },
    "md": {
      "height": 120,
      "px": 4,
      "py": 3,
      "fontSize": 15,
      "labelSize": 13
    },
    "lg": {
      "height": 180,
      "px": 5,
      "py": 4,
      "fontSize": 17,
      "labelSize": 14
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "outlined",
      "options": [
        "outlined",
        "filled"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "placeholder",
      "label": "Placeholder",
      "type": "string",
      "group": "content"
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "error",
      "label": "Error message",
      "type": "string",
      "group": "content"
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "numberOfLines",
      "label": "Lines",
      "type": "number",
      "group": "layout",
      "default": 4
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "md"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "input"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, TextArea, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function TextAreaExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Text Area Input</Text>\n          <TextArea\n          variant=\"outlined\"\n          size=\"md\"\n          placeholder=\"Placeholder\"\n          label=\"Label\"\n          error=\"Error message\"\n          disabled={false}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const TextInputMeta = {
  "id": "TextInput",
  "label": "Text Input",
  "description": "Single-line text input with label, error state, and icon support.",
  "category": "input",
  "tags": [
    "input",
    "text",
    "field",
    "form"
  ],
  "themeMapping": {
    "bg": "input",
    "text": "foreground",
    "border": "border",
    "placeholder": "mutedForeground"
  },
  "variants": [
    {
      "name": "outlined",
      "label": "Outlined",
      "overrides": {
        "borderWidth": 1,
        "bg": "transparent"
      }
    },
    {
      "name": "filled",
      "label": "Filled",
      "overrides": {
        "borderWidth": 0
      }
    },
    {
      "name": "underline",
      "label": "Underline",
      "overrides": {
        "borderWidth": 0,
        "borderBottomWidth": 1,
        "borderRadius": "none"
      }
    }
  ],
  "sizes": [
    "sm",
    "md",
    "lg"
  ],
  "sizeMap": {
    "sm": {
      "height": 32,
      "px": 3,
      "fontSize": 13,
      "labelSize": 11
    },
    "md": {
      "height": 40,
      "px": 4,
      "fontSize": 15,
      "labelSize": 13
    },
    "lg": {
      "height": 48,
      "px": 5,
      "fontSize": 17,
      "labelSize": 14
    }
  },
  "colorMap": {},
  "props": [
    {
      "name": "variant",
      "label": "Variant",
      "type": "enum",
      "group": "style",
      "default": "outlined",
      "options": [
        "outlined",
        "filled",
        "underline"
      ]
    },
    {
      "name": "size",
      "label": "Size",
      "type": "enum",
      "group": "style",
      "default": "md",
      "options": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "name": "placeholder",
      "label": "Placeholder",
      "type": "string",
      "group": "content"
    },
    {
      "name": "label",
      "label": "Label",
      "type": "string",
      "group": "content"
    },
    {
      "name": "error",
      "label": "Error message",
      "type": "string",
      "group": "content"
    },
    {
      "name": "disabled",
      "label": "Disabled",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "secureEntry",
      "label": "Password",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "md"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "input"
    },
    {
      "name": "borderColor",
      "label": "Border color",
      "type": "color",
      "group": "style",
      "themeDefault": "border"
    }
  ],
  "example": "import React, { useState } from 'react';\nimport { FoundationProvider, TextInput, Card, Stack, Text, Button } from '@flipova/foundation';\n\nexport default function TextInputExample() {\n  const [value, setValue] = useState('');\n\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\" style={{ maxWidth: 400 }}>\n        <Stack spacing={4}>\n          <Text variant=\"heading\" size=\"md\">Text Input Input</Text>\n          <TextInput\n          variant=\"outlined\"\n          size=\"md\"\n          placeholder=\"Placeholder\"\n          label=\"Label\"\n          error=\"Error message\"\n          disabled={false}\n        value={value} onChangeText={setValue} />\n          <Button variant=\"primary\" label=\"Submit\" onPress={() => console.log(value)} />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const VideoMeta = {
  "id": "Video",
  "label": "Video",
  "description": "Video player with controls, autoplay, and loop.",
  "category": "media",
  "tags": [
    "video",
    "player",
    "media",
    "stream"
  ],
  "themeMapping": {
    "bg": "muted"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "source",
      "label": "Source URL",
      "type": "string",
      "group": "content"
    },
    {
      "name": "poster",
      "label": "Poster URL",
      "type": "string",
      "group": "content"
    },
    {
      "name": "autoplay",
      "label": "Autoplay",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "loop",
      "label": "Loop",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "muted",
      "label": "Muted",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "controls",
      "label": "Show controls",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "resizeMode",
      "label": "Resize mode",
      "type": "enum",
      "group": "style",
      "default": "contain",
      "options": [
        "cover",
        "contain",
        "stretch"
      ]
    },
    {
      "name": "width",
      "label": "Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout",
      "default": 220
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Video, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function VideoExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">Video Example</Text>\n          <Video\n          source=\"Source URL\"\n          poster=\"Poster URL\"\n          autoplay={false}\n          loop={false}\n          muted={true}\n          controls={true}\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const WebViewMeta = {
  "id": "WebView",
  "label": "WebView",
  "description": "Embedded web browser view.",
  "category": "media",
  "tags": [
    "webview",
    "browser",
    "iframe",
    "embed"
  ],
  "themeMapping": {
    "bg": "muted"
  },
  "variants": [],
  "sizes": [],
  "sizeMap": {},
  "colorMap": {},
  "props": [
    {
      "name": "url",
      "label": "URL",
      "type": "string",
      "group": "content",
      "default": "https://expo.dev"
    },
    {
      "name": "width",
      "label": "Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "height",
      "label": "Height",
      "type": "number",
      "group": "layout",
      "default": 400
    },
    {
      "name": "scrollEnabled",
      "label": "Scroll",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "borderRadius",
      "label": "Border radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, WebView, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function WebViewExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">WebView Example</Text>\n          <WebView\n          url=\"https://expo.dev\"\n          height={400}\n          scrollEnabled={true}\n          borderRadius=\"none\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const WheelPickerMeta = {
  "id": "WheelPicker",
  "name": "WheelPicker",
  "description": "A scrollable barrel wheel picker. If items exceed maxItemsInWheel, a \"More...\" option opens a submenu modal.",
  "props": [
    {
      "name": "items",
      "type": "array",
      "description": "Array of items to pick from { label, value }",
      "required": true
    },
    {
      "name": "value",
      "type": "string",
      "description": "Currently selected value"
    },
    {
      "name": "itemHeight",
      "type": "number",
      "description": "Height of a single item in pixels",
      "default": 40
    },
    {
      "name": "maxItemsInWheel",
      "type": "number",
      "description": "Maximum number of items to show in the wheel before moving the rest to a submenu",
      "default": 5
    },
    {
      "name": "moreLabel",
      "type": "string",
      "description": "Label for the \"More...\" option",
      "default": "Plus..."
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, WheelPicker, Card, Stack, Text } from '@flipova/foundation';\n\nexport default function WheelPickerExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Card p={5} borderRadius=\"lg\" variant=\"elevated\">\n        <Stack spacing={3}>\n          <Text variant=\"heading\" size=\"md\">WheelPicker Example</Text>\n          <WheelPicker\n          value=\"Sample\"\n          itemHeight={40}\n          maxItemsInWheel={5}\n          moreLabel=\"Plus...\"\n        />\n        </Stack>\n      </Card>\n    </FoundationProvider>\n  );\n}"
} as const;

export const AuthLayoutMeta = {
  "id": "AuthLayout",
  "label": "Authentication",
  "description": "Panel branding (desktop) + centered form. Mobile: full screen.",
  "category": "page",
  "tags": [
    "auth",
    "login",
    "signup",
    "onboarding"
  ],
  "themeMapping": {
    "root": "background",
    "surface": "card"
  },
  "slots": [
    {
      "name": "children",
      "label": "Form",
      "required": true,
      "kind": "children"
    },
    {
      "name": "branding",
      "label": "Panel branding",
      "required": false,
      "kind": "named"
    }
  ],
  "responsive": true,
  "animated": false,
  "props": [
    {
      "name": "brandingBackground",
      "label": "Branding Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "background",
      "group": "style"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "brandingRatio",
      "label": "Branding Ratio",
      "type": "ratio",
      "group": "layout",
      "default": 0.5,
      "min": 0,
      "max": 1
    },
    {
      "name": "padding",
      "label": "Form Padding",
      "type": "spacing",
      "group": "layout",
      "default": 5
    },
    {
      "name": "shadowed",
      "label": "Mobile Shadow",
      "type": "boolean",
      "group": "style",
      "default": true
    },
    {
      "name": "formMaxWidth",
      "label": "Form Max Width",
      "type": "number",
      "group": "layout",
      "default": 520
    },
    {
      "name": "formScrollPaddingY",
      "label": "Scroll Y Padding",
      "type": "spacing",
      "group": "layout",
      "default": 8
    },
    {
      "name": "formScrollPaddingX",
      "label": "Scroll X Padding",
      "type": "spacing",
      "group": "layout",
      "default": 4
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, AuthLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function AuthLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <AuthLayout\n          borderRadius=\"none\"\n          spacing={0}\n          brandingRatio={0.5}\n          padding={5}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Authentication Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Authentication Section 2</Text>\n        </Card>\n      </AuthLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const BentoLayoutMeta = {
  "id": "BentoLayout",
  "label": "Bento",
  "description": "Bento box grid with varied cell sizes.",
  "category": "content",
  "tags": [
    "bento",
    "grid",
    "mosaic",
    "dashboard"
  ],
  "themeMapping": {
    "root": "background"
  },
  "slots": [
    {
      "name": "items",
      "label": "Items",
      "required": true,
      "kind": "items"
    }
  ],
  "responsive": true,
  "animated": false,
  "previewItemCount": 5,
  "props": [
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 2
    },
    {
      "name": "itemBackground",
      "label": "Item Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "itemBorderRadius",
      "label": "Item Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout",
      "default": 1200
    },
    {
      "name": "baseHeight",
      "label": "Base Height",
      "type": "number",
      "group": "layout",
      "default": 200
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "cellConfig",
      "label": "Cell Config",
      "type": "json",
      "group": "content",
      "default": []
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, BentoLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function BentoLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <BentoLayout\n          spacing={2}\n          itemBorderRadius=\"none\"\n          scrollable={true}\n          maxWidth={1200}\n          baseHeight={200}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Bento Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Bento Section 2</Text>\n        </Card>\n      </BentoLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const BottomDrawerLayoutMeta = {
  "id": "BottomDrawerLayout",
  "label": "Bottom Drawer",
  "description": "Animated bottom drawer with swipe gesture.",
  "category": "navigation",
  "tags": [
    "drawer",
    "bottom-sheet",
    "swipe",
    "modal"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated",
      "react-native-gesture-handler",
      "expo-haptics"
    ]
  },
  "themeMapping": {
    "root": "background",
    "drawer": "background",
    "accent": "primary",
    "border": "border"
  },
  "slots": [
    {
      "name": "content",
      "label": "Main content",
      "required": true,
      "kind": "named"
    },
    {
      "name": "drawerContent",
      "label": "Drawer content",
      "required": true,
      "kind": "named"
    }
  ],
  "constants": {
    "springConfig": {
      "damping": 25,
      "stiffness": 200,
      "mass": 0.5,
      "overshootClamping": true
    }
  },
  "responsive": true,
  "animated": true,
  "props": [
    {
      "name": "drawerHeight",
      "label": "Drawer Height",
      "type": "number",
      "group": "layout",
      "default": 400
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "drawerBackground",
      "label": "Drawer Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "drawerBorderRadius",
      "label": "Drawer Radius",
      "type": "radius",
      "group": "style",
      "default": "3xl"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "defaultOpen",
      "label": "Open by Default",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "handleColor",
      "label": "Handle Color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    },
    {
      "name": "backdropOpacity",
      "label": "Backdrop Opacity",
      "type": "ratio",
      "group": "style",
      "default": 0.4,
      "min": 0,
      "max": 1
    },
    {
      "name": "contentScaleWhenOpen",
      "label": "Open Content Scale",
      "type": "ratio",
      "group": "behavior",
      "default": 0.95,
      "min": 0.5,
      "max": 1
    },
    {
      "name": "handleBarColor",
      "label": "Handle Bar Color",
      "type": "color",
      "group": "style",
      "themeDefault": "border"
    },
    {
      "name": "handleButtonSize",
      "label": "Handle Button Size",
      "type": "number",
      "group": "layout",
      "default": 56
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, BottomDrawerLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function BottomDrawerLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <BottomDrawerLayout\n          drawerHeight={400}\n          scrollable={true}\n          drawerBorderRadius=\"3xl\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Bottom Drawer Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Bottom Drawer Section 2</Text>\n        </Card>\n      </BottomDrawerLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const CenteredLayoutMeta = {
  "id": "CenteredLayout",
  "label": "Centered",
  "description": "Centered content with optional card and maxWidth.",
  "category": "page",
  "tags": [
    "centered",
    "form",
    "onboarding",
    "modal"
  ],
  "themeMapping": {
    "root": "background",
    "surface": "card"
  },
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": true,
      "kind": "children"
    }
  ],
  "responsive": true,
  "animated": false,
  "props": [
    {
      "name": "maxWidth",
      "label": "Card Max Width",
      "type": "number",
      "group": "layout",
      "default": 500
    },
    {
      "name": "padding",
      "label": "Card Padding",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "background",
      "label": "Page Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "cardBackground",
      "label": "Card Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "3xl"
    },
    {
      "name": "shadowed",
      "label": "Card Shadow",
      "type": "boolean",
      "group": "style",
      "default": false
    },
    {
      "name": "mobilePadding",
      "label": "Mobile Padding",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "desktopPadding",
      "label": "Desktop Padding",
      "type": "spacing",
      "group": "layout",
      "default": 6
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, CenteredLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function CenteredLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <CenteredLayout\n          maxWidth={500}\n          padding={4}\n          borderRadius=\"3xl\"\n          shadowed={false}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Centered Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Centered Section 2</Text>\n        </Card>\n      </CenteredLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const DashboardLayoutMeta = {
  "id": "DashboardLayout",
  "label": "Dashboard",
  "description": "Fixed header, collapsible sidebar, scrollable content, optional footer.",
  "category": "page",
  "tags": [
    "dashboard",
    "admin",
    "sidebar",
    "header"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated"
    ]
  },
  "themeMapping": {
    "root": "background",
    "surface": "card"
  },
  "slots": [
    {
      "name": "header",
      "label": "Header",
      "required": true,
      "kind": "named"
    },
    {
      "name": "content",
      "label": "Content",
      "required": true,
      "kind": "named"
    },
    {
      "name": "sidebar",
      "label": "Sidebar",
      "required": false,
      "kind": "named"
    },
    {
      "name": "footer",
      "label": "Footer",
      "required": false,
      "kind": "named"
    }
  ],
  "responsive": true,
  "animated": true,
  "props": [
    {
      "name": "sidebarWidth",
      "label": "Sidebar Width",
      "type": "number",
      "group": "layout",
      "default": 260
    },
    {
      "name": "sidebarCollapsedWidth",
      "label": "Collapsed Sidebar Width",
      "type": "number",
      "group": "layout",
      "default": 70
    },
    {
      "name": "headerHeight",
      "label": "Header Height",
      "type": "number",
      "group": "layout",
      "default": 70
    },
    {
      "name": "footerHeight",
      "label": "Footer Height",
      "type": "number",
      "group": "layout",
      "default": 60
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "disableContentScroll",
      "label": "Disable Content Scroll",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "headerBackground",
      "label": "Header Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "sidebarBackground",
      "label": "Sidebar Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "contentBackground",
      "label": "Content Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "footerBackground",
      "label": "Footer Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "headerPaddingX",
      "label": "Header X Padding",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "mobileHeaderMinHeight",
      "label": "Min Mobile Header Height",
      "type": "number",
      "group": "layout",
      "default": 60
    },
    {
      "name": "defaultSidebarCollapsed",
      "label": "Sidebar Collapsed by Default",
      "type": "boolean",
      "group": "behavior",
      "default": false
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, DashboardLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function DashboardLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <DashboardLayout\n          sidebarWidth={260}\n          sidebarCollapsedWidth={70}\n          headerHeight={70}\n          footerHeight={60}\n          spacing={0}\n          borderRadius=\"none\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Dashboard Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Dashboard Section 2</Text>\n        </Card>\n      </DashboardLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const DeckLayoutMeta = {
  "id": "DeckLayout",
  "label": "Deck",
  "description": "Swipeable card stack with depth effect.",
  "category": "card",
  "tags": [
    "deck",
    "cards",
    "swipe",
    "tinder",
    "stack"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated",
      "react-native-gesture-handler",
      "expo-haptics"
    ]
  },
  "slots": [
    {
      "name": "items",
      "label": "Cards",
      "required": true,
      "kind": "items"
    }
  ],
  "constants": {
    "swipeThreshold": 60,
    "exitDistance": 450,
    "springConfig": {
      "damping": 20,
      "stiffness": 200,
      "mass": 0.5
    }
  },
  "responsive": false,
  "animated": true,
  "previewItemCount": 4,
  "props": [
    {
      "name": "peekOffset",
      "label": "Peek Offset",
      "type": "number",
      "group": "layout",
      "default": 12
    },
    {
      "name": "peekScale",
      "label": "Peek Scale",
      "type": "ratio",
      "group": "layout",
      "default": 0.05,
      "min": 0,
      "max": 0.2
    },
    {
      "name": "cycle",
      "label": "Loop",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "cardShadow",
      "label": "Card Shadows",
      "type": "boolean",
      "group": "style",
      "default": true
    },
    {
      "name": "cardBackground",
      "label": "Card Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "cardBorderRadius",
      "label": "Card Radius",
      "type": "radius",
      "group": "style",
      "default": 24
    },
    {
      "name": "containerWidth",
      "label": "Container Width",
      "type": "string",
      "group": "layout",
      "default": "90%"
    },
    {
      "name": "containerHeight",
      "label": "Container Height",
      "type": "string",
      "group": "layout",
      "default": "75%"
    },
    {
      "name": "peekCount",
      "label": "Background Cards",
      "type": "number",
      "group": "layout",
      "default": 2
    },
    {
      "name": "peekRotation",
      "label": "Peek Rotation",
      "type": "number",
      "group": "layout",
      "default": 0
    },
    {
      "name": "direction",
      "label": "Direction",
      "type": "enum",
      "group": "behavior",
      "default": "horizontal",
      "options": [
        "horizontal",
        "vertical"
      ]
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, DeckLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function DeckLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <DeckLayout\n          peekOffset={12}\n          peekScale={0.05}\n          cycle={false}\n          cardShadow={true}\n          cardBorderRadius={24}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Deck Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Deck Section 2</Text>\n        </Card>\n      </DeckLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const FlexLayoutMeta = {
  "id": "FlexLayout",
  "label": "Flex",
  "description": "Adaptive direction, wrap, and spacing. Optional scroll.",
  "category": "content",
  "tags": [
    "flex",
    "row",
    "column",
    "wrap",
    "adaptive"
  ],
  "themeMapping": {
    "root": "background"
  },
  "slots": [
    {
      "name": "children",
      "label": "Elements",
      "required": true,
      "kind": "children"
    }
  ],
  "responsive": true,
  "animated": false,
  "props": [
    {
      "name": "direction",
      "label": "Direction",
      "type": "enum",
      "group": "layout",
      "default": "row",
      "options": [
        "row",
        "column"
      ]
    },
    {
      "name": "wrap",
      "label": "Wrap Line",
      "type": "boolean",
      "group": "layout",
      "default": false
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "align",
      "label": "Align Items",
      "type": "enum",
      "group": "layout",
      "default": "stretch",
      "options": [
        "stretch",
        "flex-start",
        "center",
        "flex-end",
        "baseline"
      ]
    },
    {
      "name": "justify",
      "label": "Justify Content",
      "type": "enum",
      "group": "layout",
      "default": "flex-start",
      "options": [
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
        "space-evenly"
      ]
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "padding",
      "group": "layout"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, FlexLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function FlexLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <FlexLayout\n          direction=\"row\"\n          wrap={false}\n          spacing={4}\n          align=\"stretch\"\n          justify=\"flex-start\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Flex Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Flex Section 2</Text>\n        </Card>\n      </FlexLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const FlipLayoutMeta = {
  "id": "FlipLayout",
  "label": "Flip",
  "description": "Carousel with front/back flip and horizontal swipe.",
  "category": "card",
  "tags": [
    "flip",
    "card",
    "recto-verso",
    "flashcard"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated",
      "react-native-gesture-handler"
    ]
  },
  "themeMapping": {
    "root": "background",
    "surface": "card"
  },
  "slots": [
    {
      "name": "items",
      "label": "Front Faces",
      "required": true,
      "kind": "items"
    },
    {
      "name": "backContent",
      "label": "Back Faces",
      "required": false,
      "kind": "named-array"
    }
  ],
  "constants": {
    "flipThreshold": 22,
    "scaleFactor": 0.92,
    "flipScaleFactor": 0.9,
    "springNoBounce": {
      "damping": 30,
      "stiffness": 240,
      "mass": 0.6
    },
    "springSnap": {
      "damping": 35,
      "stiffness": 300,
      "mass": 0.5
    },
    "exitLeft": -700,
    "exitRight": 700
  },
  "responsive": false,
  "animated": true,
  "previewItemCount": 3,
  "props": [
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "cardBackground",
      "label": "Card Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "flipPerspective",
      "label": "Flip Perspective",
      "type": "number",
      "group": "layout",
      "default": 1200
    },
    {
      "name": "swipeThreshold",
      "label": "Swipe Threshold",
      "type": "number",
      "group": "behavior",
      "default": 40
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "padding",
      "group": "layout"
    },
    {
      "name": "cardBorderRadius",
      "label": "Card Radius",
      "type": "radius",
      "group": "style",
      "default": 20
    },
    {
      "name": "cardAspectRatio",
      "label": "Card ratio (web)",
      "type": "number",
      "group": "layout",
      "default": 0.5625,
      "description": "Width/height ratio on web - omitted = adaptive"
    },
    {
      "name": "cardMaxHeight",
      "label": "Max Card Height",
      "type": "number",
      "group": "layout",
      "description": "Max height in px - omitted = no limit"
    },
    {
      "name": "dezoomDuration",
      "label": "Zoom Out Duration",
      "type": "number",
      "group": "behavior",
      "default": 120
    },
    {
      "name": "flipDuration",
      "label": "Flip Duration",
      "type": "number",
      "group": "behavior",
      "default": 320
    },
    {
      "name": "slideOutDuration",
      "label": "Slide Out Duration",
      "type": "number",
      "group": "behavior",
      "default": 140
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, FlipLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function FlipLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <FlipLayout\n          borderRadius=\"none\"\n          flipPerspective={1200}\n          swipeThreshold={40}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Flip Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Flip Section 2</Text>\n        </Card>\n      </FlipLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const FooterLayoutMeta = {
  "id": "FooterLayout",
  "label": "Footer",
  "description": "Main content with fixed or scrollable footer.",
  "category": "content",
  "tags": [
    "footer",
    "sticky",
    "bottom-bar"
  ],
  "themeMapping": {
    "root": "background"
  },
  "slots": [
    {
      "name": "content",
      "label": "Content",
      "required": true,
      "kind": "named"
    },
    {
      "name": "footer",
      "label": "Footer",
      "required": true,
      "kind": "named"
    }
  ],
  "responsive": false,
  "animated": false,
  "props": [
    {
      "name": "footerHeight",
      "label": "Footer Height",
      "type": "number",
      "group": "layout",
      "default": 60
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "sticky",
      "label": "Sticky Footer",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "footerBackground",
      "label": "Footer Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "footerBorderRadius",
      "label": "Footer Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "contentBorderRadius",
      "label": "Content Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "padding",
      "label": "Content Padding",
      "type": "spacing",
      "group": "layout",
      "default": 5
    },
    {
      "name": "footerPadding",
      "label": "Footer Padding",
      "type": "spacing",
      "group": "layout",
      "default": 5
    },
    {
      "name": "compact",
      "label": "Compact Mode",
      "type": "boolean",
      "group": "behavior",
      "default": false
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, FooterLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function FooterLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <FooterLayout\n          footerHeight={60}\n          spacing={0}\n          sticky={false}\n          scrollable={true}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Footer Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Footer Section 2</Text>\n        </Card>\n      </FooterLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const GridLayoutMeta = {
  "id": "GridLayout",
  "label": "Grid",
  "description": "Responsive grid with adaptive columns.",
  "category": "content",
  "tags": [
    "grid",
    "columns",
    "responsive"
  ],
  "themeMapping": {
    "root": "background",
    "surface": "card"
  },
  "slots": [
    {
      "name": "items",
      "label": "Cells",
      "required": true,
      "kind": "items"
    }
  ],
  "responsive": true,
  "animated": false,
  "previewItemCount": 6,
  "props": [
    {
      "name": "columns",
      "label": "Columns",
      "type": "number",
      "group": "layout",
      "description": "Number of columns (auto if omitted)"
    },
    {
      "name": "cellHeight",
      "label": "Cell Height",
      "type": "number",
      "group": "layout",
      "description": "Fixed height in px - omitted = content adaptive"
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "itemBackground",
      "label": "Item Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "itemBorderRadius",
      "label": "Item Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "default": "transparent"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "compact",
      "label": "Compact Mode",
      "type": "boolean",
      "group": "behavior",
      "default": false
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, GridLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function GridLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <GridLayout\n          spacing={0}\n          scrollable={false}\n          padding={0}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Grid Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Grid Section 2</Text>\n        </Card>\n      </GridLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const HeaderContentLayoutMeta = {
  "id": "HeaderContentLayout",
  "label": "Collapsible Header",
  "description": "Header that shrinks on scroll with main content.",
  "category": "scroll",
  "tags": [
    "header",
    "collapsible",
    "scroll",
    "parallax"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated"
    ]
  },
  "themeMapping": {
    "root": "background",
    "header": "card",
    "content": "card"
  },
  "slots": [
    {
      "name": "header",
      "label": "Header",
      "required": true,
      "kind": "named"
    },
    {
      "name": "content",
      "label": "Content",
      "required": true,
      "kind": "named"
    }
  ],
  "responsive": false,
  "animated": true,
  "props": [
    {
      "name": "headerHeight",
      "label": "Header Height",
      "type": "number",
      "group": "layout",
      "default": 150
    },
    {
      "name": "headerCollapsedHeight",
      "label": "Collapsed Header Height",
      "type": "number",
      "group": "layout",
      "default": 60
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "headerBackground",
      "label": "Header Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "headerBorderRadius",
      "label": "Header Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "contentBackground",
      "label": "Content Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "contentBorderRadius",
      "label": "Content Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "padding",
      "label": "Content Padding",
      "type": "spacing",
      "group": "layout",
      "default": 5
    },
    {
      "name": "headerPadding",
      "label": "Header Padding",
      "type": "spacing",
      "group": "layout",
      "default": 5
    },
    {
      "name": "scrollEventThrottle",
      "label": "Scroll Throttle event",
      "type": "number",
      "group": "behavior",
      "default": 16
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, HeaderContentLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function HeaderContentLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <HeaderContentLayout\n          headerHeight={150}\n          headerCollapsedHeight={60}\n          spacing={0}\n          headerBorderRadius=\"none\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Collapsible Header Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Collapsible Header Section 2</Text>\n        </Card>\n      </HeaderContentLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const LeftDrawerLayoutMeta = {
  "id": "LeftDrawerLayout",
  "label": "Left Drawer",
  "description": "Animated left lateral drawer with swipe gesture.",
  "category": "navigation",
  "tags": [
    "drawer",
    "side-menu",
    "swipe",
    "navigation"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated",
      "react-native-gesture-handler",
      "expo-haptics"
    ]
  },
  "themeMapping": {
    "root": "background",
    "drawer": "background",
    "accent": "primary",
    "border": "border"
  },
  "slots": [
    {
      "name": "content",
      "label": "Main Content",
      "required": true,
      "kind": "named"
    },
    {
      "name": "drawerContent",
      "label": "Drawer Content",
      "required": true,
      "kind": "named"
    }
  ],
  "constants": {
    "springConfig": {
      "damping": 25,
      "stiffness": 200,
      "mass": 0.5,
      "overshootClamping": true
    }
  },
  "responsive": false,
  "animated": true,
  "props": [
    {
      "name": "drawerWidth",
      "label": "Drawer Width",
      "type": "number",
      "group": "layout",
      "default": 280
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "drawerBackground",
      "label": "Drawer Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "drawerBorderRadius",
      "label": "Drawer Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "defaultOpen",
      "label": "Open by Default",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "handleColor",
      "label": "Handle Color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    },
    {
      "name": "backdropOpacity",
      "label": "Backdrop Opacity",
      "type": "ratio",
      "group": "style",
      "default": 0.4,
      "min": 0,
      "max": 1
    },
    {
      "name": "contentScaleWhenOpen",
      "label": "Open Content Scale",
      "type": "ratio",
      "group": "behavior",
      "default": 0.98,
      "min": 0.5,
      "max": 1
    },
    {
      "name": "handleBarColor",
      "label": "Handle Bar Color",
      "type": "color",
      "group": "style",
      "themeDefault": "border"
    },
    {
      "name": "handleBarWidth",
      "label": "Gesture Zone Width",
      "type": "number",
      "group": "layout",
      "default": 40
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, LeftDrawerLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function LeftDrawerLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <LeftDrawerLayout\n          drawerWidth={280}\n          scrollable={true}\n          drawerBorderRadius=\"none\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Left Drawer Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Left Drawer Section 2</Text>\n        </Card>\n      </LeftDrawerLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const MasonryLayoutMeta = {
  "id": "MasonryLayout",
  "label": "Masonry",
  "description": "Multi-column masonry grid.",
  "category": "content",
  "tags": [
    "masonry",
    "pinterest",
    "waterfall"
  ],
  "themeMapping": {
    "root": "background",
    "surface": "card"
  },
  "slots": [
    {
      "name": "items",
      "label": "Items",
      "required": true,
      "kind": "items"
    }
  ],
  "responsive": false,
  "animated": false,
  "previewItemCount": 6,
  "props": [
    {
      "name": "columns",
      "label": "Columns",
      "type": "number",
      "group": "layout",
      "default": 2
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 1
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "default": "transparent"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "itemBackground",
      "label": "Item Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "itemBorderRadius",
      "label": "Item Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "padding",
      "group": "layout"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, MasonryLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function MasonryLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <MasonryLayout\n          columns={2}\n          spacing={1}\n          scrollable={true}\n          background=\"transparent\"\n          borderRadius=\"none\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Masonry Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Masonry Section 2</Text>\n        </Card>\n      </MasonryLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ParallaxLayoutMeta = {
  "id": "ParallaxLayout",
  "label": "Parallax",
  "description": "Horizontal scrollable rows with parallax synchronization. Items are automatically distributed into rows based on itemsPerRow.",
  "category": "scroll",
  "tags": [
    "parallax",
    "horizontal",
    "sync",
    "showcase"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated"
    ]
  },
  "slots": [
    {
      "name": "items",
      "label": "Items",
      "required": true,
      "kind": "items"
    }
  ],
  "responsive": false,
  "animated": true,
  "previewItemCount": 9,
  "props": [
    {
      "name": "rowCount",
      "label": "Number of Rows",
      "type": "number",
      "group": "layout",
      "default": 3
    },
    {
      "name": "itemWidth",
      "label": "Item Width",
      "type": "number",
      "group": "layout",
      "default": 200
    },
    {
      "name": "spacing",
      "label": "Vertical Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "itemSpacing",
      "label": "Item Spacing",
      "type": "number",
      "group": "layout",
      "default": 12
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "rowBackground",
      "label": "Row Background",
      "type": "color",
      "group": "style"
    },
    {
      "name": "itemBackground",
      "label": "Item Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "itemBorderRadius",
      "label": "Item Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "rowBorderRadius",
      "label": "Row Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "alternateDirection",
      "label": "Alternate Direction",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "bounces",
      "label": "Scroll Bounce",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "showScrollIndicator",
      "label": "Scroll Indicator",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "scrollEventThrottle",
      "label": "Scroll Throttle",
      "type": "number",
      "group": "behavior",
      "default": 16
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, ParallaxLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function ParallaxLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <ParallaxLayout\n          rowCount={3}\n          itemWidth={200}\n          spacing={4}\n          itemSpacing={12}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Parallax Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Parallax Section 2</Text>\n        </Card>\n      </ParallaxLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ResponsiveLayoutMeta = {
  "id": "ResponsiveLayout",
  "label": "Responsive",
  "description": "Adaptive layout header/sidebar/content/footer with 3 modes.",
  "category": "page",
  "tags": [
    "responsive",
    "adaptive",
    "header",
    "sidebar",
    "footer"
  ],
  "themeMapping": {
    "root": "background"
  },
  "slots": [
    {
      "name": "content",
      "label": "Content",
      "required": true,
      "kind": "named"
    },
    {
      "name": "header",
      "label": "Header",
      "required": false,
      "kind": "named"
    },
    {
      "name": "sidebar",
      "label": "Sidebar",
      "required": false,
      "kind": "named"
    },
    {
      "name": "footer",
      "label": "Footer",
      "required": false,
      "kind": "named"
    }
  ],
  "responsive": true,
  "animated": false,
  "props": [
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "headerHeight",
      "label": "Header Height",
      "type": "number",
      "group": "layout",
      "default": 60
    },
    {
      "name": "sidebarWidth",
      "label": "Sidebar Width",
      "type": "number",
      "group": "layout",
      "default": 260
    },
    {
      "name": "footerHeight",
      "label": "Footer Height",
      "type": "number",
      "group": "layout",
      "default": 60
    },
    {
      "name": "adaptiveMode",
      "label": "Adaptive Mode",
      "type": "enum",
      "group": "behavior",
      "default": "basic",
      "options": [
        "basic",
        "sidebar",
        "full"
      ]
    },
    {
      "name": "hideHeader",
      "label": "Hide Header",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "hideFooter",
      "label": "Hide Footer",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "collapseFooterOnTablet",
      "label": "Compact Footer on Tablet",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "headerBackground",
      "label": "Header Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "sidebarBackground",
      "label": "Sidebar Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "footerBackground",
      "label": "Footer Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "contentBackground",
      "label": "Content Background",
      "type": "color",
      "group": "style"
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "padding",
      "group": "layout"
    },
    {
      "name": "contentPadding",
      "label": "Content Padding",
      "type": "padding",
      "group": "layout"
    },
    {
      "name": "mobileHeaderHeight",
      "label": "Mobile Header Height",
      "type": "number",
      "group": "layout",
      "default": 56
    },
    {
      "name": "tabletFooterHeight",
      "label": "Tablet Footer Height",
      "type": "number",
      "group": "layout",
      "default": 48
    },
    {
      "name": "sidebarMaxWidth",
      "label": "Sidebar Max Width",
      "type": "number",
      "group": "layout",
      "default": 320
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, ResponsiveLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function ResponsiveLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <ResponsiveLayout\n          spacing={0}\n          headerHeight={60}\n          sidebarWidth={260}\n          footerHeight={60}\n          adaptiveMode=\"basic\"\n          hideHeader={false}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Responsive Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Responsive Section 2</Text>\n        </Card>\n      </ResponsiveLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const RootLayoutMeta = {
  "id": "RootLayout",
  "label": "Root",
  "description": "Root page container with direct flex control. Ideal as the base of every page.",
  "category": "page",
  "tags": [
    "root",
    "page",
    "container",
    "flex"
  ],
  "themeMapping": {
    "root": "background"
  },
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": true,
      "kind": "children"
    }
  ],
  "responsive": false,
  "animated": false,
  "props": [
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "justifyContent",
      "label": "Justify",
      "type": "enum",
      "group": "layout",
      "default": "flex-start",
      "options": [
        "flex-start",
        "center",
        "flex-end",
        "space-between",
        "space-around",
        "space-evenly"
      ]
    },
    {
      "name": "alignItems",
      "label": "Align Items",
      "type": "enum",
      "group": "layout",
      "default": "stretch",
      "options": [
        "stretch",
        "flex-start",
        "center",
        "flex-end",
        "baseline"
      ]
    },
    {
      "name": "flexDirection",
      "label": "Direction",
      "type": "enum",
      "group": "layout",
      "default": "column",
      "options": [
        "column",
        "row"
      ]
    },
    {
      "name": "gap",
      "label": "Gap",
      "type": "number",
      "group": "layout",
      "default": 0
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, RootLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function RootLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <RootLayout\n          scrollable={true}\n          padding={0}\n          justifyContent=\"flex-start\"\n          alignItems=\"stretch\"\n          flexDirection=\"column\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Root Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Root Section 2</Text>\n        </Card>\n      </RootLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const ScrollLayoutMeta = {
  "id": "ScrollLayout",
  "label": "Scroll",
  "description": "Scrollable structure with sticky or inline header/footer.",
  "category": "scroll",
  "tags": [
    "scroll",
    "sticky",
    "header",
    "footer",
    "safe-area"
  ],
  "themeMapping": {
    "root": "background",
    "surface": "card"
  },
  "slots": [
    {
      "name": "content",
      "label": "Content",
      "required": true,
      "kind": "named"
    },
    {
      "name": "header",
      "label": "Header",
      "required": false,
      "kind": "named"
    },
    {
      "name": "footer",
      "label": "Footer",
      "required": false,
      "kind": "named"
    }
  ],
  "responsive": true,
  "animated": false,
  "props": [
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "useSafeAreaInsets",
      "label": "Safe area",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "headerHeight",
      "label": "Header Height",
      "type": "number",
      "group": "layout",
      "default": 80
    },
    {
      "name": "footerHeight",
      "label": "Footer Height",
      "type": "number",
      "group": "layout",
      "default": 60
    },
    {
      "name": "scrollDirection",
      "label": "Scroll Direction",
      "type": "enum",
      "group": "behavior",
      "default": "vertical",
      "options": [
        "vertical",
        "horizontal",
        "both"
      ]
    },
    {
      "name": "showScrollIndicator",
      "label": "Scroll Indicator",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "enableBounces",
      "label": "Bounce",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "stickyHeader",
      "label": "Sticky Header",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "stickyFooter",
      "label": "Sticky Footer",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "headerBackground",
      "label": "Header Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "footerBackground",
      "label": "Footer Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "contentBackground",
      "label": "Content Background",
      "type": "color",
      "group": "style"
    },
    {
      "name": "headerPadding",
      "label": "Header Padding",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "footerPadding",
      "label": "Footer Padding",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "mobileHeaderHeight",
      "label": "Mobile Header Height",
      "type": "number",
      "group": "layout",
      "default": 60
    },
    {
      "name": "mobileFooterHeight",
      "label": "Mobile Footer Height",
      "type": "number",
      "group": "layout",
      "default": 50
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, ScrollLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function ScrollLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <ScrollLayout\n          spacing={4}\n          useSafeAreaInsets={true}\n          headerHeight={80}\n          footerHeight={60}\n          scrollDirection=\"vertical\"\n          showScrollIndicator={false}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Scroll Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Scroll Section 2</Text>\n        </Card>\n      </ScrollLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SidebarLayoutMeta = {
  "id": "SidebarLayout",
  "label": "Sidebar",
  "description": "Content with lateral sidebar, collapsible on mobile.",
  "category": "navigation",
  "tags": [
    "sidebar",
    "navigation",
    "drawer",
    "layout"
  ],
  "themeMapping": {
    "root": "background",
    "sidebar": "card",
    "border": "border"
  },
  "slots": [
    {
      "name": "sidebar",
      "label": "Sidebar",
      "required": true,
      "kind": "named"
    },
    {
      "name": "content",
      "label": "Content",
      "required": true,
      "kind": "named"
    }
  ],
  "responsive": true,
  "animated": false,
  "props": [
    {
      "name": "sidebarWidth",
      "label": "Sidebar Width",
      "type": "number",
      "group": "layout",
      "default": 280
    },
    {
      "name": "position",
      "label": "Sidebar Position",
      "type": "enum",
      "group": "layout",
      "default": "left",
      "options": [
        "left",
        "right"
      ]
    },
    {
      "name": "collapsible",
      "label": "Collapsible on Mobile",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 4
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "background",
      "label": "Background",
      "type": "background",
      "group": "style"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "sidebarBackground",
      "label": "Sidebar Background",
      "type": "background",
      "group": "style"
    },
    {
      "name": "sidebarBorderRadius",
      "label": "Sidebar Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "padding",
      "group": "layout"
    },
    {
      "name": "resizable",
      "label": "Resizable",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "sidebarMinWidth",
      "label": "Min Sidebar Width",
      "type": "number",
      "group": "layout",
      "default": 150
    },
    {
      "name": "sidebarMaxWidth",
      "label": "Sidebar Max Width",
      "type": "number",
      "group": "layout",
      "default": 600
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, SidebarLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function SidebarLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <SidebarLayout\n          sidebarWidth={280}\n          position=\"left\"\n          collapsible={true}\n          spacing={4}\n          scrollable={true}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Sidebar Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Sidebar Section 2</Text>\n        </Card>\n      </SidebarLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SketchLayoutMeta = {
  "id": "SketchLayout",
  "label": "Sketch (placeholder)",
  "description": "Placeholder for a drawing canvas.",
  "category": "special",
  "tags": [
    "sketch",
    "draw",
    "canvas",
    "placeholder"
  ],
  "slots": [],
  "responsive": false,
  "animated": false,
  "props": [
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, SketchLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function SketchLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <SketchLayout >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Sketch (placeholder) Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Sketch (placeholder) Section 2</Text>\n        </Card>\n      </SketchLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SortableGridLayoutMeta = {
  "id": "SortableGridLayout",
  "name": "SortableGridLayout",
  "description": "A drag-and-drop reorderable grid layout for rendering interactive lists or grids.",
  "tags": [
    "layout",
    "grid",
    "drag-and-drop",
    "interactive",
    "reorderable"
  ],
  "props": {
    "data": {
      "type": "array",
      "description": "The list of data items to render.",
      "required": true
    },
    "columns": {
      "type": "number",
      "description": "Number of columns in the grid.",
      "default": 3
    },
    "spacing": {
      "type": "number",
      "description": "Spacing between items.",
      "default": 8
    }
  },
  "example": "import React from 'react';\nimport { FoundationProvider, SortableGridLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function SortableGridLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <SortableGridLayout\n          columns={3}\n          spacing={8}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">SortableGridLayout Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">SortableGridLayout Section 2</Text>\n        </Card>\n      </SortableGridLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SplitLayoutMeta = {
  "id": "SplitLayout",
  "label": "Split",
  "description": "Two panels (left/right or top/bottom) with independent scroll.",
  "category": "content",
  "tags": [
    "split",
    "two-pane",
    "master-detail"
  ],
  "themeMapping": {
    "root": "background",
    "left": "card",
    "right": "card"
  },
  "slots": [
    {
      "name": "left",
      "label": "Left Panel",
      "required": true,
      "kind": "named"
    },
    {
      "name": "right",
      "label": "Right Panel",
      "required": true,
      "kind": "named"
    }
  ],
  "responsive": true,
  "animated": false,
  "props": [
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "leftWidth",
      "label": "Fixed Left Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "ratio",
      "label": "Left Ratio",
      "type": "ratio",
      "group": "layout",
      "default": 0.5,
      "min": 0,
      "max": 1
    },
    {
      "name": "orientation",
      "label": "Orientation",
      "type": "enum",
      "group": "layout",
      "default": "horizontal",
      "options": [
        "horizontal",
        "vertical"
      ]
    },
    {
      "name": "hideLeftOnMobile",
      "label": "Hide Left on Mobile",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "leftBackground",
      "label": "Left Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "rightBackground",
      "label": "Right Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "leftBorderRadius",
      "label": "Left Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "rightBorderRadius",
      "label": "Right Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, SplitLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function SplitLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <SplitLayout\n          spacing={0}\n          ratio={0.5}\n          orientation=\"horizontal\"\n          hideLeftOnMobile={false}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Split Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Split Section 2</Text>\n        </Card>\n      </SplitLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const Swipe2ScreenLayoutMeta = {
  "id": "Swipe2ScreenLayout",
  "label": "Swipe to Screen",
  "description": "Presentation layout with swipe to a projected screen and QR code.",
  "category": "special",
  "tags": [
    "swipe",
    "projection",
    "qr",
    "slides"
  ],
  "architecture": {
    "dependencies": [
      "react-native-gesture-handler",
      "expo-camera",
      "expo-haptics"
    ]
  },
  "slots": [
    {
      "name": "items",
      "label": "Slides",
      "required": true,
      "kind": "items"
    }
  ],
  "responsive": false,
  "animated": true,
  "previewItemCount": 3,
  "props": [
    {
      "name": "containerBackground",
      "label": "Container Background",
      "type": "color",
      "group": "style",
      "default": "#000"
    },
    {
      "name": "screenBackground",
      "label": "Screen Background",
      "type": "color",
      "group": "style",
      "default": "#fff"
    },
    {
      "name": "swipeThreshold",
      "label": "Swipe Threshold",
      "type": "number",
      "group": "behavior",
      "default": 100
    },
    {
      "name": "projectedScale",
      "label": "Projected Scale",
      "type": "ratio",
      "group": "behavior",
      "default": 0.8,
      "min": 0.5,
      "max": 1
    },
    {
      "name": "animationDuration",
      "label": "Animation Duration",
      "type": "number",
      "group": "behavior",
      "default": 300
    },
    {
      "name": "slides",
      "label": "Slides",
      "type": "json",
      "group": "content",
      "default": []
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, Swipe2ScreenLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function Swipe2ScreenLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <Swipe2ScreenLayout\n          containerBackground=\"#000\"\n          screenBackground=\"#fff\"\n          swipeThreshold={100}\n          projectedScale={0.8}\n          animationDuration={300}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Swipe to Screen Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Swipe to Screen Section 2</Text>\n        </Card>\n      </Swipe2ScreenLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SwiperLayoutMeta = {
  "id": "SwiperLayout",
  "label": "Swiper",
  "description": "Multi-directional swipeable carousel with preloading.",
  "category": "card",
  "tags": [
    "swiper",
    "carousel",
    "slides",
    "stories"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated",
      "react-native-gesture-handler"
    ]
  },
  "themeMapping": {
    "root": "background",
    "surface": "card"
  },
  "slots": [
    {
      "name": "items",
      "label": "Slides",
      "required": true,
      "kind": "items"
    }
  ],
  "constants": {
    "scaleFactor": 0.85
  },
  "responsive": false,
  "animated": true,
  "previewItemCount": 4,
  "props": [
    {
      "name": "enableSwipeUp",
      "label": "Swipe Up",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "enableSwipeDown",
      "label": "Swipe Down",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "cardBackground",
      "label": "Card Background",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    },
    {
      "name": "cardBorderRadius",
      "label": "Card Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "showCardCount",
      "label": "Card Counter",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "preloadRange",
      "label": "Preloading",
      "type": "number",
      "group": "behavior",
      "default": 2
    },
    {
      "name": "swipeThreshold",
      "label": "Swipe Threshold",
      "type": "number",
      "group": "behavior",
      "default": 40
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "padding",
      "group": "layout"
    },
    {
      "name": "springDamping",
      "label": "Spring Damping",
      "type": "number",
      "group": "behavior",
      "default": 12
    },
    {
      "name": "springStiffness",
      "label": "Spring Stiffness",
      "type": "number",
      "group": "behavior",
      "default": 160
    },
    {
      "name": "cardCountBackground",
      "label": "Counter Background",
      "type": "color",
      "group": "style",
      "default": "rgba(0,0,0,0.6)"
    },
    {
      "name": "cardCountTextColor",
      "label": "Counter Text",
      "type": "color",
      "group": "style",
      "default": "#fff"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, SwiperLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function SwiperLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <SwiperLayout\n          enableSwipeUp={false}\n          enableSwipeDown={false}\n          borderRadius=\"none\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Swiper Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Swiper Section 2</Text>\n        </Card>\n      </SwiperLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const SystemLayoutMeta = {
  "id": "SystemLayout",
  "label": "System UI",
  "description": "System wrapper managing StatusBar, SafeAreaView, and NavigationBar.",
  "category": "special",
  "tags": [
    "system",
    "statusbar",
    "navigation-bar",
    "safe-area"
  ],
  "architecture": {
    "dependencies": [
      "expo-status-bar",
      "react-native-safe-area-context"
    ]
  },
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": true,
      "kind": "children"
    }
  ],
  "responsive": false,
  "animated": false,
  "props": [
    {
      "name": "rootBackgroundColor",
      "label": "Root Background Color",
      "type": "color",
      "group": "style",
      "default": "#0c3ddbff"
    },
    {
      "name": "statusBarContentStyle",
      "label": "Status Bar Style",
      "type": "enum",
      "group": "behavior",
      "default": "auto",
      "options": [
        "light",
        "dark",
        "auto"
      ]
    },
    {
      "name": "edges",
      "label": "Safe Area Edges",
      "type": "json",
      "group": "behavior",
      "default": [
        "top",
        "bottom",
        "left",
        "right"
      ]
    },
    {
      "name": "navigationBarContentStyle",
      "label": "Nav Bar Style",
      "type": "enum",
      "group": "behavior",
      "options": [
        "light",
        "dark"
      ]
    },
    {
      "name": "navigationBarReferenceColor",
      "label": "Nav Bar Ref Color",
      "type": "color",
      "group": "style",
      "themeDefault": "card"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, SystemLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function SystemLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <SystemLayout\n          rootBackgroundColor=\"#0c3ddbff\"\n          statusBarContentStyle=\"auto\"\n          navigationBarContentStyle=\"light\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">System UI Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">System UI Section 2</Text>\n        </Card>\n      </SystemLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const TopDrawerLayoutMeta = {
  "id": "TopDrawerLayout",
  "label": "Top Drawer",
  "description": "Animated top drawer with swipe gesture.",
  "category": "navigation",
  "tags": [
    "drawer",
    "top-sheet",
    "swipe",
    "notification"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated",
      "react-native-gesture-handler",
      "expo-haptics"
    ]
  },
  "themeMapping": {
    "root": "background",
    "drawer": "background",
    "border": "border",
    "muted": "muted"
  },
  "slots": [
    {
      "name": "content",
      "label": "Main Content",
      "required": true,
      "kind": "named"
    },
    {
      "name": "drawerContent",
      "label": "Drawer Content",
      "required": true,
      "kind": "named"
    }
  ],
  "constants": {
    "springConfig": {
      "damping": 25,
      "stiffness": 200,
      "mass": 0.5,
      "overshootClamping": true
    }
  },
  "responsive": false,
  "animated": true,
  "props": [
    {
      "name": "drawerHeight",
      "label": "Drawer Height",
      "type": "number",
      "group": "layout",
      "default": 600
    },
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "drawerBackground",
      "label": "Drawer Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "drawerBorderRadius",
      "label": "Drawer Radius",
      "type": "radius",
      "group": "style",
      "default": "3xl"
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "defaultOpen",
      "label": "Open by Default",
      "type": "boolean",
      "group": "behavior",
      "default": false
    },
    {
      "name": "handleColor",
      "label": "Handle Color",
      "type": "color",
      "group": "style",
      "themeDefault": "border"
    },
    {
      "name": "backdropOpacity",
      "label": "Backdrop Opacity",
      "type": "ratio",
      "group": "style",
      "default": 0.4,
      "min": 0,
      "max": 1
    },
    {
      "name": "contentScaleWhenOpen",
      "label": "Open Content Scale",
      "type": "ratio",
      "group": "behavior",
      "default": 0.95,
      "min": 0.5,
      "max": 1
    },
    {
      "name": "closeButtonBackground",
      "label": "Close Button Background",
      "type": "color",
      "group": "style",
      "themeDefault": "muted"
    },
    {
      "name": "closeButtonSize",
      "label": "Close Button Size",
      "type": "number",
      "group": "layout",
      "default": 36
    },
    {
      "name": "closeButtonBorderColor",
      "label": "Close Button Border",
      "type": "color",
      "group": "style",
      "themeDefault": "border"
    },
    {
      "name": "closeButtonTextColor",
      "label": "Close Button Text",
      "type": "color",
      "group": "style",
      "themeDefault": "mutedForeground"
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, TopDrawerLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function TopDrawerLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <TopDrawerLayout\n          drawerHeight={600}\n          scrollable={true}\n          drawerBorderRadius=\"3xl\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Top Drawer Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Top Drawer Section 2</Text>\n        </Card>\n      </TopDrawerLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const TutoLayoutMeta = {
  "id": "TutoLayout",
  "lname": "TutoLayout",
  "description": "A guided tutorial overlay layout that traces children elements and renders an interactive tour.",
  "category": "special",
  "tags": [
    "layout",
    "tutorial",
    "guide",
    "onboarding"
  ],
  "architecture": {
    "dependencies": [
      "react-native-reanimated"
    ]
  },
  "themeMapping": {
    "root": "background",
    "accent": "primary",
    "text": "foreground"
  },
  "slots": [
    {
      "name": "children",
      "label": "Content to Annotate",
      "required": true,
      "kind": "children"
    }
  ],
  "constants": {
    "swipeThreshold": 40
  },
  "responsive": false,
  "animated": true,
  "props": [
    {
      "name": "overlayOpacity",
      "label": "Overlay Opacity",
      "type": "ratio",
      "group": "style",
      "default": 0.78,
      "min": 0,
      "max": 1
    },
    {
      "name": "overlayColor",
      "label": "Overlay Color",
      "type": "color",
      "group": "style"
    },
    {
      "name": "showSkip",
      "label": "Skip Button",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "nextLabel",
      "label": "Next Label",
      "type": "string",
      "group": "content",
      "default": "Next"
    },
    {
      "name": "finishLabel",
      "label": "Finish Label",
      "type": "string",
      "group": "content",
      "default": "Finish"
    },
    {
      "name": "accentColor",
      "label": "Accent Color",
      "type": "color",
      "group": "style",
      "themeDefault": "primary"
    },
    {
      "name": "textBackground",
      "label": "Text Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "textColor",
      "label": "Text Color",
      "type": "color",
      "group": "style",
      "themeDefault": "foreground"
    },
    {
      "name": "mutedTextColor",
      "label": "Secondary Text",
      "type": "color",
      "group": "style",
      "themeDefault": "mutedForeground"
    },
    {
      "name": "steps",
      "label": "Steps",
      "type": "json",
      "group": "content",
      "default": []
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, TutoLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function TutoLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <TutoLayout\n          overlayOpacity={0.78}\n          showSkip={true}\n          nextLabel=\"Next\"\n          finishLabel=\"Finish\"\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">TutoLayout Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">TutoLayout Section 2</Text>\n        </Card>\n      </TutoLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const VoidLayoutMeta = {
  "id": "VoidLayout",
  "label": "Void",
  "description": "Minimal container with optional scroll, padding, and maxWidth.",
  "category": "page",
  "tags": [
    "blank",
    "empty",
    "minimal",
    "wrapper"
  ],
  "slots": [
    {
      "name": "children",
      "label": "Content",
      "required": true,
      "kind": "children"
    }
  ],
  "responsive": false,
  "animated": false,
  "props": [
    {
      "name": "maxWidth",
      "label": "Max Width",
      "type": "number",
      "group": "layout",
      "description": "Maximum container width"
    },
    {
      "name": "scrollable",
      "label": "Scrollable",
      "type": "boolean",
      "group": "behavior",
      "default": true
    },
    {
      "name": "background",
      "label": "Background",
      "type": "color",
      "group": "style",
      "themeDefault": "background"
    },
    {
      "name": "borderRadius",
      "label": "Border Radius",
      "type": "radius",
      "group": "style",
      "default": "none"
    },
    {
      "name": "padding",
      "label": "Padding",
      "type": "padding",
      "group": "layout"
    },
    {
      "name": "spacing",
      "label": "Spacing",
      "type": "spacing",
      "group": "layout",
      "default": 0
    },
    {
      "name": "centerContent",
      "label": "Center Content",
      "type": "boolean",
      "group": "layout",
      "default": false
    },
    {
      "name": "showBorder",
      "label": "Visible Border",
      "type": "boolean",
      "group": "style",
      "default": false
    }
  ],
  "example": "import React from 'react';\nimport { FoundationProvider, VoidLayout, Card, Text, Stack } from '@flipova/foundation';\n\nexport default function VoidLayoutExample() {\n  return (\n    <FoundationProvider defaultTheme=\"dark\">\n      <VoidLayout\n          scrollable={true}\n          borderRadius=\"none\"\n          spacing={0}\n        >\n        <Card p={4} variant=\"elevated\">\n          <Stack spacing={2}>\n            <Text variant=\"heading\" size=\"md\">Void Section 1</Text>\n            <Text color=\"mutedForeground\">Content layout block powered by Flipova Foundation.</Text>\n          </Stack>\n        </Card>\n        <Card p={4} variant=\"outlined\">\n          <Text variant=\"heading\" size=\"md\">Void Section 2</Text>\n        </Card>\n      </VoidLayout>\n    </FoundationProvider>\n  );\n}"
} as const;

export const componentRegistry = [
  BadgeWrapperMeta,
  BlurWrapperMeta,
  CollapsibleWrapperMeta,
  FadeInWrapperMeta,
  KeyboardAvoidWrapperMeta,
  SafeAreaWrapperMeta,
  ScalePressWrapperMeta,
  ShimmerWrapperMeta,
  SkeletonWrapperMeta,
  SlideUpWrapperMeta,
  TooltipWrapperMeta,
  AccordionMeta,
  AudioMeta,
  AvatarMeta,
  AvatarPickerMeta,
  BadgeMeta,
  BlurViewMeta,
  ButtonMeta,
  CameraMeta,
  CardMeta,
  CheckboxMeta,
  ChipMeta,
  ColorPickerMeta,
  DatePickerMeta,
  EmojiPickerMeta,
  FilePickerMeta,
  FlatListMeta,
  GifPickerMeta,
  GradientMeta,
  IconMeta,
  IconButtonMeta,
  IconPickerMeta,
  ImageMeta,
  LottieAnimationMeta,
  MapViewMeta,
  NumberInputMeta,
  OTPInputMeta,
  PasswordInputMeta,
  PressableMeta,
  ProgressBarMeta,
  RadioGroupMeta,
  SearchInputMeta,
  SelectMeta,
  SeparatorMeta,
  SliderMeta,
  SpinnerMeta,
  SwitchMeta,
  TabsMeta,
  TextMeta,
  TextAreaMeta,
  TextInputMeta,
  VideoMeta,
  WebViewMeta,
  WheelPickerMeta
] as const;

export const blockRegistry = [
  
] as const;

export const layoutRegistry = [
  AuthLayoutMeta,
  BentoLayoutMeta,
  BottomDrawerLayoutMeta,
  CenteredLayoutMeta,
  DashboardLayoutMeta,
  DeckLayoutMeta,
  FlexLayoutMeta,
  FlipLayoutMeta,
  FooterLayoutMeta,
  GridLayoutMeta,
  HeaderContentLayoutMeta,
  LeftDrawerLayoutMeta,
  MasonryLayoutMeta,
  ParallaxLayoutMeta,
  ResponsiveLayoutMeta,
  RootLayoutMeta,
  ScrollLayoutMeta,
  SidebarLayoutMeta,
  SketchLayoutMeta,
  SortableGridLayoutMeta,
  SplitLayoutMeta,
  Swipe2ScreenLayoutMeta,
  SwiperLayoutMeta,
  SystemLayoutMeta,
  TopDrawerLayoutMeta,
  TutoLayoutMeta,
  VoidLayoutMeta
] as const;

export const primitiveRegistry = [
  BoxMeta,
  CenterMeta,
  InlineMeta,
  ScrollMeta,
  StackMeta,
  DividerMeta
] as const;

export function getComponentMeta(id: string): any { return componentRegistry.find((m: any) => m.id === id) || layoutRegistry.find((m: any) => m.id === id) || primitiveRegistry.find((m: any) => m.id === id) || blockRegistry.find((m: any) => m.id === id); }
export function getBlockMeta(id: string): any { return blockRegistry.find((m: any) => m.id === id) || getComponentMeta(id); }
export function getLayoutMeta(id: string): any { return layoutRegistry.find((m: any) => m.id === id) || getComponentMeta(id); }
export function getPrimitiveMeta(id: string): any { return primitiveRegistry.find((m: any) => m.id === id) || getComponentMeta(id); }
export function getMeta(id: string): any { return getComponentMeta(id); }
