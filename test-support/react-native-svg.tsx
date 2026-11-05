import React from 'react';

/** Test stand-in for react-native-svg (its fabric specs need the native renderer): the elements become plain SVG tags. */
const tag = (name: string) => {
  const C = ({ children, ...rest }: Record<string, unknown> & { children?: React.ReactNode }) =>
    React.createElement(name, rest, children);
  C.displayName = name;
  return C;
};
const Svg = tag('svg');
export default Svg;
export { Svg };
export const Circle = tag('circle');
export const ClipPath = tag('clipPath');
export const Defs = tag('defs');
export const Ellipse = tag('ellipse');
export const G = tag('g');
export const Line = tag('line');
export const LinearGradient = tag('linearGradient');
export const Mask = tag('mask');
export const Path = tag('path');
export const Polygon = tag('polygon');
export const Polyline = tag('polyline');
export const RadialGradient = tag('radialGradient');
export const Rect = tag('rect');
export const Stop = tag('stop');
export const Text = tag('text');
export const TSpan = tag('tspan');
export const Use = tag('use');
