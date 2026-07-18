import React from 'react';
import { View, TextInput, Pressable, ScrollView, Image } from 'react-native';
import { useGifPickerLogic, GifPickerProps } from './GifPicker.logic';
import { useGifPickerStyle } from './GifPicker.style';

/**
 * @component GifPicker (Web)
 * @description Web version of the robust GIF picker.
 */
const GifPickerWeb: React.FC<GifPickerProps> = (rawProps) => {
  const logic = useGifPickerLogic(rawProps);
  const styles = useGifPickerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      
      <View style={styles.searchContainer as any}>
        <TextInput 
          style={styles.searchInput as any}
          placeholder="Search GIFs..."
          value={logic.searchQuery}
          onChangeText={logic.setSearchQuery}
        />
      </View>

      <ScrollView style={{ maxHeight: 350 }}>
        <View style={styles.grid as any}>
          {logic.gifs.map((url: any) => (
            <Pressable 
              key={url} 
              onPress={() => logic.selectGif(url)} 
              style={[styles.gifBtn as any, logic.value === url && styles.gifBtnSelected]}
            >
              <Image source={{ uri: url }} style={styles.gifImg as any} resizeMode="cover" />
            </Pressable>
          ))}
        </View>
      </ScrollView>

    </View>
  );
};

export default GifPickerWeb;
