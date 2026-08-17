import { useListNews, getListNewsQueryKey } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CopyButton } from './copy-button';

export function NewsPanel() {
  const { data: news = [] } = useListNews({
    query: {
      refetchInterval: 60000,
      queryKey: getListNewsQueryKey(),
    }
  });

  return (
    <div className="flex flex-col h-auto md:h-full bg-card/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-lg">
      <div className="p-5 border-b border-border/50 flex items-center justify-between sticky top-0 z-10 bg-card/80 backdrop-blur">
        <div className="flex items-center gap-2 text-foreground">
          <Newspaper className="w-5 h-5 text-secondary" />
          <h3 className="font-display font-bold uppercase tracking-widest text-sm text-secondary">News</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-visible md:overflow-y-auto p-5 space-y-6 no-scrollbar">
        <AnimatePresence mode="popLayout">
          {news.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.1 }}
              className={`group relative block ${item.url ? 'cursor-pointer' : ''}`}
            >
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={item.headline}
                />
              )}
              <CopyButton
                text={`${item.headline}\n\n${item.summary}`}
                className="absolute right-0 top-0"
              />
              <div className="flex items-center justify-between mb-2 pr-8">
                <span className="text-xs font-bold uppercase text-primary/80 tracking-wider">
                  {item.source}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                </span>
              </div>
              <h4 className="font-display font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                {item.headline}
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.summary}
              </p>
              
              <div className="w-full h-px bg-border/40 mt-6 group-last:hidden" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
