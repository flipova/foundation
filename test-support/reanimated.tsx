// Test stand-in for react-native-reanimated: the components render as their plain React Native selves and every
// animation is a no-op. What the tests verify is the gluestack component and our wrapper, never the animation.
import React from 'react';
import { FlatList, Image, ScrollView, Text, View } from 'react-native';

const chain: any = new Proxy(function () {}, { get: () => chain, apply: () => chain });
const passthrough = (C: React.ElementType) => C;

const Animated = {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  createAnimatedComponent: passthrough,
};
export default Animated;
export const useSharedValue = <T,>(v: T) => React.useRef({ value: v }).current;
export const useAnimatedStyle = (fn: () => object) => fn();
export const withTiming = <T,>(v: T) => v;
export const withSpring = <T,>(v: T) => v;
export const withDelay = <T,>(_d: number, v: T) => v;
export const interpolate = (v: number, input: number[], output: number[]) => {
  const i = Math.max(
    0,
    input.findIndex((x) => x >= v),
  );
  return output[i] ?? output[output.length - 1];
};
export const runOnJS = <F,>(f: F) => f;
export const Easing: any = chain;
export const FadeIn: any = chain;
export const FadeOut: any = chain;
export const ZoomIn: any = chain;
export const ZoomOut: any = chain;
export const SlideInUp: any = chain;
export const SlideInDown: any = chain;
export const SlideOutDown: any = chain;
export const SlideOutUp: any = chain;
export const Layout: any = chain;
export const LinearTransition: any = chain;
