import * as import_react from 'react';
const { useMemo, useState } = import_react;
import EmojiPickerMeta from './EmojiPicker.meta.yaml';

export interface EmojiPickerProps {
  /** Callback fired when an emoji is selected */
  onChange?: (emoji: string, isAnimated?: boolean) => void;
  /** Currently selected emoji */
  value?: string;
  /** Whether to show animated emojis toggle */
  showAnimated?: boolean;
  [key: string]: any;
}

const EMOJI_CATEGORIES = [
  {
    name: 'Smileys',
    icon: '😀',
    emojis: [
      { emoji: '😀', hex: '1f600' },
      { emoji: '😂', hex: '1f602' },
      { emoji: '🥰', hex: '1f970' },
      { emoji: '😎', hex: '1f60e' },
      { emoji: '😭', hex: '1f62d' },
      { emoji: '😡', hex: '1f621' },
      { emoji: '🤔', hex: '1f914' },
      { emoji: '😴', hex: '1f634' },
      { emoji: '🫠', hex: '1fae0' },
      { emoji: '🥳', hex: '1f973' },
    ]
  },
  {
    name: 'Nature',
    icon: '🌸',
    emojis: [
      { emoji: '🌸', hex: '1f338' },
      { emoji: '🔥', hex: '1f525' },
      { emoji: '✨', hex: '2728' },
      { emoji: '🌟', hex: '1f31f' },
      { emoji: '☀️', hex: '2600' },
      { emoji: '🌈', hex: '1f308' },
      { emoji: '🌍', hex: '1f30d' },
      { emoji: '🍀', hex: '1f340' },
    ]
  },
  {
    name: 'Objects',
    icon: '🎈',
    emojis: [
      { emoji: '🎈', hex: '1f388' },
      { emoji: '🎁', hex: '1f381' },
      { emoji: '🎉', hex: '1f389' },
      { emoji: '💎', hex: '1f48e' },
      { emoji: '📱', hex: '1f4f1' },
      { emoji: '💡', hex: '1f4a1' },
      { emoji: '❤️', hex: '2764' },
      { emoji: '💔', hex: '1f494' },
    ]
  }
];

export function useEmojiPickerLogic(props: EmojiPickerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (EmojiPickerMeta?.props) {
      EmojiPickerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { onChange, value, showAnimated = true, ...rest } = merged;

  const [activeType, setActiveType] = useState<'standard' | 'animated'>('standard');
  const [activeCategory, setActiveCategory] = useState<string>(EMOJI_CATEGORIES[0].name);

  // Map to Google Noto Emoji animated WebP dataset URL
  const getAnimatedUrl = (hex: string) => `https://fonts.gstatic.com/s/e/notoemoji/latest/${hex}/512.webp`;

  const activeEmojis = useMemo(() => {
    return EMOJI_CATEGORIES.find(c => c.name === activeCategory)?.emojis || [];
  }, [activeCategory]);

  return { 
    onChange, 
    value, 
    showAnimated,
    activeType,
    setActiveType,
    activeCategory,
    setActiveCategory,
    categories: EMOJI_CATEGORIES,
    activeEmojis,
    getAnimatedUrl,
    rest 
  };
}
