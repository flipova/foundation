import React from 'react';
import { View, TextInput, Pressable, ScrollView, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useIconPickerLogic, IconPickerProps } from './IconPicker.logic';
import { useIconPickerStyle } from './IconPicker.style';

/**
 * @component IconPicker
 * @description A robust icon picker with a searchable grid of standard icons. Beautifully styled and typed.
 */
const IconPicker: React.FC<IconPickerProps> = (rawProps) => {
  const logic = useIconPickerLogic(rawProps);
  const styles = useIconPickerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      <View style={styles.header as any}>
        <Text style={styles.title as any}>Select an Icon</Text>
      </View>
      
      <View style={styles.searchContainer as any}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon as any} />
        <TextInput 
          style={styles.searchInput as any}
          placeholder="Search icons..."
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

      <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
        {logic.filteredIcons.length === 0 ? (
          <View style={styles.emptyContainer as any}>
            <Feather name="inbox" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText as any}>No icons found.</Text>
          </View>
        ) : (
          <View style={styles.grid as any}>
            {logic.filteredIcons.map((iconName: string) => {
              const isSelected = logic.value === iconName;
              return (
                <Pressable 
                  key={iconName} 
                  onPress={() => logic.selectIcon(iconName)} 
                  style={[styles.iconBtn as any, isSelected && styles.iconBtnSelected]}
                >
                  <Feather 
                    name={iconName as any} 
                    size={24} 
                    color={isSelected ? '#FFFFFF' : '#4A5568'} 
                  />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default IconPicker;
