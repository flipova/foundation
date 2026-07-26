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
   * Callback fired when file validation fails.
   * @param error Error message describing the validation failure.
   */
  onFileError?: (error: string) => void;
  /**
   * Disables the file picker, preventing interaction if set to true.
   */
  disabled?: boolean;
  /**
   * The text label displayed inside the file picker button. Defaults to 'Select a file'.
   */
  label?: string;
  /**
   * Optional MIME type to restrict file selection (e.g. 'image/*', 'image/png,image/jpeg').
   */
  accept?: string;
  /**
   * Maximum file size in megabytes. If not specified, no limit is enforced.
   */
  maxSizeInMB?: number;
  /**
   * Array of allowed file extensions (without dot, e.g., ['pdf', 'docx']).
   * If not specified, no extension validation is performed.
   */
  allowedExtensions?: string[];
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
  const {
    onFileSelect,
    onFileError,
    disabled,
    label = 'Select a file',
    accept,
    maxSizeInMB,
    allowedExtensions,
    ...rest
  } = merged;

  return {
    onFileSelect,
    onFileError,
    disabled,
    label,
    accept,
    maxSizeInMB,
    allowedExtensions,
    rest,
  };
}
