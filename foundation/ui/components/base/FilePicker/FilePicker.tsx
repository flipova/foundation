import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useFilePickerLogic, FilePickerProps } from './FilePicker.logic';
import { useFilePickerStyle } from './FilePicker.style';
import { Upload } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { validateFile } from '@/ui/utils/inputHelpers';

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
 * Provides error feedback via aria-invalid and aria-describedby for validation messages.
 * 
 * Validation:
 * Supports file size limits (maxSizeInMB), MIME type restrictions (accept), and extension validation.
 * Validation errors are reported via onFileError callback.
 */
const FilePicker: React.FC<FilePickerProps> = (rawProps) => {
  const logic = useFilePickerLogic(rawProps);
  const styles = useFilePickerStyle(logic);

  const parseMimeTypes = (acceptString?: string): string[] => {
    if (!acceptString) return [];
    return acceptString.split(',').map(t => t.trim());
  };

  const handlePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: logic.accept || '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && logic.onFileSelect) {
        const file = result.assets[0];
        
        // Validate file if validation options are provided
        if (logic.maxSizeInMB || logic.allowedExtensions || logic.accept) {
          const allowedMimeTypes = parseMimeTypes(logic.accept);
          
          const validationResult = validateFile(file, {
            maxSizeInMB: logic.maxSizeInMB,
            allowedMimeTypes,
            allowedExtensions: logic.allowedExtensions,
          });

          if (!validationResult.valid) {
            if (logic.onFileError) {
              logic.onFileError(validationResult.error || 'File validation failed');
            } else {
              console.warn('File validation error:', validationResult.error);
            }
            return;
          }
        }

        logic.onFileSelect(file);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      console.warn('Document picker error:', errorMessage);
      if (logic.onFileError) {
        logic.onFileError(`Failed to pick file: ${errorMessage}`);
      }
    }
  };

  return (
    <Pressable 
      style={[styles.container as any, logic.rest.style]} 
      disabled={logic.disabled}
      onPress={handlePick}
      accessibilityRole="button"
      accessibilityLabel={logic.label || "Pick a file"}
      aria-describedby={logic.maxSizeInMB ? 'file-size-limit' : undefined}
    >
      <Upload size={24} color={styles.label?.color as string || '#000'} style={{ marginBottom: 8 }} />
      <Text style={styles.label as any}>{logic.label || "Select File"}</Text>
      {logic.maxSizeInMB && (
        <Text 
          style={{ fontSize: 12, marginTop: 4, opacity: 0.7 } as any}
          id="file-size-limit"
        >
          Max {logic.maxSizeInMB}MB
        </Text>
      )}
    </Pressable>
  );
};

export default FilePicker;
