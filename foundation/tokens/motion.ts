export const durations = {
  instant: 0,
  fast: 150,
  base: 250,
  slow: 350,
  slower: 500,
} as const;

export const easings = {
  linear: "linear",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
} as const;

export type DurationToken = keyof typeof durations;
export type EasingToken = keyof typeof easings;
