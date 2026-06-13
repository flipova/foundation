/**
 * FilePicker — Web Component
 *
 * Input de sélection de fichiers avec modes button et dropzone.
 */

import React, { CSSProperties, useRef, useState } from "react";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { radii, RadiusToken } from "../../tokens";

export interface FilePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  variant?: "button" | "dropzone";
  size?: "sm" | "md" | "lg";
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  borderRadius?: RadiusToken;
  onFilesChange?: (files: FileList | null) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({
  label = "Upload file",
  variant = "button",
  size = "md",
  accept = "image/*",
  multiple = false,
  disabled = false,
  borderRadius = "md",
  onFilesChange,
  onChange,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const radius = radii[borderRadius];
  const h = size === "sm" ? 32 : size === "lg" ? 48 : 40;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFileNames(Array.from(files).map((f) => f.name));
      onFilesChange?.(files);
    }
    onChange?.(e);
  };

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      style={{ display: "none" }}
      onChange={handleChange}
      {...rest}
    />
  );

  if (variant === "dropzone") {
    return (
      <div>
        {hiddenInput}
        <div
          role="button"
          tabIndex={0}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); !disabled && setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            const files = e.dataTransfer.files;
            setFileNames(Array.from(files).map((f) => f.name));
            onFilesChange?.(files);
          }}
          style={{
            border: `2px dashed ${isDragging ? theme.primary : theme.border}`,
            borderRadius: radius,
            padding: "32px 24px",
            textAlign: "center",
            cursor: disabled ? "not-allowed" : "pointer",
            backgroundColor: isDragging ? `${theme.primary}11` : theme.muted,
            transition: "border-color 0.15s ease, background-color 0.15s ease",
            opacity: disabled ? 0.6 : 1,
            ...style,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.mutedForeground} strokeWidth="1.5" style={{ margin: "0 auto 8px" }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: theme.foreground, fontFamily: "inherit" }}>
            {fileNames.length > 0 ? fileNames.join(", ") : label}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: theme.mutedForeground, fontFamily: "inherit" }}>
            {fileNames.length === 0 && "Drag & drop or click to select"}
          </p>
        </div>
      </div>
    );
  }

  // Button variant
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style as CSSProperties }}>
      {hiddenInput}
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          height: h,
          paddingLeft: 16,
          paddingRight: 16,
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "inherit",
          borderRadius: radius,
          border: `1px solid ${theme.border}`,
          backgroundColor: theme.muted,
          color: theme.foreground,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {label}
      </button>
      {fileNames.length > 0 && (
        <span style={{ fontSize: 13, color: theme.mutedForeground, fontFamily: "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>
          {fileNames.join(", ")}
        </span>
      )}
    </div>
  );
};

export default FilePicker;
