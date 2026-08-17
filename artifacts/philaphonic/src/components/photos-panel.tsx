import { useEffect, useRef, useState } from 'react';
import { useListPhotos, getListPhotosQueryKey } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { FeedImage } from './feed-image';
import { mapsUrl } from '@/lib/maps';

/** Wikimedia Special:FilePath image URLs resolve 1:1 to a File: info page. */
function wikimediaSourceUrl(imageUrl: string): string | null {
  if (!imageUrl.includes('commons.wikimedia.org/wiki/Special:FilePath/')) return null;
  return imageUrl.replace('/wiki/Special:FilePath/', '/wiki/File:');
}

const SWIPE_THRESHOLD = 50;

export function PhotosPanel() {
  const { data: photos = [] } = useListPhotos({
    query: {
      refetchInterval: 30000,
      queryKey: getListPhotosQueryKey(),
    }
  });

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);

  // Track position by photo id, not array index: the background refetch
  // reshuffles the array's order every ~30s (same set, "live" feel), and
  // pinning by id keeps the currently-viewed photo on screen instead of
  // silently swapping to whatever now sits at the old index — navigation
  // should only ever happen from a manual swipe/click.
  useEffect(() => {
    if (currentId === null && photos.length > 0) {
      setCurrentId(photos[0].id);
    } else if (currentId !== null && !photos.some((p) => p.id === currentId)) {
      setCurrentId(photos[0]?.id ?? null);
    }
  }, [photos, currentId]);

  const index = Math.max(0, photos.findIndex((p) => p.id === currentId));
  const currentPhoto = photos[index];

  function go(delta: number) {
    if (photos.length < 2) return;
    setDirection(delta);
    setCurrentId(photos[(index + delta + photos.length) % photos.length].id);
  }

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[500px] bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 group shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10 pointer-events-none" />

      <div
        className="absolute inset-0 z-0"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]!.clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0]!.clientX - touchStartX.current;
          touchStartX.current = null;
          if (delta <= -SWIPE_THRESHOLD) go(1);
          else if (delta >= SWIPE_THRESHOLD) go(-1);
        }}
      >
        <AnimatePresence custom={direction}>
          {currentPhoto && (
            <motion.div
              key={currentPhoto.id}
              custom={direction}
              initial={{ x: `${direction * 100}%` }}
              animate={{ x: 0 }}
              exit={{ x: `${direction * -100}%` }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <FeedImage src={currentPhoto.imageUrl} alt={currentPhoto.title} fadeMs={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentPhoto && (
        <div className="absolute bottom-0 left-0 p-6 z-20 w-full pointer-events-none">
          <motion.div
            key={`caption-${currentPhoto.id}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="pointer-events-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              {currentPhoto.tag}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-tight">
              {currentPhoto.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/80 font-medium">
              <a
                href={mapsUrl(`${currentPhoto.location}, Philadelphia, PA`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
                aria-label={`${currentPhoto.location} — view on map`}
              >
                <MapPin className="w-4 h-4 text-secondary" />
                {currentPhoto.location}
              </a>
              {wikimediaSourceUrl(currentPhoto.imageUrl) ? (
                <a
                  href={wikimediaSourceUrl(currentPhoto.imageUrl)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  aria-label={`${currentPhoto.credit} — view source on Wikimedia Commons`}
                >
                  <Camera className="w-4 h-4 text-primary" />
                  {currentPhoto.credit}
                </a>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-primary" />
                  {currentPhoto.credit}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 backdrop-blur text-white opacity-70 hover:opacity-100 hover:bg-black/60 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 backdrop-blur text-white opacity-70 hover:opacity-100 hover:bg-black/60 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setCurrentId(p.id);
                }}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === index ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {!currentPhoto && (
        <div className="absolute inset-0 flex items-center justify-center bg-card animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
