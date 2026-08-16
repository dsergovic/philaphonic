import { useListTicker, getListTickerQueryKey } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Radio, Info } from 'lucide-react';

export function TickerPanel() {
  const { data: tickers = [] } = useListTicker({
    query: {
      refetchInterval: 20000,
      queryKey: getListTickerQueryKey(),
    }
  });

  // Two copies of the set: the animation slides -50%, i.e. exactly one set
  // per loop, giving a seamless infinite scroll.
  const repeatedTickers = Array.from({ length: 2 }).flatMap(() => tickers);

  return (
    <div className="w-full bg-background/80 backdrop-blur-xl text-primary overflow-hidden py-3 border-t border-primary/20 relative z-50 flex items-center shadow-[0_-10px_30px_rgba(0,240,255,0.1)]">
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {repeatedTickers.map((ticker, i) => (
          <div key={`${ticker.id}-${i}`} className="flex items-center gap-3 px-6 whitespace-nowrap">
            {ticker.kind === 'nowPlaying' && <Music className="w-4 h-4 text-secondary" />}
            {ticker.kind === 'pulse' && <Radio className="w-4 h-4 text-primary" />}
            {ticker.kind === 'fact' && <Info className="w-4 h-4 text-primary/70" />}
            <span className="font-display font-bold uppercase tracking-wider text-sm text-foreground/90">
              {ticker.text}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mx-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
