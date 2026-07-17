import { useMemo, useState, useEffect } from 'react';
import CameraMeta from './Camera.meta.yaml';

/**
 * Properties for the Camera component.
 */
export interface CameraProps {
  /**
   * The active camera facing direction ('back' or 'front').
   * @default 'back'
   */
  facing?: 'back' | 'front';
  /**
   * Whether the camera is active and rendering. 
   * Can be used to pause the camera preview.
   * @default true
   */
  isActive?: boolean;
  /**
   * Callback fired when a photo or video is captured.
   * @param uri The local file URI of the captured media.
   */
  onCapture?: (uri: string) => void;
  /**
   * Additional properties to pass to the container or underlying camera component.
   */
  [key: string]: any;
}

export function useCameraLogic(props: CameraProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (CameraMeta?.props) {
      CameraMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { facing = 'back', isActive = true, onCapture, ...rest } = merged;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  return { facing, isActive, onCapture, hasPermission, setHasPermission, rest };
}
