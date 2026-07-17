import React from 'react';
import { View } from 'react-native';
import { useColorPickerLogic, ColorPickerProps } from './ColorPicker.logic';
import { useColorPickerStyle } from './ColorPicker.style';
// Fallback for web since reanimated color picker might have issues depending on reanimated web setup.
// Assuming it works via Reanimated Web.
import RNColorPicker, { Panel1, Swatches, Preview, HueSlider } from 'reanimated-color-picker';

/**
 * @component ColorPicker (Web)
 * @description A robust color picker for the web utilizing react-native-reanimated-color-picker.
 */
const ColorPickerWeb: React.FC<ColorPickerProps> = (rawProps) => {
  const logic = useColorPickerLogic(rawProps);
  const styles = useColorPickerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <RNColorPicker style={{ flex: 1 }} value={logic.color} onComplete={logic.onSelectColor}>
        <Preview hideInitialColor />
        <View style={styles.panelContainer as any}>
          <Panel1 />
        </View>
        <View style={styles.sliderContainer as any}>
          <HueSlider />
        </View>
        <View style={styles.swatchesContainer as any}>
          <Swatches />
        </View>
      </RNColorPicker>
    </View>
  );
};

export default ColorPickerWeb;
