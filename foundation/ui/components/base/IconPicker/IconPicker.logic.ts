import { useMemo, useState } from 'react';
import IconPickerMeta from './IconPicker.meta.yaml';

/**
 * Props for the IconPicker component.
 */
export interface IconPickerProps {
  /** Callback fired when an icon is selected */
  onChange?: (iconName: string) => void;
  /** Currently selected icon */
  value?: string;
  /** Custom styles */
  style?: any;
  /** Catch-all for other props */
  [key: string]: any;
}

/**
 * Logic hook for the IconPicker component.
 */
export function useIconPickerLogic(props: IconPickerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (IconPickerMeta?.props) {
      IconPickerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { onChange, value, ...rest } = merged;

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Comprehensive list of popular Feather icons
  const allIcons: string[] = useMemo(() => [
    'activity', 'airplay', 'alert-circle', 'alert-octagon', 'alert-triangle', 
    'align-center', 'align-justify', 'align-left', 'align-right', 'anchor', 
    'aperture', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 
    'award', 'bar-chart', 'battery', 'bell', 'bluetooth', 'book', 'bookmark', 
    'box', 'briefcase', 'calendar', 'camera', 'cast', 'check', 'check-circle', 
    'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'clipboard', 
    'clock', 'cloud', 'cloud-drizzle', 'cloud-lightning', 'cloud-off', 'cloud-rain', 
    'cloud-snow', 'code', 'codepen', 'command', 'compass', 'copy', 'corner-down-left', 
    'corner-down-right', 'corner-left-down', 'corner-left-up', 'corner-right-down', 
    'corner-right-up', 'corner-up-left', 'corner-up-right', 'cpu', 'credit-card', 
    'crop', 'crosshair', 'database', 'delete', 'disc', 'download', 'download-cloud', 
    'droplet', 'edit', 'edit-2', 'edit-3', 'external-link', 'eye', 'eye-off', 
    'fast-forward', 'feather', 'file', 'file-minus', 'file-plus', 'file-text', 
    'film', 'filter', 'flag', 'folder', 'folder-minus', 'folder-plus', 'gift', 
    'github', 'gitlab', 'globe', 'grid', 'hash', 'headphones', 'heart', 'help-circle', 
    'home', 'image', 'inbox', 'info', 'instagram', 'italic', 'key', 'layers', 
    'layout', 'life-buoy', 'link', 'link-2', 'list', 'loader', 'lock', 'log-in', 
    'log-out', 'mail', 'map', 'map-pin', 'maximize', 'maximize-2', 'menu', 'message-circle', 
    'message-square', 'mic', 'mic-off', 'minimize', 'minimize-2', 'minus', 'minus-circle', 
    'minus-square', 'monitor', 'moon', 'more-horizontal', 'more-vertical', 'mouse-pointer', 
    'move', 'music', 'navigation', 'navigation-2', 'octagon', 'package', 'paperclip', 
    'pause', 'pause-circle', 'pen-tool', 'percent', 'phone', 'phone-call', 'phone-forwarded', 
    'phone-incoming', 'phone-missed', 'phone-off', 'phone-outgoing', 'pie-chart', 
    'play', 'play-circle', 'plus', 'plus-circle', 'plus-square', 'pocket', 'power', 
    'printer', 'radio', 'refresh-ccw', 'refresh-cw', 'repeat', 'rewind', 'rotate-ccw', 
    'rotate-cw', 'rss', 'save', 'scissors', 'search', 'send', 'server', 'settings', 
    'share', 'share-2', 'shield', 'shield-off', 'shopping-bag', 'shopping-cart', 
    'shuffle', 'sidebar', 'skip-back', 'skip-forward', 'slack', 'slash', 'sliders', 
    'smartphone', 'smile', 'speaker', 'square', 'star', 'stop-circle', 'sun', 
    'sunrise', 'sunset', 'tablet', 'tag', 'target', 'terminal', 'thermometer', 
    'thumbs-down', 'thumbs-up', 'toggle-left', 'toggle-right', 'trash', 'trash-2', 
    'trello', 'trending-down', 'trending-up', 'triangle', 'truck', 'tv', 'twitter', 
    'type', 'umbrella', 'underline', 'unlock', 'upload', 'upload-cloud', 'user', 
    'user-check', 'user-minus', 'user-plus', 'user-x', 'users', 'video', 'video-off', 
    'voicemail', 'volume', 'volume-1', 'volume-2', 'volume-x', 'watch', 'wifi', 
    'wifi-off', 'wind', 'x', 'x-circle', 'x-square', 'youtube', 'zap', 'zap-off', 
    'zoom-in', 'zoom-out'
  ], []);

  const filteredIcons: string[] = useMemo(() => {
    if (!searchQuery) return allIcons;
    return allIcons.filter((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, allIcons]);

  const selectIcon = (iconName: string) => {
    if (onChange) onChange(iconName);
  };

  return { 
    value, 
    selectIcon, 
    searchQuery, 
    setSearchQuery, 
    filteredIcons, 
    rest 
  };
}
