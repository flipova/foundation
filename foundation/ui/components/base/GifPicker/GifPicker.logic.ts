import { useMemo, useState, useEffect } from 'react';
import GifPickerMeta from './GifPicker.meta.yaml';

/**
 * Interface representing a GIF item.
 */
export interface GifItem {
  /** Unique ID for the GIF */
  id: string;
  /** URL of the GIF image */
  url: string;
  /** Title or description of the GIF */
  title: string;
}

/**
 * Props for the GifPicker component.
 */
export interface GifPickerProps {
  /** Callback fired when a GIF is selected */
  onChange?: (gifUrl: string) => void;
  /** Currently selected GIF URL */
  value?: string;
  /** Optional API key for Giphy/Tenor (mocked if not provided) */
  apiKey?: string;
  /** Optional limit of GIFs to fetch */
  limit?: number;
  /** Custom styles */
  style?: any;
  /** Any other props */
  [key: string]: any;
}

// Mock GIFs to simulate API data
const MOCK_GIFS: GifItem[] = [
  { id: '1', url: 'https://media.giphy.com/media/l41YkxvU8c7J7Bba0/giphy.gif', title: 'Funny Cat' },
  { id: '2', url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', title: 'Happy Dance' },
  { id: '3', url: 'https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif', title: 'Mind Blown' },
  { id: '4', url: 'https://media.giphy.com/media/xT0xeJpnrWC4XWblWQ/giphy.gif', title: 'Thumbs Up' },
  { id: '5', url: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif', title: 'Laughter' },
  { id: '6', url: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif', title: 'Crying' },
  { id: '7', url: 'https://media.giphy.com/media/26gsa1yJkqYJpZpXG/giphy.gif', title: 'Surprise' },
  { id: '8', url: 'https://media.giphy.com/media/3oEduYmB0t5Vj028sE/giphy.gif', title: 'Shrug' }
];

/**
 * Logic hook for the GifPicker component.
 */
export function useGifPickerLogic(props: GifPickerProps) {
  const metaDefaults = useMemo(() => {
    const defaults: Record<string, any> = {};
    if (GifPickerMeta?.props) {
      GifPickerMeta.props.forEach((p: any) => {
        if (p.default !== undefined) defaults[p.name] = p.default;
      });
    }
    return defaults;
  }, []);

  const merged = { ...metaDefaults, ...props };
  const { onChange, value, apiKey, limit = 20, ...rest } = merged;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Debounce the search query to minimize API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch GIFs (mocked API call)
  useEffect(() => {
    let isMounted = true;
    const fetchGifs = async () => {
      setLoading(true);
      
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 600));

      if (!isMounted) return;

      if (!debouncedQuery) {
        setGifs(MOCK_GIFS);
      } else {
        // Mock search logic
        const q = debouncedQuery.toLowerCase();
        const results = MOCK_GIFS.filter(g => g.title.toLowerCase().includes(q));
        // If empty, just return a random subset to simulate "some results"
        setGifs(results.length > 0 ? results : MOCK_GIFS.slice(0, 3));
      }
      setLoading(false);
    };

    fetchGifs();

    return () => { isMounted = false; };
  }, [debouncedQuery, limit, apiKey]);

  const selectGif = (url: string) => {
    if (onChange) onChange(url);
  };

  return { 
    value, 
    selectGif, 
    searchQuery, 
    setSearchQuery, 
    gifs, 
    loading, 
    rest 
  };
}
