import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
// In web, a native select might be better, but we will use a basic list representation here for consistency with the React Native structure
import { useWheelPickerLogic, WheelPickerProps } from './WheelPicker.logic';
import { useWheelPickerStyle } from './WheelPicker.style';

/**
 * @component WheelPicker (Web)
 * @description A web representation of the scrollable barrel wheel picker. Uses standard scrolling since snapToInterval behavior varies on web.
 */
const WheelPickerWeb: React.FC<WheelPickerProps> = (rawProps) => {
  const logic = useWheelPickerLogic(rawProps);
  const styles = useWheelPickerStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style, { overflowY: 'auto' } as any]} {...logic.rest}>
      
      {/* On web, we use simple mapped items without snap for better mouse compatibility */}
      {logic.wheelItems.map((item: any, idx: number) => (
        <Pressable 
          key={`${item.value}-${idx}`} 
          style={styles.itemContainer as any}
          onPress={() => {
            if (item.value === '__MORE__') {
              logic.setIsSubmenuOpen(true);
            } else if (logic.onChange) {
              logic.onChange(item.value);
            }
          }}
        >
          <Text style={[styles.itemText as any, logic.value === item.value && { fontWeight: 'bold', color: '#007AFF' }]}>
            {item.label}
          </Text>
        </Pressable>
      ))}

      {/* Submenu Modal */}
      <Modal
        visible={logic.isSubmenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => logic.setIsSubmenuOpen(false)}
      >
        <View style={styles.modalOverlay as any}>
          <View style={styles.modalContent as any}>
            <View style={styles.modalHeader as any}>
              <Text style={styles.modalTitle as any}>Select Item</Text>
            </View>
            <View style={{ maxHeight: 400, overflowY: 'auto' } as any}>
              {logic.allItems.map((item: any, idx: number) => (
                <Pressable
                  key={`${item.value}-${idx}`}
                  style={[
                    styles.submenuItem as any, 
                    logic.value === item.value && styles.submenuItemActive
                  ]}
                  onPress={() => logic.selectFromSubmenu(item.value)}
                >
                  <Text 
                    style={[
                      styles.submenuItemText as any, 
                      logic.value === item.value && styles.submenuItemTextActive
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WheelPickerWeb;
