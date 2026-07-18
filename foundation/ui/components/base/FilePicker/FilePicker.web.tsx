import React, { useRef } from 'react';
import { useFilePickerLogic, FilePickerProps } from './FilePicker.logic';
import { useFilePickerStyle } from './FilePicker.style';
import { Upload } from 'lucide-react';

/**
 * @component FilePicker (Web)
 * @description An interface for users to select files from their device.
 * @useCases Useful for uploading avatars, documents, or attaching images to messages.
 * @structure A styled clickable container that visually hides a native file input and forwards click events to it.
 * @accessibility The visually hidden input maintains focusability and keyboard interaction semantics. Screen readers will announce it as a file upload input.
 */
const FilePicker: React.FC<FilePickerProps> = (rawProps) => {
  const logic = useFilePickerLogic(rawProps);
  const styles = useFilePickerStyle(logic);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div 
      style={{ ...styles.container, display: 'flex', flexDirection: 'column', cursor: logic.disabled ? 'not-allowed' : 'pointer' } as React.CSSProperties} 
      onClick={() => !logic.disabled && inputRef.current?.click()}
      {...logic.rest}
    >
      <input 
        type="file" 
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={(e) => logic.onFileSelect?.(e.target.files?.[0])}
        disabled={logic.disabled}
      />
      <Upload size={24} color={styles.label.color} style={{ marginBottom: 8 }} />
      <span style={styles.label as React.CSSProperties}>{logic.label}</span>
    </div>
  );
};

export default FilePicker;
