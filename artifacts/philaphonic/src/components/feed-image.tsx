import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Image with fade-in on load and a visible placeholder on error.
 * Load/error state resets whenever `src` changes (panels rotate content).
 */
export function FeedImage({
  src,
  alt,
  fadeMs = 500,
  priority = false,
}: {
  src: string;
  alt: string;
  fadeMs?: number;
  /** When true, skip lazy loading (use for the currently visible hero photo). */
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/5 text-muted-foreground">
        <ImageOff className="w-6 h-6 opacity-40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={`w-full h-full object-cover transition-opacity ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDuration: `${fadeMs}ms` }}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  );
}
