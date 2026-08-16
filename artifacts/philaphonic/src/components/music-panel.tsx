import { useListMusic, getListMusicQueryKey } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedImage } from './feed-image';
import { Disc3, PlayCircle } from 'lucide-react';
import { useState } from 'react';

export function MusicPanel() {
  const { data: music = [] } = useListMusic({
    query: {
      refetchInterval: 40000,
      queryKey: getListMusicQueryKey(),
    }
  });

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-lg">
      <div className="p-5 border-b border-border/50 bg-card/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-primary">
          <Disc3 className="w-5 h-5" />
          <h3 className="font-display font-bold uppercase tracking-widest text-sm">Music</h3>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
        <AnimatePresence mode="popLayout">
          {music.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
            >
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(`${item.artist} ${item.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 rounded-xl"
                aria-label={`Play ${item.title} by ${item.artist} on Spotify`}
              />
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                {item.coverUrl ? (
                  <FeedImage src={item.coverUrl} alt={item.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted-foreground/20">
                    <Disc3 className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    item.kind === 'latest' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                  }`}>
                    {item.kind}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.year}</span>
                </div>
                <h4 className="font-display font-bold text-base truncate">{item.title}</h4>
                <p className="text-sm font-medium text-foreground/80 truncate">{item.artist}</p>
                {item.neighborhood && (
                  <p className="text-xs text-muted-foreground mt-1 truncate block">{item.neighborhood}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

