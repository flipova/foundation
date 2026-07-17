import React from 'react';
import { View, TextInput, Pressable, ScrollView, Image, ActivityIndicator, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useGifPickerLogic, GifPickerProps, GifItem } from './GifPicker.logic';
import { useGifPickerStyle } from './GifPicker.style';

/**
 * @component GifPicker
 * @description A robust GIF picker that integrates searching and selecting animated GIFs, fully typed and styled.
 */
const GifPicker: React.FC<GifPickerProps> = (rawProps) => {
  const logic = useGifPickerLogic(rawProps);
  const styles = useGifPickerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      
      <View style={styles.header as any}>
        <Text style={styles.title as any}>Choose a GIF</Text>
      </View>
      
      <View style={styles.searchContainer as any}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon as any} />
        <TextInput 
          style={styles.searchInput as any}
          placeholder="Search GIFs via Tenor/Giphy..."
          placeholderTextColor="#888"
          value={logic.searchQuery}
          onChangeText={logic.setSearchQuery}
        />
        {logic.searchQuery.length > 0 && (
          <Pressable onPress={() => logic.setSearchQuery('')} style={styles.clearBtn as any}>
            <Feather name="x-circle" size={18} color="#888" />
          </Pressable>
        )}
      </View>

      <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
        {logic.loading ? (
          <View style={styles.loadingContainer as any}>
            <ActivityIndicator size="large" color="#3182CE" />
            <Text style={styles.loadingText as any}>Loading amazing GIFs...</Text>
          </View>
        ) : logic.gifs.length === 0 ? (
          <View style={styles.emptyContainer as any}>
            <Feather name="image" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText as any}>No GIFs found.</Text>
          </View>
        ) : (
          <View style={styles.grid as any}>
            {logic.gifs.map((gif: GifItem) => {
              const isSelected = logic.value === gif.url;
              return (
                <Pressable 
                  key={gif.id} 
                  onPress={() => logic.selectGif(gif.url)} 
                  style={[styles.gifBtn as any, isSelected && styles.gifBtnSelected]}
                >
                  <Image 
                    source={{ uri: gif.url }} 
                    style={styles.gifImg as any} 
                    resizeMode="cover" 
                  />
                  {isSelected && (
                    <View style={styles.selectedOverlay as any}>
                      <Feather name="check-circle" size={24} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

    </View>
  );
};

export default GifPicker;
