import React from 'react';
import { View, TextInput, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useIconPickerLogic, IconPickerProps } from './IconPicker.logic';
import { useIconPickerStyle } from './IconPicker.style';

/**
 * @component IconPicker (Web)
 * @description Web version of the robust icon picker with a searchable grid.
 */
const IconPickerWeb: React.FC<IconPickerProps> = (rawProps) => {
  const logic = useIconPickerLogic(rawProps);
  const styles = useIconPickerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]} {...logic.rest}>
      
      <View style={styles.searchContainer as any}>
        <TextInput 
          style={styles.searchInput as any}
          placeholder="Search icons..."
          value={logic.searchQuery}
          onChangeText={logic.setSearchQuery}
        />
      </View>

      <ScrollView style={{ maxHeight: 300 }}>
        <View style={styles.grid as any}>
          {logic.filteredIcons.map((iconName: any) => (
            <Pressable 
              key={iconName} 
              onPress={() => logic.selectIcon(iconName)} 
              style={[styles.iconBtn as any, logic.value === iconName && styles.iconBtnSelected]}
            >
              <Feather 
                name={iconName as any} 
                size={24} 
                color={logic.value === iconName ? '#FFFFFF' : '#333333'} 
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

    </View>
  );
};

export default IconPickerWeb;
