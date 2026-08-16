import { useListPhotos, getListPhotosQueryKey } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Camera } from 'lucide-react';
import { FeedImage } from './feed-image';
import { mapsUrl } from '@/lib/maps';

export function PhotosPanel() {
  const { data: photos = [] } = useListPhotos({
    query: {
      refetchInterval: 30000,
      queryKey: getListPhotosQueryKey(),
    }
  });

  const currentPhoto = photos[0];

  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[500px] bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 group shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
      
      <AnimatePresence mode="wait">
        {currentPhoto && (
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <FeedImage src={currentPhoto.imageUrl} alt={currentPhoto.title} fadeMs={1000} />
            
            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
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
                  <div className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-primary" />
                    {currentPhoto.credit}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentPhoto && (
        <div className="absolute inset-0 flex items-center justify-center bg-card animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
