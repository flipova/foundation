import React from 'react';
import { Placeholder } from '../../Placeholder';
import { View } from 'react-native';
import { useAuthLayoutLogic, AuthLayoutProps } from './AuthLayout.logic';
import { useAuthLayoutStyle } from './AuthLayout.style';

/**
 * @component AuthLayout
 * @description
 * AuthLayout provides a foundational structure tailored specifically for authentication screens
 * (e.g., login, registration, password recovery). It splits the viewport into a split-screen 
 * layout featuring an illustrative or branding image alongside a dedicated form container.
 *
 * @useCases
 * - Login or Registration pages where a primary marketing image is desired.
 * - Onboarding flows with distinct visual separation between content and input.
 *
 * @structure
 * - Renders a row-based Flexbox container.
 * - Left/Top side: An optional visual container for branding/imagery.
 * - Right/Bottom side: A centered container for authentication forms.
 *
 * @accessibility
 * - Ensure that the provided `image` node contains appropriate `accessibilityLabel` attributes if it conveys meaning.
 * - The form container acts as a standard `View`, but screen readers should be guided sequentially from the image (if any) to the form.
 */
const AuthLayout: React.FC<AuthLayoutProps> = (rawProps) => {
  const logic = useAuthLayoutLogic(rawProps);
  const styles = useAuthLayoutStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <View style={styles.imageContainer as any}>
          {logic.image || <Placeholder label="image" />}
        </View>
      <View style={styles.formContainer as any}>
        {logic.children || <Placeholder label="children" />}
      </View>
    </View>
  );
};

export default AuthLayout;
