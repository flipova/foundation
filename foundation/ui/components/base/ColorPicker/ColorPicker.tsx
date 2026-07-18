import React from 'react';
import { View, Text } from 'react-native';
import { useColorPickerLogic, ColorPickerProps } from './ColorPicker.logic';
import { useColorPickerStyle } from './ColorPicker.style';
import RNColorPicker, { Panel1, Swatches, Preview, HueSlider } from 'reanimated-color-picker';

/**
 * @component ColorPicker
 * @description A robust and beautiful hue/saturation/lightness selection interface utilizing react-native-reanimated-color-picker.
 * It provides a premium design with soft shadows, rounded corners, and a polished user interface.
 * 
 * @example
 * <ColorPicker 
 *   value="#3498db" 
 *   onChange={(color) => console.log(color)} 
 * />
 */
const ColorPicker: React.FC<ColorPickerProps> = (rawProps) => {
  const logic = useColorPickerLogic(rawProps);
  const styles = useColorPickerStyle(logic);

  return (
    <View style={[styles.container, logic.rest.style]} {...logic.rest}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Select Color</Text>
      </View>
      <RNColorPicker 
        style={{ flex: 1 }} 
        value={logic.color} 
        onComplete={logic.onSelectColor}
        thumbSize={28}
        sliderThickness={24}
      >
        <View style={styles.previewContainer}>
          <Preview hideInitialColor />
        </View>
        <View style={styles.panelContainer}>
          <Panel1 />
        </View>
        <View style={styles.sliderContainer}>
          <HueSlider />
        </View>
        <View style={styles.swatchesContainer}>
          <Swatches />
        </View>
      </RNColorPicker>
    </View>
  );
};

export default ColorPicker;
