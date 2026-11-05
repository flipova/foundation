import React from 'react';
import { Image, Modal as RNModal, Pressable, Text, View } from 'react-native';
import { iconRecipe, imageViewerRecipe, type ImageViewerProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function ImageViewer({ visible, source, alt, onClose, testID }: ImageViewerProps) {
  const t = useResolvedTheme();
  const r = imageViewerRecipe(t);
  return (
    <RNModal transparent animationType="fade" visible={visible} onRequestClose={onClose} testID={testID}>
      <View style={r.backdrop as never}>
        <Image
          source={{ uri: source }}
          alt={alt}
          accessibilityLabel={alt}
          resizeMode="contain"
          style={r.image as never}
        />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={r.close as never}>
          <Text style={r.closeLabel as never}>{iconRecipe({ name: 'close' }, t).glyph}</Text>
        </Pressable>
      </View>
    </RNModal>
  );
}
