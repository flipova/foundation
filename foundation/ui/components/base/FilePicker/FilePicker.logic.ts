import { useMemo } from 'react';
import FilePickerMeta from './FilePicker.meta.yaml';

/**
 * Props for the FilePicker component.
 */
export interface FilePickerProps {
  /**
   * Callback fired when a file is successfully selected.
   * @param file The file object returned by the document picker.
   */
  onFileSelect?: (file: any) => void;
  /**
   * Disables the file picker, preventing interaction if set to true.
   */
  disabled?: boolean;
  /**
   * The text label displayed inside the file picker button. Defaults to 'Select a file'.
   */
  label?: string;
  /**
   * Optional MIME type to restrict file selection (e.g. 'image/*').
   */
  accept?: string;
  /**
   * Any other props to spread to the underlying Pressable or container.
   */
  [key: string]: any;
}

export function useFilePickerLogic(props: FilePickerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (FilePickerMeta?.props) {
      FilePickerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { onFileSelect, disabled, label = 'Select a file', accept, ...rest } = merged;

  return { onFileSelect, disabled, label, accept, rest };
}
