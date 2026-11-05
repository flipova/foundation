// Test stand-in for @legendapp/motion: plain views, no animation, children always mounted while rendered.
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

const strip = ({ animate, initial, exit, transition, ...rest }: Record<string, unknown>) => rest;
const motion = (C: React.ElementType) =>
  React.forwardRef<unknown, Record<string, unknown>>((p, ref) => React.createElement(C, { ...strip(p), ref } as never));

export const Motion = {
  View: motion(View),
  Text: motion(Text),
  Pressable: motion(Pressable),
  ScrollView: motion(ScrollView),
};
export const createMotionAnimatedComponent = (C: React.ElementType) => motion(C);
export const AnimatePresence = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export type MotionComponentProps<A = unknown, B = unknown, C = unknown, D = unknown> = Record<string, unknown> & {
  _?: [A, B, C, D];
};
