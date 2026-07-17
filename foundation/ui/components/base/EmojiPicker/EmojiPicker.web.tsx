import React from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useEmojiPickerLogic, EmojiPickerProps } from './EmojiPicker.logic';
import { useEmojiPickerStyle } from './EmojiPicker.style';

/**
 * @component EmojiPicker (Web)
 * @description A robust emoji picker with category-based selection and Google Noto Animated WebP support.
 */
const EmojiPickerWeb: React.FC<EmojiPickerProps> = (rawProps) => {
  const logic = useEmojiPickerLogic(rawProps);
  const styles = useEmojiPickerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      
      {logic.showAnimated && (
        <View style={styles.typeToggleContainer as any}>
          <Pressable 
            style={[styles.typeBtn as any, logic.activeType === 'standard' && styles.typeBtnActive]}
            onPress={() => logic.setActiveType('standard')}
          >
            <Text style={[styles.typeText as any, logic.activeType === 'standard' && styles.typeTextActive]}>Standard</Text>
          </Pressable>
          <Pressable 
            style={[styles.typeBtn as any, logic.activeType === 'animated' && styles.typeBtnActive]}
            onPress={() => logic.setActiveType('animated')}
          >
            <Text style={[styles.typeText as any, logic.activeType === 'animated' && styles.typeTextActive]}>Animated</Text>
          </Pressable>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll as any} contentContainerStyle={styles.categoriesContainer as any}>
        {logic.categories.map((cat) => (
          <Pressable 
            key={cat.name} 
            style={[styles.categoryBtn as any, logic.activeCategory === cat.name && styles.categoryBtnActive]}
            onPress={() => logic.setActiveCategory(cat.name)}
          >
            <Text style={styles.categoryIcon as any}>{cat.icon}</Text>
            <Text style={[styles.categoryText as any, logic.activeCategory === cat.name && styles.categoryTextActive]}>{cat.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={{ maxHeight: 250 }} showsVerticalScrollIndicator={false}>
        <View style={styles.grid as any}>
          {logic.activeEmojis.map((item) => (
            <Pressable 
              key={item.hex} 
              onPress={() => logic.onChange?.(item.emoji, logic.activeType === 'animated')} 
              style={[styles.emojiBtn as any, logic.value === item.emoji && styles.selected]}
            >
              {logic.activeType === 'standard' ? (
                <Text style={styles.emojiText as any}>{item.emoji}</Text>
              ) : (
                <Image 
                  source={{ uri: logic.getAnimatedUrl(item.hex) }}
                  style={styles.animatedEmoji as any}
                  resizeMode="contain"
                />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>

    </View>
  );
};

export default EmojiPickerWeb;
