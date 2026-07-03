import { Platform } from "react-native";

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isWeb = Platform.OS === "web";

export const platformSelect = <T>(platforms: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T => {
  if (isIOS && platforms.ios !== undefined) return platforms.ios;
  if (isAndroid && platforms.android !== undefined) return platforms.android;
  if (isWeb && platforms.web !== undefined) return platforms.web;
  return platforms.default;
};
