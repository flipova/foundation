import { Platform } from "react-native";

/**
 * Booléen indiquant si la plateforme courante est iOS.
 */
export const isIOS = Platform.OS === "ios";
/**
 * Booléen indiquant si la plateforme courante est Android.
 */
export const isAndroid = Platform.OS === "android";
/**
 * Booléen indiquant si la plateforme courante est le Web.
 */
export const isWeb = Platform.OS === "web";

/**
 * Sélectionne une valeur spécifique en fonction de la plateforme courante (iOS, Android, Web).
 * Retourne la valeur par défaut si aucune valeur spécifique n'est fournie ou si la plateforme ne correspond pas.
 *
 * @param platforms - Un objet contenant les valeurs possibles par plateforme et une valeur par défaut.
 * @returns La valeur résolue pour la plateforme courante.
 */
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
