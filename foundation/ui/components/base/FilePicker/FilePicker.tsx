import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useFilePickerLogic, FilePickerProps } from './FilePicker.logic';
import { useFilePickerStyle } from './FilePicker.style';
import { Upload } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

/**
 * FilePicker component provides a user interface to select documents or files from the device.
 * 
 * Role & Use Cases:
 * Primarily used in forms or settings pages where users need to upload documents, images, or other files.
 * It leverages the `expo-document-picker` to trigger the native file selection UI.
 * 
 * Structure:
 * Renders a visually accessible `Pressable` container wrapping an upload icon and a text label.
 * 
 * Accessibility:
 * Uses `accessibilityRole="button"` and `accessibilityLabel` to ensure screen readers correctly identify it as an interactive element.
 */
const FilePicker: React.FC<FilePickerProps> = (rawProps) => {
  const logic = useFilePickerLogic(rawProps);
  const styles = useFilePickerStyle(logic);

  const handlePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: logic.accept || '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && logic.onFileSelect) {
        logic.onFileSelect(result.assets[0]);
      }
    } catch (e) {
      console.warn('Document picker error:', e);
    }
  };

  return (
    <Pressable 
      style={[styles.container as any, logic.rest.style]} 
      disabled={logic.disabled}
      onPress={handlePick}
      accessibilityRole="button"
      accessibilityLabel={logic.label || "Pick a file"}
    >
      <Upload size={24} color={styles.label?.color as string || '#000'} style={{ marginBottom: 8 }} />
      <Text style={styles.label as any}>{logic.label || "Select File"}</Text>
    </Pressable>
  );
};

export default FilePicker;
