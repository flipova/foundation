import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { avatarRecipe, initialsOf, type AvatarProps } from '../../../contract';
import { useResolvedTheme } from '../../provider';

export function Avatar(p: AvatarProps) {
  const t = useResolvedTheme();
  const r = avatarRecipe(p, t);
  const [failed, setFailed] = useState(false);
  const showImage = !!p.source && !failed;
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={p.accessibilityLabel ?? p.name}
      style={r.container as never}
      testID={p.testID}
    >
      {showImage ? (
        <Image
          source={{ uri: p.source }}
          style={r.image as never}
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <Text style={r.initials as never}>{initialsOf(p.name)}</Text>
      )}
    </View>
  );
}
