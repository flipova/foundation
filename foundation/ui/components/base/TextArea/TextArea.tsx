import React, { useEffect } from 'react';
import { View, TextInput as RNTextInput, Text } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useTextAreaLogic, TextAreaProps } from './TextArea.logic';
import { useTextAreaStyle } from './TextArea.style';

/**
 * @component TextArea
 * @description An auto-expanding multi-line text input with smooth height transitions.
 */
const TextArea: React.FC<TextAreaProps> = (rawProps) => {
  const logic = useTextAreaLogic(rawProps);
  const styles = useTextAreaStyle(logic);

  const animatedHeight = useSharedValue(styles.baseMinHeight);

  useEffect(() => {
    const targetHeight = Math.max(styles.baseMinHeight, logic.contentHeight + 20); // Add padding
    animatedHeight.value = withTiming(targetHeight, { duration: 150 });
  }, [logic.contentHeight, styles.baseMinHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  return (
    <View style={[styles.container, logic.rest.style]}>
      <Animated.View style={[styles.inputWrapper, animatedStyle]}>
        <RNTextInput
          style={styles.input}
          value={logic.value}
          defaultValue={logic.defaultValue}
          onChangeText={logic.onChangeText}
          placeholder={logic.placeholder}
          placeholderTextColor={styles.placeholderColor}
          editable={!logic.disabled}
          onFocus={() => logic.setIsFocused(true)}
          onBlur={() => logic.setIsFocused(false)}
          multiline
          onContentSizeChange={logic.handleContentSizeChange}
        />
      </Animated.View>
      {logic.error ? <Text style={styles.errorText}>{logic.error}</Text> : null}
    </View>
  );
};

export default TextArea;
